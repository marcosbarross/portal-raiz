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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${getApiUrl()}/Product/GetProducts`)
      .then((response) => {
        const allProducts = [
          ...(response.data.products || []),
          ...(response.data.productsAlternativeSize || []),
        ];
        setProdutos(allProducts);
      })
      .catch((error) => console.error('Erro ao carregar produtos:', error));
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
    const produto = produtos.find((p) => p.id === parseInt(produtoId));
    if (produto) {
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
      setProdutoId('');
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
        })
        .catch((error) => {
          console.error('Erro ao enviar pedido:', error);
          setModalMessage(
            'Ocorreu um erro ao enviar o pedido. Verifique os logs.'
          );
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
          <Form.Group>
            <Form.Label>Produto</Form.Label>
            <Form.Control
              as="select"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {`${produto.name}, tamanho: ${produto.size}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Quantidade</Form.Label>
            <Form.Control
              type="number"
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
              <th>Preço</th>
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
                <td>{item.productPrice.toFixed(2)}</td>
                <td>{(item.productPrice * item.quantity).toFixed(2)}</td>
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
            <h4>Troco: R$ {troco.toFixed(2)}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="mt-3" onClick={handleSubmitPedido}>
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
