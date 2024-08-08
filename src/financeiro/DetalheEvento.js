import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomNavbar from '../components/CustomNavbar';
import { Container, Button, Form, Spinner, Table, Accordion } from "react-bootstrap";
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
    const [loadingParcelas, setLoadingParcelas] = useState({});
    const [parcelas, setParcelas] = useState({});
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

    const fetchParcelas = async (studentId) => {
        setLoadingParcelas({ ...loadingParcelas, [studentId]: true });
        try {
            const response = await axios.get(`${getApiUrl()}/student/GetStudentParcelas/${studentId}`);
            setParcelas({ ...parcelas, [studentId]: response.data?.$values || [] });
        } catch (error) {
            console.error('Erro ao carregar parcelas do aluno:', error);
            setParcelas({ ...parcelas, [studentId]: [] });
        } finally {
            setLoadingParcelas({ ...loadingParcelas, [studentId]: false });
        }
    };

    const handleCheckboxChange = (studentId, parcelaIndex) => {
        const updatedParcelas = { ...parcelas };
        if (Array.isArray(updatedParcelas[studentId])) {
            const parcela = updatedParcelas[studentId][parcelaIndex];
            if (!parcela.Paid) {
                parcela.paid = !parcela.paid;
            }
            setParcelas(updatedParcelas);
        } else {
            console.error('Parcelas não é um array:', updatedParcelas[studentId]);
        }
    };

    const handlePagarParcelas = async (studentId) => {
        const selectedParcelas = parcelas[studentId].filter(parcela => parcela.paid && !parcela.Paid);
        try {
            await axios.post(`${getApiUrl()}/student/PagarParcelas`, selectedParcelas);
            fetchParcelas(studentId);
        } catch (error) {
            console.error('Erro ao pagar parcelas:', error);
            alert('Erro ao pagar parcelas.');
        }
    };

    const handleToggleAccordion = (studentId) => {
        if (!parcelas[studentId]) {
            fetchParcelas(studentId);
        }
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
                        <Accordion defaultActiveKey="0">
                            {event.Students.map(student => (
                                <Accordion.Item eventKey={student.Registration.toString()} key={student.Registration}>
                                    <Accordion.Header onClick={() => handleToggleAccordion(student.Registration)}>
                                        {student.Name} ({student.Registration})
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {loadingParcelas[student.Registration] ? (
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        ) : (
                                            <>
                                                <Table striped className="mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Pago</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(parcelas[student.Registration]) && parcelas[student.Registration].map((parcela, index) => (
                                                            <tr key={index}>
                                                                <td>{parcela.InstallmentNumber}</td>
                                                                <td>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        checked={parcela.Paid || parcela.paid}
                                                                        disabled={parcela.Paid}
                                                                        onChange={() => handleCheckboxChange(student.Registration, index)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Button variant="success" onClick={() => handlePagarParcelas(student.Registration)}>
                                                    Pagar Parcelas
                                                </Button>
                                            </>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
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
