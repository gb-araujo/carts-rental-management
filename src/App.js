import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ControleAluguel from "./components/ControleAluguel";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/controle-aluguel" /> : <Login />}
        />
        <Route
          path="/controle-aluguel"
          element={user ? <ControleAluguel /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
