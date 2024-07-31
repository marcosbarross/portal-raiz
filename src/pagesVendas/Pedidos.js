import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get(`${getApiUrl()}/pedidos/`)
      .then(response => setPedidos(response.data))
      .catch(error => console.error('Error loading orders:', error));

    axios.get(`${getApiUrl()}/produtos/`)
      .then(response => setProdutos(response.data))
      .catch(error => console.error('Error loading products:', error));
  }, []);

  const handleDeletePedido = (id) => {
    axios.delete(`${getApiUrl()}/pedidos/${id}`)
      .then(() => setPedidos(pedidos.filter(pedido => pedido.id !== id)))
      .catch(error => console.error('Error deleting order:', error));
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

    doc.setFontSize(20);
    doc.text('Cantina Junina', pageWidth / 2, startY, { align: 'center' });
    startY += lineHeight + 2;

    doc.setFontSize(10);
    doc.text(`Número do pedido: ${pedido.id}`, startX, startY);
    startY += lineHeight;

    doc.text('Produto', startX, startY);
    doc.text('Qtd', startX + 1.7 * columnWidth, startY);
    doc.text('Preço', startX + 2.2 * columnWidth, startY);
    doc.text('Subtotal', startX + 3 * columnWidth, startY);
    startY += lineHeight;

    let totalPrice = 0;

    pedido.itens.forEach(item => {
      const produto = produtos.find(p => p.id === item.produto_id);
      if (produto) {
        const quantidade = item.quantidade;
        const precoUnitario = produto.preco;
        const subtotal = quantidade * precoUnitario;

        doc.text(produto.nome, startX, startY);
        doc.text(quantidade.toString(), startX + 1.7 * columnWidth, startY);
        doc.text(precoUnitario.toFixed(2), startX + 2.2 * columnWidth, startY);
        doc.text(subtotal.toFixed(2), startX + 3 * columnWidth, startY);
        startY += lineHeight / 2;

        totalPrice += subtotal;
      }
    });

    startY += lineHeight;
    doc.line(startX, startY, pageWidth - startX, startY);
    startY += lineHeight / 2;
    doc.text('Total:', startX, startY);
    doc.text(totalPrice.toFixed(2), startX + 3 * columnWidth, startY);

    const string = doc.output('bloburl');
    window.open(string, '_blank');
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Pedidos</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID do Pedido</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>
                  {pedido.itens.map(item => {
                    const produto = produtos.find(p => p.id === item.produto_id);
                    return produto ? (
                      <div key={item.id}>
                        {produto.nome} - {item.quantidade}
                      </div>
                    ) : (
                      <div key={item.id}>
                        Produto não encontrado - {item.quantidade}
                      </div>
                    );
                  })}
                </td>
                <td>
                  {pedido.itens.reduce((total, item) => {
                    const produto = produtos.find(p => p.id === item.produto_id);
                    return produto ? total + (produto.preco * item.quantidade) : total;
                  }, 0).toFixed(2)}
                </td>
                <td>
                  <Button onClick={() => gerarCupomFiscal(pedido)}>Comprovante</Button>
                  <Button variant="danger" onClick={() => handleDeletePedido(pedido.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Pedidos;
