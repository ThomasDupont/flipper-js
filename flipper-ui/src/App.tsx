import { useState } from 'react'
import './App.css'
import { useAuthGuard } from './guard/Auth'
import { Login } from './login/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Flipper } from './grid/Flipper'
import { NavBar } from './grid/NavBar'

function App (): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { isLoggedIn } = useAuthGuard()
  return <>
    <NavBar isLoggedIn={isLoggedIn || isAuthenticated} />
    {isLoggedIn || isAuthenticated
      ? (
      <Flipper />
        )
      : <Login setIsAuthenticated={setIsAuthenticated} />
    }
  </>
}

export default App
