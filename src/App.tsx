import React from 'react';
import { Terminal, Settings, Play, Rocket, Wallet, ScrollText, MessageSquare } from 'lucide-react';
import { useSandboxStore } from './store';
import { cn } from './lib/utils';

export default function App() {
  const { 
    isWalletConnected, connectWallet, disconnectWallet, walletAddress, network,
    code, setCode, contractType, setContractType,
    compile, deploy, isCompiling, isDeploying, bytecode,
    consoleOutput, clearConsole
  } = useSandboxStore();

  return (
    <div className="flex flex-col h-screen bg-[#080809] text-slate-300 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0c0c0e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center">
            <Rocket className="text-black w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              PANDORA
              <span className="text-emerald-500 font-normal">LABS</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isWalletConnected ? (
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">{network || 'kaspa_mainnet'}</span>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-sm text-slate-300 font-mono">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}</span>
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold transition-colors border border-white/10"
                >
                  Disconnect
                </button>
             </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 rounded bg-white text-black text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Connect Kasware
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0b] flex flex-col">
          <div className="p-4 space-y-6 flex-1">
            <div>
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Project Type</h2>
              <div className="space-y-1">
                <button 
                  onClick={() => setContractType('KRC-20')}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                    contractType === 'KRC-20' ? "bg-emerald-500/10 text-emerald-500" : "text-slate-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <ScrollText className="w-4 h-4" />
                  KRC-20 Token
                </button>
                <button 
                  onClick={() => setContractType('Smart-Contract')}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                    contractType === 'Smart-Contract' ? "bg-emerald-500/10 text-emerald-500" : "text-slate-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  Smart Contract <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 rounded-sm">Exp</span>
                </button>
              </div>
            </div>

            <div>
               <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Resources</h2>
               <div className="space-y-1">
                  <a href="#" className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                     Kasplex Docs
                  </a>
                  <a href="#" className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                     BlockDAG Architecture
                  </a>
               </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/5">
             <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 font-medium text-sm transition-colors border border-[#5865F2]/20">
               <MessageSquare className="w-4 h-4" />
               Join Dev Discord
             </a>
          </div>
        </aside>

        {/* Editor Main Area */}
        <main className="flex-1 flex flex-col bg-[#0d0d0f]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0a0a0b]">
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-[#0d0d0f] border-t-2 border-emerald-500 text-xs font-medium text-slate-300">
                  {contractType === 'KRC-20' ? 'protocol.json' : 'contract.ks'}
               </div>
            </div>
            <div className="flex items-center gap-4 py-1">
              <button 
                onClick={compile}
                disabled={isCompiling}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 transition-colors border border-white/10 disabled:opacity-50"
              >
                <Play className="w-4 h-4 text-emerald-500" />
                {isCompiling ? 'Compiling...' : 'Compile'}
              </button>
              <button 
                onClick={deploy}
                disabled={isDeploying || !bytecode}
                className="flex items-center gap-2 px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors disabled:opacity-50"
              >
                <Rocket className="w-4 h-4" />
                {isDeploying ? 'Deploying...' : 'Deploy'}
              </button>
            </div>
          </div>

          <div className="flex-1 relative border-b border-white/5">
             <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full p-6 bg-[#0d0d0f] text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
             />
          </div>

          {/* Console */}
          <div className="h-48 flex flex-col bg-[#08080a]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0a0a0b]">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                Output Console
              </div>
              <button 
                onClick={clearConsole}
                className="text-[10px] text-slate-500 hover:text-slate-300 uppercase font-bold tracking-widest"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1">
              {consoleOutput.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-500 shrink-0">
                    [{log.timestamp.toLocaleTimeString([], { hour12: false })}]
                  </span>
                  <span className={cn(
                    "whitespace-pre-wrap break-words",
                    log.type === 'error' && "text-red-400",
                    log.type === 'success' && "text-emerald-400/80",
                    log.type === 'info' && "text-slate-300"
                  )}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 px-4 bg-emerald-600 text-black flex items-center justify-between text-[10px] font-bold uppercase shrink-0">
        <div className="flex gap-4">
          <span>● Ready</span>
          <span>UTF-8</span>
        </div>
        <div className="flex gap-4">
          <span>DAG-Depth: 142ms</span>
          <span>Pandora v1.0-alpha</span>
        </div>
      </footer>
    </div>
  );
}
