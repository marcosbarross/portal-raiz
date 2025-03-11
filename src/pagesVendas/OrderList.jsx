import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateFilterModal, setShowDateFilterModal] = useState(false);
  const [dateFilterText, setDateFilterText] = useState('');

  useEffect(() => {
    axios
      .get(`${getApiUrl()}/Order/GetOrders`)
      .then((response) => {
        if (response.data) {
          setOrders(response.data);
        } else {
          console.error('Resposta inesperada da API:', response.data);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar pedidos:', error);
      });
  }, []);

  useEffect(() => {
    const grouped = orders.reduce((acc, order) => {
      const existingOrder = acc.find(
        (o) => o.identificator === order.identificator
      );
      if (existingOrder) {
        existingOrder.products.push({
          productName: order.productName,
          productSize: order.productSize,
          quantity: order.quantity,
          price: order.price,
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
          products: [
            {
              productName: order.productName,
              productSize: order.productSize,
              quantity: order.quantity,
              price: order.price,
            },
          ],
        });
      }
      return acc;
    }, []);
    setGroupedOrders(grouped);
    setFilteredOrders(grouped);
  }, [orders]);

  useEffect(() => {
    const filtered = groupedOrders.filter((order) => {
      const orderDate = new Date(order.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
  
      if (end) {
        end.setHours(23, 59, 59, 999);
      }
  
      console.log('Order Date:', orderDate);
      console.log('Start Date:', start);
      console.log('End Date:', end);
  
      const matchesSearchTerm =
        order.identificator.toString().includes(searchTerm) ||
        order.studentName.toLowerCase().includes(searchTerm.toLowerCase());
  
      const matchesDateRange =
        (!start || orderDate >= start) && (!end || orderDate <= end);
  
      return matchesSearchTerm && matchesDateRange;
    });
  
    setFilteredOrders(filtered);
  }, [searchTerm, groupedOrders, startDate, endDate]);

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortColumn(column);
    setSortDirection(direction);
  };

  const getSortedOrders = () => {
    if (!sortColumn) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn) {
        case 'identificator':
          return sortDirection === 'asc'
            ? a.identificator - b.identificator
            : b.identificator - a.identificator;

        case 'studentName':
          valueA = a.studentName.toLowerCase();
          valueB = b.studentName.toLowerCase();
          break;

        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;

        case 'totalPrice':
          return sortDirection === 'asc'
            ? a.totalPrice - b.totalPrice
            : b.totalPrice - a.totalPrice;

        default:
          return 0;
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleOpenDateFilterModal = () => {
    setShowDateFilterModal(true);
  };

  const handleCloseDateFilterModal = () => {
    setShowDateFilterModal(false);
  };

  const handleApplyDateFilter = () => {
    setShowDateFilterModal(false);
    if (startDate && endDate) {
      setDateFilterText(`Exibindo resultados do intervalo entre ${startDate} e ${endDate}`);
    } else {
      setDateFilterText('');
    }
  };

  const generateReceipt = (order) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 130],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let startX = 5;
    let startY = 10;
    const lineHeight = 4;
    const columnWidth = 18;

    doc.setFontSize(8);
    doc.text('EDUCANDÁRIO RAIZ DO SABER', pageWidth / 2, startY, {
      align: 'center',
    });
    startY += lineHeight;
    doc.text('Rua Francisco do Rego Moraes Barros', pageWidth / 2, startY, {
      align: 'center',
    });
    startY += lineHeight;
    doc.text('Engenho Maranguape - Paulista - PE', pageWidth / 2, startY, {
      align: 'center',
    });
    startY += lineHeight;
    doc.text('CNPJ: 03.511.401.0001-02', pageWidth / 2, startY, {
      align: 'center',
    });
    startY += lineHeight * 2;

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
            <br />
            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={handleOpenDateFilterModal}>
                  Filtrar por data
                </Button>
              </Col>
            </Row>
            {dateFilterText && <p>{dateFilterText}</p>}
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('identificator')}
                    style={{ cursor: 'pointer' }}
                  >
                    Número do pedido{getSortIndicator('identificator')}
                  </th>
                  <th
                    onClick={() => handleSort('studentName')}
                    style={{ cursor: 'pointer' }}
                  >
                    Nome do estudante{getSortIndicator('studentName')}
                  </th>
                  <th
                    onClick={() => handleSort('date')}
                    style={{ cursor: 'pointer' }}
                  >
                    Data{getSortIndicator('date')}
                  </th>
                  <th
                    onClick={() => handleSort('totalPrice')}
                    style={{ cursor: 'pointer' }}
                  >
                    Valor total{getSortIndicator('totalPrice')}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {getSortedOrders().map((order) => (
                  <tr key={order.identificator}>
                    <td>{order.identificator}</td>
                    <td>{order.studentName}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{`R$ ${order.totalPrice.toFixed(2)}`}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleShowDetails(order)}
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Modal de Detalhes do Pedido */}
        <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <p>
                  <strong>Número do pedido:</strong>{' '}
                  {selectedOrder.identificator}
                </p>
                <p>
                  <strong>Nome do estudante:</strong>{' '}
                  {selectedOrder.studentName}
                </p>
                <p>
                  <strong>Data:</strong>{' '}
                  {new Date(selectedOrder.date).toLocaleString()}
                </p>
                <p>
                  <strong>Quantidade total dos produtos:</strong>{' '}
                  {selectedOrder.totalQuantity}
                </p>
                <p>
                  <strong>Preço total:</strong>{' '}
                  {selectedOrder.totalPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Produtos:</strong>
                </p>
                <ul>
                  {selectedOrder.products.map((product, index) => (
                    <li key={index}>
                      Produto: {product.productName}, tamanho: {product.productSize} - Quantidade: {product.quantity} x {' '}
                      R$ {product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Fechar
            </Button>
            {selectedOrder && (
              <Button
                variant="primary"
                onClick={() => generateReceipt(selectedOrder)}
              >
                Gerar recibo
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal show={showDateFilterModal} onHide={handleCloseDateFilterModal}>
          <Modal.Header closeButton>
            <Modal.Title>Filtrar por data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="startDate">
                <Form.Label>Data de início</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="endDate">
                <Form.Label>Data de fim</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDateFilterModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleApplyDateFilter}>
              Aplicar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default OrderList;