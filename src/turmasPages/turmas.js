import React, { useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel, Table, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import axios from 'axios';
import getApiUrl from '../util/api';

function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const [shift, setShift] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTurmas();
    }, []);

    const fetchTurmas = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Group/GetGroups`);
            setTurmas(response.data.$values);
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
        }
    };

    const handleAddTurma = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiUrl()}/Group/AddGroup`, { name, level, shift });
            fetchTurmas();
            setName('');
            setLevel('');
            setShift('');
        } catch (error) {
            console.error('Erro ao adicionar turma:', error);
        }
    };

    const handleDetails = (id) => {
        navigate(`/TurmaDetalhe/${id}`);
    };

    const renderTurmasByLevel = (level) => {
        const filteredTurmas = turmas.filter(turma => turma.level === level);

        if (filteredTurmas.length === 0) return null;

        return (
            <Accordion.Item eventKey={level}>
                <Accordion.Header>{level}</Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome da Turma</th>
                                <th>Turno</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTurmas.map((turma, index) => (
                                <tr key={turma.id}>
                                    <td>{index + 1}</td>
                                    <td>{turma.name}</td>
                                    <td>{turma.shift}</td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleDetails(turma.id)}
                                        >
                                            Detalhes
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        );
    };

    return (
        <>
            <CustomNavbar />
            <Container className='mt-4'>
                <h2>Cadastrar nova turma</h2>
                <Form onSubmit={handleAddTurma}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Nome da turma"
                        className="mb-3"
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Digite o nome da turma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <Form.Select 
                        aria-label="Selecione o nível" 
                        className='mb-3'
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option>Selecione o nível</option>
                        <option value="Ensino Infantil">Ensino Infantil</option>
                        <option value="Ensino Fundamental I">Ensino Fundamental I</option>
                        <option value="Ensino Fundamental II">Ensino Fundamental II</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                    </Form.Select>
                    <Form.Select 
                        aria-label="Selecione o horário" 
                        className='mb-3'
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                    >
                        <option>Selecione o horário</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                        <option value="Integral">Integral</option>
                    </Form.Select>        
                    <Button variant="primary" type="submit" className="mb-3">
                        Cadastrar
                    </Button>
                </Form>
            </Container>

            <Container>
                <h2>Turmas cadastradas</h2>
                <Accordion defaultActiveKey="0">
                    {renderTurmasByLevel('Ensino Infantil')}
                    {renderTurmasByLevel('Ensino Fundamental I')}
                    {renderTurmasByLevel('Ensino Fundamental II')}
                    {renderTurmasByLevel('Ensino Médio')}
                </Accordion>
            </Container> 
        </>
    );
}

export default Turmas;
