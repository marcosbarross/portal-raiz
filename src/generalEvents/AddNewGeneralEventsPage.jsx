import React, { useState, useEffect } from "react";
import { Container, FloatingLabel, Form, Button, Table, Modal } from 'react-bootstrap';
import CustomNavbar from "../components/CustomNavbar";
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../util/api';

function GeneralEventsPage() {
    const [generalEvents, setGeneralEvents] = useState([]);
    const [name, setName] = useState("");
    const [installments, setInstallments] = useState("");
    const [date, setDate] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadGeneralEvents();
    }, []);    

    const loadGeneralEvents = () => {
        fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEvents`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.$values)) {
                    setGeneralEvents(data.$values);
                } else {
                    console.error("Resposta da API não é um array:", data);
                }
            })
            .catch(error => console.error("Erro ao carregar eventos:", error));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newEvent = {
            name: name,
            installments: parseInt(installments),
            date: date,
            totalPrice: parseFloat(totalPrice)
        };
        try {
            const response = await fetch(`${getApiUrl()}/GeneralEvent/AddGeneralEvent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEvent)
            });
            if (response.ok) {
                alert("Evento cadastrado com sucesso!");
                // Limpar o formulário
                setName("");
                setInstallments("");
                setDate("");
                setTotalPrice("");
                // Recarregar os eventos
                loadGeneralEvents();
            } else {
                alert("Erro ao cadastrar evento. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar evento:", error);
            alert("Erro ao cadastrar evento. Tente novamente.");
        }
    };

    const handleDelete = (id) => {
        setShowModal(true);
        setEventIdToDelete(id);
    };

    const confirmDelete = () => {
        fetch(`${getApiUrl()}/GeneralEvent/DeleteGeneralEvent/${eventIdToDelete}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                setShowModal(false);
                // Recarregar os eventos após a exclusão
                loadGeneralEvents();
            } else {
                alert("Erro ao excluir evento. Tente novamente.");
            }
        })
        .catch(error => {
            console.error("Erro ao excluir evento:", error);
            alert("Erro ao excluir evento. Tente novamente.");
        });
    };

    return (
        <>
        <CustomNavbar />
   
        <Container className="mb-3">
            <br />
            <h3>Cadastrar novo evento geral</h3>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Nome do evento"
                    className="mb-3"
                >
                    <Form.Control 
                        type="text" 
                        placeholder="Nome do evento" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Parcelas"
                    className="mb-3"
                >
                    <Form.Control 
                        type="number" 
                        placeholder="Parcelas" 
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)} 
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Data"
                    className="mb-3"
                >
                    <Form.Control 
                        type="date" 
                        placeholder="Data" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)} 
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Preço Total"
                    className="mb-3"
                >
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
            <h3>Eventos Gerais</h3>
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
                    {generalEvents.map(event => (
                        <tr key={event.Id}>
                            <td>{event.Id}</td>
                            <td>{event.Name}</td>
                            <td>{event.TotalPrice}</td>
                            <td>{event.Installments}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate(`/ViewGeneralEvent/${event.Id}`)}>Acessar</Button>{' '}
                                <Button variant="warning" onClick={() => navigate(`/EditGeneralEvent/${event.Id}`)}>Editar</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(event.Id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>Tem certeza de que deseja excluir este evento?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default GeneralEventsPage;
