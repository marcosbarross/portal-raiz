import React, { useState, useEffect } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';
import { useNavigate } from 'react-router-dom';

function NovoFinanceiro() {
  const [nome, setNome] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
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
      const response = await axios.get(
        `${getApiUrl()}/GeneralEvent/GetGeneralEvents`
      );
      setEvents(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/Group/GetGroups`);
      setGroups(response.data.$values || []);
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
      totalPrice: parseFloat(totalPrice),
      groupId: parseInt(selectedGroup),
    };

    try {
      await axios.post(`${getApiUrl()}/GeneralEvent/AddGeneralEvent`, evento);
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
                  value={totalPrice}
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
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.installments}</td>
                  <td>{event.totalPrice}</td>
                  <td>
                    {event.group
                      ? `${event.group.name} (${event.group.level}, ${event.group.shift})`
                      : 'Sem turma'}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleDetails(event.id)}
                    >
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
