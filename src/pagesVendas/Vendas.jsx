import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';
import StudentSelector from '../components/StudentSelector';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [totalPedido, setTotalPedido] = useState(0);
  const [valorPago, setValorPago] = useState(0);
  const [troco, setTroco] = useState(0);
  const [semTroco, setSemTroco] = useState(false);
  const [levels, setLevels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupStudents, setGroupStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const fetchGroupStudents = (idGroup) => {
    axios.get(`${getApiUrl()}/Group/GetGroupDetail/${idGroup}`)
      .then(response => {
        const students = response.data.Students?.$values || [];
        setGroupStudents(students);
      })
      .catch(error => console.error('Erro ao buscar alunos do grupo:', error));
  };
  
  useEffect(() => {
    fetch(`${getApiUrl()}/Group/GetGroups`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos grupos");
        }
        return response.json();
      })
      .then((data) => {
        const groupsData = data.$values || [];
        setGroups(groupsData);

        const uniqueLevels = [...new Set(groupsData.map((group) => group.level))];
        setLevels(uniqueLevels);
      })
      .catch((err) => console.error("Erro ao buscar os dados dos grupos:", err.message));
  }, []);
  

  useEffect(() => {
    axios.get(`${getApiUrl()}/Product/GetProducts`)
      .then(response => {
        const allProducts = [
          ...(response.data.Products?.$values || []),
          ...(response.data.ProductsAlternativeSize?.$values || []),
        ];
        setProdutos(allProducts);
      })
      .catch(error => console.error('Erro ao carregar produtos:', error));
  }, []);

  useEffect(() => {
    calcularTotalPedido();
  }, [itensPedido]);

  useEffect(() => {
    if (semTroco) {
      setTroco(0);
      setValorPago(totalPedido);
    } else {
      calcularTroco();
    }
  }, [valorPago, semTroco, totalPedido]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const produto = produtos.find(p => p.Id === parseInt(produtoId));
    if (produto) {
      const itemExistente = itensPedido.find(item => item.productId === produto.Id);
      if (itemExistente) {
        setItensPedido(itensPedido.map(item =>
          item.productId === produto.Id
            ? { ...item, quantity: item.quantity + parseInt(quantidade) }
            : item
        ));
      } else {
        setItensPedido([...itensPedido, {
          productId: produto.Id,
          productSize: produto.Size,
          quantity: parseInt(quantidade),
          productName: produto.Name,
          productPrice: produto.Price,
        }]);
      }
      setProdutoId('');
      setQuantidade('');
    }
  };

  const handleDeleteItem = (produtoId) => {
    setItensPedido(itensPedido.filter(item => item.productId !== produtoId));
  };

  const calcularTotalPedido = () => {
    const total = itensPedido.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    setTotalPedido(total);
  };

  const handleValorPagoChange = (e) => setValorPago(parseFloat(e.target.value));
  const handleCheckboxChange = () => setSemTroco(!semTroco);
  const calcularTroco = () => setTroco(valorPago - totalPedido);

  const handleSubmitPedido = () => {
    if (!selectedStudent) {
      alert("Selecione um aluno antes de finalizar o pedido.");
      return;
    }
  
    const orderId = Math.floor(Date.now() / 1000);
    const currentDate = new Date().toISOString();
  
    const orderItems = itensPedido.map((item) => ({
      Identificator: orderId,
      ProductId: item.productId,
      ProductQuantity: item.quantity,
      StudentId: parseInt(selectedStudent),
      Date: currentDate,
    }));
  
    if (valorPago >= totalPedido) {
      axios
        .post(`${getApiUrl()}/Product/SellProduct`, orderItems)
        .then(() => {
          setItensPedido([]);
          alert("Pedido realizado com sucesso!");
          gerarCupomFiscal(orderItems);
        })
        .catch((error) => {
          console.error("Erro ao enviar pedido:", error);
          alert("Ocorreu um erro ao enviar o pedido. Verifique os logs.");
        });
    } else {
      alert("Valor pago insuficiente.");
    }
  };    
  
  const gerarCupomFiscal = (pedido) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 257]
    });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    let startX = 5;
    let startY = 10;
    let lineHeight = 8;
    let columnWidth = 18;
  
    doc.setFontSize(8);
    doc.text('EDUCANDÁRIO RAIZ DO SABER', pageWidth / 2, startY, { align: 'center' });
    startY += 3;
    doc.text('Rua Francisco do Rego Moraes Barros', pageWidth / 2, startY, { align: 'center' });
    startY += 3;
    doc.text('Engenho Maranguape - Paulista - PE', pageWidth / 2, startY, { align: 'center' });
    startY += 3;
    doc.text('CNPJ: 03.511.401.0001-02', pageWidth / 2, startY, { align: 'center' });
    startY += 8;
  
    const aluno = groupStudents.find(student => student.Id === pedido[0].StudentId);
    const nomeAluno = aluno ? aluno.Name : 'Desconhecido';
  
    doc.setFontSize(10);
    doc.text(`Aluno: ${nomeAluno}`, startX, startY);
    startY += lineHeight;
  
    doc.text('Produto', startX, startY);
    doc.text('Qtd', startX + 1.7 * columnWidth, startY);
    doc.text('Preço', startX + 2.2 * columnWidth, startY);
    doc.text('Subtotal', startX + 3 * columnWidth, startY);
    startY += lineHeight;
  
    let totalPrice = 0;
  
    pedido.forEach(item => {
      const produto = produtos.find(p => p.Id === item.ProductId);
      const quantidade = item.ProductQuantity;
      const precoUnitario = produto.Price;
      const subtotal = quantidade * precoUnitario;
  
      doc.text(produto.Name, startX, startY);
      doc.text(quantidade.toString(), startX + 1.7 * columnWidth, startY);
      doc.text(precoUnitario.toFixed(2), startX + 2.2 * columnWidth, startY);
      doc.text(subtotal.toFixed(2), startX + 3 * columnWidth, startY);
      startY += lineHeight;
  
      totalPrice += subtotal;
    });
  
    startY += lineHeight / 2;
    doc.line(startX, startY, pageWidth - startX, startY);
    startY += lineHeight / 2;
    doc.text('Total:', startX, startY);
    doc.text(totalPrice.toFixed(2), startX + 3 * columnWidth, startY);
    startY += lineHeight / 2;
    doc.text('Valor Pago:', startX, startY);
    doc.text(valorPago.toFixed(2), startX + 3 * columnWidth, startY);
    startY += lineHeight / 2;
    doc.text('Troco:', startX, startY);
    doc.text(troco.toFixed(2), startX + 3 * columnWidth, startY);
  
    const string = doc.output('bloburl');
    window.open(string, '_blank');
  };  
  
  

  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    fetchGroupStudents(e.target.value);
  };
  const handleStudentChange = (e) => setSelectedStudent(e.target.value);
  const handleAddStudent = () => {
    if (selectedStudent) alert(`Aluno ${selectedStudent} selecionado.`);
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Selecione o aluno que irá comprar: </h2>
        <StudentSelector
          levels={levels}
          groups={groups}
          groupStudents={groupStudents}
          selectedLevel={selectedLevel}
          selectedGroup={selectedGroup}
          selectedStudent={selectedStudent}
          onLevelChange={handleLevelChange}
          onGroupChange={handleGroupChange}
          onStudentChange={handleStudentChange}
          onAddStudent={handleAddStudent}
        />
        <Form onSubmit={handleAddItem} className="mt-3">
          <hr />
        <h2>Selecione o produto: </h2>
          <Form.Group>
            <Form.Label>Produto</Form.Label>
            <Form.Control as="select" value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
              <option value="">Selecione um produto</option>
              {produtos.map(produto => (
                <option key={produto.Id} value={produto.Id}>
                  {`${produto.Name}, tamanho: ${produto.Size}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Quantidade</Form.Label>
            <Form.Control type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="mt-3">Adicionar ao pedido</Button>
        </Form>
        <hr/>
        <h2 className="mt-5">Itens do pedido</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tamanho</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Subtotal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensPedido.map(item => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.productSize}</td>
                <td>{item.quantity}</td>
                <td>{item.productPrice.toFixed(2)}</td>
                <td>{(item.productPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteItem(item.productId)}>Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Valor Pago</Form.Label>
              <Form.Control type="number" value={valorPago} onChange={handleValorPagoChange} disabled={semTroco} required />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <Form.Check type="checkbox" label="Sem troco" checked={semTroco} onChange={handleCheckboxChange} />
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Troco</Form.Label>
              <Form.Control type="number" value={troco} disabled />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <h3>Total: {totalPedido.toFixed(2)}</h3>
            <Button onClick={handleSubmitPedido} disabled={itensPedido.length === 0}>Finalizar Pedido</Button>
          </Col>
        </Row>
      </Container>
      <br />
    </>
  );
}

export default Vendas;