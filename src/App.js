// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import XpProgressCircle from './Components/XpProgressCircle';
import CharacterSheet from './Components/Character/CharacterSheet';
import CharacterTabs from './Components/Character/CharacterTabs';

function App() {
  // 1) Hydrate level from LocalStorage (so CSV import shows in the UI immediately)
  const [level, setLevel] = useState(() => {
    try {
      const raw = localStorage.getItem("character_level");
      if (raw != null) {
        try {
          const parsed = JSON.parse(raw);
          const n = Number(parsed);
          return Number.isFinite(n) ? n : 1;
        } catch {
          const n = Number(raw);
          return Number.isFinite(n) ? n : 1;
        }
      }
    } catch {}
    return 1;
  });

  // 2) Persist level whenever it changes (keeps Import/Export and all tabs in sync)
  useEffect(() => {
    try {
      localStorage.setItem("character_level", JSON.stringify(level));
    } catch {}
  }, [level]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Xp UI controls the *same* level state */}
        <XpProgressCircle level={level} setLevel={setLevel} />
        {/* Character sheet uses level for caps and calculations */}
        <CharacterSheet level={level} />
      </header>
      {/* Tabs need level for export */}
      <CharacterTabs level={level} />
    </div>
  );
}

export default App;
