import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function RelatorioVendas() {
  const [relatorio, setRelatorio] = useState({ itens: [], total_vendido: 0 });

  const carregarRelatorio = useCallback(() => {
    axios.get(`${getApiUrl()}/relatorio_vendas/`)
      .then(response => setRelatorio(response.data))
      .catch(error => console.error('Error loading sales report:', error));
  }, []);

  useEffect(() => {
    carregarRelatorio();
  }, [carregarRelatorio]);

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
            {relatorio.itens.map(item => (
              <tr key={item.produto_id}>
                <td>{item.produto_nome}</td>
                <td>{item.quantidade_vendida}</td>
                <td>{item.total_vendido.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h4 className="mt-4">Total Geral Vendido: {relatorio.total_vendido.toFixed(2)}</h4>
      </Container>
    </>
  );
}

export default RelatorioVendas;
