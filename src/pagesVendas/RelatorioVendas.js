import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function RelatorioVendas() {
  const [produtos, setProdutos] = useState([]);

  const carregarProdutos = useCallback(() => {
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
    carregarProdutos();
  }, [carregarProdutos]);

  const calcularTotalVendido = () => {
    return produtos.reduce((total, produto) => total + (produto.SoldAmount * produto.Price), 0).toFixed(2);
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Relatório de Vendas</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade Vendida</th>
              <th>Total Vendido</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.Id}>
                <td>{produto.Name}</td>
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
