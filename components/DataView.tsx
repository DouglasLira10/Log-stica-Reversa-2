import React, { useState, useMemo } from 'react';
import type { FormSubmission } from '../types';
import SearchIcon from './icons/SearchIcon';

interface DataViewProps {
  submissions: FormSubmission[];
  loading: boolean;
}

const DataView: React.FC<DataViewProps> = ({ submissions, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) {
      return submissions;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return submissions.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [submissions, searchTerm]);
  
  const sortedSubmissions = useMemo(() => {
    return filteredSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredSubmissions]);
  
  if (loading) {
    return (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Carregando registros...</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar em todos os campos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent outline-none"
        />
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
            <SearchIcon />
        </div>
      </div>

      {sortedSubmissions.length > 0 ? (
        <div className="space-y-4">
          {sortedSubmissions.map(submission => (
            <div key={submission.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">CEP: {submission.cepColeta}</p>
                  <p className="text-sm text-gray-500">
                    Registrado em: {new Date(submission.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="bg-[#E6F0F9] text-[#004d9c] text-xs font-semibold px-2.5 py-0.5 rounded-full">{submission.motivoTentativa}</span>
              </div>
               <p className="text-sm mb-4"><strong className="text-gray-600">Endereço:</strong> {submission.enderecoColeta}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p><strong className="text-gray-600">Nº Local:</strong> {submission.numeroLocalColeta}</p>
                {submission.motivoInsuficiencia && <p><strong className="text-gray-600">Motivo Insuf.:</strong> {submission.motivoInsuficiencia}</p>}
                <p><strong className="text-gray-600">Informante:</strong> {submission.nomeInformante}</p>
                <p><strong className="text-gray-600">Carteiro:</strong> {submission.carteiro}</p>
                <p><strong className="text-gray-600">Data/Hora Evento:</strong> {new Date(submission.dataHora).toLocaleString('pt-BR')}</p>
                <p><strong className="text-gray-600">Registrado por:</strong> {submission.submittedBy.nome}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Nenhum registro encontrado.</p>
          {searchTerm && <p className="text-gray-400 mt-2">Tente um termo de busca diferente.</p>}
        </div>
      )}
    </div>
  );
};

export default DataView;