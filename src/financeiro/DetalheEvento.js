import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomNavbar from '../components/CustomNavbar';
import jsPDF from 'jspdf';
import { Container, Button, Form, Spinner, Table, Accordion } from "react-bootstrap";
import axios from 'axios';
import getApiUrl from '../util/api';

function DetalheEvento() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        Registration: ''
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

            // Carrega os alunos do grupo vinculado ao evento
            if (eventData.GroupId) {
                fetchStudentsByGroup(eventData.GroupId);
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes do evento:', error);
        }
    };

    const fetchStudentsByGroup = async (groupId) => {
        try {
            const response = await axios.get(`${getApiUrl()}/group/GetGroupDetail/${groupId}`);
            const studentsData = response.data?.Students?.$values || [];
            setStudents(studentsData);
        } catch (error) {
            console.error('Erro ao carregar alunos do grupo:', error);
        }
    };

    const handleAddStudentToggle = () => {
        setShowAddStudentForm(!showAddStudentForm);
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiUrl()}/student/AddStudentToEvent`, {
                EventId: id,
                Registration: newStudent.Registration
            });
            setNewStudent({ Registration: '' });
            setShowAddStudentForm(false);
            fetchEventDetails();
        } catch (error) {
            console.error('Erro ao adicionar aluno:', error);
            alert('Erro ao adicionar aluno. Verifique se o aluno já está registrado no evento.');
        }
    };

    const handlePagarParcelas = async (studentId) => {
        const selectedParcelas = parcelas[studentId]
            .filter(parcela => parcela.paid && !parcela.Paid)
            .map(parcela => ({
                InstallmentNumber: parcela.InstallmentNumber,
                Paid: true,
                Valor: event.TotalPrice / event.Installments,
                EventId: id,
                StudentId: studentId
            }));

        try {
            await axios.post(`${getApiUrl()}/student/PagarParcelas`, selectedParcelas);
            fetchParcelas(studentId);
            const student = event.Students.find(s => s.Registration === studentId);
            handleGerarPDF(student.Name, selectedParcelas);
        } catch (error) {
            console.error('Erro ao pagar parcelas:', error);
            alert('Erro ao pagar parcelas.');
        }
    };

    const handleGerarPDF = (studentName, parcelasPagas) => {
        const pdf = new jsPDF({
            unit: 'mm',
            format: [80, 297]
        });
        const docWidth = pdf.internal.pageSize.getWidth();

        pdf.setFontSize(8);
        pdf.text('EDUCANDÁRIO RAIZ DO SABER', docWidth / 2, 10, { align: 'center' });
        pdf.text('Rua Francisco do Rego Moraes Barros', docWidth / 2, 13, { align: 'center' });
        pdf.text('Engenho Maranguape - Paulista - PE', docWidth / 2, 16, { align: 'center' });
        pdf.text('CNPJ: 03.511.401.0001-02', docWidth / 2, 19, { align: 'center' });

        pdf.setFontSize(10);
        const currentDate = new Date().toLocaleDateString();
        pdf.text(`Nome: ${studentName}`, 10, 25);
        pdf.text(`Data: ${currentDate}`, 10, 30);
        pdf.text('Descrição:', 10, 40);

        let yPos = 45;
        let total = 0;

        parcelasPagas.forEach((parcela) => {
            const descricao = ` ${parcela.InstallmentNumber}ª parcela`;
            const preco = `R$ ${parcela.Valor}`;
            pdf.text(descricao, 10, yPos);
            pdf.text(preco, 50, yPos);
            yPos += 10;

            pdf.line(10, yPos - 5, 80, yPos - 5);
            total += parseFloat(parcela.Valor);
        });

        pdf.text(`Total: R$ ${total.toFixed(2)}`, 10, yPos + 5);
        pdf.text('Obrigado!', 10, yPos + 15);

        const string = pdf.output('bloburl');
        window.open(string, '_blank');
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
            const selectedParcela = updatedParcelas[studentId][parcelaIndex];
            const allPreviousPaid = updatedParcelas[studentId].slice(0, parcelaIndex).every(parcela => parcela.Paid || parcela.paid);
            if (allPreviousPaid) {
                if (!selectedParcela.Paid) {
                    selectedParcela.paid = !selectedParcela.paid;
                }
                setParcelas(updatedParcelas);
            } else {
                alert('Você só pode pagar parcelas consecutivas.');
            }
        } else {
            console.error('Parcelas não é um array:', updatedParcelas[studentId]);
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
                        <p>Pagamento: R${event.TotalPrice} reais em {event.Installments} parcelas de R$ {event.TotalPrice / event.Installments}</p>

                        <Button variant="primary" onClick={handleAddStudentToggle}>
                            {showAddStudentForm ? 'Cancelar' : 'Adicionar aluno'}
                        </Button>
                        <br />

                        {showAddStudentForm && (
                            <Container className="mb-3">
                                <Form onSubmit={handleAddStudent} className="mt-4">
                                    <Form.Group controlId="formStudent">
                                        <Form.Label>Aluno</Form.Label>
                                        <Form.Select
                                            aria-label="Selecione o aluno"
                                            value={newStudent.Registration}
                                            onChange={(e) => setNewStudent({ ...newStudent, Registration: e.target.value })}
                                        >
                                            <option value="">Selecione o aluno</option>
                                            {students.map((student) => (
                                                <option key={student.Registration} value={student.Registration}>
                                                    {student.Name} (Responsável: {student.Responsible})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Button type="submit" variant="success" className="mt-3">
                                        Adicionar
                                    </Button>
                                </Form>
                            </Container>
                        )}

                        <br />
                        <h3>Alunos confirmados</h3>
                        <Accordion defaultActiveKey="0">
                            {event.Students.map(student => (
                                <Accordion.Item eventKey={student.Registration} key={student.Registration}>
                                    <Accordion.Header onClick={() => handleToggleAccordion(student.Registration)}>
                                        {`${student.Name}, Responsável: ${student.Responsible}` }
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {loadingParcelas[student.Registration] ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Parcela</th>
                                                        <th>Pago</th>
                                                        <th>Selecionar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {parcelas[student.Registration]?.map((parcela, index) => (
                                                        <tr key={index}>
                                                            <td>{parcela.InstallmentNumber}</td>
                                                            <td>{parcela.Paid ? 'Sim' : 'Não'}</td>
                                                            <td>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={parcela.paid || parcela.Paid}
                                                                    onChange={() => handleCheckboxChange(student.Registration, index)}
                                                                    disabled={parcela.Paid}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                        <Button variant="primary" onClick={() => handlePagarParcelas(student.Registration)} className="mt-3">
                                            Pagar parcelas selecionadas
                                        </Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                ) : (
                    <Spinner animation="border" />
                )}
            </Container>
        </>
    );
}

export default DetalheEvento;
