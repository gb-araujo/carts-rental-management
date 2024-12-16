// components/OperadorForm.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const OperadorForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [operadores, setOperadores] = useState([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Operadores"), (snapshot) => {
      setOperadores(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return unsubscribe;
  }, []);


  const handleCadastro = async () => {
    try {
      await addDoc(collection(db, "Operadores"), {
        email,
        admin: false, // Por padrão, o operador não será admin
      });
      setEmail("");
      setPassword("");
      alert("Operador cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar operador:", error.message);
    }
  };

  const handleRemover = async (id) => {
    try {
      await deleteDoc(doc(db, "Operadores", id));
      alert("Operador removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover operador:", error.message);
    }
  };

  return (
    <div>
      <h1>Gerenciar Operadores</h1>
      <h2>Cadastrar Novo Operador</h2>
      <input
        type="email"
        placeholder="E-mail do operador"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCadastro}>Cadastrar Operador</button>

      <h2>Operadores Ativos</h2>
      <ul>
        {operadores.map((operador) => (
          <li key={operador.id}>
            <p>E-mail: {operador.email}</p>
            <button onClick={() => handleRemover(operador.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperadorForm;
