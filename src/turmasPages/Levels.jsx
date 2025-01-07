import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  FloatingLabel,
  Table,
  Modal,
} from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import axios from 'axios';
import getApiUrl from '../util/api';

function Levels() {
  const [levels, setLevels] = useState([]);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editLevelId, setEditLevelId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [levelIdToDelete, setLevelIdToDelete] = useState(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/Level/GetLevels`);
      // Acesse diretamente os dados retornados da API
      if (response.data && Array.isArray(response.data)) {
        setLevels(response.data);
      } else {
        setLevels([]);
      }
    } catch (error) {
      console.error('Erro ao buscar níveis:', error);
      setLevels([]);
    }
  };

  const handleAddLevel = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${getApiUrl()}/Level/AddLevel`, { name });
      fetchLevels();
      setName('');
    } catch (error) {
      console.error('Erro ao adicionar nível:', error);
    }
  };

  const handleEditLevel = (level) => {
    setEditLevelId(level.id);
    setEditName(level.name);
    setShowEditModal(true);
  };

  const handleUpdateLevel = async () => {
    try {
      await axios.put(`${getApiUrl()}/Level/UpdateLevel/${editLevelId}`, {
        name: editName,
      });
      fetchLevels();
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao atualizar nível:', error);
    }
  };

  const handleDeleteLevel = (id) => {
    setLevelIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteLevel = async () => {
    try {
      await axios.delete(`${getApiUrl()}/Level/DeleteLevel/${levelIdToDelete}`);
      fetchLevels();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir nível:', error);
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Cadastrar novo nível</h2>
        <Form onSubmit={handleAddLevel}>
          <FloatingLabel
            controlId="floatingInput"
            label="Nome do nível"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Digite o nome do nível"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FloatingLabel>
          <Button variant="primary" type="submit" className="mb-3">
            Cadastrar
          </Button>
        </Form>
      </Container>

      <Container>
        <h2>Níveis cadastrados</h2>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome do Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {levels.length > 0 ? (
              levels.map((level, index) => (
                <tr key={level.id}>
                  <td>{index + 1}</td>
                  <td>{level.name}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEditLevel(level)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteLevel(level.id)}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Nenhum nível cadastrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar nível</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome do nível"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Digite o nome do nível"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateLevel}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este nível?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteLevel}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Levels;
