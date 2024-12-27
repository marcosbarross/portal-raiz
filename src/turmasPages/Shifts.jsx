import React, { useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel, Table, Modal } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import axios from 'axios';
import getApiUrl from '../util/api';

function Shifts() {
    const [shifts, setShifts] = useState([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/Shift/GetShifts`);
            setShifts(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar turnos:', error);
            setShifts([]);
        }
    };

    const handleAddShift = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${getApiUrl()}/Shift/AddShift`, { name });
            fetchShifts();
            setName('');
        } catch (error) {
            console.error('Erro ao adicionar turno:', error);
        }
    };

    const handleEditShift = (shift) => {
        setName(shift.name);
        setEditId(shift.id);
        setShowEditModal(true);
    };

    const handleUpdateShift = async () => {
        try {
            await axios.put(`${getApiUrl()}/Shift/UpdateShift/${editId}`, { name });
            fetchShifts();
            setShowEditModal(false);
            setEditId(null);
            setName('');
        } catch (error) {
            console.error('Erro ao editar turno:', error);
        }
    };

    const handleDeleteShift = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteShift = async () => {
        try {
            await axios.delete(`${getApiUrl()}/Shift/DeleteShift/${deleteId}`);
            fetchShifts();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Erro ao excluir turno:', error);
        }
    };

    return (
        <>
            <CustomNavbar />
            <Container className='mt-4'>
                <h2>Cadastrar novo turno</h2>
                <Form onSubmit={handleAddShift}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Nome do turno"
                        className="mb-3"
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Digite o nome do turno"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <Button variant="primary" type="submit" className="mb-3">
                        Cadastrar
                    </Button>
                </Form>
            </Container>

            <Container>
                <h2>Turnos cadastrados</h2>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome do Turno</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.map((shift, index) => (
                            <tr key={shift.id}>
                                <td>{index + 1}</td>
                                <td>{shift.name}</td>
                                <td>
                                    <Button 
                                        variant="warning" 
                                        onClick={() => handleEditShift(shift)}
                                        className="me-2"
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDeleteShift(shift.id)}
                                    >
                                        Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Turno</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Nome do turno"
                            className="mb-3"
                        >
                            <Form.Control 
                                type="text" 
                                placeholder="Digite o nome do turno"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleUpdateShift}>Salvar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja excluir este turno?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDeleteShift}>Excluir</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Shifts;