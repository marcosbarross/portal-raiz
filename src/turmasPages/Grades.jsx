import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  FloatingLabel,
  Table,
  Accordion,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import axios from 'axios';
import getApiUrl from '../util/api';

function Grades() {
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState('');
  const [levelId, setLevelId] = useState('');
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrades();
    fetchLevels();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/Grade/GetGrades`);
      if (response.data && Array.isArray(response.data)) {
        // Filtrar valores nulos no array `grades`
        const filteredGrades = response.data.filter((grade) => grade !== null);
        setGrades(filteredGrades);
      } else {
        setGrades([]);
      }
    } catch (error) {
      console.error('Erro ao buscar séries:', error);
      setGrades([]);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/Level/GetLevels`);
      if (response.data && Array.isArray(response.data)) {
        // Filtrar valores nulos no array `levels`
        const filteredLevels = response.data.filter((level) => level !== null);
        setLevels(filteredLevels);
      } else {
        setLevels([]);
      }
    } catch (error) {
      console.error('Erro ao buscar níveis:', error);
      setLevels([]);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      const level = levels.find((l) => l.id === parseInt(levelId));
      await axios.post(`${getApiUrl()}/Grade/AddGrade`, {
        name,
        levelId: parseInt(levelId),
        level,
      });
      fetchGrades();
      setName('');
      setLevelId('');
    } catch (error) {
      console.error('Erro ao adicionar série:', error);
    }
  };

  const handleDetails = (id) => {
    navigate(`/GradeDetalhe/${id}`);
  };

  const renderGradesByLevel = (levelId) => {
    const filteredGrades = grades.filter((grade) => grade.levelId === levelId);

    if (filteredGrades.length === 0) return null;

    const levelName =
      levels.find((level) => level.id === levelId)?.name ||
      'Nível Desconhecido';

    return (
      <Accordion.Item eventKey={levelId} key={levelId}>
        <Accordion.Header>{levelName}</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome da Série</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade, index) => (
                <tr key={grade.id}>
                  <td>{index + 1}</td>
                  <td>{grade.name}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleDetails(grade.id)}
                    >
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Cadastrar nova série</h2>
        <Form onSubmit={handleAddGrade}>
          <FloatingLabel
            controlId="floatingInput"
            label="Nome da série"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Digite o nome da série"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FloatingLabel>
          <Form.Select
            aria-label="Selecione o nível"
            className="mb-3"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
          >
            <option>Selecione o nível</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </Form.Select>
          <Button variant="primary" type="submit" className="mb-3">
            Cadastrar
          </Button>
        </Form>
      </Container>

      <Container>
        <h2>Séries cadastradas</h2>
        <Accordion defaultActiveKey="0">
          {levels.map((level) => renderGradesByLevel(level.id))}
        </Accordion>
      </Container>
    </>
  );
}

export default Grades;
