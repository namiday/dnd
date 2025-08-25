// src/Components/Character/Skills/SkillTabs.js
import React, { useEffect, useRef, useState } from "react";

const LS_KEY = "character_skills";

const EMPTY_SKILL = {
  nom: "",
  info: "",
  carac1: "",
  carac2: "",
  part1: "",
  part1_uses: 0,
  part1_bonus: 0,
  part2: "",
  part2_uses: 0,
  part2_bonus: 0,
};

function SkillTabs() {
  // 1) Hydrate once from LocalStorage at first render
  const [skills, setSkills] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      const arr = Array.isArray(v) ? v : [];
      console.log("📥 Chargement initial depuis localStorage :", arr);
      return arr;
    } catch {
      console.log("📥 Chargement initial depuis localStorage : []");
      return [];
    }
  });

  // 2) Save to LS on change, but skip the very first run (prevents nuking imported data)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(skills));
      console.log("💾 Sauvegarde skills :", skills);
    } catch (e) {
      console.error("Erreur sauvegarde skills:", e);
    }
  }, [skills]);

  // --- Helpers ---
  const addSkill = () => {
    setSkills((prev) => [...prev, { ...EMPTY_SKILL }]);
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSkill = (index, field, value) => {
    setSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const numberInput = (v) => {
    if (v === "" || v === null || v === undefined) return 0;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const caracSuggestions = [
    "attaque", "dexterite", "constitution", "intelligence", "sagesse", "charisme",
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Compétences</h2>
        <button
          onClick={addSkill}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
        >
          ➕ Ajouter une compétence
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm opacity-70">Aucune compétence pour l’instant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Nom</th>
                <th className="border px-2 py-1">Info</th>
                <th className="border px-2 py-1">Carac1</th>
                <th className="border px-2 py-1">Carac2</th>
                <th className="border px-2 py-1">Part1</th>
                <th className="border px-2 py-1">Uses1</th>
                <th className="border px-2 py-1">Bonus1</th>
                <th className="border px-2 py-1">Part2</th>
                <th className="border px-2 py-1">Uses2</th>
                <th className="border px-2 py-1">Bonus2</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={s.nom || ""}
                      onChange={(e) => updateSkill(idx, "nom", e.target.value)}
                      placeholder="Nom"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={s.info || ""}
                      onChange={(e) => updateSkill(idx, "info", e.target.value)}
                      placeholder="Info"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      list="carac-list"
                      className="w-full border rounded px-2 py-1"
                      value={s.carac1 || ""}
                      onChange={(e) => updateSkill(idx, "carac1", e.target.value)}
                      placeholder="Carac1"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      list="carac-list"
                      className="w-full border rounded px-2 py-1"
                      value={s.carac2 || ""}
                      onChange={(e) => updateSkill(idx, "carac2", e.target.value)}
                      placeholder="Carac2"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={s.part1 || ""}
                      onChange={(e) => updateSkill(idx, "part1", e.target.value)}
                      placeholder="Part1"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-24 border rounded px-2 py-1"
                      value={s.part1_uses ?? 0}
                      onChange={(e) =>
                        updateSkill(idx, "part1_uses", numberInput(e.target.value))
                      }
                      placeholder="Uses1"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-24 border rounded px-2 py-1"
                      value={s.part1_bonus ?? 0}
                      onChange={(e) =>
                        updateSkill(idx, "part1_bonus", numberInput(e.target.value))
                      }
                      placeholder="Bonus1"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={s.part2 || ""}
                      onChange={(e) => updateSkill(idx, "part2", e.target.value)}
                      placeholder="Part2"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-24 border rounded px-2 py-1"
                      value={s.part2_uses ?? 0}
                      onChange={(e) =>
                        updateSkill(idx, "part2_uses", numberInput(e.target.value))
                      }
                      placeholder="Uses2"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-24 border rounded px-2 py-1"
                      value={s.part2_bonus ?? 0}
                      onChange={(e) =>
                        updateSkill(idx, "part2_bonus", numberInput(e.target.value))
                      }
                      placeholder="Bonus2"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <button
                      onClick={() => removeSkill(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Datalist for convenience (no constraint) */}
          <datalist id="carac-list">
            {caracSuggestions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      )}
    </div>
  );
}

export default SkillTabs;
