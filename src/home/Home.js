import React from 'react';
import { Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';
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
                <Card.Title>Venda de produtos</Card.Title>
                <Button variant="primary">
                  <LinkContainer to={"/itens"}>
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
                src={require('./dinheiro.png')} 
                className="card-img-limited"
              />
              <Card.Body className="text-center">
                <Card.Title>Financeiro de eventos</Card.Title>
                <Button variant="primary">
                  <LinkContainer to={"/NovoFinanceiro"}>
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
