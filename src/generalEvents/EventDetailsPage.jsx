import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Accordion, Table, Form, Button, Modal } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import getApiUrl from "../util/api";

function GeneralEventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [groups, setGroups] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupStudents, setGroupStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const navigateToStudentPayments = (studentId) => {
        window.location.href = `/event/${id}/student/${studentId}/payments`;
    };

    const fetchEventDetails = () => {
        fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEventDetails/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do evento");
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
        fetch(`${getApiUrl()}/Group/GetGroups`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados dos grupos");
                }
                return response.json();
            })
            .then((data) => {
                setGroups(data.$values || []);
                const uniqueLevels = [...new Set(data.$values.map((group) => group.level))];
                setLevels(uniqueLevels);
            })
            .catch((err) => setError(err.message));
    }, []);

    const groupStudentsByGroupAndShift = () => {
        const groupsMap = {};
        event.GeneralEventStudents?.$values.forEach((studentEvent) => {
            const groupId = studentEvent.Student?.GroupId;
            if (groupId) {
                const group = groups.find((g) => g.id === groupId);
                if (group) {
                    const groupKey = `${group.name} - ${group.shift}`;
                    if (!groupsMap[groupKey]) {
                        groupsMap[groupKey] = [];
                    }
                    groupsMap[groupKey].push(studentEvent.Student);
                }
            }
        });
        return groupsMap;
    };

    const handleDeleteStudent = (studentId) => {
        const url = `${getApiUrl()}/Student/RemoveStudentFromGeneralEvent?generalEventId=${id}&studentId=${studentId}`;
    
        fetch(url, {
            method: "DELETE",
            headers: { "Accept": "*/*" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao excluir o aluno do evento");
                }
                alert("Aluno excluído com sucesso!");
                fetchEventDetails();
            })
            .catch((err) => alert(err.message));
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

        fetch(`${getApiUrl()}/Group/GetGroupDetail/${groupId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os alunos do grupo");
                }
                return response.json();
            })
            .then((data) => setGroupStudents(data.Students.$values || []))
            .catch((err) => setError(err.message));
    };

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        const student = groupStudents.find((s) => s.Registration === parseInt(studentId));
        setSelectedStudent(student);
    };

    const addStudentToEvent = () => {
        if (selectedStudent) {
            const payload = {
                GeneralEventId: parseInt(id),
                StudentId: selectedStudent.Registration,
                PaidInstallments: 0,
            };

            fetch(`${getApiUrl()}/Student/AddStudentToGeneralEvent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao adicionar o aluno ao evento");
                    }
                    alert("Aluno adicionado com sucesso!");
                    fetchEventDetails();
                })
                .catch((err) => alert(err.message));
        }
    };

    if (error) {
        return <p>Erro ao carregar dados: {error}</p>;
    }

    if (!event || groups.length === 0) {
        return <p>Carregando...</p>;
    }

    const groupedStudents = groupStudentsByGroupAndShift();

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Tem certeza de que deseja excluir este aluno do evento?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
                    <strong>Nome:</strong> {event.Name}
                </p>
                <p>
                    <strong>Parcelas:</strong> {event.Installments}
                </p>
                <p>
                    <strong>Data:</strong> {new Date(event.Date).toLocaleDateString()}
                </p>
                <p>
                    <strong>Preço Total:</strong> R$ {event.TotalPrice.toFixed(2)}
                </p>

                <h3>Alunos por turma</h3>
                <Accordion className="mt-4">
                    {Object.keys(groupedStudents).map((groupKey, index) => (
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
                                                    <td>{student?.Name || "Nome não disponível"}</td>
                                                    <td>{student?.Responsible || "Responsável não disponível"}</td>
                                                    <td>
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() => navigateToStudentPayments(student.Registration)}
                                                        >
                                                            Caixa
                                                        </Button>{" "}
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                setStudentToDelete(student.Registration);
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
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="secondary"
                    className="mt-4"
                >
                    {showAddForm ? "Minimizar formulário" : "Adicionar aluno"}
                </Button>

                {showAddForm && (
                    <Form className="mt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Selecione o nível</Form.Label>
                            <Form.Select onChange={handleLevelChange}>
                                <option value="">Selecione...</option>
                                {levels.map((level, index) => (
                                    <option key={index} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Selecione o grupo</Form.Label>
                            <Form.Select
                                onChange={handleGroupChange}
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
                            <Form.Label>Selecione o aluno</Form.Label>
                            <Form.Select
                                onChange={handleStudentChange}
                                disabled={!selectedGroup}
                            >
                                <option value="">Selecione...</option>
                                {groupStudents.map((student) => (
                                    <option key={student.Registration} value={student.Registration}>
                                        {student.Name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button
                            onClick={addStudentToEvent}
                            disabled={!selectedStudent}
                            variant="primary"
                        >
                            Adicionar aluno
                        </Button>
                    </Form>
                )}
            </Container>
            <br />
        </>
    );
}

export default GeneralEventDetailsPage;
