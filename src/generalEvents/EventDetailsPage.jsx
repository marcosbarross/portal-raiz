import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Accordion, Table } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function GeneralEventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    // Fetch dos detalhes do evento
    useEffect(() => {
        fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEventDetails/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do evento");
                }
                return response.json();
            })
            .then((data) => setEvent(data))
            .catch((err) => setError(err.message));
    }, [id]);

    // Fetch dos grupos
    useEffect(() => {
        fetch(`${getApiUrl()}/Group/GetGroups`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados dos grupos");
                }
                return response.json();
            })
            .then((data) => setGroups(data.$values || []))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p>Erro ao carregar dados: {error}</p>;
    }

    if (!event || groups.length === 0) {
        return <p>Carregando...</p>;
    }

    // Função para agrupar alunos por grupo e turno
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

    const groupedStudents = groupStudentsByGroupAndShift();

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">
                <h3>Detalhes do Evento Geral</h3>
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

                <h3>Alunos por Turma e Turno</h3>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedStudents[groupKey].length > 0 ? (
                                            groupedStudents[groupKey].map((student, studentIndex) => (
                                                <tr key={studentIndex}>
                                                    <td>{studentIndex + 1}</td>
                                                    <td>{student?.Name || "Nome não disponível"}</td>
                                                    <td>{student?.Responsible || "Responsável não disponível"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">
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
            </Container>
        </>
    );
}

export default GeneralEventDetailsPage;
