export interface User {
  nome: string;
  matricula: string;
}

export interface StoredUser extends User {
  id?: number;
  senhaHash: string; // In a real app, this would be a hash. Here it's stored as plain text for simplicity.
}

export interface FormSubmission {
  id: string;
  timestamp: string;
  submittedBy: User;
  cepColeta: string;
  enderecoColeta: string;
  numeroLocalColeta: string;
  motivoTentativa: string;
  motivoInsuficiencia?: string;
  nomeInformante: string;
  carteiro: string;
  dataHora: string;
}