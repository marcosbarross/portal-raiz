import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import CustomNavbar from '../components/CustomNavbar';

function TurmaDetalhe() {
    const { id } = useParams();
    const [groupData, setGroupData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [studentIdToDelete, setStudentIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteStudent = (registration) => {
        setShowModal(true);
        setStudentIdToDelete(registration);
    };

    const confirmDelete = () => {
        axios.delete(`${getApiUrl()}/group/RemoveStudentFromGroup/${studentIdToDelete}`)
            .then(() => {
                loadGroupData(id);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao excluir aluno:', error);
                setShowModal(false);
            });
    };

    const loadGroupData = (groupId) => {
        axios.get(`${getApiUrl()}/group/GetGroupDetail/${groupId}`)
            .then(response => {
                if (response.data) {
                    setGroupData({ ...response.data, students: response.data.students || [] });
                } else {
                    console.warn('Resposta inesperada da API:', response.data);
                    setGroupData({ students: [] });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do grupo:', error);
                setError(error);
            });
    };

    useEffect(() => {
        if (id) {
            loadGroupData(id);
        }
    }, [id]);

    if (error) {
        console.error('Erro:', error);
        return <p>Erro ao carregar os dados: {error.message}</p>;
    }

    if (!groupData) {
        return <p>Carregando...</p>;
    }

    const filteredStudents = groupData.students.filter(student => 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.responsible?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <CustomNavbar />
            <br />
            <Container>
                <h1>{groupData.name || 'Turma não informada'}, {groupData.shift || 'Turno não informado'}</h1>
                <p>{groupData.level || 'Nível não informado'}</p>

                <Form.Group controlId="search">
                    <Form.Label>Buscar Aluno ou Responsável</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome do aluno ou responsável"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Form.Group>

                <h2>Alunos</h2>
                {filteredStudents.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Responsável</th>
                                <th>Turma</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student.registration || index}>
                                    <td>{index + 1}</td>
                                    <td>{student.name || 'Nome não informado'}</td>
                                    <td>{student.responsible || 'Responsável não informado'}</td>
                                    <td>{groupData.name || 'Turma não informada'}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteStudent(student.registration)}>
                                            Remover
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>Não há alunos cadastrados ou correspondentes à busca.</p>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja excluir este aluno?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
                </Modal.Footer>
            </Modal>
        </>     
    );
}

export default TurmaDetalhe;
