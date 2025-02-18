import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';
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
  const [produtoToEdit, setProdutoToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddForm, setShowAddForm] = useState(false);

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
          console.error('API response is not in expected format:', response.data);
          setProdutos([]);
        }
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        setProdutos([]);
      });
  };

  const compareSizes = (a, b) => {
    const sizeA = a.toString();
    const sizeB = b.toString();
    const numA = parseInt(sizeA);
    const numB = parseInt(sizeB);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return sizeA.localeCompare(sizeB);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const sortedProdutos = produtos
    .filter((produto) =>
      produto.name?.toLowerCase().includes(busca.toLowerCase()) ||
      (produto.size &&
        produto.size.toString().toLowerCase().includes(busca.toLowerCase()))
    )
    .sort((a, b) => {
      let compare = 0;
      
      if (sortColumn === 'name') {
        compare = a.name.localeCompare(b.name);
        if (compare === 0) compare = compareSizes(a.size, b.size);
      } else if (sortColumn === 'size') {
        compare = compareSizes(a.size, b.size);
      } else if (sortColumn === 'price') {
        compare = a.price - b.price;
      } else if (sortColumn === 'remainingAmount') {
        compare = a.remainingAmount - b.remainingAmount;
      }

      return sortDirection === 'asc' ? compare : -compare;
    });

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      setNome('');
      setPreco('');
      setTamanho('');
      setEstoque('');
    }
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
        handleToggleAddForm();
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleDeleteProduto = () => {
    if (produtoToDelete) {
      axios
        .delete(`${getApiUrl()}/Product/DeleteProduct/${produtoToDelete.id}`)
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

  const handleShowEditModal = (produto) => {
    setProdutoToEdit({ ...produto });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setProdutoToEdit(null);
    setShowEditModal(false);
  };

  const handleUpdateProduto = () => {
    if (produtoToEdit) {
      axios
        .put(`${getApiUrl()}/Product/UpdateProduct/${produtoToEdit.id}`, produtoToEdit)
        .then(() => {
          loadProdutos();
          handleCloseEditModal();
        })
        .catch((error) => console.error('Error updating product:', error));
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2>Produtos</h2>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="success" onClick={handleToggleAddForm}>
              {showAddForm ? 'Cancelar' : 'Adicionar Produto'}
            </Button>
          </Col>
        </Row>

        {showAddForm && (
          <div className="mb-4 p-3 border rounded">
            <h4>Adicionar novo produto</h4>
            <Form onSubmit={handleAddProduto}>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
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
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Estoque</Form.Label>
                    <Form.Control
                      type="number"
                      value={estoque}
                      onChange={(e) => setEstoque(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Tamanho</Form.Label>
                    <Form.Select
                      value={tamanho}
                      onChange={(e) => setTamanho(e.target.value)}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="16">16</option>
                      <option value="PP">PP</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button type="submit" className="w-100">
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        )}

        <Form.Group className="mb-4">
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
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('name')}
              >
                Nome{getSortIndicator('name')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('price')}
              >
                Preço{getSortIndicator('price')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('size')}
              >
                Tamanho{getSortIndicator('size')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('remainingAmount')}
              >
                Estoque{getSortIndicator('remainingAmount')}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedProdutos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.name}</td>
                <td>R$ {produto.price.toFixed(2)}</td>
                <td>{produto.size}</td>
                <td>{produto.remainingAmount}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowEditModal(produto)}
                  >
                    Editar
                  </Button>
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

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {produtoToEdit && (
            <>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={produtoToEdit.name}
                  onChange={(e) =>
                    setProdutoToEdit({ ...produtoToEdit, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={produtoToEdit.price}
                  onChange={(e) =>
                    setProdutoToEdit({ ...produtoToEdit, price: parseFloat(e.target.value) })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tamanho</Form.Label>
                <Form.Control
                  type="text"
                  value={produtoToEdit.size}
                  onChange={(e) =>
                    setProdutoToEdit({ ...produtoToEdit, size: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Estoque</Form.Label>
                <Form.Control
                  type="number"
                  value={produtoToEdit.remainingAmount}
                  onChange={(e) =>
                    setProdutoToEdit({
                      ...produtoToEdit,
                      remainingAmount: parseInt(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateProduto}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Itens;