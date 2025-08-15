import React, { useState, useEffect, useMemo } from 'react';
import ActionButton from './Action/ActionButton';

function CharacterSheet({ level }) {
  const [pv, setPv] = useState(19);
  const [pe, setPe] = useState(30);

  const [stats, setStats] = useState({
    ATT: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  });

  const maxPv = stats.CON * 10;
  const maxPe = stats.SAG * 10;

  useEffect(() => {
    setPv((prev) => Math.min(prev, maxPv));
  }, [maxPv]);

  useEffect(() => {
    setPe((prev) => Math.min(prev, maxPe));
  }, [maxPe]);

  const levelCap = {
    1: 12, 2: 14, 3: 15, 4: 17, 5: 20,
    6: 22, 7: 23, 8: 25, 9: 27, 10: 31,
    11: 33, 12: 35, 13: 36, 14: 38, 15: 41,
    16: 43, 17: 45, 18: 47, 19: 49, 20: 56,
  };

  const maxCaracteristiques = levelCap[level] || 0;
  const totalCaracteristiques = Object.values(stats).reduce((a, b) => a + b, 0);

  const updateStat = (key, change) => {
    setStats((prev) => {
      const newValue = prev[key] + change;
      const newTotal = totalCaracteristiques + change;
      if (newValue < 0 || newTotal > maxCaracteristiques) return prev;
      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  const StatBlock = ({ label, value, onIncrement, onDecrement }) => {
    const isDisabled = totalCaracteristiques >= maxCaracteristiques;

    return (
      <div
        style={{
          width: '100px',
          height: '90px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          margin: '5px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ padding: '5px 0', fontWeight: 'bold' }}>{label}</div>
        <div
          style={{
            display: 'flex',
            borderTop: '1px solid white',
          }}
        >
          <button
            onClick={onDecrement}
            style={{
              flex: 1,
              background: 'none',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              padding: '6px 0',
              cursor: 'pointer',
            }}
          >
            –
          </button>
          <div
            style={{
              flex: 1,
              borderLeft: '1px solid white',
              borderRight: '1px solid white',
              padding: '6px 0',
              fontWeight: 'bold',
            }}
          >
            {value}
          </div>
          <button
            onClick={onIncrement}
            disabled={isDisabled}
            style={{
              flex: 1,
              background: 'none',
              color: isDisabled ? 'gray' : 'white',
              border: 'none',
              fontSize: '16px',
              padding: '6px 0',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // ✅ Compétences & objets depuis localStorage
  const skills = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("character_skills")) || [];
    } catch {
      return [];
    }
  }, []);

  const objects = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("character_objects")) || [];
    } catch {
      return [];
    }
  }, []);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          border: '1px solid #000',
          width: '500px',
          height: 'auto',
        }}
      >
        {/* Haut gauche */}
        <div
          style={{
            borderRight: '1px solid #000',
            borderBottom: '1px solid #000',
            padding: '10px',
          }}
        >
          <p>
            <strong>Indice de recherche :</strong> criminel
          </p>
        </div>

        {/* Haut droit */}
        <div
          style={{
            borderBottom: '1px solid #000',
            padding: '10px',
          }}
        >
          <p>
            <strong>Poids porté :</strong> 70/80
          </p>
        </div>

        {/* Bas gauche : Stats */}
        <div
          style={{
            borderRight: '1px solid #000',
            padding: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <h2>Vous êtes niveau : {level}</h2>
          <p>Total caractéristiques : {totalCaracteristiques} / {maxCaracteristiques}</p>
          {Object.entries(stats).map(([label, value]) => (
            <StatBlock
              key={label}
              label={label}
              value={value}
              onIncrement={() => updateStat(label, 1)}
              onDecrement={() => updateStat(label, -1)}
            />
          ))}
        </div>

        {/* Bas droit : PV/PE */}
        <div style={{ padding: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <p>
              PV : {pv}/{maxPv}
            </p>
            <button onClick={() => setPv((prev) => Math.max(prev - 1, 0))}>- PV</button>
            <button onClick={() => setPv((prev) => Math.min(prev + 1, maxPv))}>+ PV</button>
          </div>

          <div>
            <p>
              PE : {pe}/{maxPe}
            </p>
            <button onClick={() => setPe((prev) => Math.max(prev - 1, 0))}>- PE</button>
            <button onClick={() => setPe((prev) => Math.min(prev + 1, maxPe))}>+ PE</button>
          </div>
        </div>
      </div>

      {/* Bouton ACTION */}
      <div style={{ marginTop: '20px' }}>
        <ActionButton
          characteristics={{
            attaque: stats.ATT,
            defense: stats.CON,
            volonte: stats.SAG,
          }}
          skills={skills}
          objects={objects}
        />
      </div>
    </>
  );
}

export default CharacterSheet;
