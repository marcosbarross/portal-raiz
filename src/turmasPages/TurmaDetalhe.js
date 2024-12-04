import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import CustomNavbar from '../components/CustomNavbar';

function TurmaDetalhe() {
    const { id } = useParams();
    const [groupData, setGroupData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [studentIdToDelete, setStudentIdToDelete] = useState(null);

    const handleDeleteStudent = (StudentId) => {
        setShowModal(true);
        setStudentIdToDelete(StudentId);
    };

    const confirmDelete = () => {
        axios.delete(`${getApiUrl()}/group/RemoveStudentFromGroup/${studentIdToDelete}`)
          .then(() => {
              loadStudents(groupData.Id);
              setShowModal(false);
          })
          .catch(error => {
              console.error('Erro ao excluir aluno:', error);
              setShowModal(false);
          });
    };

    const loadStudents = (id) => {
        fetch(`${getApiUrl()}/group/GetGroupDetail/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.Students && data.Students.$values) {
                    const students = data.Students.$values;
                    setGroupData({ ...data, Students: students });
                } else {
                    setGroupData(data);
                }
            })
            .catch(error => setError(error));
    };
    
    useEffect(() => {
        if (id) {
            loadStudents(id);
        }
    }, [id]);

    if (error) {
        console.error('Erro:', error);
        return <p>Erro ao carregar os dados: {error.message}</p>;
    }

    if (!groupData) {
        return <p>Carregando...</p>;
    }

    return (
        <>
        <CustomNavbar />
        <br />
        <Container>
            <h1>{groupData.Name}, {groupData.Shift}</h1>
            <p>{groupData.Level}</p>

            <h2>Alunos</h2>
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
                    {groupData.Students && groupData.Students.map((student, index) => (
                        <tr key={student.Registration}>
                            <td>{index + 1}</td>
                            <td>{student.Name}</td>
                            <td>{student.Responsible}</td>
                            <td>{groupData.Name}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteStudent(student.Registration)}>Remover</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
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
