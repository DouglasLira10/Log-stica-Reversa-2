import { useState, useEffect } from 'react';
import type { User, StoredUser } from '../types';
import { db } from '../services/db';

const SESSION_KEY = 'correios_session';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const sessionUser = sessionStorage.getItem(SESSION_KEY);
    if(sessionUser) {
        setUser(JSON.parse(sessionUser));
    }
  }, []);

  const login = async (matricula: string, senha: string): Promise<boolean> => {
    const foundUser = await db.users.where({ matricula, senhaHash: senha }).first();
    if (foundUser) {
      const sessionUser: User = { nome: foundUser.nome, matricula: foundUser.matricula };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return true;
    }
    return false;
  };

  const register = async (nome: string, matricula: string, senha: string): Promise<boolean> => {
    const existingUser = await db.users.where('matricula').equals(matricula).first();
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: StoredUser = { nome, matricula, senhaHash: senha }; // Storing password directly for demo
    await db.users.add(newUser);
    
    const sessionUser: User = { nome: newUser.nome, matricula: newUser.matricula };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, login, register, logout };
};

export default useAuth;