import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getApiUrl from '../util/api';
import logo from './raizlogo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/Account/IsAuthenticated`, {
          withCredentials: true,
        });
        if (response) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage({ text: '', type: '' });
    setIsSubmitting(true);

    if (!username || !password) {
      setMessage({ text: 'Preencha todos os campos obrigatórios', type: 'danger' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${getApiUrl()}/Account/Login`,
        { Username: username, Password: password },
        { withCredentials: true }
      );

      if (response) {
        setMessage({ text: 'Login realizado com sucesso!', type: 'success' });
        navigate('/home');
      } else {
        setMessage({ text: response.data.message || 'Credenciais inválidas', type: 'danger' });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Erro na conexão com o servidor',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isInvalidUsername = touched.username && !username;
  const isInvalidPassword = touched.password && !password;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <div className="bg-white p-4 rounded-3 border border-primary shadow">
            <div className="text-center mb-4">
              <img 
                src={logo}
                alt="Logo da Empresa" 
                className="mb-3"
                style={{ maxWidth: '200px', height: 'auto' }}
              />
              <h3 className="text-dark mb-0">Portal Raiz</h3>
              <small className="text-muted">Acesso restrito</small>
            </div>

            {message.text && (
              <Alert 
                variant={message.type} 
                className="text-center border-top-0 border-start-0 border-end-0 border-bottom"
                style={{ borderWidth: '2px' }}
              >
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleLogin} noValidate>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Nome de usuário:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleBlur('username')}
                  isInvalid={isInvalidUsername}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor insira seu nome de usuário
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Senha:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur('password')}
                  isInvalid={isInvalidPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor insira sua senha
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Entrando...' : 'Acessar sistema'}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
