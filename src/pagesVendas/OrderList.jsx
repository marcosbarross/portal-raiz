import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
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
        if (response.data.$values && Array.isArray(response.data.$values)) {
          setOrders(response.data.$values);
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
      const existingOrder = acc.find(o => o.Identificator === order.Identificator);
      if (existingOrder) {
        existingOrder.Products.push({
          ProductName: order.ProductName,
          Quantity: order.Quantity,
          Price: order.Price
        });
        existingOrder.TotalQuantity += order.Quantity;
        existingOrder.TotalPrice += order.Quantity * order.Price;
      } else {
        acc.push({
          Identificator: order.Identificator,
          StudentName: order.StudentName,
          Date: order.Date,
          TotalQuantity: order.Quantity,
          TotalPrice: order.Quantity * order.Price,
          Products: [{
            ProductName: order.ProductName,
            Quantity: order.Quantity,
            Price: order.Price
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
      order.Identificator.toString().includes(searchTerm) ||
      order.StudentName.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <tr key={order.Identificator}>
                    <td>{order.Identificator}</td>
                    <td>{order.StudentName}</td>
                    <td>{new Date(order.Date).toLocaleString()}</td>
                    <td>{`R$ ${order.TotalPrice.toFixed(2)}`}</td>
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
                <p><strong>Número do pedido:</strong> {selectedOrder.Identificator}</p>
                <p><strong>Nome do estudante:</strong> {selectedOrder.StudentName}</p>
                <p><strong>Data:</strong> {new Date(selectedOrder.Date).toLocaleString()}</p>
                <p><strong>Quantidade total dos produtos:</strong> {selectedOrder.TotalQuantity}</p>
                <p><strong>Preço total:</strong> {selectedOrder.TotalPrice.toFixed(2)}</p>
                <p><strong>Produtos:</strong></p>
                <ul>
                  {selectedOrder.Products.map((product, index) => (
                    <li key={index}>
                      {product.ProductName} - {product.Quantity} x {product.Price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default OrderList;
