import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import getApiUrl from "../util/api";
import { jsPDF } from "jspdf";

function StudentPaymentsPage() {
    const { id, studentId } = useParams();
    const [installments, setInstallments] = useState([]);
    const [selectedInstallments, setSelectedInstallments] = useState(0);
    const [error, setError] = useState(null);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [change, setChange] = useState(0);
    const [studentName, setStudentName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetch(`${getApiUrl()}/Student/GetGeneralEventInstallments/${studentId}/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar parcelas");
                }
                return response.json();
            })
            .then((data) => setInstallments(data || []))
            .catch((err) => setError(err.message));

        fetch(`${getApiUrl()}/Student/GetStudentName/${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar nome do aluno");
                }
                return response.json();
            })
            .then((data) => setStudentName(data.name))
            .catch((err) => setError(err.message));
    }, [id, studentId]);

    const calculateTotal = () => {
        const unpaidInstallments = installments.filter((i) => !i.paid);
        return unpaidInstallments
            .slice(0, selectedInstallments)
            .reduce((total, installment) => total + (installment.installment ?? 0), 0);
    };

    const handleGerarPDF = () => {
        const pdf = new jsPDF({
            unit: "mm",
            format: [80, 297],
        });
        const docWidth = pdf.internal.pageSize.getWidth();
    
        pdf.setFontSize(8);
        pdf.text("EDUCANDÁRIO RAIZ DO SABER", docWidth / 2, 10, { align: "center" });
        pdf.text("Rua Francisco do Rego Moraes Barros", docWidth / 2, 13, { align: "center" });
        pdf.text("Engenho Maranguape - Paulista - PE", docWidth / 2, 16, { align: "center" });
        pdf.text("CNPJ: 03.511.401.0001-02", docWidth / 2, 19, { align: "center" });
    
        pdf.setFontSize(10);
        const currentDate = new Date().toLocaleDateString();
        pdf.text(`Nome: ${studentName}`, 10, 25);
        pdf.text(`Data: ${currentDate}`, 10, 30);
        pdf.text("Parcelas Pagas:", 10, 40);
    
        let yPos = 45;
        let total = 0;
    
        installments
            .filter((i) => i.paid)
            .forEach((parcela) => {
                yPos += 1;
                const descricao = `${parcela.installmentNumber}ª parcela - Pago em: ${new Date(parcela.payDate).toLocaleDateString()}`;
                const preco = `R$ ${(parcela.installment ?? 0).toFixed(2)}`;
                pdf.text(descricao, 10, yPos);
                yPos += 5;
                pdf.text(preco, 10, yPos);
                yPos += 2;
                total += parcela.installment ?? 0;
                pdf.line(5, yPos + 2, docWidth - 5, yPos + 2);
                yPos += 6;
            });
    
        yPos += 5;
        pdf.text(`Total: R$ ${total.toFixed(2)}`, 10, yPos);
        yPos += 5;
        pdf.text("Obrigado!", 10, yPos + 5);
    
        const string = pdf.output("bloburl");
        window.open(string, "_blank");
    };
       

    const handlePayment = () => {
        const payload = {
            GeneralEventId: parseInt(id),
            StudentId: studentId,
            InstallmentsToPay: selectedInstallments,
        };

        fetch(`${getApiUrl()}/Student/PayGeneralEventInstallment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao processar pagamento");
                }
                setModalMessage("Pagamento realizado com sucesso!");
                setShowModal(true);
                setSelectedInstallments(0);
                setReceivedAmount(0);
                setChange(0);
                window.location.reload();
            })
            .catch((err) => {
                setModalMessage(err.message);
                setShowModal(true);
            });
    };

    if (error) {
        return <p>Erro ao carregar dados: {error}</p>;
    }

    if (installments.length === 0) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <CustomNavbar />
            <Container className="mt-4">
                <h3>Pagamentos de: {studentName}</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {installments.map((installment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{installment.payDate ? new Date(installment.payDate).toLocaleDateString() : "N/A"}</td>
                                <td>R$ {(installment.installment ?? 0).toFixed(2)}</td>
                                <td>{installment.paid ? "Pago" : "Pendente"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Form.Group className="mt-4">
                    <Form.Label>Quantidade de parcelas a pagar:</Form.Label>
                    <Form.Select
                        onChange={(e) => setSelectedInstallments(parseInt(e.target.value))}
                    >
                        <option value={0}>Selecione...</option>
                        {Array.from(
                            { length: installments.filter((i) => !i.paid).length },
                            (_, i) => i + 1
                        ).map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <p className="mt-3"><b>Total Selecionado:</b> R$ {calculateTotal().toFixed(2)}</p>

                <Form.Group className="mt-4">
                    <Form.Label>Valor recebido:</Form.Label>
                    <Form.Control
                        type="number"
                        value={receivedAmount}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setReceivedAmount(value);
                            setChange(value - calculateTotal());
                        }}
                    />
                </Form.Group>

                <p className="mt-3"><b>Troco:</b> R$ {change >= 0 ? change.toFixed(2) : "Valor insuficiente"}</p>

                <Button
                    className="mt-3 me-3"
                    onClick={handlePayment}
                    disabled={selectedInstallments === 0 || change < 0}
                >
                    Realizar pagamento
                </Button>

                <Button 
                    className="mt-3"
                    onClick={handleGerarPDF}
                    variant="info"
                >
                    Gerar recibo
                </Button>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default StudentPaymentsPage;
