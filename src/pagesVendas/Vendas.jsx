import React, { useEffect, useState } from 'react';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Table,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';
import StudentSelector from '../components/StudentSelector';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [quantidade, setQuantidade] = useState('');
  const [totalPedido, setTotalPedido] = useState(0);
  const [valorPago, setValorPago] = useState(0);
  const [troco, setTroco] = useState(0);
  const [semTroco, setSemTroco] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${getApiUrl()}/Product/GetProducts`)
      .then((response) => {
        const normalizedProducts = [
          ...(response.data.products || []),
          ...(response.data.productsAlternativeSize || []),
        ].map(p => ({
          ...p,
          size: p.size.toString()
        }));

        const sortedProducts = normalizedProducts.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setProdutos(sortedProducts);
      })
      .catch((error) => console.error('Erro ao carregar produtos:', error));
  }, []);

  const groupedProducts = produtos.reduce((acc, product) => {
    if (product.remainingAmount > 0) {
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      acc[product.name].push(product);
    }
    return acc;
  }, {});

  useEffect(() => {
    if (selectedProductName && groupedProducts[selectedProductName]) {
      const sizes = groupedProducts[selectedProductName].sort((a, b) =>
        a.size.localeCompare(b.size, undefined, { numeric: true })
      );
      setAvailableSizes(sizes);
      setSelectedSizeId('');
    }
  }, [selectedProductName]);

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
    const produto = produtos.find((p) => p.id === parseInt(selectedSizeId));
    
    if (produto) {
      if (produto.remainingAmount < parseInt(quantidade)) {
        setModalMessage(`Quantidade insuficiente em estoque! Disponível: ${produto.remainingAmount}`);
        setShowModal(true);
        return;
      }

      const itemExistente = itensPedido.find(
        (item) => item.productId === produto.id
      );
      
      if (itemExistente) {
        setItensPedido(
          itensPedido.map((item) =>
            item.productId === produto.id
              ? { ...item, quantity: item.quantity + parseInt(quantidade) }
              : item
          )
        );
      } else {
        setItensPedido([
          ...itensPedido,
          {
            productId: produto.id,
            productSize: produto.size,
            quantity: parseInt(quantidade),
            productName: produto.name,
            productPrice: produto.price,
          },
        ]);
      }
      setSelectedProductName('');
      setSelectedSizeId('');
      setQuantidade('');
    }
  };

  const calcularTotalPedido = () => {
    const total = itensPedido.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    setTotalPedido(total);
  };

  const calcularTroco = () => setTroco(valorPago - totalPedido);

  const handleSubmitPedido = () => {
    if (!selectedStudent) {
      setModalMessage('Selecione um aluno antes de finalizar o pedido.');
      setShowModal(true);
      return;
    }

    const orderId = Math.floor(Date.now() / 1000);
    const currentDate = new Date().toISOString();

    const orderItems = itensPedido.map((item) => ({
      identificator: orderId,
      productId: item.productId,
      productQuantity: item.quantity,
      studentId: parseInt(selectedStudent),
      date: currentDate,
    }));

    if (valorPago >= totalPedido) {
      axios
        .post(`${getApiUrl()}/Product/SellProduct`, orderItems)
        .then(() => {
          setItensPedido([]);
          setModalMessage('Pedido realizado com sucesso!');
          setShowModal(true);

          axios.get(`${getApiUrl()}/Product/GetProducts`)
            .then(response => {
              const normalizedProducts = [
                ...(response.data.products || []),
                ...(response.data.productsAlternativeSize || []),
              ].map(p => ({ ...p, size: p.size.toString() }));
              setProdutos(normalizedProducts.sort((a, b) => a.name.localeCompare(b.name)));
            });
        })
        .catch((error) => {
          console.error('Erro ao enviar pedido:', error);
          setModalMessage('Erro ao processar pedido. Tente novamente.');
          setShowModal(true);
        });
    } else {
      setModalMessage('Valor pago insuficiente.');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Selecione o aluno que irá comprar: </h2>
        <StudentSelector onStudentSelect={setSelectedStudent} />

        <Form onSubmit={handleAddItem} className="mt-3">
          <h2>Selecione o produto: </h2>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Produto</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProductName}
                  onChange={(e) => setSelectedProductName(e.target.value)}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {Object.keys(groupedProducts)
                    .sort()
                    .map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              {selectedProductName && (
                <Form.Group>
                  <Form.Label>Tamanhos disponíveis</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSizeId}
                    onChange={(e) => setSelectedSizeId(e.target.value)}
                    required
                  >
                    <option value="">Selecione o tamanho</option>
                    {availableSizes.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.size} (Estoque: {product.remainingAmount})
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Quantidade</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-3">
            Adicionar ao pedido
          </Button>
        </Form>

        <hr />
        <h2 className="mt-5">Itens do pedido</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tamanho</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Subtotal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensPedido.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.productSize}</td>
                <td>{item.quantity}</td>
                <td>R$ {item.productPrice.toFixed(2)}</td>
                <td>R$ {(item.productPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setItensPedido(
                        itensPedido.filter(
                          (i) => i.productId !== item.productId
                        )
                      )
                    }
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        <Row className="mt-3">
          <Col>
            <h4>Total: R$ {totalPedido.toFixed(2)}</h4>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Valor pago</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={valorPago}
                onChange={(e) => setValorPago(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Sem troco"
                checked={semTroco}
                onChange={(e) => setSemTroco(e.target.checked)}
              />
            </Form.Group>
          </Col>
          <Col>
            <h4>Troco: R$ {Math.max(troco, 0).toFixed(2)}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button 
              className="mt-3" 
              onClick={handleSubmitPedido}
              disabled={itensPedido.length === 0}
            >
              Finalizar Pedido
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Informação</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Vendas;