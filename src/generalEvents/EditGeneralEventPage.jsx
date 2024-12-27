import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import getApiUrl from '../util/api';

function EditGeneralEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [name, setName] = useState("");
    const [installments, setInstallments] = useState("");
    const [date, setDate] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

    useEffect(() => {
        fetch(`${getApiUrl()}/GeneralEvent/GetGeneralEventDetails/${id}`)
            .then(response => response.json())
            .then(data => {
                setEvent(data);
                setName(data.name);
                setInstallments(data.installments);
                setDate(new Date(data.date).toISOString().split('T')[0]);
                setTotalPrice(data.totalPrice);
            })
            .catch(error => console.error("Erro ao carregar detalhes do evento:", error));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedEvent = {
            name,
            installments: parseInt(installments),
            date,
            totalPrice: parseFloat(totalPrice)
        };

        fetch(`${getApiUrl()}/GeneralEvent/UpdateGeneralEvent/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedEvent)
        })
        .then(response => {
            if (response.ok) {
                alert("Evento atualizado com sucesso!");
                navigate("/general-events");
            } else {
                alert("Erro ao atualizar evento. Tente novamente.");
            }
        })
        .catch(error => console.error("Erro ao atualizar evento:", error));
    };

    if (!event) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">
                <h3>Editar Evento Geral</h3>
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
                        Atualizar
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default EditGeneralEventPage;
