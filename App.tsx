
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  Bell, 
  Globe, 
  Trash2, 
  Pencil,
  Sparkles, 
  Loader2, 
  PackageOpen, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  Settings,
  AlertTriangle,
  X,
  Database,
  Lock,
  Terminal,
  ShieldCheck,
  LogOut,
  Cpu
} from 'lucide-react';
import { Product } from './types';
import { generateDescription } from './geminiService';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_-fuK7ZsW3lQVr7F000aXGqzuB2hQ_I30MNPnnpSlvvbgZ6wi_PI20OzjK8a0ev4/exec";
const TOKEN = "borabill";
const ADMIN_PASSWORD = "1223334444";

// Interface para Logs do Sistema
interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  action: string;
  details: string;
}

// --- COMPONENTE: MODAL DE LOGIN ADMIN ---
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPass('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-[#ee4d2d] p-4 rounded-full shadow-lg shadow-orange-900/50">
            <Lock size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-center mb-1 uppercase tracking-wider">Acesso Restrito</h2>
        <p className="text-gray-400 text-center text-xs mb-8">Shoppe System Kernel</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Senha de Admin</label>
            <input 
              type="password" 
              autoFocus
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-center text-xl tracking-[0.5em] focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] outline-none transition-all font-mono"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              placeholder="••••••••••"
            />
          </div>
          {error && (
            <div className="text-red-500 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
              <AlertCircle size={12} /> SENHA INCORRETA
            </div>
          )}
          <button 
            type="submit"
            className="w-full bg-[#ee4d2d] hover:bg-[#f05d40] text-white font-bold py-3 rounded uppercase tracking-wider transition-all transform active:scale-95 shadow-lg"
          >
            Desbloquear Painel
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-500 text-xs hover:text-white transition-colors border-b border-transparent hover:border-gray-500 pb-0.5">Voltar para Loja</a>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: PAINEL DE ADMINISTRAÇÃO (LOGS) ---
const AdminPanel: React.FC<{ logs: SystemLog[], onLogout: () => void }> = ({ logs, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-500 font-mono p-4 md:p-8 flex flex-col">
      <div className="flex justify-between items-end mb-6 border-b border-green-900/50 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Terminal size={32} className="text-[#ee4d2d]" /> 
            ADMIN CONSOLE <span className="text-xs bg-[#ee4d2d] text-white px-2 py-0.5 rounded ml-2 font-sans tracking-wide">ROOT ACCESS</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
            <Cpu size={12} /> System Status: ONLINE | {logs.length} events logged
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-colors border border-gray-700"
        >
          <LogOut size={14} /> SAIR DO SISTEMA
        </button>
      </div>

      <div className="flex-grow bg-[#050505] rounded border border-green-900/30 overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-[#111] px-4 py-2 text-xs text-gray-400 border-b border-green-900/30 flex justify-between">
          <span>/var/log/shoppe-system.log</span>
          <span className="animate-pulse text-green-500">● LIVE MONITORING</span>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-1 font-mono text-sm h-[600px]">
          {logs.length === 0 && (
            <div className="text-gray-600 italic text-center mt-20">Nenhum evento registrado nesta sessão...</div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors group">
              <span className="text-gray-500 whitespace-nowrap">[{log.timestamp}]</span>
              <span className={`font-bold w-24 uppercase text-xs flex items-center ${
                log.type === 'error' ? 'text-red-500' : 
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {log.type}
              </span>
              <span className="text-gray-300 font-bold whitespace-nowrap">{log.action}:</span>
              <span className="text-gray-400 break-all group-hover:text-white transition-colors">{log.details}</span>
            </div>
          ))}
          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-gray-900 p-4 rounded border border-gray-800">
           <h3 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><Database size={14} /> ENDPOINT</h3>
           <p className="text-[10px] text-gray-500 break-all">{SCRIPT_URL}</p>
         </div>
         <div className="bg-gray-900 p-4 rounded border border-gray-800">
           <h3 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><ShieldCheck size={14} /> AUTH TOKEN</h3>
           <p className="text-[10px] text-gray-500 break-all">{TOKEN.split('').map(() => '*').join('')} (Protegido)</p>
         </div>
         <div className="bg-gray-900 p-4 rounded border border-gray-800">
           <h3 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><Globe size={14} /> AMBIENTE</h3>
           <p className="text-[10px] text-gray-500">React Production Build v4.2.0</p>
         </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: MODAIS EXISTENTES (ConfirmDelete, ProductModal) ---

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  rowNumber: number;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, productName, rowNumber }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Linha #{rowNumber}?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Você vai apagar o produto <span className="font-bold text-black">"{productName}"</span>. O Google Sheets atualizará as linhas automaticamente após a exclusão.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-sm font-bold hover:bg-gray-200 transition-colors"
            >
              CANCELAR
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              CONFIRMAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'rowNumber'>, row?: number) => Promise<void>;
  editingProduct: Product | null;
}

const ProductModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, editingProduct }) => {
  const [form, setForm] = useState({
    name: '',
    link: '',
    imageUrl: '',
    price: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const themeColor = editingProduct ? "bg-blue-600" : "bg-[#ee4d2d]";
  const themeRing = editingProduct ? "focus:ring-blue-600" : "focus:ring-[#ee4d2d]";
  const themeButton = editingProduct ? "bg-blue-600 hover:bg-blue-700" : "bg-[#ee4d2d] hover:bg-[#f05d40]";

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setForm({
          name: editingProduct.name,
          link: editingProduct.link,
          imageUrl: editingProduct.imageUrl,
          price: editingProduct.price.toString(),
          description: editingProduct.description
        });
      } else {
        setForm({ name: '', link: '', imageUrl: '', price: '', description: '' });
      }
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      setIsSubmitting(false);
    }
  }, [isOpen, editingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMagicFill = async () => {
    if (!form.name) return;
    setIsGenerating(true);
    const desc = await generateDescription(form.name);
    setForm(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.imageUrl) return;
    
    setIsSubmitting(true);
    try {
      await onSave({
        name: form.name.trim(),
        link: form.link || '#',
        imageUrl: form.imageUrl,
        price: parseFloat(form.price),
        description: form.description
      }, editingProduct?.rowNumber);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`${themeColor} p-6 text-white flex justify-between items-center transition-colors duration-500`}>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {editingProduct ? <Pencil size={24} /> : <Plus size={24} />} 
              {editingProduct ? 'Editar Produto' : 'Novo Anúncio'}
            </h2>
            {editingProduct && (
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full mt-1 w-fit uppercase">
                Database Row: {editingProduct.rowNumber}
              </span>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase tracking-tighter">Nome do Produto *</label>
            <input 
              ref={nameInputRef}
              type="text" 
              name="name"
              required
              className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none transition-all text-black font-medium focus:ring-2 ${themeRing}`}
              value={form.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-black uppercase tracking-tighter">Preço (R$) *</label>
              <input 
                type="number" 
                name="price"
                step="0.01"
                required
                className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none transition-all font-black text-black text-lg focus:ring-2 ${themeRing}`}
                value={form.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-black uppercase tracking-tighter">Link Afiliado</label>
              <input 
                type="url" 
                name="link"
                className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none transition-all text-black font-medium focus:ring-2 ${themeRing}`}
                value={form.link}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase tracking-tighter">URL da Imagem *</label>
            <input 
              type="url" 
              name="imageUrl"
              required
              className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none transition-all text-black font-medium focus:ring-2 ${themeRing}`}
              value={form.imageUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-black uppercase tracking-tighter">Descrição</label>
              <button 
                type="button"
                onClick={handleMagicFill}
                disabled={isGenerating}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded transition-colors ${editingProduct ? 'text-blue-600 bg-blue-50' : 'text-[#ee4d2d] bg-[#ee4d2d]/10'}`}
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                IA SUGERIR
              </button>
            </div>
            <textarea 
              name="description"
              rows={3}
              className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none transition-all resize-none text-black font-medium focus:ring-2 ${themeRing}`}
              value={form.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-sm font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${themeButton}`}
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (editingProduct ? 'SALVAR ALTERAÇÕES NA LINHA' : 'PUBLICAR NA VITRINE')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (APP) ---
const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [processingLine, setProcessingLine] = useState<number | null>(null);
  
  // Sistema de Logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  const addLog = (type: SystemLog['type'], action: string, details: string) => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type,
      action,
      details
    };
    setSystemLogs(prev => [newLog, ...prev]);
    console.log(`[${type.toUpperCase()}] ${action}: ${details}`);
  };
  
  // Detecção de Rota /admin ou ?page=admin
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path === '/admin' || search.includes('admin')) {
      setViewMode('admin-login');
    }
  }, []);

  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, productName: string, rowNumber: number}>({
    isOpen: false,
    productName: '',
    rowNumber: 0
  });

  const fetchProductsFromSheet = useCallback(async () => {
    setIsLoading(true);
    addLog('info', 'SYNC_START', 'Iniciando busca de dados na planilha...');
    try {
      const url = `${SCRIPT_URL}?token=${TOKEN}&t=${Date.now()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        addLog('success', 'SYNC_COMPLETE', `${data.length} registros recebidos.`);
        const mappedProducts: Product[] = data.map((item: any, index: number) => ({
          id: `row-${item.row}`,
          name: item.nome || 'Sem nome',
          link: item.link || '#',
          imageUrl: item.imagem || '',
          price: parseFloat(item.valor || '0'),
          description: item.descricao || '',
          createdAt: Date.now(),
          rowNumber: item.row 
        }));
        setProducts(mappedProducts);
      } else {
        addLog('warning', 'SYNC_WARNING', 'Resposta inesperada: ' + JSON.stringify(data));
      }
    } catch (error: any) {
      addLog('error', 'SYNC_ERROR', error.toString());
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsFromSheet();
  }, [fetchProductsFromSheet]);

  const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'rowNumber'>, row?: number) => {
    setSyncStatus('syncing');
    const isUpdate = !!row;
    const actionType = isUpdate ? 'UPDATE' : 'CREATE';
    
    addLog('info', `${actionType}_REQ`, `Enviando dados para linha ${row || 'NOVA'}...`);
    
    try {
      const payload = {
        action: isUpdate ? 'update' : 'create',
        row: row || null,
        nome: productData.name,
        link: productData.link,
        imagem: productData.imageUrl,
        valor: productData.price.toString(),
        descricao: productData.description
      };

      await fetch(`${SCRIPT_URL}?token=${TOKEN}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      addLog('success', `${actionType}_SENT`, 'Requisição enviada com sucesso (no-cors).');
      setSyncStatus('success');
      setTimeout(() => {
        fetchProductsFromSheet();
        setSyncStatus('idle');
        setEditingProduct(null);
      }, 1500);
    } catch (error: any) {
      addLog('error', `${actionType}_FAIL`, error.toString());
      setSyncStatus('error');
    }
  }, [fetchProductsFromSheet]);

  const handleDeleteProduct = useCallback(async (row: number, name: string) => {
    setProcessingLine(row);
    setSyncStatus('syncing');
    addLog('warning', 'DELETE_REQ', `Solicitando exclusão da linha #${row} (${name})`);

    try {
      const payload = { 
        action: 'delete', 
        row: row 
      };
      
      await fetch(`${SCRIPT_URL}?token=${TOKEN}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      addLog('success', 'DELETE_SENT', 'Comando de exclusão transmitido.');
      
      setProducts(prev => prev.filter(p => p.rowNumber !== row));
      setSyncStatus('success');
      setDeleteModal({ ...deleteModal, isOpen: false });
      
      setTimeout(() => {
        setSyncStatus('idle');
        setProcessingLine(null);
        fetchProductsFromSheet();
      }, 2000);
    } catch (error: any) {
      addLog('error', 'DELETE_FAIL', error.toString());
      setSyncStatus('error');
      setProcessingLine(null);
    }
  }, [fetchProductsFromSheet, deleteModal]);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      p.rowNumber.toString() === searchLower
    ).sort((a, b) => b.rowNumber - a.rowNumber);
  }, [products, searchTerm]);

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (viewMode === 'admin-login') {
    return <AdminLogin onLogin={() => {
      setIsAdminAuthenticated(true);
      setViewMode('admin-dashboard');
      addLog('warning', 'AUTH_ADMIN', 'Acesso administrativo concedido via senha.');
    }} />;
  }

  if (viewMode === 'admin-dashboard' && isAdminAuthenticated) {
    return <AdminPanel logs={systemLogs} onLogout={() => {
      setViewMode('store');
      setIsAdminAuthenticated(false);
      window.history.pushState({}, '', '/'); // Limpa URL
    }} />;
  }

  // --- MODO LOJA PADRÃO ---
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans">
      <div className="bg-[#ee4d2d] text-white py-1 px-4 text-[11px] flex justify-between items-center border-b border-white/10 font-bold">
        <div className="flex items-center gap-3">
          <span className="cursor-pointer hover:opacity-80">Painel Shoppe Database</span>
          <span className="flex items-center gap-1"><Globe size={10} /> Português</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1 cursor-pointer"><Bell size={12} /> Ajuda</div>
          <span className="font-bold border-l border-white/30 pl-4">Modo: Gerenciamento por Linhas (ID)</span>
        </div>
      </div>

      <header className="bg-[#ee4d2d] sticky top-0 z-40 px-4 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer text-white flex-shrink-0" onClick={() => fetchProductsFromSheet()}>
            <ShoppingCart size={32} fill="white" />
            <div className="leading-tight">
              <span className="text-xl font-black italic tracking-tighter block uppercase">Shoppe</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">DB Manager v4</span>
            </div>
          </div>

          <div className="flex-grow w-full relative">
            <div className="bg-white rounded-sm p-1 flex items-center shadow-inner">
              <input 
                type="text" 
                placeholder="Busque por nome ou número da linha..." 
                className="w-full px-4 py-2 outline-none text-sm text-black font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#ee4d2d] text-white px-5 py-2 rounded-sm hover:brightness-110 transition-all">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-3 md:p-6 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-5 rounded-sm shadow-sm border-b-2 border-[#ee4d2d]">
          <div className="flex items-center gap-4">
            <div className="bg-[#ee4d2d]/10 p-3 rounded-full">
              <Database className="text-[#ee4d2d]" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">Base de Dados</h1>
              <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                Controle: <span className="text-orange-600 font-bold">Por Row ID</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={fetchProductsFromSheet}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-sm text-sm font-bold hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              SYNC
            </button>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#ee4d2d] text-white px-6 py-2.5 rounded-sm text-sm font-black shadow-md hover:brightness-110 transition-all"
            >
              <Plus size={18} />
              ADICIONAR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
          {isLoading && products.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-sm border border-gray-100">
              <Loader2 size={48} className="animate-spin text-[#ee4d2d] mb-4" />
              <p className="text-gray-500 text-sm font-black tracking-widest uppercase">Carregando dados da nuvem...</p>
            </div>
          ) : filteredProducts.map(produto => (
            <div 
              key={produto.id} 
              onClick={() => openEditModal(produto)}
              className={`bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#ee4d2d] group flex flex-col h-full relative cursor-pointer ${processingLine === produto.rowNumber ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            >
              {/* Badge da Linha */}
              <div className="absolute top-0 left-0 z-20 bg-black text-white px-2.5 py-1.5 flex items-center gap-1 shadow-lg rounded-br-sm border-r border-b border-white/20">
                <span className="text-[10px] font-black leading-none">ID #{produto.rowNumber}</span>
              </div>

              {/* Botões de Ação */}
              <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(produto); }}
                  className="p-2.5 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setDeleteModal({ isOpen: true, productName: produto.name, rowNumber: produto.rowNumber });
                  }}
                  className="p-2.5 bg-white text-red-500 rounded-full shadow-lg border border-gray-100 hover:bg-red-600 hover:text-white transition-all hover:scale-110"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                <img 
                  src={produto.imageUrl} 
                  alt={produto.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f5f5f5/ee4d2d?text=Erro+Imagem'; }}
                />
              </div>
              
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-[12px] text-gray-800 line-clamp-2 h-9 leading-tight font-medium group-hover:text-[#ee4d2d] transition-colors">
                  {produto.name}
                </h3>
                
                <div className="mt-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] text-black font-black">R$</span>
                    <span className="text-xl font-black text-black tracking-tighter">
                      {produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-1.5">
                  <a 
                    href={produto.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-grow flex items-center justify-center gap-1.5 bg-[#ee4d2d] text-white py-2 rounded-sm text-[11px] font-bold hover:brightness-110 shadow-sm transition-all"
                  >
                    LINK <ArrowRight size={12} />
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(produto); }}
                    className="p-2 border border-blue-200 text-blue-600 rounded-sm hover:bg-blue-50 transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {!isLoading && filteredProducts.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-400 bg-white rounded-sm border-2 border-dashed border-gray-100">
              <PackageOpen size={64} strokeWidth={1} className="mb-4 opacity-10" />
              <p className="text-lg font-bold text-gray-400">Banco de dados vazio</p>
              <button onClick={() => setSearchTerm('')} className="mt-2 text-[#ee4d2d] font-bold text-sm hover:underline">Ver todos</button>
            </div>
          )}
        </div>
      </main>

      {syncStatus !== 'idle' && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-6 py-4 rounded-lg text-xs font-black shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          {syncStatus === 'syncing' && <><Loader2 size={18} className="animate-spin text-[#ee4d2d]" /> SINCRONIZANDO (POR ID)...</>}
          {syncStatus === 'success' && <><CheckCircle2 size={18} className="text-green-400" /> OPERAÇÃO CONCLUÍDA!</>}
          {syncStatus === 'error' && <><AlertCircle size={18} className="text-red-400" /> ERRO DE OPERAÇÃO.</>}
        </div>
      )}

      {/* Modais */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <ConfirmDeleteModal 
        isOpen={deleteModal.isOpen}
        productName={deleteModal.productName}
        rowNumber={deleteModal.rowNumber}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => handleDeleteProduct(deleteModal.rowNumber, deleteModal.productName)}
      />
      
      <footer className="bg-white border-t border-gray-100 py-10 px-4 text-center mt-auto">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest font-black text-[#ee4d2d]">Shoppe Database Manager v4.0</p>
        <p className="text-[9px] text-gray-300 mt-2 font-medium">Indexação por Row ID (Database Mode)</p>
      </footer>
    </div>
  );
};

export default App;
