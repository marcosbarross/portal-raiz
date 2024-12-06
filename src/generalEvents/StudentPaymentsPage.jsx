import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Form, Button } from "react-bootstrap";
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

    useEffect(() => {
        fetch(`${getApiUrl()}/Student/GetGeneralEventInstallments/${studentId}/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar parcelas");
                }
                return response.json();
            })
            .then((data) => setInstallments(data.$values || []))
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
        const unpaidInstallments = installments.filter((i) => !i.Paid);
        return unpaidInstallments
            .slice(0, selectedInstallments)
            .reduce((total, installment) => total + (installment.Installment ?? 0), 0);
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
    
        const paidInstallments = installments.filter((i) => i.Paid);
    
        paidInstallments.forEach((parcela, index) => {
            const descricao = `${parcela.InstallmentNumber}ª parcela - Pago em: ${new Date(parcela.PayDate).toLocaleDateString()}`;
            const preco = `R$ ${(parcela.Installment ?? 0).toFixed(2)}`;
            pdf.text(descricao, 10, yPos);
            yPos += 10;
            pdf.text(preco, 10, yPos);
            yPos += 10;
    
            pdf.line(10, yPos - 5, 80, yPos - 5);
            total += parcela.Installment ?? 0;
        });
    
        pdf.text(`Total: R$ ${total.toFixed(2)}`, 10, yPos + 5);
        pdf.text("Obrigado!", 10, yPos + 15);
    
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
                alert("Pagamento realizado com sucesso!");
                handleGerarPDF();
                window.location.reload();
            })
            .catch((err) => alert(err.message));
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
                                <td>{installment.PayDate ? new Date(installment.PayDate).toLocaleDateString() : "N/A"}</td>
                                <td>R$ {(installment.Installment ?? 0).toFixed(2)}</td>
                                <td>{installment.Paid ? "Pago" : "Pendente"}</td>
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
                            { length: installments.filter((i) => !i.Paid).length },
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
                    className="mt-3"
                    onClick={handlePayment}
                    disabled={selectedInstallments === 0 || change < 0}
                >
                    Realizar pagamento
                </Button>
            </Container>
            <br />
        </>
    );
}

export default StudentPaymentsPage;
