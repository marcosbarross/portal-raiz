import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Itens from './pagesVendas/Itens';
import Vendas from './pagesVendas/Vendas';
import Pedidos from './pagesVendas/Pedidos';
import RelatorioVendas from './pagesVendas/RelatorioVendas';
import GeradorRecibos from './geradorRecibos/GeradorRecibos'
const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/itens" element={<Itens />} />
                <Route path="/vendas" element={<Vendas />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path='/relatorio'element={<RelatorioVendas/>} />
                <Route path='/geradorRecibos' element={<GeradorRecibos />} />
            </Routes>
        </Router>
    );
};

export default App;
