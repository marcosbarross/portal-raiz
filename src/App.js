import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Itens from './pagesVendas/Itens';
import Vendas from './pagesVendas/Vendas';
import RelatorioVendas from './pagesVendas/RelatorioVendas';
import GeradorRecibos from './geradorRecibos/GeradorRecibos';
import NovoFinanceiro from './financeiro/NovoFinanceiro';
import DetalheEvento from './financeiro/DetalheEvento';
import AddAlunos from './alunosPages/AddAlunos';
import Turmas from './turmasPages/turmas';
import TurmaDetalhe from './turmasPages/TurmaDetalhe';
import Login from './authPages/Login';
import Register from './authPages/Register';
import PrivateRoute from './authPages/PrivateRoute';
import AddNewGeneralEventPage from './generalEvents/AddNewGeneralEventsPage';
import EditGeneralEventPage from './generalEvents/EditGeneralEventPage.jsx';
import EventDetailsPage from './generalEvents/EventDetailsPage';
import StudentPaymentsPage from './generalEvents/StudentPaymentsPage.jsx';
import OrderList from './pagesVendas/OrderList.jsx';
import Shifts from './turmasPages/Shifts.jsx';
import Levels from './turmasPages/Levels.jsx';
import Grades from './turmasPages/Grades.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/home"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route path="/itens" element={<PrivateRoute element={<Itens />} />} />
        <Route path="/vendas" element={<PrivateRoute element={<Vendas />} />} />
        <Route
          path="/relatorio"
          element={<PrivateRoute element={<RelatorioVendas />} />}
        />
        <Route
          path="/geradorRecibos"
          element={<PrivateRoute element={<GeradorRecibos />} />}
        />
        <Route
          path="/novoFinanceiro"
          element={<PrivateRoute element={<NovoFinanceiro />} />}
        />
        <Route
          path="/DetalheEvento/:id"
          element={<PrivateRoute element={<DetalheEvento />} />}
        />
        <Route
          path="/AddAlunos"
          element={<PrivateRoute element={<AddAlunos />} />}
        />
        <Route path="/Turmas" element={<PrivateRoute element={<Turmas />} />} />
        <Route
          path="/TurmaDetalhe/:id"
          element={<PrivateRoute element={<TurmaDetalhe />} />}
        />
        <Route
          path="/AddNewGeneralEventsPage"
          element={<PrivateRoute element={<AddNewGeneralEventPage />} />}
        />
        <Route
          path="/EditGeneralEvent/:id"
          element={<PrivateRoute element={<EditGeneralEventPage />} />}
        />
        <Route
          path="/ViewGeneralEvent/:id"
          element={<PrivateRoute element={<EventDetailsPage />} />}
        />
        <Route
          path="/event/:id/student/:studentId/payments"
          element={<PrivateRoute element={<StudentPaymentsPage />} />}
        />
        <Route
          path="/OrderList"
          element={<PrivateRoute element={<OrderList />} />}
        />
        <Route path="/Shifts" element={<PrivateRoute element={<Shifts />} />} />
        <Route path="/Levels" element={<PrivateRoute element={<Levels />} />} />
        <Route
          path="/Grades"
          element={<PrivateRoute element={<Grades />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
