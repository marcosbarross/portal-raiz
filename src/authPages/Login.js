import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../util/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${getApiUrl()}/Account/IsAuthenticated`, {
          withCredentials: true,
        });
        navigate('/home');
      } catch (error) {}
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${getApiUrl()}/Account/Login`,
        { Username: username, Password: password },
        { withCredentials: true }
      );
      setMessage(response.data.message);

      if (response) {
        navigate('/home');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <h3 className="text-center mb-4">Login Portal Raiz</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Nome:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Entrar
              </Button>
            </div>
            {message && <p className="text-center mt-3">{message}</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
