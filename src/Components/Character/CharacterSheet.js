import React, { useEffect, useMemo } from "react";
import ActionButton from "./Action/ActionButton";

/* =========================================================
 * Robust LocalStorage helpers + hook
 * - Lit LS dans l'initialiseur de useState (pas d'effet)
 * - Évite d'écrire au premier render (skip 1er passage)
 * - Gère proprement nombres/objets et erreurs JSON
 * =======================================================*/
function readFromLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Si ce n'est pas du JSON valide, tente une coercition simple
      parsed = raw;
    }

    if (typeof fallback === "number") {
      const n = Number(parsed);
      return Number.isFinite(n) ? n : fallback;
    }
    if (typeof fallback === "object" && fallback !== null) {
      // On attend un objet : si parsed n'en est pas un, on renvoie le fallback
      return parsed && typeof parsed === "object" ? parsed : fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => readFromLS(key, initialValue));
  const first = React.useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}

/* =========================================================
 * Utils
 * =======================================================*/
const DEFAULT_STATS = { ATT: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 };

function normalizeStats(obj) {
  const src = obj || {};
  return {
    ATT: Number(src.ATT ?? 0),
    DEX: Number(src.DEX ?? 0),
    CON: Number(src.CON ?? 0),
    INT: Number(src.INT ?? 0),
    SAG: Number(src.SAG ?? 0),
    CHA: Number(src.CHA ?? 0),
  };
}

const levelCap = {
  1: 12,  2: 14,  3: 15,  4: 17,  5: 20,
  6: 22,  7: 23,  8: 25,  9: 27, 10: 31,
 11: 33, 12: 35, 13: 36, 14: 38, 15: 41,
 16: 43, 17: 45, 18: 47, 19: 49, 20: 56,
};

/* =========================================================
 * Component
 * =======================================================*/
function CharacterSheet({ level }) {
  // 1) Stats : lues synchroniquement depuis LS au 1er render
  const [stats, setStats] = useLocalStorage("character_stats", DEFAULT_STATS);

  // 1.b) Normaliser une seule fois les types (si l'import a mis des strings)
  useEffect(() => {
    const n = normalizeStats(stats);
    // comparer rapidement
    if (JSON.stringify(n) !== JSON.stringify(stats)) {
      setStats(n); // écrit dans LS (après le premier skip) avec types corrigés
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // une seule fois

  // 2) Déductions
  const maxPv = useMemo(() => (Number(stats.CON) || 0) * 10, [stats.CON]);
  const maxPe = useMemo(() => (Number(stats.SAG) || 0) * 10, [stats.SAG]);

  // 3) PV/PE : initialisés depuis LS au tout premier render.
  //    Si aucune valeur stockée, on prend par défaut le max calculé depuis les stats déjà hydratées.
  const [pv, setPv] = useLocalStorage("character_pv", maxPv);
  const [pe, setPe] = useLocalStorage("character_pe", maxPe);

  // 4) Clamps vers le bas seulement lorsque max change (évite le drop à 0 avant hydratation)
  useEffect(() => {
    setPv((prev) => {
      const cur = Number(prev) || 0;
      return cur > maxPv ? maxPv : cur;
    });
  }, [maxPv, setPv]);

  useEffect(() => {
    setPe((prev) => {
      const cur = Number(prev) || 0;
      return cur > maxPe ? maxPe : cur;
    });
  }, [maxPe, setPe]);

  // 5) Limites de caractéristiques par niveau
  const maxCaracteristiques = levelCap[level] || 0;

  const totalCaracteristiques = useMemo(
    () =>
      Object.values(stats).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [stats]
  );

  // 6) MàJ d'une carac : recalcul basé sur l'état courant (évite les erreurs de fermeture)
  const updateStat = (key, change) => {
    setStats((prev) => {
      const curVal = Number(prev[key]) || 0;
      const nextVal = curVal + change;
      if (nextVal < 0) return prev;

      const curTotal = Object.values(prev).reduce(
        (sum, v) => sum + (Number(v) || 0),
        0
      );
      const nextTotal = curTotal + change;
      if (nextTotal > maxCaracteristiques) return prev;

      return { ...prev, [key]: nextVal };
    });
  };

  // 7) Lecture des skills/objects pour ActionButton (memo + robustesse)
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

  // 8) UI
  const StatBlock = ({ label, value, onIncrement, onDecrement }) => {
    const isDisabled = totalCaracteristiques >= maxCaracteristiques;
    return (
      <div
        style={{
          width: "100px",
          height: "90px",
          backgroundColor: "black",
          color: "white",
          borderRadius: "10px",
          textAlign: "center",
          margin: "5px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ padding: "5px 0", fontWeight: "bold" }}>{label}</div>
        <div style={{ display: "flex", borderTop: "1px solid white" }}>
          <button
            onClick={onDecrement}
            style={{
              flex: 1,
              background: "none",
              color: "white",
              border: "none",
              fontSize: "16px",
              padding: "6px 0",
              cursor: "pointer",
            }}
            aria-label={`Diminuer ${label}`}
          >
            –
          </button>
          <div
            style={{
              flex: 1,
              borderLeft: "1px solid white",
              borderRight: "1px solid white",
              padding: "6px 0",
              fontWeight: "bold",
            }}
            aria-live="polite"
          >
            {value}
          </div>
          <button
            onClick={onIncrement}
            disabled={isDisabled}
            style={{
              flex: 1,
              background: "none",
              color: isDisabled ? "gray" : "white",
              border: "none",
              fontSize: "16px",
              padding: "6px 0",
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            aria-label={`Augmenter ${label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          border: "1px solid #000",
          width: "500px",
          height: "auto",
        }}
      >
        <div
          style={{
            borderRight: "1px solid #000",
            borderBottom: "1px solid #000",
            padding: "10px",
          }}
        >
          <p>
            <strong>Indice de recherche :</strong> criminel
          </p>
        </div>

        <div
          style={{
            borderBottom: "1px solid #000",
            padding: "10px",
          }}
        >
          <p>
            <strong>Poids porté :</strong> 70/80
          </p>
        </div>

        <div
          style={{
            borderRight: "1px solid #000",
            padding: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <h2>Vous êtes niveau : {level}</h2>
          <p>
            Total caractéristiques : {totalCaracteristiques} /{" "}
            {maxCaracteristiques}
          </p>
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

        <div style={{ padding: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <p>
              PV : {pv}/{maxPv}
            </p>
            <button onClick={() => setPv((prev) => Math.max((Number(prev) || 0) - 1, 0))}>
              - PV
            </button>
            <button
              onClick={() =>
                setPv((prev) =>
                  Math.min((Number(prev) || 0) + 1, maxPv)
                )
              }
            >
              + PV
            </button>
          </div>

          <div>
            <p>
              PE : {pe}/{maxPe}
            </p>
            <button onClick={() => setPe((prev) => Math.max((Number(prev) || 0) - 1, 0))}>
              - PE
            </button>
            <button
              onClick={() =>
                setPe((prev) =>
                  Math.min((Number(prev) || 0) + 1, maxPe)
                )
              }
            >
              + PE
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
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
