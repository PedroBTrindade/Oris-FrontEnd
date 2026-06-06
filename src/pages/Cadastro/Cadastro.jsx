import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Cadastro.css';

/**
 * Cadastro: tela de criação de conta no ORIS.
 *
 * Validações client-side espelhadas às do backend:
 *  - Username não pode ser "admin"
 *  - Senha com mínimo 8 chars e ao menos uma letra
 *  - Confirmação deve ser igual à senha
 */
export default function Cadastro() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Estados para mostrar/ocultar senha e confirmação
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  // Valida senha: mínimo 8 chars com ao menos uma letra
  const senhaValida = (s) => /^(?=.*[a-zA-Z]).{8,}$/.test(s);

  const handleCadastro = async (e) => {
    e.preventDefault();
    const novosErros = {};

    if (!senhaValida(senha)) {
      novosErros.senha = 'a senha deve possuir no mínimo 8 caracteres com a presença de ao menos uma letra';
      setConfirmacao('');
    }

    if (senhaValida(senha) && senha !== confirmacao) {
      novosErros.confirmacao = 'A senha e a confirmação de senha devem ser iguais';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setCarregando(true);

    try {
      await authAPI.cadastrar(username, senha, confirmacao);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.message || 'Erro ao cadastrar';

      if (msg.includes('usuário') || msg.includes('registrado')) {
        setErros({ username: 'Nome de usuário já foi registrado' });
      } else if (msg.includes('senha')) {
        setErros({ senha: msg });
        setConfirmacao('');
      } else {
        setErros({ geral: msg });
      }
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
    <div className="cadastro-pagina">
      <div className="cadastro-brilho cadastro-brilho-1" />
      <div className="cadastro-brilho cadastro-brilho-2" />

      <div className="cadastro-container">
        {/* Header */}
        <div className="cadastro-header">
          <button className="cadastro-voltar" onClick={() => navigate('/login')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <div className="cadastro-logo">
            <img src="/logo.png" alt="ORIS" />
          </div>

          <h1 className="cadastro-titulo">Criar conta</h1>
          <p className="cadastro-subtitulo">Comece sua jornada emocional</p>
        </div>

        {/* Sucesso */}
        {sucesso ? (
          <div className="cadastro-sucesso">
            Conta criada com sucesso! Redirecionando...
          </div>
        ) : (
          <form className="cadastro-form" onSubmit={handleCadastro}>
            {erros.geral && <div className="cadastro-erro-geral">{erros.geral}</div>}

            {/* Username */}
            <div className="cadastro-campo">
              <label className="cadastro-label">Nome de usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seunome"
                className={`cadastro-input ${erros.username ? 'cadastro-input--erro' : ''}`}
                required
              />
              {erros.username && <span className="cadastro-erro-campo">{erros.username}</span>}
            </div>

            {/* Senha */}
            <div className="cadastro-campo">
              <label className="cadastro-label">Senha</label>
              <div className="cadastro-input-wrapper">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="mínimo 8 caracteres com letras"
                  className={`cadastro-input ${erros.senha ? 'cadastro-input--erro' : ''}`}
                  required
                />
                <button
                  type="button"
                  className="cadastro-olho"
                  onClick={() => setMostrarSenha(prev => !prev)}
                >
                  {mostrarSenha ? <IconeOlhoFechado /> : <IconeOlho />}
                </button>
              </div>
              {erros.senha && <span className="cadastro-erro-campo">{erros.senha}</span>}
            </div>

            {/* Confirmação */}
            <div className="cadastro-campo">
              <label className="cadastro-label">Confirmar senha</label>
              <div className="cadastro-input-wrapper">
                <input
                  type={mostrarConfirmacao ? 'text' : 'password'}
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  placeholder="••••••••"
                  className={`cadastro-input ${erros.confirmacao ? 'cadastro-input--erro' : ''}`}
                  required
                />
                <button
                  type="button"
                  className="cadastro-olho"
                  onClick={() => setMostrarConfirmacao(prev => !prev)}
                >
                  {mostrarConfirmacao ? <IconeOlhoFechado /> : <IconeOlho />}
                </button>
              </div>
              {erros.confirmacao && <span className="cadastro-erro-campo">{erros.confirmacao}</span>}
            </div>

            <button type="submit" className="cadastro-btn" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        <button className="cadastro-login-link" onClick={() => navigate('/login')}>
          já possuo conta
        </button>
      </div>
    </div>
  );
}
