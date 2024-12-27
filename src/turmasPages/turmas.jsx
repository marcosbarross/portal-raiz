import React, { useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel, Table, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import axios from 'axios';
import getApiUrl from '../util/api';

function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [name, setName] = useState('');
    const [levelId, setLevelId] = useState('');
    const [shiftId, setShiftId] = useState('');
    const [gradeId, setGradeId] = useState('');
    const [levels, setLevels] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [grades, setGrades] = useState([]);
    const [filteredGrades, setFilteredGrades] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTurmas();
        fetchLevels();
        fetchShifts();
        fetchGrades();
    }, []);

    const fetchTurmas = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Group/GetGroups`);
            if (response.data && Array.isArray(response.data)) {
                setTurmas(response.data);
            } else {
                setTurmas([]);
            }
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
            setTurmas([]);
        }
    };

    const fetchLevels = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Level/GetLevels`);
            if (response.data && Array.isArray(response.data)) {
                const sortedLevels = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setLevels(sortedLevels);
            } else {
                setLevels([]);
            }
        } catch (error) {
            console.error('Erro ao buscar níveis:', error);
            setLevels([]);
        }
    };
    

    const fetchShifts = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Shift/GetShifts`);
            if (response.data && Array.isArray(response.data)) {
                const sortedShifts = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setShifts(sortedShifts);
            } else {
                setShifts([]);
            }
        } catch (error) {
            console.error('Erro ao buscar turnos:', error);
            setShifts([]);
        }
    };
    
    const fetchGrades = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Grade/GetGrades`);
            if (response.data && Array.isArray(response.data)) {
                const sortedGrades = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setGrades(sortedGrades);
            } else {
                setGrades([]);
            }
        } catch (error) {
            console.error('Erro ao buscar séries:', error);
            setGrades([]);
        }
    };
    

    const handleLevelChange = (e) => {
        const selectedLevelId = e.target.value;
        setLevelId(selectedLevelId);
        const relatedGrades = grades.filter(grade => grade.levelId === parseInt(selectedLevelId));
        setFilteredGrades(relatedGrades);
        setGradeId('');
    };

    const handleAddTurma = async (e) => {
        e.preventDefault();
        try {
            const level = levels.find(l => l.id === parseInt(levelId));
            const shift = shifts.find(s => s.id === parseInt(shiftId));
            const grade = grades.find(g => g.id === parseInt(gradeId));
            await axios.post(`${getApiUrl()}/Group/AddGroup`, { name, levelId: parseInt(levelId), shiftId: parseInt(shiftId), gradeId: parseInt(gradeId)});
            fetchTurmas();
            setName('');
            setLevelId('');
            setShiftId('');
            setGradeId('');
        } catch (error) {
            console.error('Erro ao adicionar turma:', error);
        }
    };

    const handleDetails = (id) => {
        navigate(`/TurmaDetalhe/${id}`);
    };

    const renderTurmasByLevel = (levelId) => {
        const level = levels.find((l) => l.id === levelId);
        const filteredTurmas = turmas.filter((turma) => turma.levelId === levelId);
    
        if (!level || filteredTurmas.length === 0) return null;
    
        return (
            <Accordion.Item eventKey={levelId}>
                <Accordion.Header>{level.name}</Accordion.Header>
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
                            {filteredTurmas.map((turma, index) => {
                                const shift = shifts.find((s) => s.id === turma.shiftId);
                                return (
                                    <tr key={turma.id}>
                                        <td>{index + 1}</td>
                                        <td>{turma.name}</td>
                                        <td>{shift ? shift.name : 'Indefinido'}</td>
                                        <td>
                                            <Button 
                                                variant="primary" 
                                                onClick={() => handleDetails(turma.id)}
                                            >
                                                Detalhes
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                        value={levelId}
                        onChange={handleLevelChange}
                    >
                        <option>Selecione o nível</option>
                        {levels.map((level) => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Select 
                        aria-label="Selecione a série" 
                        className='mb-3'
                        value={gradeId}
                        onChange={(e) => setGradeId(e.target.value)}
                        disabled={!levelId}
                    >
                        <option>Selecione a série</option>
                        {filteredGrades.map((grade) => (
                            <option key={grade.id} value={grade.id}>{grade.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Select 
                        aria-label="Selecione o horário" 
                        className='mb-3'
                        value={shiftId}
                        onChange={(e) => setShiftId(e.target.value)}
                    >
                        <option>Selecione o horário</option>
                        {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>{shift.name}</option>
                        ))}
                    </Form.Select>        
                    <Button variant="primary" type="submit" className="mb-3">
                        Cadastrar
                    </Button>
                </Form>
            </Container>

            <Container>
                <h2>Turmas cadastradas</h2>
                <Accordion defaultActiveKey="0">
                    {levels.map(level => renderTurmasByLevel(level.id))}
                </Accordion>
            </Container> 
        </>
    );
}

export default Turmas;
