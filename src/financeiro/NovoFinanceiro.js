import React, { useState, useEffect } from 'react';
import CustomNavbar from "../components/CustomNavbar";
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import { useNavigate } from 'react-router-dom';

function NovoFinanceiro() {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [parcelas, setParcelas] = useState('');
    const [data, setData] = useState('');
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/event/GetEvents`);
            if (Array.isArray(response.data.$values)) {
                setEvents(response.data.$values);
            } else {
                console.error('Resposta inesperada da API', response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const date = new Date(data);
        const evento = {
            name: nome,
            installments: parseInt(parcelas),
            date: new Date(date.getTime() + date.getTimezoneOffset() * 60000)
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
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
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

                    <Button variant="primary" type="submit">
                        Cadastrar
                    </Button>
                </Form>

                {events.length > 0 ? (
                    <Table striped className="mt-4">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Nome do evento</th>
                                <th>Data</th>
                                <th>Parcelas</th>
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
