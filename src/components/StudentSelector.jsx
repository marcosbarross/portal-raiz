import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap';
import getApiUrl from '../util/api';

const StudentSelector = ({ onStudentSelect }) => {
  const [levels, setLevels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${getApiUrl()}/Group/GetGroupsDetails`)
      .then((response) => {
        const groupsData = response.data || [];
        setGroups(groupsData);

        const uniqueLevels = [
          ...new Map(
            groupsData.map((group) => [
              group.level,
              { id: group.level, name: group.level },
            ])
          ).values(),
        ];
        setLevels(uniqueLevels);
      })
      .catch((error) => console.error('Erro ao buscar grupos:', error));
  }, []);

  const onLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedGroup(null);
    setStudents([]);
    setSelectedStudent(null);
  };

  const onGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
    setSelectedStudent(null);

    if (groupId) {
      axios
        .get(`${getApiUrl()}/Student/GetStudentsByGroup/${groupId}`)
        .then((response) => {
          const studentsData = response.data || [];
          setStudents(studentsData);
        })
        .catch((error) => console.error('Erro ao buscar alunos:', error));
    } else {
      setStudents([]);
    }
  };

  const handleStudentSelect = () => {
    if (!selectedStudent) {
      alert('Selecione um estudante válido.');
      return;
    }
    onStudentSelect(selectedStudent); // Passa o estudante selecionado para o componente pai.
    setShowModal(true); // Exibe o modal.
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Selecione o nível</Form.Label>
          <Form.Select value={selectedLevel || ''} onChange={onLevelChange}>
            <option value="">Selecione...</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selecione o grupo</Form.Label>
          <Form.Select
            value={selectedGroup || ''}
            onChange={onGroupChange}
            disabled={!selectedLevel}
          >
            <option value="">Selecione...</option>
            {groups
              .filter((group) => group.level === selectedLevel)
              .map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} - {group.shift}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selecione o estudante</Form.Label>
          <Form.Select
            value={selectedStudent || ''}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={!selectedGroup}
          >
            <option value="">Selecione...</option>
            {students.map((student) => (
              <option key={student.registration} value={student.registration}>
                {student.name} - {student.responsible}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          variant="primary"
          onClick={handleStudentSelect}
          disabled={!selectedStudent}
        >
          Selecionar estudante
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Estudante Selecionado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          O estudante{' '}
          {
            students.find(
              (student) => student.registration === parseInt(selectedStudent)
            )?.name
          }{' '}
          foi selecionado com sucesso!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentSelector;
