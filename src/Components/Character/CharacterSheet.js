import React, { useState, useEffect, useMemo, useRef } from 'react';
import ActionButton from './Action/ActionButton';

function CharacterSheet({ level }) {
  const hasLoaded = useRef(false);


  const [stats, setStats] = useState(() => {
  try {
    const raw = localStorage.getItem("character_stats");
    let s = raw ? JSON.parse(raw) : {};
    // migrate legacy ATT → FOR
    if (s && s.FOR == null && s.ATT != null) {
      s.FOR = s.ATT;
      delete s.ATT;
      localStorage.setItem("character_stats", JSON.stringify(s));
    }
    const num = (v) => (Number.isFinite(+v) ? +v : 0);
    return {
      FOR: num(s?.FOR), DEX: num(s?.DEX), CON: num(s?.CON),
      INT: num(s?.INT), SAG: num(s?.SAG), CHA: num(s?.CHA),
    };
  } catch {
    return { FOR:0, DEX:0, CON:0, INT:0, SAG:0, CHA:0 };
  }
});

const [pv, setPv] = useState(() => {
  const raw = localStorage.getItem("character_pv");
  return raw != null ? (+raw || 0) : 0;
});

const [pe, setPe] = useState(() => {
  const raw = localStorage.getItem("character_pe");
  return raw != null ? (+raw || 0) : 0;
});

  // ---------- Indice de recherche ----------
  const WANTED_LEVELS = [
    null,
    'petit vol',
    'violence aggravée',
    'meurtre',
    'Multiples meurtres',
    'Attentat',
    'Génocide',
    'Destruction planétaire',
  ];
  const [wantedIndex, setWantedIndex] = useState(() => {
    try {
      const raw = localStorage.getItem('character_wanted_index');
      if (raw != null) {
        const n = Number(JSON.parse(raw));
        if (Number.isFinite(n) && n >= 1 && n <= 7) return n;
      }
    } catch {}
    return 1;
  });
  useEffect(() => {
    try { localStorage.setItem('character_wanted_index', JSON.stringify(wantedIndex)); } catch {}
  }, [wantedIndex]);
  const wantedStars = (n) => '⭐'.repeat(Math.max(0, Math.min(7, n || 0)));
  const wantedLabel = (n) => {
    const name = WANTED_LEVELS[n] || '';
    return name ? `${name} (${wantedStars(n)})` : '';
  };

  // ---------- Helpers ----------
  const parseNum = (v) => {
    if (v === null || v === undefined) return 0;
    const n = parseFloat(String(v).trim().replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };
  const formatWeight = (n) => {
    const r = Math.round(n * 100) / 100;
    return Number.isInteger(r) ? String(r) : r.toFixed(2);
  };

  const maxPv = stats.CON * 10;
  const maxPe = stats.SAG * 10;

  useEffect(() => {
  try { localStorage.setItem("character_stats", JSON.stringify(stats)); } catch {}
  }, [stats]);

  useEffect(() => {
    try { localStorage.setItem("character_pv", String(pv)); } catch {}
  }, [pv]);

  useEffect(() => {
    try { localStorage.setItem("character_pe", String(pe)); } catch {}
  }, [pe]);

  // Persist level (export fallback)
  useEffect(() => {
    try { localStorage.setItem("character_level", JSON.stringify(level)); } catch {}
  }, [level]);

  // Load PV/PE/Stats from LS + MIGRATE ATT → FOR once
  useEffect(() => {
    try {
      const rawStats = localStorage.getItem("character_stats");
      const storedPv = localStorage.getItem("character_pv");
      const storedPe = localStorage.getItem("character_pe");

      let parsed = {
        FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0,
      };
      if (rawStats) {
        const s = JSON.parse(rawStats) || {};
        // MIGRATION: if legacy ATT exists and FOR is missing, move ATT → FOR
        let migrated = false;
        if (s.FOR == null && s.ATT != null) {
          s.FOR = s.ATT;
          delete s.ATT;
          migrated = true;
        }
        parsed = {
          FOR: parseNum(s.FOR),
          DEX: parseNum(s.DEX),
          CON: parseNum(s.CON),
          INT: parseNum(s.INT),
          SAG: parseNum(s.SAG),
          CHA: parseNum(s.CHA),
        };
        if (migrated) {
          try { localStorage.setItem("character_stats", JSON.stringify(parsed)); } catch {}
        }
      }
      setStats(parsed);

      if (storedPv) setPv(Number(storedPv));
      if (storedPe) setPe(Number(storedPe));
    } catch (e) {
      console.error("Erreur chargement PV/PE/stats:", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  // Auto-save stats/PV/PE
  useEffect(() => {
    if (!hasLoaded.current) return;
    try { localStorage.setItem("character_stats", JSON.stringify(stats)); } catch {}
  }, [stats]);
  useEffect(() => {
    if (!hasLoaded.current) return;
    try { localStorage.setItem("character_pv", String(pv)); } catch {}
  }, [pv]);
  useEffect(() => {
    if (!hasLoaded.current) return;
    try { localStorage.setItem("character_pe", String(pe)); } catch {}
  }, [pe]);

  // Clamp PV/PE when max changes
  useEffect(() => { setPv((prev) => Math.min(prev, maxPv)); }, [maxPv]);
  useEffect(() => { setPe((prev) => Math.min(prev, maxPe)); }, [maxPe]);

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
      const newValue = (prev[key] ?? 0) + change;
      const newTotal = totalCaracteristiques + change;
      if (newValue < 0 || newTotal > maxCaracteristiques) return prev;
      return { ...prev, [key]: newValue };
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
        <div style={{ display: 'flex', borderTop: '1px solid white' }}>
          <button
            onClick={onDecrement}
            style={{
              flex: 1, background: 'none', color: 'white', border: 'none',
              fontSize: '16px', padding: '6px 0', cursor: 'pointer',
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

  // ----- INVENTORY WEIGHT (live) -----
  const [objectsVersion, setObjectsVersion] = useState(0);
  useEffect(() => {
    const bump = () => setObjectsVersion((v) => v + 1);
    const onStorage = (e) => { if (e.key === 'character_objects') bump(); };
    window.addEventListener('character_objects_updated', bump);
    window.addEventListener('storage', onStorage);
    window.addEventListener('visibilitychange', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener('character_objects_updated', bump);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('visibilitychange', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);
  const objects = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("character_objects")) || []; }
    catch { return []; }
  }, [objectsVersion]);
  const totalWeight = useMemo(
    () => (objects || []).reduce((sum, o) => sum + parseNum(o?.poids), 0),
    [objects]
  );

  // Carry capacity: (FOR + CON) * 10
  const maxCarry = (parseNum(stats.FOR) + parseNum(stats.CON)) * 10;

  // Snapshot for ActionButton
  const skills = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("character_skills")) || []; }
    catch { return []; }
  }, [objectsVersion]);

  // For nicer order when rendering stats blocks
  const statOrder = ["FOR", "DEX", "CON", "INT", "SAG", "CHA"];

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
        {/* Top-left: Indice de recherche */}
        <div
          style={{
            borderRight: '1px solid #000',
            borderBottom: '1px solid #000',
            padding: '10px',
          }}
        >
          <p style={{ marginBottom: 8 }}>
            <strong>Indice de recherche :</strong>
          </p>
          <div>
            <select
              value={wantedIndex}
              onChange={(e) => setWantedIndex(Number(e.target.value))}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #ccc',
                width: '100%',
              }}
              aria-label="Indice de recherche"
            >
              {[1,2,3,4,5,6,7].map((n) => (
                <option key={n} value={n}>
                  {wantedLabel(n)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top-right: Poids porté */}
        <div
          style={{
            borderBottom: '1px solid #000',
            padding: '10px',
          }}
        >
          <p>
            <strong>Poids porté :</strong> {formatWeight(totalWeight)} / {formatWeight(maxCarry)}
          </p>
        </div>

        {/* Bottom-left: Stats */}
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

          {statOrder.map((label) => (
            <StatBlock
              key={label}
              label={label}
              value={stats[label] ?? 0}
              onIncrement={() => updateStat(label, 1)}
              onDecrement={() => updateStat(label, -1)}
            />
          ))}
        </div>

        {/* Bottom-right: PV/PE */}
        <div style={{ padding: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <p>PV : {pv}/{maxPv}</p>
            <button onClick={() => setPv((prev) => Math.max(prev - 1, 0))}>- PV</button>
            <button onClick={() => setPv((prev) => Math.min(prev + 1, maxPv))}>+ PV</button>
          </div>

          <div>
            <p>PE : {pe}/{maxPe}</p>
            <button onClick={() => setPe((prev) => Math.max(prev - 1, 0))}>- PE</button>
            <button onClick={() => setPe((prev) => Math.min(prev + 1, maxPe))}>+ PE</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <ActionButton
          characteristics={{
            attaque: stats.FOR,  // <— now uses FOR
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
