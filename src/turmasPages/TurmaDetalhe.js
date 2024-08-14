import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container } from 'react-bootstrap';
import getApiUrl from '../util/api';
import CustomNavbar from '../components/CustomNavbar';

function TurmaDetalhe() {
    const { id } = useParams();
    console.log('ID from params:', id); // Log do ID
    const [groupData, setGroupData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (id) {  // Verifica se o ID existe
            console.log('ID exists, making API call'); // Log para confirmar o ID
            fetch(`${getApiUrl()}/group/GetGroupDetail/${id}`)
                .then(response => {
                    console.log('Response:', response);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data:', data); // Log dos dados recebidos
                    if (data && data.Students && data.Students.$values) {
                        const students = data.Students.$values;
                        setGroupData({ ...data, Students: students });
                    } else {
                        setGroupData(data);
                    }
                })
                .catch(error => setError(error));
        }
    }, [id]);

    if (error) {
        console.error('Erro:', error); // Log do erro para depuração
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
                    </tr>
                </thead>
                <tbody>
                    {groupData.Students && groupData.Students.map((student, index) => (
                        <tr key={student.Registration}>
                            <td>{index + 1}</td>
                            <td>{student.Name}</td>
                            <td>{student.Responsible}</td>
                            <td>{groupData.Name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
        </>     
    );
}


export default TurmaDetalhe;
