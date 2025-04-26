// App.js
import React, { useState } from 'react';
import './App.css';
import XpProgressCircle from './Components/XpProgressCircle';
import CharacterSheet from './Components/CharacterSheet';

function App() {
  // Déclaration de la variable level dans le composant parent
  const [level, setLevel] = useState(1);

  return (
    <div className="App">
      <header className="App-header">
        {/* Passer level et sa fonction de mise à jour à XpProgressCircle */}
        <XpProgressCircle level={level} setLevel={setLevel} />
        {/* Passer level à CharacterSheet */}
        <CharacterSheet level={level} />
      </header>
    </div>
  );
}

export default App;
