import { FormEvent, useState } from "react"
import { Effect as T } from 'effect'
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import { login } from "../api/api"

export const Login = ({
    setIsAuthenticated
}: {
    setIsAuthenticated: (isAuthenticated: boolean) => void
}) => {

    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [formError, setFormError] = useState<string | null>(null)

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        T.tryPromise(() => login(username, password)).pipe(
            T.map(token => {
                localStorage.setItem('token', token)
                setIsAuthenticated(true)
                return T.void
            }),
            T.mapError(() => {
                setFormError('Invalid username or password')
                return T.void
            }),
            T.runPromise
        )
    }
    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Login</h1>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        {formError && <Form.Text className="text-danger">{formError}</Form.Text>}
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
