import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [totalPedido, setTotalPedido] = useState(0);
  const [valorPago, setValorPago] = useState(0);
  const [troco, setTroco] = useState(0);
  const [semTroco, setSemTroco] = useState(false);

  useEffect(() => {
    axios.get(`${getApiUrl()}/GetProducts`)
      .then(response => {
        if (response.data && response.data.$values) {
          setProdutos(response.data.$values);
        } else {
          console.error('API response is not in expected format:', response.data);
          setProdutos([]);
        }
      })
      .catch(error => console.error('Error loading products:', error));
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
        setItensPedido([...itensPedido, { productId: produto.Id, quantity: parseInt(quantidade), productName: produto.Name, productPrice: produto.Price }]);
      }
      setProdutoId('');
      setQuantidade('');
    }
  };

  const handleDeleteItem = (produtoId) => {
    setItensPedido(itensPedido.filter(item => item.productId !== produtoId));
  };

  const calcularTotalPedido = () => {
    let total = 0;
    itensPedido.forEach(item => {
      total += item.productPrice * item.quantity;
    });
    setTotalPedido(total);
  };

  const handleValorPagoChange = (e) => {
    setValorPago(parseFloat(e.target.value));
  };

  const handleCheckboxChange = () => {
    setSemTroco(!semTroco);
  };

  const calcularTroco = () => {
    if (!semTroco) {
      setTroco(valorPago - totalPedido);
    }
  };

  const handleSubmitPedido = () => {
    const order = itensPedido.map(item => ({
      id: item.productId,
      quantity: item.quantity
    }));

    if (valorPago >= totalPedido) {
      axios.post(`${getApiUrl()}/SellProduct`, order)
        .then(response => {
          setItensPedido([]);
          alert('Pedido realizado com sucesso!');
          gerarCupomFiscal(order);
        })
        .catch(error => console.error('Error submitting order:', error));
    } else {
      alert('Valor pago insuficiente');
    }
  };

  const gerarCupomFiscal = (pedido) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 257]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let startX = 10;
    let startY = 10;
    let lineHeight = 10;
    let columnWidth = 18;

    doc.setFontSize(8);
    doc.text('EDUCANDÁRIO RAIZ DO SABER', pageWidth / 2, startY, { align: 'center' });
    startY += 3
    doc.text('Rua Francisco do Rego Moraes Barros', pageWidth / 2, startY, { align: 'center' });
    startY += 3
    doc.text('Engenho Maranguape - Paulista - PE', pageWidth / 2, startY, { align: 'center' });
    startY += 3
    doc.text('CNPJ: 03.511.401.0001-02', pageWidth / 2, startY, { align: 'center' });
    
    startY += 8;

    doc.setFontSize(12);

    doc.setFontSize(10);
    doc.text('Produto', startX, startY);
    doc.text('Qtd', startX + 1.7 * columnWidth, startY);
    doc.text('Preço', startX + 2.2 * columnWidth, startY);
    doc.text('Subtotal', startX + 3 * columnWidth, startY);
    startY += lineHeight;

    let totalPrice = 0;

    pedido.forEach(item => {
      const produto = produtos.find(p => p.Id === item.id);
      const quantidade = item.quantity;
      const precoUnitario = produto.Price;
      const subtotal = quantidade * precoUnitario;

      doc.text(produto.Name, startX, startY);
      doc.text(quantidade.toString(), startX + 1.7 * columnWidth, startY);
      doc.text(precoUnitario.toFixed(2), startX + 2.2 * columnWidth, startY);
      doc.text(subtotal.toFixed(2), startX + 3 * columnWidth, startY);
      startY += lineHeight / 2;

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

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Realizar venda</h2>
        <Form onSubmit={handleAddItem}>
          <Form.Group>
            <Form.Label>Produto</Form.Label>
            <Form.Control as="select" value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
              <option value="">Selecione um produto</option>
              {produtos.map(produto => (
                <option key={produto.Id} value={produto.Id}>{`${produto.Name}, tamanho: ${produto.Size}`}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Quantidade</Form.Label>
            <Form.Control type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="mt-3">Adicionar ao pedido</Button>
        </Form>
        <h2 className="mt-5">Itens do Pedido</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Produto</th>
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
              <Form.Control
                type="number"
                placeholder="Valor Pago"
                value={valorPago}
                onChange={handleValorPagoChange}
                onBlur={calcularTroco}
                required
                disabled={semTroco}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mt-4">
              <Form.Check
                type="checkbox"
                label="Sem troco"
                checked={semTroco}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <h4 className="mt-4">Total: {totalPedido.toFixed(2)}</h4>
        <h4 className="mt-2">Troco: {troco.toFixed(2)}</h4>
        <Button className="mt-3" onClick={handleSubmitPedido}>Finalizar Pedido</Button>
      </Container>
    </>
  );
}

export default Vendas;