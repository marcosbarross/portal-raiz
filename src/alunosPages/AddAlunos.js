import React, { useState, useEffect } from 'react';
import CustomNavbar from "../components/CustomNavbar";
import { Form, Container, FloatingLabel, Button } from 'react-bootstrap';
import axios from 'axios';
import getApiUrl from '../util/api';

function AddAlunos() {
    const [name, setName] = useState('');
    const [responsible, setResponsible] = useState('');
    const [groupId, setGroupId] = useState('');
    const [turmas, setTurmas] = useState([]);

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

    const handleAddAluno = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiUrl()}/Student/AddStudent`, { 
                name, 
                responsible, 
                groupId: parseInt(groupId)
            });
            setName('');
            setResponsible('');
            setGroupId('');
        } catch (error) {
            console.error('Erro ao adicionar aluno:', error);
        }
    };
    
       

    return (
        <>
            <CustomNavbar />
            <Form onSubmit={handleAddAluno}>
                <Container className="mt-4">
                    <h2>Cadastrar novo aluno</h2>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Nome do aluno"
                        className="mb-3" >
                        <Form.Control 
                            type="text" 
                            placeholder="Nome do aluno" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </FloatingLabel>
                    <FloatingLabel 
                        controlId="floatingInput" 
                        label="Nome do responsável"
                        className="mb-3">
                        <Form.Control 
                            type="text" 
                            placeholder="Nome do responsável" 
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                        />
                    </FloatingLabel>
                </Container>
                <Container className="mt-4">
                    <Form.Select 
                        aria-label="Selecione a turma"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}>
                        <option value="">Selecione a turma</option>
                        {turmas.map((turma) => (
                            <option key={turma.id} value={turma.id}>
                                {turma.name} - {turma.level} - {turma.shift}
                            </option>
                        ))}
                    </Form.Select>
                    <br />
                    <Button variant="primary" type="submit">
                        Cadastrar
                    </Button>
                </Container>                
            </Form>
        </>
    );
}

export default AddAlunos;
