import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { signOut, createUserWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

function ControleAluguel() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tempoMaximo, setTempoMaximo] = useState("");
  const [showOperadorForm, setShowOperadorForm] = useState(false);
  const [emailOperador, setEmailOperador] = useState("");
  const [senhaOperador, setSenhaOperador] = useState("");

  const clientesRef = collection(db, "Clientes");
  const operadoresRef = collection(db, "Operadores");

  const cadastrarCliente = async () => {
    if (!nome || !cpf || !tempoMaximo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    try {
      await addDoc(clientesRef, {
        nome,
        cpf,
        tempo_maximo: parseInt(tempoMaximo),
        horario_inicio: serverTimestamp(),
      });
      setNome("");
      setCpf("");
      setTempoMaximo("");
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

  const cadastrarOperador = async () => {
    if (!emailOperador || !senhaOperador) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailOperador,
        senhaOperador
      );
      const user = userCredential.user;

      await addDoc(operadoresRef, {
        email: user.email,
        uid: user.uid,
        criado_em: serverTimestamp(),
      });

      setEmailOperador("");
      setSenhaOperador("");
      setShowOperadorForm(false);
      alert("Operador cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar operador:", error);
      alert("Erro ao cadastrar operador: " + error.message);
    }
  };

  // Função para excluir um cliente
  const excluirCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "Clientes", id));
      alert("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(clientesRef, orderBy("horario_inicio", "desc")), // Ordenando por horario_inicio em ordem decrescente
      (snapshot) => {
        const listaClientes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(listaClientes);
      }
    );

    return () => unsubscribe();
  }, []);

  const calcularTempoPassado = (horarioInicio) => {
    if (!horarioInicio) return "Carregando...";

    const inicio = horarioInicio.toDate();
    const agora = new Date();
    const diferenca = Math.floor((agora - inicio) / 1000);
    const horas = Math.floor(diferenca / 3600);
    const minutos = Math.floor((diferenca % 3600) / 60);
    const segundos = diferenca % 60;

    return `${horas}h ${minutos}m ${segundos}s`;
  };

  const verificarTempoExcedido = (tempoMaximo, horarioInicio) => {
    const tempoPassado = calcularTempoPassado(horarioInicio);
    const tempoMaximoSegundos = tempoMaximo * 60; // Convertendo para segundos

    const tempoPassadoSegundos = tempoPassado
      .split(" ")
      .reduce((total, part) => {
        const value = parseInt(part);
        if (part.includes("h")) return total + value * 3600;
        if (part.includes("m")) return total + value * 60;
        if (part.includes("s")) return total + value;
        return total;
      }, 0);

    return tempoPassadoSegundos >= tempoMaximoSegundos;
  };

  const calcularHoraFinal = (horarioInicio, tempoMaximo) => {
    if (!horarioInicio) return "Sem registro de horário";

    const inicio = horarioInicio.toDate();
    const horaFinal = new Date(inicio.getTime() + tempoMaximo * 60000); // Adicionando o tempo máximo em minutos

    const horas = String(horaFinal.getHours()).padStart(2, "0");
    const minutos = String(horaFinal.getMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClientes((prevClientes) =>
        prevClientes.map((cliente) => ({
          ...cliente,
          tempo_passado: calcularTempoPassado(cliente.horario_inicio),
          tempo_excedido: verificarTempoExcedido(
            cliente.tempo_maximo,
            cliente.horario_inicio
          ),
          hora_final: calcularHoraFinal(
            cliente.horario_inicio,
            cliente.tempo_maximo
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [clientes]);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Sair
          </button>
        </div>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowOperadorForm(!showOperadorForm)}
          >
            {showOperadorForm ? "Cancelar" : "Cadastrar Operador"}
          </button>
        </div>
      </div>

      {showOperadorForm && (
        <div className="mb-4">
          <h3>Cadastrar Operador</h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={emailOperador}
                onChange={(e) => setEmailOperador(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={senhaOperador}
                onChange={(e) => setSenhaOperador(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={cadastrarOperador}
            >
              Cadastrar Operador
            </button>
          </form>
        </div>
      )}

      <h1 className="text-center mb-4">Controle de Aluguel de Carrinhos</h1>

      <div className="mb-4">
        <h3>Cadastrar Cliente</h3>
        <form>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input
              type="text"
              className="form-control"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tempo Máximo (em minutos)</label>
            <input
              type="number"
              className="form-control"
              value={tempoMaximo}
              onChange={(e) => setTempoMaximo(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={cadastrarCliente}
          >
            Cadastrar
          </button>
        </form>
      </div>

      <h3>Lista de Clientes</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Tempo Máximo</th>
            <th>Tempo Passado</th>
            <th>Hora Final</th>
            <th>Tempo Excedido</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.tempo_maximo} minutos</td>
              <td>{cliente.tempo_passado}</td>
              <td>{cliente.hora_final}</td>
              <td>
                {cliente.tempo_excedido ? (
                  <span className="text-danger">Excedido</span>
                ) : (
                  <span className="text-success">Dentro do limite</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => excluirCliente(cliente.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ControleAluguel;
