import React from 'react';
import type { User } from '../types';
import CorreiosLogo from './CorreiosLogo';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md border-t-4 border-[#FFC72C]">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <CorreiosLogo className="h-12" />
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-gray-700">Olá, {user.nome.split(' ')[0]}</span>
            <button
              onClick={onLogout}
              className="text-[#004d9c] font-semibold hover:underline transition-colors text-sm"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;