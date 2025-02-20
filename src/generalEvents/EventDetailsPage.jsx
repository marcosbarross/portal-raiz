import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Accordion, Table, Button, Modal, Form } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';
import GeneralEventStudentSelector from './GeneralEventStudentSelector';

function GeneralEventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

  const fetchEventDetails = () => {
    fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEventDetails/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do evento');
        }
        return response.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    Promise.all([
      fetch(`${getApiUrl()}/Group/GetGroupsDetails`).then((res) => res.json()),
      fetch(`${getApiUrl()}/Group/GetGroups`).then((res) => res.json()),
    ])
      .then(([detailedGroups]) => {
        setGroups(detailedGroups);

        const uniqueLevels = [
          ...new Set(detailedGroups.map((group) => group.level)),
        ];
        setLevels(uniqueLevels);
      })
      .catch((err) => setError('Erro ao carregar os dados dos grupos.'));
  }, []);

  const groupStudentsByGroupAndShift = () => {
    const groupsMap = {};
    (event.generalEventStudents || []).forEach((studentEvent) => {
      const groupId = studentEvent.student?.groupId;
      if (groupId) {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          const groupKey = `${group.name} - ${group.shift} - ${group.level}`;
          if (!groupsMap[groupKey]) {
            groupsMap[groupKey] = [];
          }
          groupsMap[groupKey].push(studentEvent.student);
        }
      }
    });
    return groupsMap;
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedGroup(null);
    setGroupStudents([]);
    setSelectedStudent(null);
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    const group = groups.find((g) => g.id === parseInt(groupId));
    setSelectedGroup(group);

    if (group) {
      fetch(`${getApiUrl()}/Group/GetGroupDetail/${group.id}`)
        .then((response) => response.json())
        .then((data) => setGroupStudents(data.students || []))
        .catch(() => setError('Erro ao carregar alunos do grupo.'));
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = groupStudents.find(
      (s) => s.registration === parseInt(studentId)
    );
    setSelectedStudent(student);
  };

  const addStudentToEvent = () => {
    if (selectedStudent) {
      const payload = {
        GeneralEventId: parseInt(id),
        StudentId: selectedStudent.registration,
        PaidInstallments: 0,
      };

      fetch(`${getApiUrl()}/Student/AddStudentToGeneralEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao adicionar o aluno ao evento');
          }
          setShowAddModal(false);
          fetchEventDetails();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDeleteStudent = (studentId) => {
    const url = `${getApiUrl()}/Student/RemoveStudentFromGeneralEvent?generalEventId=${id}&studentId=${studentId}`;

    fetch(url, {
      method: 'DELETE',
      headers: { Accept: '*/*' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao excluir o aluno do evento');
        }
        fetchEventDetails();
      })
      .catch((err) => setError(err.message));
  };

  if (!event) {
    return <p>Carregando...</p>;
  }

  const groupedStudents = groupStudentsByGroupAndShift();

  const filteredGroupKeys = Object.keys(groupedStudents)
    .sort((a, b) => a.localeCompare(b))
    .filter((groupKey) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        groupKey.toLowerCase().includes(lowerCaseSearchTerm) ||
        groupedStudents[groupKey].some((student) =>
          student.name.toLowerCase().includes(lowerCaseSearchTerm)
      ))
    });

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        {/* Modal para Adicionar Aluno */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Aluno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GeneralEventStudentSelector
              levels={levels}
              groups={groups}
              groupStudents={groupStudents}
              selectedLevel={selectedLevel}
              selectedGroup={selectedGroup}
              selectedStudent={selectedStudent}
              onLevelChange={handleLevelChange}
              onGroupChange={handleGroupChange}
              onStudentChange={handleStudentChange}
              onAddStudent={addStudentToEvent}
            />
          </Modal.Body>
        </Modal>

        {/* Modal para Excluir Aluno */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir este aluno do evento?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDeleteStudent(studentToDelete);
                setShowDeleteModal(false);
              }}
            >
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>

        <h3>Detalhes do evento</h3>
        <p>
          <strong>Nome:</strong> {event.name}
        </p>
        <p>
          <strong>Parcelas:</strong> {event.installments}
        </p>
        <p>
          <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Preço Total:</strong> R$ {event.totalPrice.toFixed(2)}
        </p>

        {/* Campo de busca */}
        <Form.Group controlId="search" className="mt-4">
          <Form.Control
            type="text"
            placeholder="Buscar por turma ou aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <h3>Alunos por turma</h3>
        <Accordion className="mt-4">
          {filteredGroupKeys.map((groupKey, index) => (
            <Accordion.Item eventKey={index.toString()} key={groupKey}>
              <Accordion.Header>{groupKey}</Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Responsável</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedStudents[groupKey].length > 0 ? (
                      groupedStudents[groupKey].map((student, studentIndex) => (
                        <tr key={studentIndex}>
                          <td>{studentIndex + 1}</td>
                          <td>{student?.name || 'Nome não disponível'}</td>
                          <td>
                            {student?.responsible || 'Responsável não disponível'}
                          </td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => {
                                window.location.href = `/event/${id}/student/${student.registration}/payments`;
                              }}
                            >
                              Caixa
                            </Button>{' '}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setStudentToDelete(student.registration);
                                setShowDeleteModal(true);
                              }}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Nenhum aluno neste grupo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <Button
          onClick={() => setShowAddModal(true)}
          variant="secondary"
          className="mt-4"
        >
          Adicionar aluno
        </Button>
      </Container>
    </>
  );
}

export default GeneralEventDetailsPage;