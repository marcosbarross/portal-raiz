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
    axios.get(`${getApiUrl()}/Product/GetProducts`)
      .then(response => {
        if (response.data && response.data.Products && response.data.Products.$values) {
          const produtosNormais = response.data.Products.$values;
          const produtosAlternativos = response.data.ProductsAlternativeSize ? response.data.ProductsAlternativeSize.$values : [];
          const todosProdutos = [...produtosNormais, ...produtosAlternativos];
          setProdutos(todosProdutos);
          setFilteredProdutos(todosProdutos); // Inicialmente, exibe todos os produtos
        } else {
          console.error('API response is not in expected format:', response.data);
          setProdutos([]);
          setFilteredProdutos([]);
        }
      })
      .catch(error => console.error('Error loading products:', error));
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  useEffect(() => {
    const filtered = produtos.filter(produto => 
      produto.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (produto.Size && typeof produto.Size === 'string' && produto.Size.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProdutos(filtered);
  }, [searchTerm, produtos]);  

  const calcularTotalVendido = () => {
    return filteredProdutos.reduce((total, produto) => total + (produto.SoldAmount * produto.Price), 0).toFixed(2);
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
            {filteredProdutos.map(produto => (
              <tr key={produto.Id}>
                <td>{produto.Name}</td>
                <td>{produto.Size}</td>
                <td>{produto.RemainingAmount}</td>
                <td>{produto.SoldAmount}</td>
                <td>R$ {(produto.SoldAmount * produto.Price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h4 className="mt-4">Total geral vendido: R$ {calcularTotalVendido()}</h4>
      </Container>
    </>
  );
}

export default RelatorioVendas;
