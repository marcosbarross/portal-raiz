import React from 'react';
import { Nav, Container, Row, Col, Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import './Home.css';

function Home() {
  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <Row>
          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={require('./taxa.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Gerador de recibos</Card.Title>
                <Button variant="primary">
                  <LinkContainer to={"/geradorRecibos"}>
                    <Nav.Link>Abrir</Nav.Link>
                  </LinkContainer>
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={require('./mao.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Fardamentos</Card.Title>
                <DropdownButton id="dropdown-basic-button" title="Abrir como">
                  <Dropdown.Item>
                    <LinkContainer to={"/itens"}>
                      <Nav.Link>Ver fardamentos</Nav.Link>
                    </LinkContainer></Dropdown.Item>
                  <Dropdown.Item>
                    <LinkContainer to={"/vendas"}>
                      <Nav.Link>Vender fardamentos</Nav.Link>
                    </LinkContainer>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <LinkContainer to={"/relatorio"}>
                      <Nav.Link>Relatório geral</Nav.Link>
                    </LinkContainer>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <LinkContainer to={"/OrderList"}>
                      <Nav.Link>Relatório de pedidos</Nav.Link>
                    </LinkContainer>
                  </Dropdown.Item>
                </DropdownButton>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={require('./dinheiro.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Eventos</Card.Title>
                <DropdownButton id="dropdown-basic-button" title="Abrir como">
                  <Dropdown.Item>
                    <LinkContainer to={"/NovoFinanceiro"}>
                      <Nav.Link>Eventos de turma</Nav.Link>
                    </LinkContainer></Dropdown.Item>
                  <Dropdown.Item>
                    <LinkContainer to={"/AddNewGeneralEventsPage"}>
                      <Nav.Link>Eventos gerais</Nav.Link>
                    </LinkContainer>
                  </Dropdown.Item>
                </DropdownButton>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={require('./aluna.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Painel de alunos</Card.Title>
                <Button variant="primary">
                  <LinkContainer to={"/AddAlunos"}>
                    <Nav.Link>Abrir</Nav.Link>
                  </LinkContainer>
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={require('./encontro.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Painel de turmas</Card.Title>
                <Button variant="primary">
                  <LinkContainer to={"/Turmas"}>
                    <Nav.Link>Abrir</Nav.Link>
                  </LinkContainer>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
