import React from 'react';
import Home from './Home';
import PickWinner from './PickWinner';
// using react-router-dom for naviagete user  pickwinner or Home 
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';

function App() {
  return(
    <BrowserRouter>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/PickWinner">PickWinner</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/PickWinner" element={<PickWinner />}></Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App;