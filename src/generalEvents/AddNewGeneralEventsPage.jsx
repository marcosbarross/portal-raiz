import React, { useState, useEffect } from "react";
import { Container, FloatingLabel, Form, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import CustomNavbar from "../components/CustomNavbar";
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../util/api';

function GeneralEventsPage() {
    const [generalEvents, setGeneralEvents] = useState([]);
    const [name, setName] = useState("");
    const [installments, setInstallments] = useState("");
    const [date, setDate] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadGeneralEvents();
    }, []);

    const loadGeneralEvents = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEvents`);
            const data = await response.json();
            setGeneralEvents(data);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            setError("Erro ao carregar eventos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !installments || !date || !totalPrice) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        const newEvent = {
            name,
            installments: parseInt(installments),
            date,
            totalPrice: parseFloat(totalPrice),
        };

        try {
            const response = await fetch(`${getApiUrl()}/GeneralEvent/AddGeneralEvent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            });

            if (response.ok) {
                setSuccess("Evento cadastrado com sucesso!");
                setName("");
                setInstallments("");
                setDate("");
                setTotalPrice("");
                loadGeneralEvents();
            } else {
                setError("Erro ao cadastrar evento. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar evento:", error);
            setError("Erro ao cadastrar evento. Tente novamente.");
        }
    };

    const handleDelete = (id) => {
        setShowModal(true);
        setEventIdToDelete(id);
    };

    const confirmDelete = async () => {
        setError("");
        try {
            const response = await fetch(`${getApiUrl()}/GeneralEvent/DeleteGeneralEvent/${eventIdToDelete}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setShowModal(false);
                loadGeneralEvents();
            } else {
                setError("Erro ao excluir evento. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
            setError("Erro ao excluir evento. Tente novamente.");
        }
    };

    return (
        <>
            <CustomNavbar />

            <Container className="mb-3">
                <br />
                <h3>Cadastrar novo evento geral</h3>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <FloatingLabel controlId="floatingInput" label="Nome do evento" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Nome do evento"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Parcelas" className="mb-3">
                        <Form.Control
                            type="number"
                            placeholder="Parcelas"
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Data" className="mb-3">
                        <Form.Control
                            type="date"
                            placeholder="Data"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Preço Total" className="mb-3">
                        <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Preço Total"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                        />
                    </FloatingLabel>
                    <Button variant="primary" type="submit">
                        Cadastrar
                    </Button>
                </Form>

                <br />
                <h3>Eventos gerais</h3>

                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Valor Total</th>
                                <th>Parcelas</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generalEvents.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.id}</td>
                                    <td>{event.name}</td>
                                    <td>{event.totalPrice}</td>
                                    <td>{event.installments}</td>
                                    <td>
                                        <Button variant="info" onClick={() => navigate(`/ViewGeneralEvent/${event.id}`)}>
                                            Acessar
                                        </Button>{' '}
                                        <Button variant="warning" onClick={() => navigate(`/EditGeneralEvent/${event.id}`)}>
                                            Editar
                                        </Button>{' '}
                                        <Button variant="danger" onClick={() => handleDelete(event.id)}>
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja excluir este evento?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default GeneralEventsPage;
