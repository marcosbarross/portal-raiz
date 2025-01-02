import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function Itens() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [estoque, setEstoque] = useState('');
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = () => {
    axios
      .get(`${getApiUrl()}/Product/GetProducts`)
      .then((response) => {
        if (response.data) {
          const produtosNormais = response.data.products.map((produto) => ({
            id: produto.id,
            name: produto.name,
            size: produto.size,
            price: produto.price,
            remainingAmount: produto.remainingAmount,
          }));
          const produtosAlternativos =
            response.data.productsAlternativeSize.map((produto) => ({
              id: produto.id,
              name: produto.name,
              size: produto.size,
              price: produto.price,
              remainingAmount: produto.remainingAmount,
            }));
          setProdutos([...produtosNormais, ...produtosAlternativos]);
        } else {
          console.error(
            'API response is not in expected format:',
            response.data
          );
          setProdutos([]);
        }
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        setProdutos([]);
      });
  };

  const handleAddProduto = (e) => {
    e.preventDefault();
    const newProduto = {
      name: nome,
      price: parseFloat(preco),
      size: tamanho,
      remainingAmount: parseInt(estoque),
      soldAmount: 0,
    };
    axios
      .post(`${getApiUrl()}/Product/AddProduct`, newProduto)
      .then(() => {
        loadProdutos();
        setNome('');
        setPreco('');
        setTamanho('');
        setEstoque('');
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleDeleteProduto = () => {
    if (produtoToDelete) {
      axios
        .delete(`${getApiUrl()}/Product/DeleteProduct/${produtoToDelete.id}`) // aqui é "id"
        .then(() => {
          loadProdutos();
          handleCloseModal();
        })
        .catch((error) => console.error('Error deleting product:', error));
    }
  };

  const handleShowModal = (produto) => {
    setProdutoToDelete(produto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProdutoToDelete(null);
  };

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.name?.toLowerCase().includes(busca.toLowerCase()) ||
      (produto.size &&
        produto.size.toString().toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Adicionar produto</h2>
        <Form onSubmit={handleAddProduto}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Preço</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Estoque</Form.Label>
            <Form.Control
              type="number"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tamanho</Form.Label>

            <Form.Select
              aria-label="Tamanho"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              required
            >
              <option value="">Selecione o tamanho...</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">PP</option>
              <option value="20">P</option>
              <option value="22">M</option>
              <option value="24">G</option>
              <option value="26">GG</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" className="mt-3">
            Adicionar produto
          </Button>
        </Form>

        <Form.Group className="mt-4">
          <Form.Label>Buscar produtos</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome ou tamanho do produto"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </Form.Group>

        <h2 className="mt-5">Produtos cadastrados</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Tamanho</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.name}</td>
                <td>{produto.price}</td>
                <td>{produto.size}</td>
                <td>{produto.remainingAmount}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleShowModal(produto)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir o produto "{produtoToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProduto}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Itens;
