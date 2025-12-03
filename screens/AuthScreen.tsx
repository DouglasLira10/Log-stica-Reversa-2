import React, { useState } from 'react';
import Button from '../components/Button';
import UserIcon from '../components/icons/UserIcon';
import LockIcon from '../components/icons/LockIcon';
import CorreiosLogo from '../components/CorreiosLogo';

interface AuthScreenProps {
  onLogin: (matricula: string, senha: string) => Promise<boolean>;
  onRegister: (nome: string, matricula: string, senha: string) => Promise<boolean>;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let success = false;
    try {
      if (isRegister) {
        if (!nome || !matricula || !senha) {
          setError('Todos os campos são obrigatórios.');
          return;
        }
        success = await onRegister(nome, matricula, senha);
        if (!success) {
          setError('Matrícula já cadastrada.');
        }
      } else {
        if (!matricula || !senha) {
          setError('Matrícula e senha são obrigatórios.');
          return;
        }
        success = await onLogin(matricula, senha);
        if (!success) {
          setError('Matrícula ou senha inválida.');
        }
      }
    } catch (e) {
        setError('Ocorreu um erro. Tente novamente.')
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-10 border border-gray-200">
      <CorreiosLogo className="h-24 mb-8" />
      <h2 className="text-3xl font-bold text-center text-[#004d9c] mb-2">{isRegister ? 'Registrar Conta' : 'Acessar Sistema'}</h2>
      <p className="text-center text-gray-500 mb-8">{isRegister ? 'Preencha seus dados para se registrar.' : 'Entre com sua matrícula e senha.'}</p>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-4 relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon /></span>
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>
        )}
        <div className="mb-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon /></span>
            <input
              type="text"
              placeholder="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent outline-none"
              disabled={loading}
            />
        </div>
        <div className="mb-6 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockIcon /></span>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent outline-none"
              disabled={loading}
            />
        </div>
        <div className="w-full">
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Processando...' : (isRegister ? 'Registrar' : 'Entrar')}
            </Button>
        </div>
      </form>
      <p className="text-center mt-6">
        {isRegister ? 'Já tenho cadastro. ' : 'Não tem uma conta? '}
        <button onClick={() => {setIsRegister(!isRegister); setError('')}} className="text-[#004d9c] hover:underline font-semibold" disabled={loading}>
          {isRegister ? 'Faça o login' : 'Registre-se'}
        </button>
      </p>
    </div>
  );
};

export default AuthScreen;