import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import CustomNavbar from '../components/CustomNavbar';

function TurmaDetalhe() {
    const { id } = useParams();
    const [groupData, setGroupData] = useState(null);
    const [error, setError] = useState(null);

    const handleDeleteStudent = (StudentId) => {
        axios.delete(`${getApiUrl()}/group/RemoveStudentFromGroup/${StudentId}`)
          .then(() => loadStudents(groupData.Id))
          .catch(error => console.error('Error deleting product:', error));
      };

    const loadStudents = (id) =>{
        fetch(`${getApiUrl()}/group/GetGroupDetail/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
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
    }
    
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
        </>     
    );
}


export default TurmaDetalhe;