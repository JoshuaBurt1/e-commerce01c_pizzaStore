import logo from './logo.svg';
import './App.css';
import React from 'react';
import PizzaForm from './PizzaForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
        {/* Include PizzaForm component */}
        <PizzaForm />
    </div>
  );
}

export default App;