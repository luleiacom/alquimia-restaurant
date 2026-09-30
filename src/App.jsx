import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Navegación principal
  const [activeTab, setActiveTab] = useState('compendium'); // 'compendium' | 'cauldron' | 'telegraph' | 'passport'
  const [selectedElixir, setSelectedElixir] = useState(null);

  // 1. Efecto Linterna (Mouse Position)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // 2. Audio Ambiental Real (music1.wav)
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // 3. Caldero Interactivo con efectos visuales
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [brewResult, setBrewResult] = useState(null);
  const [isBrewing, setIsBrewing] = useState(false);

  // 4. Terminal de Telégrafo
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'ALQUIMIA SECURE TELEGRAPH [VERSION 4.2.0]' },
    { type: 'system', text: 'Type "help" to see available commands or "elixir" to override.' }
  ]);

  // 5. Pasaporte / Gamificación con sellos visuales
  const [stamps, setStamps] = useState(() => {
    try {
      const saved = localStorage.getItem('alquimia_stamps');
      return saved ? JSON.parse(saved) : [{ id: 'welcome', name: 'Welcome Seal', icon: '🗝️' }];
    } catch {
      return [{ id: 'welcome', name: 'Welcome Seal', icon: '🗝️' }];
    }
  });

  useEffect(() => {
    localStorage.setItem('alquimia_stamps', JSON.stringify(stamps));
  }, [stamps]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const toggleAmbientAudio = () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch(err => {
        console.error("Error al reproducir el audio:", err);
      });
    }
  };

  // Datos de Elixires con Imágenes Atmosféricas
  const elixirs = [
    { 
      id: 1, 
      name: "Elixir of Immortality", 
      type: "Botanical Tonic", 
      desc: "Artisanal gin infused with wild chrysanthemums, elderflower reduction, and cold eucalyptus smoke.", 
      effect: "Perpetual lucidity.", 
      price: "$18", 
      notes: "Herbaceous • Crisp",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80"
    },
    { 
      id: 2, 
      name: "The Apothecary's Brew", 
      type: "Oak Extract", 
      desc: "Bourbon aged in charred casks, dark nutmeg bitter, vintage port wine, and burnt rosemary.", 
      effect: "Deep warmth.", 
      price: "$22", 
      notes: "Smoky • Robust",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
    },
    { 
      id: 3, 
      name: "Venus' Tears", 
      type: "Forbidden Distillate", 
      desc: "Vodka distilled with greenhouse raspberries, white hibiscus cordial, and pure 24k gold.", 
      effect: "Subtle euphoria.", 
      price: "$20", 
      notes: "Sweet • Luminous",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80"
    },
    { 
      id: 4, 
      name: "Siren's Poison", 
      type: "Marine Solution", 
      desc: "Virgin cane white rum, bitter orange curaçao, kelp infusion, and saline emulsion.", 
      effect: "Abyssal awakening.", 
      price: "$19", 
      notes: "Saline • Bold",
      image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const rawIngredients = [
    { id: 'ing1', name: 'Mandragora Root', cat: 'Botanical', icon: '🌿' },
    { id: 'ing2', name: 'Eucalyptus Smoke', cat: 'Atmosphere', icon: '💨' },
    { id: 'ing3', name: '24k Gold Flakes', cat: 'Mineral', icon: '✨' },
    { id: 'ing4', name: 'Obsidian Dust', cat: 'Catalyst', icon: '🖤' },
    { id: 'ing5', name: 'Siren Tears', cat: 'Distillate', icon: '💧' },
    { id: 'ing6', name: 'Burnt Rosemary', cat: 'Aromatic', icon: '🔥' }
  ];

  const toggleIngredient = (ing) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    } else {
      if (selectedIngredients.length < 3) {
        setSelectedIngredients([...selectedIngredients, ing]);
      }
    }
  };

  const addStamp = (id, name, icon) => {
    if (!stamps.some(s => s.id === id)) {
      setStamps([...stamps, { id, name, icon }]);
    }
  };

  const brewPotion = () => {
    if (selectedIngredients.length < 3) return;
    setIsBrewing(true);
    setTimeout(() => {
      setIsBrewing(false);
      const names = ["The Philosopher's Draft", "Midnight Alchemist Secret", "Shadow Elixir N°9", "Forbidden Philtre"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      setBrewResult({
        name: randomName,
        formula: selectedIngredients.map(i => i.name).join(' + '),
        potency: `${Math.floor(Math.random() * 30 + 75)}% Proof`,
        description: "A custom magical concoction synthesized via your personal ingredient parameters."
      });
      addStamp('master-brewer', 'Master Brewer Seal', '🧪');
    }, 2000);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    let response = "";

    const newLogs = [...terminalLogs, { type: 'user', text: `> ${terminalInput}` }];

    if (cmd === 'help') {
      response = "Available commands: elixir, vip, status, clear, stamps";
    } else if (cmd === 'elixir' || cmd === 'unlock') {
      setIsUnlocked(true);
      response = "Override accepted. Opening secret vault doors...";
    } else if (cmd === 'vip') {
      response = "VIP Status: Confirmed. Secret catalog unlocked in Compendium.";
      addStamp('vip-telegraph', 'VIP Telegraph Seal', '📜');
    } else if (cmd === 'status') {
      response = "System operational. Temperature: 18.4°C. Alchemists active: 4.";
    } else if (cmd === 'stamps') {
      response = `Your collected seals: ${stamps.map(s => s.name).join(', ')}`;
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response = `Unknown command "${terminalInput}". The system rejects this frequency.`;
    }

    setTerminalLogs([...newLogs, { type: 'system', text: response }]);
    setTerminalInput('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'elixir') {
      setIsUnlocked(true);
      setError(false);
      addStamp('doorbell', 'Doorbell Seal', '🔔');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen bg-[#040D09] text-[#DFD7C5] overflow-hidden m-0 p-0 font-sans z-50 select-none"
    >
      
      {/* AUDIO NATIVO */}
      <audio ref={audioRef} src="/music1.wav" loop preload="auto" />

      {/* LUZ DE LINTERNA DINÁMICA */}
      <div 
        className="absolute pointer-events-none z-30 inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.08), transparent 80%)`
        }}
      ></div>

      {/* AMBIENTE DE FONDO */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#224232]/30 rounded-full blur-[180px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#040D09]/80 to-[#020604]"></div>
      </div>

      {/* PANTALLA DE ACCESO CLANDESTINO */}
      <div 
        className={`absolute inset-0 z-50 bg-[#040D09] flex flex-col justify-between p-6 md:p-12 transition-all duration-1000 ease-in-out ${
          isUnlocked ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
        }`}
      >
        <header className="flex justify-between items-center max-w-6xl mx-auto w-full border-b border-[#D4AF37]/20 pb-4">
          <div className="text-[11px] font-mono tracking-[0.3em] text-[#D4AF37]/70 uppercase">THE COMPENDIUM</div>
          <div className="text-center">
            <h1 className="font-serif text-2xl md:text-3xl text-[#D4AF37] tracking-[0.25em] font-light">Alquimia</h1>
          </div>
          <button 
            onClick={toggleAmbientAudio}
            className="text-[10px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 hover:bg-[#D4AF37]/10 transition"
          >
            {audioPlaying ? '[ MUSIC: ON ]' : '[ MUSIC: OFF ]'}
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto w-full py-4">
          <div className="hidden md:flex flex-col justify-center items-start border-r border-[#D4AF37]/20 pr-12 relative">
            <div className="p-4 bg-[#0A1811] border-2 border-[#D4AF37]/60 shadow-[0_0_20px_rgba(0,0,0,0.8)] mb-6">
              <span className="font-serif text-base text-[#D4AF37] block tracking-widest">ALQUIMIA</span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#DFD7C5]/70 uppercase">APOTHECARY & CRAFT COCKTAILS</span>
            </div>
            <p className="text-xs text-[#DFD7C5]/60 italic font-serif leading-relaxed">
              "Behind iron-forged panels, mystery ambient notes and amber lights lies the secret sanctuary."
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-6 md:p-8 bg-[#07130E]/90 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-1">PASSWORD REQUIRED</span>
            <h2 className="font-serif text-lg text-[#DFD7C5] mb-6">ENTER THE CORRECT ELIXIR</h2>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 max-w-sm">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secret Password (e.g. elixir)" 
                className="px-4 py-3 bg-[#020605] text-[#DFD7C5] placeholder:text-[#DFD7C5]/30 border border-[#D4AF37]/40 focus:border-[#D4AF37] outline-none text-center text-xs tracking-[0.3em]"
                autoFocus
              />
              <button 
                type="submit"
                className="py-3 bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#996D12] text-[#040D09] font-bold text-[11px] hover:brightness-125 transition duration-300 tracking-[0.3em] uppercase"
              >
                RING THE DOORBELL
              </button>
            </form>

            {error && (
              <p className="text-rose-500 mt-4 text-[10px] tracking-widest uppercase font-mono animate-bounce">Incorrect seal. The apothecary is watching.</p>
            )}
            <span className="text-[9px] font-mono text-[#DFD7C5]/40 mt-6 tracking-widest">HINT: TYPE "elixir" OR USE TELEGRAPH</span>
          </div>
        </div>

        <footer className="text-center pb-2">
          <span className="text-[9px] font-mono text-[#DFD7C5]/30 tracking-[0.3em] uppercase">EST. 1920 • PRIVATE LOUNGE</span>
        </footer>
      </div>

      {/* INTERFAZ PRINCIPAL DESBLOQUEADA */}
      <div className="relative z-20 flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Navbar Interna */}
        <header className="flex flex-col md:flex-row justify-between items-center py-4 border-b border-[#D4AF37]/20 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#D4AF37]/10">
              <i className="fa-solid fa-flask text-[#D4AF37] text-xs"></i>
            </div>
            <div>
              <span className="text-base font-serif text-[#D4AF37] tracking-[0.2em] block">ALQUIMIA</span>
              <span className="text-[8px] text-[#DFD7C5]/50 tracking-[0.3em] uppercase">Interactive Laboratory • V5</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center bg-[#07130E] border border-[#D4AF37]/30 p-1 gap-1">
            <button 
              onClick={() => setActiveTab('compendium')}
              className={`px-3 py-2 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'compendium' ? 'bg-[#D4AF37] text-[#040D09] font-bold' : 'text-[#DFD7C5]/70 hover:text-[#D4AF37]'}`}
            >
              Compendium
            </button>
            <button 
              onClick={() => setActiveTab('cauldron')}
              className={`px-3 py-2 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'cauldron' ? 'bg-[#D4AF37] text-[#040D09] font-bold' : 'text-[#DFD7C5]/70 hover:text-[#D4AF37]'}`}
            >
              Alchemical Cauldron
            </button>
            <button 
              onClick={() => setActiveTab('telegraph')}
              className={`px-3 py-2 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'telegraph' ? 'bg-[#D4AF37] text-[#040D09] font-bold' : 'text-[#DFD7C5]/70 hover:text-[#D4AF37]'}`}
            >
              Telegraph Terminal
            </button>
            <button 
              onClick={() => setActiveTab('passport')}
              className={`px-3 py-2 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'passport' ? 'bg-[#D4AF37] text-[#040D09] font-bold' : 'text-[#DFD7C5]/70 hover:text-[#D4AF37]'}`}
            >
              Digital Passport ({stamps.length})
            </button>
            <button 
              onClick={toggleAmbientAudio}
              className={`px-3 py-2 text-[9px] font-mono tracking-widest ${audioPlaying ? 'text-[#D4AF37] bg-[#D4AF37]/20 border border-[#D4AF37]' : 'text-[#DFD7C5]/50'}`}
            >
              {audioPlaying ? '🍸 MUSIC: ON' : '🔇 MUSIC: OFF'}
            </button>
          </div>
        </header>

        {/* Contenido Dinámico con Tarjetas Visuales e Interactivas */}
        <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {activeTab === 'compendium' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 animate-fade-in">
              {elixirs.map((drink) => (
                <div 
                  key={drink.id}
                  onClick={() => setSelectedElixir(drink)}
                  className="group relative bg-[#07130E]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl hover:scale-[1.01] flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                    <img 
                      src={drink.image} 
                      alt={drink.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#040D09] via-transparent to-transparent opacity-80"></div>
                  </div>

                  <div className="sm:w-2/3 p-6 flex flex-col justify-between relative">
                    <div className="absolute top-4 right-4 text-[9px] font-mono tracking-widest text-[#D4AF37]/60 border border-[#D4AF37]/30 px-2 py-0.5">
                      N° 0{drink.id}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">{drink.type}</span>
                      <h3 className="font-serif text-xl text-[#DFD7C5] group-hover:text-[#D4AF37] transition-colors mb-2">{drink.name}</h3>
                      <p className="text-xs text-[#DFD7C5]/70 italic mb-4 leading-relaxed font-serif line-clamp-2">{drink.desc}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-[#D4AF37]/20">
                      <span className="text-[10px] text-[#D4AF37]/80 tracking-wider uppercase font-mono">{drink.notes}</span>
                      <span className="font-serif text-lg text-[#D4AF37] font-bold">{drink.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cauldron' && (
            <div className="max-w-2xl mx-auto py-6 animate-fade-in text-center">
              <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase block mb-2">Interactive Laboratory</span>
              <h2 className="font-serif text-3xl text-[#DFD7C5] mb-2">THE ALCHEMICAL CAULDRON</h2>
              <p className="text-xs text-[#DFD7C5]/70 italic mb-6 font-serif">Select exactly 3 rare ingredients to synthesize your own custom secret elixir.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {rawIngredients.map((ing) => {
                  const isSelected = selectedIngredients.includes(ing);
                  return (
                    <div 
                      key={ing.id}
                      onClick={() => toggleIngredient(ing)}
                      className={`p-4 border transition-all cursor-pointer flex flex-col justify-between items-center text-center ${
                        isSelected ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' : 'bg-[#07130E] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <span className="text-2xl mb-1">{ing.icon}</span>
                      <span className="text-[9px] font-mono text-[#D4AF37]/70 uppercase">{ing.cat}</span>
                      <span className="font-serif text-sm text-[#DFD7C5] my-1">{ing.name}</span>
                      <span className="text-[10px] text-[#DFD7C5]/40">{isSelected ? '✓ Added' : '+ Add'}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={brewPotion}
                disabled={selectedIngredients.length !== 3 || isBrewing}
                className={`w-full py-3 font-bold text-[10px] tracking-[0.3em] uppercase transition shadow-xl ${
                  selectedIngredients.length === 3 ? 'bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#996D12] text-[#040D09] hover:brightness-125' : 'bg-[#07130E] text-[#DFD7C5]/30 border border-[#D4AF37]/20 cursor-not-allowed'
                }`}
              >
                {isBrewing ? 'SYNTHESIZING CHEMICAL REACTION...' : 'SYNTHESIS POTION FORMULA'}
              </button>

              {brewResult && (
                <div className="mt-8 p-6 bg-[#07130E] border-2 border-[#D4AF37] text-left animate-fade-in shadow-2xl relative">
                  <div className="absolute top-3 right-3 text-[9px] font-mono text-[#D4AF37]">{brewResult.potency}</div>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">SYNTHESIZED SUCCESS</span>
                  <h3 className="font-serif text-2xl text-[#DFD7C5] mb-2">{brewResult.name}</h3>
                  <p className="text-xs text-[#DFD7C5]/80 italic font-serif mb-3">Formula: {brewResult.formula}</p>
                  <p className="text-xs text-[#DFD7C5]/60">{brewResult.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'telegraph' && (
            <div className="max-w-2xl mx-auto py-8 animate-fade-in">
              <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase block text-center mb-1">Encrypted Communication</span>
              <h2 className="font-serif text-2xl text-[#DFD7C5] text-center mb-6">TELEGRAPH CONSOLE</h2>
              
              <div className="bg-[#020605] border border-[#D4AF37]/40 p-4 h-64 overflow-y-auto font-mono text-xs mb-4 flex flex-col gap-2 shadow-inner">
                {terminalLogs.map((log, index) => (
                  <div key={index} className={`${log.type === 'user' ? 'text-[#D4AF37]' : 'text-[#DFD7C5]/80'}`}>
                    {log.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type command (e.g. help, vip, status)..." 
                  className="flex-1 p-3 bg-[#07130E] border border-[#D4AF37]/40 text-[#DFD7C5] text-xs font-mono outline-none focus:border-[#D4AF37]"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] text-[#040D09] font-bold text-[10px] tracking-widest uppercase hover:bg-white transition"
                >
                  TRANSMIT
                </button>
              </form>
            </div>
          )}

          {activeTab === 'passport' && (
            <div className="max-w-xl mx-auto py-8 animate-fade-in text-center">
              <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase block mb-1">Alchemist Ledger</span>
              <h2 className="font-serif text-3xl text-[#DFD7C5] mb-2">DIGITAL PASSPORT</h2>
              <p className="text-xs text-[#DFD7C5]/70 italic font-serif mb-8">Seals collected across your secret explorations in Alquimia.</p>

              <div className="grid grid-cols-1 gap-3">
                {stamps.map((stamp, i) => (
                  <div key={i} className="p-4 bg-[#07130E] border border-[#D4AF37]/40 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-lg">
                        {stamp.icon}
                      </div>
                      <span className="font-serif text-sm text-[#DFD7C5] tracking-wide">{stamp.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#D4AF37]/60 uppercase border border-[#D4AF37]/30 px-2 py-1">VERIFIED SEAL</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {selectedElixir && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="relative max-w-lg w-full bg-[#07130E] border-2 border-[#D4AF37] shadow-2xl overflow-hidden">
              <div className="h-56 relative">
                <img src={selectedElixir.image} alt={selectedElixir.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130E] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 text-center">
                <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase">LABORATORY RECORD</span>
                <h3 className="font-serif text-2xl text-[#DFD7C5] mt-1 mb-3">{selectedElixir.name}</h3>
                <p className="text-xs text-[#DFD7C5]/80 italic font-serif mb-5">{selectedElixir.desc}</p>
                <div className="p-3 bg-[#020605] border border-[#D4AF37]/30 mb-5 text-[11px] text-[#D4AF37] font-serif">
                  Desired side effect: {selectedElixir.effect}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl text-[#D4AF37]">{selectedElixir.price}</span>
                  <button 
                    onClick={() => setSelectedElixir(null)}
                    className="px-5 py-2 bg-[#D4AF37] text-[#040D09] font-bold text-[10px] tracking-widest uppercase hover:bg-white transition"
                  >
                    CLOSE RECORD
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="py-3 border-t border-[#D4AF37]/10 flex justify-between items-center text-[9px] text-[#DFD7C5]/40 tracking-widest uppercase font-mono">
          <span>ALQUIMIA SPEAKEASY // VISUAL MODULE ACTIVE</span>
          <span>SECURE PROTOCOL ACTIVE</span>
        </footer>

      </div>

    </div>
  );
}