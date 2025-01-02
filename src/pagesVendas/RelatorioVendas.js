import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function RelatorioVendas() {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarProdutos = useCallback(() => {
    axios
      .get(`${getApiUrl()}/Product/GetProducts`)
      .then((response) => {
        if (response.data && response.data.products) {
          const produtosNormais = response.data.products;
          const produtosAlternativos =
            response.data.productsAlternativeSize || [];
          const todosProdutos = [...produtosNormais, ...produtosAlternativos];
          setProdutos(todosProdutos);
          setFilteredProdutos(todosProdutos); // Inicialmente, exibe todos os produtos
        } else {
          console.error(
            'API response is not in expected format:',
            response.data
          );
          setProdutos([]);
          setFilteredProdutos([]);
        }
      })
      .catch((error) => console.error('Error loading products:', error));
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  useEffect(() => {
    const filtered = produtos.filter(
      (produto) =>
        produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (produto.size &&
          typeof produto.size === 'string' &&
          produto.size.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProdutos(filtered);
  }, [searchTerm, produtos]);

  const calcularTotalVendido = () => {
    return filteredProdutos
      .reduce((total, produto) => total + produto.soldAmount * produto.price, 0)
      .toFixed(2);
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Relatório de vendas</h2>
        <Form.Group controlId="search" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar por nome do produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tamanho</th>
              <th>Estoque</th>
              <th>Quantidade vendida</th>
              <th>Total vendido</th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.name}</td>
                <td>{produto.size}</td>
                <td>{produto.remainingAmount}</td>
                <td>{produto.soldAmount}</td>
                <td>R$ {(produto.soldAmount * produto.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h4 className="mt-4">
          Total geral vendido: R$ {calcularTotalVendido()}
        </h4>
      </Container>
    </>
  );
}

export default RelatorioVendas;
