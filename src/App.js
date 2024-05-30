import logo from './logo.svg';
import './App.css';
import  { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './router/PrivateRoute';
import './mock/mock.js'

function App() {
  return (
    <Router>
      <PrivateRoute/>
    </Router>
  );
}

export default App;
