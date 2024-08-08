import React from 'react';
import CustomNavbar from "../components/CustomNavbar";
import { Form, Container, FloatingLabel, Button } from 'react-bootstrap';

function AddAlunos(){



    return(
        <>
            <CustomNavbar />
            <Form>
            <Container className="mt-4">
                <h2>Cadastrar novo aluno</h2>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Nome do aluno"
                    className="mb-3" >
                    <Form.Control type="text" placeholder="Nome do aluno" />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Nome do responsável">
                    <Form.Control type="text" placeholder="Nome do responsável" />
                </FloatingLabel>
                <br />
                <Button variant="primary" type="submit">
                            Cadastrar
                </Button>
                </Container>
            </Form>


        </>
    )
}

export default AddAlunos;