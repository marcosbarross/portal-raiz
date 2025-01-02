import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../components/CustomNavbar';

function GeradorRecibos() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState(new Date().toLocaleString());
  const [produtos, setProdutos] = useState([{ nome: '', valor: '' }]);

  const handleAddProduto = () => {
    setProdutos([...produtos, { nome: '', valor: '' }]);
  };

  const handleProdutoChange = (index, field, value) => {
    const updatedProdutos = [...produtos];
    updatedProdutos[index][field] = value;
    setProdutos(updatedProdutos);
  };

  const handleGerarPDF = () => {
    const pdf = new jsPDF({
      unit: 'mm',
      format: [80, 297],
    });

    const docWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(6);

    pdf.text('EDUCANDÁRIO RAIZ DO SABER', docWidth / 2, 10, {
      align: 'center',
    });
    pdf.text('Rua Francisco do Rego Moraes Barros', docWidth / 2, 12, {
      align: 'center',
    });
    pdf.text('Engenho Maranguape - Paulista - PE', docWidth / 2, 14, {
      align: 'center',
    });
    pdf.text('CNPJ: 03.511.401.0001-02', docWidth / 2, 16, { align: 'center' });

    pdf.setFontSize(10);

    pdf.text(`Nome: ${nome}`, 10, 25);
    pdf.text(`Data: ${data}`, 10, 30);
    pdf.text('Descrição:', 10, 40);

    let yPos = 45;
    let total = 0;

    produtos.forEach((produto, index) => {
      const descricao = `${produto.nome}`;
      const preco = `Preço: R$ ${produto.valor}`;
      pdf.text(descricao, 10, yPos);
      pdf.text(preco, 50, yPos);
      yPos += 10;

      pdf.line(10, yPos - 5, 80, yPos - 5);

      total += parseFloat(produto.valor);
    });

    pdf.text(`Total: R$ ${total.toFixed(2)}`, 10, yPos + 5);
    yPos += 15;
    pdf.text('Obrigado!', 10, yPos);

    pdf.save('recibo_pagamento.pdf');
  };

  return (
    <>
      <CustomNavbar />
      <div className="container mt-5">
        <h1>Recibo de pagamento</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              Nome:
            </label>
            <input
              type="text"
              className="form-control"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          {produtos.map((produto, index) => (
            <div key={index}>
              <div className="mb-3">
                <label htmlFor={`produto${index + 1}`} className="form-label">
                  Produto:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`produto${index + 1}`}
                  value={produto.nome}
                  onChange={(e) =>
                    handleProdutoChange(index, 'nome', e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor={`valorProduto${index + 1}`}
                  className="form-label"
                >
                  Valor Produto:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`valorProduto${index + 1}`}
                  value={produto.valor}
                  onChange={(e) =>
                    handleProdutoChange(index, 'valor', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddProduto}
          >
            Adicionar Produto
          </button>
          <br />
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={handleGerarPDF}
          >
            Gerar PDF
          </button>
        </form>
      </div>
    </>
  );
}

export default GeradorRecibos;
