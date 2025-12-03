import React, { useState, useEffect } from 'react';
import type { User, FormSubmission } from '../types';
import { MOTIVOS_TENTATIVA, MOTIVOS_INSUFICIENCIA, CARTEIROS } from '../constants';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { db } from '../services/db';
import DataView from '../components/DataView';

interface MainScreenProps {
  user: User;
}

type View = 'form' | 'data';

const MainScreen: React.FC<MainScreenProps> = ({ user }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);
  const [view, setView] = useState<View>('form');

  // Form state
  const [cepColeta, setCepColeta] = useState('');
  const [enderecoColeta, setEnderecoColeta] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [numeroLocalColeta, setNumeroLocalColeta] = useState('');
  const [motivoTentativa, setMotivoTentativa] = useState('');
  const [motivoInsuficiencia, setMotivoInsuficiencia] = useState('');
  const [nomeInformante, setNomeInformante] = useState('');
  const [carteiro, setCarteiro] = useState(CARTEIROS[0] || '');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
        if (view === 'data') {
            setLoadingSubmissions(true);
            const allSubmissions = await db.submissions.toArray();
            setSubmissions(allSubmissions);
            setLoadingSubmissions(false);
        }
    };
    fetchSubmissions();
  }, [view]);

  const showInsuficiencia = motivoTentativa === 'Endereço Insuficiente';

  const handleCepChange = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, ''); // Remove non-digit characters
    setCepColeta(cleanedCep);
    setEnderecoColeta('');
    setCepError('');

    if (cleanedCep.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          setCepError('CEP não encontrado.');
        } else {
          const address = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
          setEnderecoColeta(address);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao buscar endereço. Tente novamente.');
      } finally {
        setCepLoading(false);
      }
    }
  };


  const clearForm = () => {
    setCepColeta('');
    setEnderecoColeta('');
    setCepError('');
    setNumeroLocalColeta('');
    setMotivoTentativa('');
    setMotivoInsuficiencia('');
    setNomeInformante('');
    setCarteiro(CARTEIROS[0] || '');
    setData('');
    setHora('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cepColeta || !numeroLocalColeta || !motivoTentativa || !carteiro || !data || !hora) {
        setFeedback('Erro: Preencha todos os campos obrigatórios.');
        setTimeout(() => setFeedback(''), 3000);
        return;
    }
    
    const dataHora = `${data}T${hora}`;

    const newSubmission: FormSubmission = {
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toISOString(),
      submittedBy: user,
      cepColeta,
      enderecoColeta,
      numeroLocalColeta,
      motivoTentativa,
      motivoInsuficiencia: showInsuficiencia ? motivoInsuficiencia : undefined,
      nomeInformante,
      carteiro,
      dataHora,
    };

    await db.submissions.add(newSubmission);
    setFeedback('Dados enviados com sucesso!');
    clearForm();
    setTimeout(() => setFeedback(''), 3000);
  };
  
  const TabButton: React.FC<{currentView: View, viewName: View, text: string}> = ({currentView, viewName, text}) => (
      <button 
        onClick={() => setView(viewName)}
        className={`px-6 py-3 font-bold text-lg rounded-t-lg transition-colors focus:outline-none ${
            currentView === viewName ? 'bg-white text-[#004d9c] shadow-inner-top' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        style={{
            boxShadow: currentView === viewName ? '0 -4px 0 0 #FFC72C inset' : 'none'
        }}
      >
        {text}
      </button>
  )

  return (
    <div className="space-y-6">
        <div className="flex border-b-2 border-gray-200">
            <TabButton currentView={view} viewName="form" text="Registrar Tentativa" />
            <TabButton currentView={view} viewName="data" text="Consultar Tentativas" />
        </div>
      
        <div className="bg-white p-8 rounded-b-xl rounded-tr-xl shadow-lg border border-gray-200">
            {view === 'form' ? (
            <>
                <h1 className="text-2xl font-bold mb-1 text-gray-800">Dados da Tentativa</h1>
                <p className="text-gray-500 mb-6">Preencha todos os campos obrigatórios.</p>

                <form onSubmit={handleSubmit}>
                    <FormField label="Cep da Coleta" id="cep" required>
                        <input id="cep" type="text" value={cepColeta} onChange={e => handleCepChange(e.target.value)} maxLength={8} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C]"/>
                    </FormField>

                    <FormField label="Endereço da Coleta" id="endereco">
                        <input id="endereco" type="text" value={cepLoading ? 'Buscando...' : enderecoColeta} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"/>
                        {cepError && <p className="text-red-500 text-sm mt-1">{cepError}</p>}
                    </FormField>

                    <FormField label="Numero do Local Coleta" id="numero" required>
                        <input id="numero" type="text" value={numeroLocalColeta} onChange={e => setNumeroLocalColeta(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C]"/>
                    </FormField>
                    <FormField label="Motivo Tentativa" id="motivo" required>
                        <select id="motivo" value={motivoTentativa} onChange={e => setMotivoTentativa(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] bg-white">
                            <option value="" disabled>Selecione o motivo</option>
                            {MOTIVOS_TENTATIVA.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </FormField>
                    {showInsuficiencia && (
                        <FormField label="Motivo da Insuficiência do Endereço" id="motivo-insuficiencia" required>
                             <select id="motivo-insuficiencia" value={motivoInsuficiencia} onChange={e => setMotivoInsuficiencia(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] bg-white">
                                <option value="" disabled>Selecione o motivo</option>
                                {MOTIVOS_INSUFICIENCIA.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </FormField>
                    )}
                    <FormField label="Nome do Informante" id="informante">
                        <input id="informante" type="text" value={nomeInformante} onChange={e => setNomeInformante(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C]"/>
                    </FormField>
                    <FormField label="Carteiro/Matrícula" id="carteiro" required>
                        <select id="carteiro" value={carteiro} onChange={e => setCarteiro(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C] bg-white">
                             {CARTEIROS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Data/ Hora" id="data" required>
                        <div className="flex gap-4">
                            <input id="data" type="date" value={data} onChange={e => setData(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C]"/>
                            <input id="hora" type="time" value={hora} onChange={e => setHora(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC72C]"/>
                        </div>
                    </FormField>

                    {feedback && <p className={`p-3 rounded-md mb-6 text-center ${feedback.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{feedback}</p>}

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button type="submit">Enviar Formulário</Button>
                        <Button type="button" variant="secondary" onClick={clearForm}>Limpar formulário</Button>
                    </div>
                </form>
            </>
            ) : (
                <DataView submissions={submissions} loading={loadingSubmissions} />
            )}
      </div>
    </div>
  );
};

export default MainScreen;