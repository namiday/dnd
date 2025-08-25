import { useState, useEffect } from "react";

export default function XpProgressCircle({ level, setLevel }) {
  // Per-level XP thresholds (amount needed to go from this level to the next)
  const xpThresholds = [
    700, 2100, 4900, 13300, 17500, 25400, 31500, 38500, 55300,
    63700, 72100, 80500, 88900, 111300, 122500, 133700, 144900,
    158900, 186900,
  ];

  const [xp, setXp] = useState(0);
  const [customXp, setCustomXp] = useState(0);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Faible");
  const [selectedDiceNumber, setSelectedDiceNumber] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState("réussite");
  const [xpGainResult, setXpGainResult] = useState(null);

  // ---------- Helpers ----------
  const parseNum = (v) => {
    if (v === null || v === undefined) return 0;
    const n = Number(String(v).trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const readXPFromLS = () => {
    // canonical
    try {
      const raw = localStorage.getItem("character_xp");
      if (raw != null) {
        try {
          const n = Number(JSON.parse(raw));
          if (Number.isFinite(n)) return n;
        } catch {
          const n = Number(raw);
          if (Number.isFinite(n)) return n;
        }
      }
    } catch {}
    // fallback in general info
    try {
      const gi = JSON.parse(localStorage.getItem("character_generalInfo") || "{}");
      const cands = [gi?.XP, gi?.xp, gi?.experience, gi?.exp];
      for (const c of cands) {
        const n = Number(c);
        if (Number.isFinite(n)) return n;
      }
    } catch {}
    return 0;
  };

  const writeXPToLS = (val) => {
    try {
      localStorage.setItem("character_xp", JSON.stringify(val));
      // mirror into general info (handy for export/readability)
      const gi = JSON.parse(localStorage.getItem("character_generalInfo") || "{}");
      gi.XP = val;
      localStorage.setItem("character_generalInfo", JSON.stringify(gi));
    } catch {}
    // notify listeners (e.g., other widgets)
    try {
      window.dispatchEvent(new Event("character_xp_updated"));
    } catch {}
  };

  const writeLevelToLS = (lvl) => {
    try {
      localStorage.setItem("character_level", JSON.stringify(lvl));
    } catch {}
  };

  // ---------- Hydrate XP on mount ----------
  useEffect(() => {
    const storedXp = readXPFromLS();
    setXp(parseNum(storedXp));
  }, []);

  // ---------- Derived values for the ring ----------
  const effectiveLevel = Math.max(1, parseNum(level) || 1);
  const currentThreshold =
    xpThresholds[Math.min(effectiveLevel - 1, xpThresholds.length - 1)] ??
    xpThresholds[0];

  const progress = Math.min(parseNum(xp) / currentThreshold, 1);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // ---------- XP logic ----------
  const addXp = (amount) => {
    const add = parseNum(amount);
    if (add <= 0) return;

    let newXp = parseNum(xp) + add;
    let newLevel = effectiveLevel;
    let leveledUp = false;

    // Loop over thresholds while we can level up
    while (newLevel - 1 < xpThresholds.length && newXp >= xpThresholds[newLevel - 1]) {
      newXp -= xpThresholds[newLevel - 1];
      newLevel += 1;
      leveledUp = true;
    }

    if (leveledUp) {
      setLevelUpFlash(true);
    }

    // Persist + update state
    setLevel(newLevel);
    setXp(newXp);
    writeLevelToLS(newLevel);
    writeXPToLS(newXp);
  };

  useEffect(() => {
    if (levelUpFlash) {
      const timer = setTimeout(() => setLevelUpFlash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [levelUpFlash]);

  const handleAddXp = () => addXp(500);

  const handleCustomXpAdd = () => {
    const value = parseInt(customXp, 10);
    if (!isNaN(value) && value > 0) {
      addXp(value);
      setCustomXp(0);
    }
  };

  const handleDifficultyXpAdd = () => {
    const xpMatrix = {
      Faible: {
        "échec critique": 300,
        "échec": 500,
        "réussite": 700,
        "réussite critique": 1000,
      },
      Moyenne: {
        "échec critique": 600,
        "échec": 1000,
        "réussite": 1400,
        "réussite critique": 2100,
      },
      Difficile: {
        "échec critique": 900,
        "échec": 1400,
        "réussite": 2100,
        "réussite critique": 2800,
      },
      Trop_Difficile: {
        "échec critique": 1200,
        "échec": 2100,
        "réussite": 3500,
        "réussite critique": 3900,
      },
      Hors_Normes: {
        "échec critique": 1400,
        "échec": 3500,
        "réussite": 4200,
        "réussite critique": 4800,
      },
      Invraissemblable: {
        "échec critique": 2100,
        "échec": 4200,
        "réussite": 5600,
        "réussite critique": 6200,
      },
      Impossible: {
        "échec critique": 2800,
        "échec": 5600,
        "réussite": 7000,
        "réussite critique": 8000,
      },
    };

    const base = xpMatrix[selectedDifficulty]?.[selectedOutcome] || 0;

    let diceTotal = 0;
    const diceRolls = [];
    for (let i = 0; i < selectedDiceNumber; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      diceRolls.push(roll);
      diceTotal += roll;
    }

    const totalXp = base * diceTotal;
    addXp(totalXp);
    setXpGainResult(
      `+${totalXp} XP (base: ${base} × dés: ${diceRolls.join(" + ")} = ${diceTotal})`
    );
    setShowDifficultySelector(false);
  };

  // ---------- UI ----------
  return (
    <div className="flex flex-col items-center space-y-4 relative">
      {levelUpFlash && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-wrap items-center justify-center pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce opacity-90"
              style={{
                position: "absolute",
                top: `${50 + Math.random() * 20 - 10}%`,
                left: `${50 + Math.random() * 20 - 10}%`,
                animationDuration: `${0.4 + Math.random() * 0.6}s`,
                transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="black"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="green"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="45%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          Niveau {effectiveLevel}
        </text>
        <text
          x="50%"
          y="60%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="12"
        >
          {parseNum(xp)} / {currentThreshold} XP
        </text>
      </svg>

      <button
        onClick={handleAddXp}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter XP
      </button>

      <div className="flex space-x-2">
        <input
          type="number"
          value={customXp}
          onChange={(e) => setCustomXp(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300"
          placeholder="XP à ajouter"
        />
        <button
          onClick={handleCustomXpAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        >
          Ajouter
        </button>
      </div>

      <button
        onClick={() => setShowDifficultySelector(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Calculer votre XP
      </button>

      {xpGainResult && (
        <div className="text-green-600 font-semibold">{xpGainResult}</div>
      )}

      {showDifficultySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="font-bold text-lg text-black mb-4">
              Choisissez la difficulté :
            </h3>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded w-full mb-4"
            >
              <option value="Faible">Faible</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Difficile">Difficile</option>
              <option value="Trop_Difficile">Trop difficile</option>
              <option value="Hors_Normes">Hors normes</option>
              <option value="Invraissemblable">Invraissemblable</option>
              <option value="Impossible">Impossible</option>
            </select>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded w-full mb-4"
            >
              <option value="échec critique">échec critique</option>
              <option value="échec">échec</option>
              <option value="réussite">réussite</option>
              <option value="réussite critique">réussite critique</option>
            </select>
            <select
              value={selectedDiceNumber}
              onChange={(e) => setSelectedDiceNumber(parseInt(e.target.value))}
              className="border border-gray-300 px-2 py-1 rounded w-full mb-4"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button
              onClick={handleDifficultyXpAdd}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
            >
              Ajouter votre XP
            </button>
            <button
              onClick={() => setShowDifficultySelector(false)}
              className="text-sm text-gray-600 hover:underline w-full text-center"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
