import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import './Login.css';

/**
 * Login: tela de entrada do ORIS.
 *
 * Exibe logo PNG + nome ORIS + formulário de login.
 * Em caso de erro, limpa os campos e exibe alerta.
 * Link "não possuo conta" redireciona para cadastro.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estado para mostrar/ocultar senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const usuario = await authAPI.login(username, senha);
      login(usuario);
      navigate(usuario.admin ? '/admin' : '/home');
    } catch (err) {
      setUsername('');
      setSenha('');
      setErro(err.message || 'senha ou nome de usuário são incompatíveis');
    } finally {
      setCarregando(false);
    }
  };

  // Ícone de olho aberto
  const IconeOlho = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  // Ícone de olho fechado
  const IconeOlhoFechado = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="login-pagina">
      <div className="login-brilho login-brilho-1" />
      <div className="login-brilho login-brilho-2" />

      <div className="login-container">
        {/* Logo e identidade */}
        <div className="login-logo">
          <div className="login-estrela">
            <img src="/public/logo.png" alt="ORIS" />
          </div>
          <h1 className="login-titulo">ORIS</h1>
          <p className="login-subtitulo">Expresse suas emoções</p>
        </div>

        {/* Formulário */}
        <form className="login-form" onSubmit={handleLogin}>
          {erro && (
            <div className="login-erro">
              {erro}
            </div>
          )}

          {/* Username */}
          <div className="login-campo">
            <label className="login-label">Nome de usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@seuusuario"
              className="login-input"
              required
            />
          </div>

          {/* Senha com botão de mostrar/ocultar */}
          <div className="login-campo">
            <label className="login-label">Senha</label>
            <div className="login-input-wrapper">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                required
              />
              <button
                type="button"
                className="login-olho"
                onClick={() => setMostrarSenha(prev => !prev)}
              >
                {mostrarSenha ? <IconeOlhoFechado /> : <IconeOlho />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          className="login-cadastro-link"
          onClick={() => navigate('/cadastro')}
        >
          não possuo conta
        </button>
      </div>
    </div>
  );
}
