
import React from 'react';
import useAuth from './hooks/useAuth';
import AuthScreen from './screens/AuthScreen';
import MainScreen from './screens/MainScreen';
import Header from './components/Header';

const App: React.FC = () => {
  const { user, login, register, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 font-['Titillium_Web',_sans-serif]">
      <Header user={user} onLogout={logout} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {user ? (
            <MainScreen user={user} />
          ) : (
            <AuthScreen onLogin={login} onRegister={register} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-600 text-sm">
        <p>Este formulário foi criado por Douglas Lira para fins demonstrativos.</p>
        <p>Inspirado no sistema interno do Correios.</p>
      </footer>
    </div>
  );
};

export default App;