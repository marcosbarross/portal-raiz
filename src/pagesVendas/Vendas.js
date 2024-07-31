import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');

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
        setItensPedido([...itensPedido, { productId: produto.Id, quantity: parseInt(quantidade), productName: produto.Nome }]);
      }
      setProdutoId('');
      setQuantidade('');
    }
  };

  const handleDeleteItem = (produtoId) => {
    setItensPedido(itensPedido.filter(item => item.productId !== produtoId));
  };

  const handleSubmitPedido = () => {
    const order = itensPedido.map(item => ({
      id: item.productId,
      quantity: item.quantity
    }));

    axios.post(`${getApiUrl()}/SellProduct`, order)
      .then(response => {
        setItensPedido([]);
        alert('Pedido realizado com sucesso!');
      })
      .catch(error => console.error('Error submitting order:', error));
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Realizar Venda</h2>
        <Form onSubmit={handleAddItem}>
          <Form.Group>
            <Form.Label>Produto</Form.Label>
            <Form.Control as="select" value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
              <option value="">Selecione um produto</option>
              {produtos.map(produto => (
                <option key={produto.Id} value={produto.Id}>{`${produto.Nome}, tamanho: ${produto.Tamanho}`}</option>
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensPedido.map(item => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteItem(item.productId)}>Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleSubmitPedido} className="mt-4">Finalizar Pedido</Button>
      </Container>
    </>
  );
}

export default Vendas;
