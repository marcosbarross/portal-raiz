import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import getApiUrl from '../util/api';
import CustomNavbar from '../components/CustomNavbar';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`${getApiUrl()}/Order/GetOrders`)
      .then(response => {
        if (response.data) {
          setOrders(response.data); // Ajuste para lidar com o array direto
        } else {
          console.error('Resposta inesperada da API:', response.data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar pedidos:', error);
      });
  }, []);

  useEffect(() => {
    const grouped = orders.reduce((acc, order) => {
      const existingOrder = acc.find(o => o.identificator === order.identificator);
      if (existingOrder) {
        existingOrder.products.push({
          productName: order.productName,
          quantity: order.quantity,
          price: order.price
        });
        existingOrder.totalQuantity += order.quantity;
        existingOrder.totalPrice += order.quantity * order.price;
      } else {
        acc.push({
          identificator: order.identificator,
          studentName: order.studentName,
          date: order.date,
          totalQuantity: order.quantity,
          totalPrice: order.quantity * order.price,
          products: [{
            productName: order.productName,
            quantity: order.quantity,
            price: order.price
          }]
        });
      }
      return acc;
    }, []);
    setGroupedOrders(grouped);
    setFilteredOrders(grouped); // Inicialmente, exibe todos os pedidos
  }, [orders]);

  useEffect(() => {
    const filtered = groupedOrders.filter(order =>
      order.identificator.toString().includes(searchTerm) ||
      order.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, groupedOrders]);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const generateReceipt = (order) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 130]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let startX = 5;
    let startY = 10;
    let lineHeight = 4;
    let columnWidth = 18;

    doc.setFontSize(8);
    doc.text('EDUCANDÁRIO RAIZ DO SABER', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight;
    doc.text('Rua Francisco do Rego Moraes Barros', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight;
    doc.text('Engenho Maranguape - Paulista - PE', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight;
    doc.text('CNPJ: 03.511.401.0001-02', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight *2;

    doc.setFontSize(10);
    doc.text('RECIBO DE COMPRA', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight + 3;
    doc.text(`Número do Pedido: ${order.identificator}`, startX, startY);
    startY += lineHeight;
    doc.text(`Nome do Estudante: ${order.studentName}`, startX, startY);
    startY += lineHeight;
    doc.text(`Data: ${new Date(order.date).toLocaleString()}`, startX, startY);
    startY += lineHeight;

    doc.line(startX, startY, pageWidth - startX, startY);

    startY += lineHeight + 2;

    doc.text('Produto', startX, startY);
    doc.text('Qtd', startX + 1.7 * columnWidth, startY);
    doc.text('Preço', startX + 2.2 * columnWidth, startY);
    doc.text('Subtotal', startX + 3 * columnWidth, startY);
    startY += lineHeight;

    let totalPrice = 0;

    order.products.forEach((product) => {
      const quantidade = product.quantity;
      const precoUnitario = product.price;
      const subtotal = quantidade * precoUnitario;

      doc.text(product.productName, startX, startY);
      doc.text(quantidade.toString(), startX + 1.7 * columnWidth, startY);
      doc.text(precoUnitario.toFixed(2), startX + 2.2 * columnWidth, startY);
      doc.text(subtotal.toFixed(2), startX + 3 * columnWidth, startY);
      startY += lineHeight;

      totalPrice += subtotal;
    });

    startY += lineHeight / 2;
    doc.line(startX, startY, pageWidth - startX, startY);
    startY += lineHeight + 2;
    doc.text('Total:', startX, startY);
    doc.text(totalPrice.toFixed(2), startX + 3 * columnWidth, startY);

    const string = doc.output('bloburl');
    window.open(string, '_blank');
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Lista de pedidos</h2>
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Buscar por número do pedido ou nome do estudante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Número do pedido</th>
                  <th>Nome do estudante</th>
                  <th>Data</th>
                  <th>Valor total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.identificator}>
                    <td>{order.identificator}</td>
                    <td>{order.studentName}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{`R$ ${order.totalPrice.toFixed(2)}`}</td>
                    <td>
                      <Button variant="info" onClick={() => handleShowDetails(order)}>Detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <p><strong>Número do pedido:</strong> {selectedOrder.identificator}</p>
                <p><strong>Nome do estudante:</strong> {selectedOrder.studentName}</p>
                <p><strong>Data:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                <p><strong>Quantidade total dos produtos:</strong> {selectedOrder.totalQuantity}</p>
                <p><strong>Preço total:</strong> {selectedOrder.totalPrice.toFixed(2)}</p>
                <p><strong>Produtos:</strong></p>
                <ul>
                  {selectedOrder.products.map((product, index) => (
                    <li key={index}>
                      {product.productName} - {product.quantity} x {product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
            {selectedOrder && (
              <Button variant="primary" onClick={() => generateReceipt(selectedOrder)}>
                Gerar Recibo
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default OrderList;
