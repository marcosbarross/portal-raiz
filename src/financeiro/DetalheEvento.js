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
    const [levels, setLevels] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        Level: '',
        GroupId: '',
        Registration: ''
    });
    const [loadingParcelas, setLoadingParcelas] = useState({});
    const [parcelas, setParcelas] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
        fetchLevels();
    }, [id]);

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
    
        parcelasPagas.forEach((parcela, index) => {
            const descricao = ` ${parcela.InstallmentNumber}ª parcela`;
            const preco = `R$ ${parcela.Valor}`;
            pdf.text(descricao, 10, yPos);
            pdf.text(preco, 50, yPos);
            yPos += 10;
    
            pdf.line(10, yPos - 5, 80, yPos - 5);
            total += parseFloat(parcela.Valor);
        });
    
        pdf.text(`Total: R$ ${total.toFixed(2)}`, 10, yPos + 5);
        yPos += 15;
        pdf.text('Obrigado!', 10, yPos);
    
        const string = pdf.output('bloburl');
        window.open(string, '_blank');
    };
    
    const handlePagarParcelas = async (studentId) => {
        const selectedParcelas = parcelas[studentId].filter(parcela => parcela.paid && !parcela.Paid).map(parcela => ({
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
            console.log(selectedParcelas)
            handleGerarPDF(student.Name, selectedParcelas);
        } catch (error) {
            console.error('Erro ao pagar parcelas:', error);
            alert('Erro ao pagar parcelas.');
        }
    };
    

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

    const fetchLevels = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/group/GetGroups`);
            const groupsData = response.data;
            const groupsArray = groupsData.$values || [];
            const uniqueLevels = [...new Set(groupsArray.map(group => group.level))];
            setLevels(uniqueLevels);
        } catch (error) {
            console.error('Erro ao carregar níveis:', error);
        }
    };

    const fetchGroupsByLevel = async (level) => {
        try {
            const response = await axios.get(`${getApiUrl()}/group/GetGroups`);
            const groupsData = response.data;
            const groupsArray = groupsData.$values || [];
            const filteredGroups = groupsArray.filter(group => group.level === level);
            setGroups(filteredGroups);
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
        }
    };

    const fetchStudentsByGroup = async (groupId) => {
        try {
            const response = await axios.get(`${getApiUrl()}/student/GetStudents`);
            const studentsData = response.data?.$values || [];
            const filteredStudents = studentsData.filter(student => student.GroupId == groupId);
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    };
    

    const handleLevelChange = (e) => {
        const level = e.target.value;
        setNewStudent({ ...newStudent, Level: level, GroupId: '', Registration: '' });
        setGroups([]);
        setStudents([]);
        fetchGroupsByLevel(level);
    };

    const handleGroupChange = (e) => {
        const groupId = e.target.value;
        setNewStudent({ ...newStudent, GroupId: groupId, Registration: '' });
        setStudents([]);
        fetchStudentsByGroup(groupId);
    };

    const handleStudentChange = (e) => {
        const registration = e.target.value;
        setNewStudent({ ...newStudent, Registration: registration });
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
            setNewStudent({
                Level: '',
                GroupId: '',
                Registration: ''
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
                            {showAddStudentForm ? 'Cancelar' : 'Adicionar Aluno'}
                        </Button>
                        <br />

                        {showAddStudentForm && (
                            <Container className="mb-3">
                                <Form onSubmit={handleAddStudent} className="mt-4">
                                    <Form.Group controlId="formLevel">
                                        <Form.Label>Nível</Form.Label>
                                        <Form.Select aria-label="Selecione o nível" value={newStudent.Level} onChange={handleLevelChange}>
                                            <option value="">Selecione o nível</option>
                                            {levels.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <br />

                                    <Form.Group controlId="formGroup">
                                        <Form.Label>Turma</Form.Label>
                                        <Form.Select 
                                            aria-label="Selecione a turma"
                                            value={newStudent.GroupId}
                                            onChange={handleGroupChange}
                                            disabled={!newStudent.Level}
                                        >
                                            <option value="">Selecione a turma</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>{group.name} {group.shift} </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <br />
                                    <Form.Group controlId="formStudent">
                                        <Form.Label>Aluno</Form.Label>
                                        <Form.Select 
                                            aria-label="Selecione o aluno"
                                            value={newStudent.Registration}
                                            onChange={handleStudentChange}
                                            disabled={!newStudent.GroupId}
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
                {`${student.Name}, Responsável: (${student.Responsible})` }
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
                            </tr>
                        </thead>
                        <tbody>
                            {parcelas[student.Registration]?.map((parcela, index) => (
                                <tr key={parcela.InstallmentNumber}>
                                    <td>Parcela {parcela.InstallmentNumber}</td>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={parcela.paid || parcela.Paid}
                                            disabled={parcela.Paid}
                                            onChange={() => handleCheckboxChange(student.Registration, index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <Button 
                    variant="success"
                    onClick={() => handlePagarParcelas(student.Registration)}
                    disabled={loadingParcelas[student.Registration]}
                >
                    Pagar parcelas
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