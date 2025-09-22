// src/pages/Register.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("cliente"); // cliente ou vendedor
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Regras de força da senha
  const validatePasswordStrength = (pwd) => {
    const rules = {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
    return rules;
  };

  // Verificação geral de formulário
  const validateForm = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = "Informe seu nome completo.";
    if (!email.includes("@")) newErrors.email = "E-mail inválido.";

    const pwdRules = validatePasswordStrength(password);
    if (!pwdRules.length)
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    if (!pwdRules.uppercase)
      newErrors.password = "Inclua ao menos uma letra maiúscula.";
    if (!pwdRules.lowercase)
      newErrors.password = "Inclua ao menos uma letra minúscula.";
    if (!pwdRules.number)
      newErrors.password = "Inclua ao menos um número.";
    if (!pwdRules.special)
      newErrors.password = "Inclua ao menos um caractere especial.";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = { nome, name: nome, email, password, role };
      const res = await api.post("/auth/register", payload);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user ?? null);
        navigate("/products");
        return;
      }

      // tenta login automático
      const loginRes = await api.post("/auth/login", { email, password });
      if (loginRes.data && loginRes.data.token) {
        localStorage.setItem("token", loginRes.data.token);
        setUser(loginRes.data.user ?? null);
        navigate("/products");
        return;
      }

      alert("Cadastro realizado com sucesso. Faça login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Erro ao cadastrar. Verifique os dados.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = validatePasswordStrength(password);

  return (
    <div className="form-container">
      <h2>Cadastrar-se</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        {errors.nome && <p className="error">{errors.nome}</p>}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        {/* Indicador de força da senha */}
        {password && (
          <div className="pwd-strength">
            <p>Força da senha:</p>
            <ul>
              <li style={{ color: pwdStrength.length ? "green" : "red" }}>
                ≥ 6 caracteres
              </li>
              <li style={{ color: pwdStrength.uppercase ? "green" : "red" }}>
                1 letra maiúscula
              </li>
              <li style={{ color: pwdStrength.lowercase ? "green" : "red" }}>
                1 letra minúscula
              </li>
              <li style={{ color: pwdStrength.number ? "green" : "red" }}>
                1 número
              </li>
              <li style={{ color: pwdStrength.special ? "green" : "red" }}>
                1 caractere especial
              </li>
            </ul>
          </div>
        )}

        <label>
          Sou:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
