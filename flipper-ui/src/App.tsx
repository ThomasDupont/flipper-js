import { useState } from 'react';
import './App.css';
import { useAuthGuard } from './guard/Auth';
import { Login } from './login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Flipper } from './grid/Flipper';

function App() {
  const [ isAuthenticated, setIsAuthenticated ] = useState(false)
  const { isLoggedIn } = useAuthGuard()
  return isLoggedIn || isAuthenticated ? (
    <Flipper />
  ) : <Login setIsAuthenticated={setIsAuthenticated} />;
}

export default App;
