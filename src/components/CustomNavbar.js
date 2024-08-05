import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function CustomNavbar() {
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
              <LinkContainer to="/pedidos">
                <NavDropdown.Item>Pedidos</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/relatorio">
                <NavDropdown.Item>Relatorio</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown title="Menu de eventos" id="basic-nav-dropdown">
              <LinkContainer to="/novoFinanceiro">
                <NavDropdown.Item>Adicionar evento</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/geradorRecibos">
              <Nav.Link>Gerador de recibos</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
