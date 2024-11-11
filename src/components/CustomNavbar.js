import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../util/api';

function CustomNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/Account/IsAuthenticated`, { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${getApiUrl()}/Account/Logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Portal Raiz</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Menu de vendas" id="basic-nav-dropdown">
              <LinkContainer to="/itens">
                <NavDropdown.Item>Adicionar item</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/vendas">
                <NavDropdown.Item>Vender</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/relatorio">
                <NavDropdown.Item>Relatorio</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/novoFinanceiro">
              <Nav.Link>Adicionar evento</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/geradorRecibos">
              <Nav.Link>Gerador de recibos</Nav.Link>
            </LinkContainer>
          </Nav>
          {isLoggedIn ? (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <LinkContainer to="/">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
