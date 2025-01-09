import React, { useState, useEffect } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import { 
  Form, 
  Container, 
  FloatingLabel, 
  Button, 
  Alert, 
  Modal, 
  Table 
} from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';

function AddAlunos() {
  const [name, setName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [groupId, setGroupId] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [csvAlunos, setCsvAlunos] = useState([]);
  const [modalGroupId, setModalGroupId] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/Group/GetGroupsDetails`);
      if (response.data && Array.isArray(response.data)) {
        setTurmas(response.data);
      } else {
        setTurmas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setError('Erro ao carregar as turmas. Tente novamente.');
    }
  };

  const handleAddAluno = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !responsible || !groupId) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await axios.post(`${getApiUrl()}/Student/AddStudent`, {
        name,
        responsible,
        groupId: parseInt(groupId, 10),
      });
      setName('');
      setResponsible('');
      setGroupId('');
      setSuccess('Aluno cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      setError(
        'Erro ao cadastrar o aluno. Verifique os dados e tente novamente.'
      );
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').slice(1); // Ignora a primeira linha
        const alunos = rows.map((row) => {
          const [name, responsible] = row.split(';');
          return { name: name?.trim(), responsible: responsible?.trim() };
        }).filter(aluno => aluno.name && aluno.responsible); // Filtra linhas inválidas
        setCsvAlunos(alunos);
      };
      reader.readAsText(file);
    }
  };

  const handleBatchRegister = async () => {
    setModalError('');
    if (!modalGroupId) {
      setModalError('Selecione uma turma antes de cadastrar os alunos.');
      return;
    }

    try {
      const response = await axios.get(`${getApiUrl()}/Student/GetStudentsByGroup/${modalGroupId}`);
      const existingStudents = response.data || [];
      
      const duplicated = [];
      const successful = [];

      for (const aluno of csvAlunos) {
        const isDuplicate = existingStudents.some(
          (existing) =>
            existing.name === aluno.name &&
            existing.responsible === aluno.responsible
        );
        if (isDuplicate) {
          duplicated.push(aluno);
        } else {
          try {
            await axios.post(`${getApiUrl()}/Student/AddStudent`, {
              name: aluno.name,
              responsible: aluno.responsible,
              groupId: parseInt(modalGroupId, 10),
            });
            successful.push(aluno);
          } catch (error) {
            console.error(`Erro ao cadastrar o aluno ${aluno.name}:`, error);
          }
        }
      }

      setCsvAlunos([]);
      setShowModal(false);

      let message = `${successful.length} alunos cadastrados com sucesso!`;
      if (duplicated.length > 0) {
        message += `\n${duplicated.length} duplicatas encontradas:\n${duplicated.map(a => `${a.name} - ${a.responsible}`).join('\n')}`;
      }
      setSuccess(message);
    } catch (error) {
      console.error('Erro ao cadastrar alunos em lote:', error);
      setModalError('Erro ao cadastrar alunos em lote.');
    }
  };

  return (
    <>
      <CustomNavbar />
      <Form onSubmit={handleAddAluno}>
        <Container className="mt-4">
          <h2>Cadastrar novo aluno</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success" style={{ whiteSpace: 'pre-wrap' }}>{success}</Alert>}

          <FloatingLabel
            controlId="floatingInput"
            label="Nome do aluno"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Nome do aluno"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Nome do responsável"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Nome do responsável"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
            />
          </FloatingLabel>
        </Container>
        <Container className="mt-4">
          <Form.Select
            aria-label="Selecione a turma"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.name} - {turma.level} - {turma.shift}
              </option>
            ))}
          </Form.Select>

          <br />
          <Button variant="primary" type="submit">
            Cadastrar
          </Button>
          <Button
            variant="secondary"
            className="ms-3"
            onClick={() => setShowModal(true)}
          >
            Cadastrar em Lote
          </Button>
        </Container>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Alunos em Lote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Carregar arquivo CSV</Form.Label>
            <Form.Control type="file" onChange={handleCsvUpload} />
          </Form.Group>
          <Form.Select
            aria-label="Selecione a turma"
            value={modalGroupId}
            onChange={(e) => setModalGroupId(e.target.value)}
            className="mb-3"
          >
            <option value="">Selecione a turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.name} - {turma.level} - {turma.shift}
              </option>
            ))}
          </Form.Select>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {csvAlunos.map((aluno, index) => (
                <tr key={index}>
                  <td>{aluno.name}</td>
                  <td>{aluno.responsible}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleBatchRegister}>
            Confirmar Cadastro
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddAlunos;
