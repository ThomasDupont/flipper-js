import { Navbar, Container, Button } from "react-bootstrap"

export const NavBar = ({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element => {
    const logout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }
    return <Navbar className="bg-body-tertiary">
    <Container>
        <h1>Flipper-js</h1>
        {isLoggedIn && <Button variant="primary" onClick={() => logout()}>Logout</Button>}
    </Container>
  </Navbar>
}
