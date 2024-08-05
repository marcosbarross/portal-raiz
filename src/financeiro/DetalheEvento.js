import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomNavbar from '../components/CustomNavbar';
import { Container, Button, Form, Spinner, Table } from "react-bootstrap";
import axios from 'axios';
import getApiUrl from '../util/api';

function DetalheEvento() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        Name: '',
        Responsible: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/event/GetEventDetails/${id}`);
            const eventData = response.data;
            eventData.Students = eventData.Students?.$values || [];
            setEvent(eventData);
        } catch (error) {
            console.error('Erro ao carregar detalhes do evento:', error);
        }
    };

    const handleNavigateToNewScreen = () => {
        navigate(`/nova-tela/${id}`);
    };

    const handleAddStudentToggle = () => {
        setShowAddStudentForm(!showAddStudentForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiUrl()}/student/AddStudentToEvent`, {
                EventId: id,
                ...newStudent
            });
            setNewStudent({
                Registration: '',
                Name: '',
                Responsible: ''
            });
            setShowAddStudentForm(false);
            fetchEventDetails();
        } catch (error) {
            console.error('Erro ao adicionar aluno:', error);
            alert('Erro ao adicionar aluno. Verifique se o aluno já está registrado no evento.');
        }
    };
    

    const handleNavigateToFinanceiro = (studentId) => {
        navigate(`/financeiro/${studentId}`);
    };

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">
                {event ? (
                    <>
                        <h1>{event.Name}</h1>
                        <p>Data: {new Date(event.Date).toLocaleDateString()}</p>
                        <p>Parcelas: {event.Installments}</p>

                        <Button variant="primary" onClick={handleAddStudentToggle}>
                            {showAddStudentForm ? 'Cancelar' : 'Adicionar Aluno'}
                        </Button>

                        {showAddStudentForm && (
                            <Form onSubmit={handleAddStudent} className="mt-3">
                                <Form.Group>
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Name"
                                        value={newStudent.Name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Responsável</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Responsible"
                                        value={newStudent.Responsible}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="success" className="mt-3">
                                    Adicionar
                                </Button>
                            </Form>
                        )}

                        <h3>Alunos confirmados</h3>
                        <Table striped className="mt-3">
                            <thead>
                                <tr>
                                    <th>Registro</th>
                                    <th>Nome</th>
                                    <th>Responsável</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.Students.map(student => (
                                    <tr key={student.Registration}>
                                        <td>{student.Registration}</td>
                                        <td>{student.Name}</td>
                                        <td>{student.Responsible}</td>
                                        <td>
                                            <Button variant="info" onClick={() => handleNavigateToFinanceiro(student.Registration)}>
                                                Financeiro
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}
            </Container>
        </>
    );
}

export default DetalheEvento;
