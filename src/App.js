import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Itens from './pagesVendas/Itens';
import Vendas from './pagesVendas/Vendas';
import RelatorioVendas from './pagesVendas/RelatorioVendas';
import GeradorRecibos from './geradorRecibos/GeradorRecibos'
import NovoFinanceiro from './financeiro/NovoFinanceiro';
import DetalheEvento from './financeiro/DetalheEvento';
import AddAlunos from './alunosPages/AddAlunos';
import Turmas from './turmasPages/turmas';
import TurmaDetalhe from './turmasPages/TurmaDetalhe';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/itens" element={<Itens />} />
                <Route path="/vendas" element={<Vendas />} />
                <Route path='/relatorio'element={<RelatorioVendas/>} />
                <Route path='/geradorRecibos' element={<GeradorRecibos />} />
                <Route path='/novoFinanceiro' element={<NovoFinanceiro />}/>
                <Route path='/DetalheEvento/:id' element={<DetalheEvento />}/>
                <Route path='/AddAlunos' element={<AddAlunos />} />  
                <Route path='/Turmas' element={<Turmas />} />  
                <Route path='/TurmaDetalhe' element={<TurmaDetalhe />} />
            </Routes>
        </Router>
    );
};

export default App;
