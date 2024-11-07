import React, { useState, useEffect } from 'react';
import CustomNavbar from "../components/CustomNavbar";
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import { useNavigate } from 'react-router-dom';

function NovoFinanceiro() {
    const [nome, setNome] = useState('');
    const [totalprice, setTotalPrice] = useState('');
    const [parcelas, setParcelas] = useState('');
    const [data, setData] = useState('');
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        fetchGroups();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/event/GetEvents`);
            const eventsData = response.data.$values || [];
    
            const eventsWithGroups = await Promise.all(eventsData.map(async (event) => {
                if (event.GroupId) {
                    const groupResponse = await axios.get(`${getApiUrl()}/group/GetGroupDetail/${event.GroupId}`);
                    return { ...event, Group: groupResponse.data };
                }
                return event;
            }));
    
            setEvents(eventsWithGroups);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        }
    };
    

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/group/GetGroups`);
            if (Array.isArray(response.data.$values)) {
                setGroups(response.data.$values);
            } else {
                console.error('Resposta inesperada da API', response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const date = new Date(data);
        const evento = {
            name: nome,
            installments: parseInt(parcelas),
            date: new Date(date.getTime() + date.getTimezoneOffset() * 60000),
            TotalPrice: parseFloat(totalprice),
            GroupId: parseInt(selectedGroup)
        };

        try {
            await axios.post(`${getApiUrl()}/event/AddEvent`, evento);
            alert('Evento cadastrado com sucesso!');
            fetchEvents();
        } catch (error) {
            console.error('Erro ao cadastrar evento:', error);
            alert('Erro ao cadastrar evento');
        }
    };

    const handleDetails = (id) => {
        navigate(`/DetalheEvento/${id}`);
    };    

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="nome">
                        <Form.Label>Nome do evento</Form.Label>
                        <Form.Control
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="valor">
                                <Form.Label>Valor</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={totalprice}
                                    onChange={(e) => setTotalPrice(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="parcelas">
                                <Form.Label>Número de parcelas</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={parcelas}
                                    onChange={(e) => setParcelas(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="data">
                        <Form.Label>Data do evento</Form.Label>
                        <Form.Control
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="grupo">
                        <Form.Label>Turma</Form.Label>
                        <Form.Select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="">Selecione uma turma</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name} - {group.level} ({group.shift})
                                </option>
                            ))}

                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Cadastrar
                    </Button>
                </Form>

                {events.length > 0 ? (
                <Table striped className="mt-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome do evento</th>
                            <th>Data</th>
                            <th>Parcelas</th>
                            <th>Total</th>
                            <th>Turma</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.Id}>
                                <td>{event.Id}</td>
                                <td>{event.Name}</td>
                                <td>{new Date(event.Date).toLocaleDateString()}</td>
                                <td>{event.Installments}</td>
                                <td>{event.TotalPrice}</td>
                                <td>{event.Group ? `${event.Group.Name} (${event.Group.Level}, ${event.Group.Shift})` : 'Sem turma'}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleDetails(event.Id)}>
                                        Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="mt-4">Nenhum evento cadastrado.</p>
            )}
            </Container>
        </>
    );
}

export default NovoFinanceiro;