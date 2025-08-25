// src/Components/Character/PnjFamiliers/PnjsTab.js
import React, { useEffect, useRef, useState } from "react";

const LS_KEY = "character_familiers";

const EMPTY_OBJET = { nom: "", PR: "", DGT: "", PDE: "", qualite: "" };

const EMPTY_PNJ = {
  nom: "",
  niveau: 0,
  pvMin: 0,
  pvMax: 0,
  peMin: 0,
  peMax: 0,
  nomAttaque: "",
  valAttaque: 0,
  nomDefense: "",
  valDefense: 0,
  nomVolonte: "",
  valVolonte: 0,
  nomSpecial: "",
  valSpecial: 0,
  xpMin: 0,
  xpMax: 0,
  description: "",
  forces: "",
  faiblesses: "",
  objets: [],
};

const num = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

function PnjsTab() {
  // 1) Hydrate once from LocalStorage at first render
  const [familiers, setFamiliers] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      const arr = Array.isArray(v) ? v : [];
      console.log("📥 Chargement familiers:", arr);
      return arr;
    } catch {
      console.log("📥 Chargement familiers: []");
      return [];
    }
  });

  // 2) Save to LS on change, but skip the very first run (prevents nuking imported data)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(familiers));
      console.log("💾 Sauvegarde familiers:", familiers);
    } catch (e) {
      console.error("Erreur sauvegarde familiers:", e);
    }
  }, [familiers]);

  // --- PNJ helpers ---
  const addFamilier = () => setFamiliers((prev) => [...prev, { ...EMPTY_PNJ }]);
  const removeFamilier = (i) =>
    setFamiliers((prev) => prev.filter((_, idx) => idx !== i));
  const updateFamilier = (i, field, value) =>
    setFamiliers((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f))
    );

  // --- Objet helpers (nested inside a PNJ) ---
  const addObjet = (fi) =>
    setFamiliers((prev) =>
      prev.map((f, idx) => (idx === fi ? { ...f, objets: [...(f.objets || []), { ...EMPTY_OBJET }] } : f))
    );

  const removeObjet = (fi, oi) =>
    setFamiliers((prev) =>
      prev.map((f, idx) => {
        if (idx !== fi) return f;
        const next = [...(f.objets || [])].filter((_, j) => j !== oi);
        return { ...f, objets: next };
      })
    );

  const updateObjet = (fi, oi, field, value) =>
    setFamiliers((prev) =>
      prev.map((f, idx) => {
        if (idx !== fi) return f;
        const list = [...(f.objets || [])];
        list[oi] = { ...list[oi], [field]: value };
        return { ...f, objets: list };
      })
    );

  // --- UI ---
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">PNJ / Familiers</h2>
        <button
          onClick={addFamilier}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
        >
          ➕ Ajouter un PNJ / Familier
        </button>
      </div>

      {familiers.length === 0 ? (
        <p className="text-sm opacity-70">Aucun PNJ/Familier pour l’instant.</p>
      ) : (
        <div className="space-y-6">
          {familiers.map((f, i) => (
            <div key={i} className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {f.nom ? f.nom : "PNJ/Familier sans nom"}
                  {typeof f.niveau === "number" ? ` — Nv ${f.niveau}` : ""}
                </h3>
                <button
                  onClick={() => removeFamilier(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  title="Supprimer ce PNJ"
                >
                  🗑️
                </button>
              </div>

              {/* Ligne 1: identifiants + jauges */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-3">
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Nom"
                  value={f.nom || ""}
                  onChange={(e) => updateFamilier(i, "nom", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Niveau"
                  value={f.niveau ?? 0}
                  onChange={(e) => updateFamilier(i, "niveau", num(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="PV min"
                  value={f.pvMin ?? 0}
                  onChange={(e) => updateFamilier(i, "pvMin", num(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="PV max"
                  value={f.pvMax ?? 0}
                  onChange={(e) => updateFamilier(i, "pvMax", num(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="PE min"
                  value={f.peMin ?? 0}
                  onChange={(e) => updateFamilier(i, "peMin", num(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="PE max"
                  value={f.peMax ?? 0}
                  onChange={(e) => updateFamilier(i, "peMax", num(e.target.value))}
                />
              </div>

              {/* Ligne 2: Attaque/Défense/Volonté/Spécial */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-2 mt-2">
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Nom Attaque"
                  value={f.nomAttaque || ""}
                  onChange={(e) => updateFamilier(i, "nomAttaque", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Val Attaque"
                  value={f.valAttaque ?? 0}
                  onChange={(e) => updateFamilier(i, "valAttaque", num(e.target.value))}
                />

                <input
                  className="border rounded px-2 py-1"
                  placeholder="Nom Défense"
                  value={f.nomDefense || ""}
                  onChange={(e) => updateFamilier(i, "nomDefense", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Val Défense"
                  value={f.valDefense ?? 0}
                  onChange={(e) => updateFamilier(i, "valDefense", num(e.target.value))}
                />

                <input
                  className="border rounded px-2 py-1"
                  placeholder="Nom Volonté"
                  value={f.nomVolonte || ""}
                  onChange={(e) => updateFamilier(i, "nomVolonte", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Val Volonté"
                  value={f.valVolonte ?? 0}
                  onChange={(e) => updateFamilier(i, "valVolonte", num(e.target.value))}
                />

                <input
                  className="border rounded px-2 py-1"
                  placeholder="Nom Spécial"
                  value={f.nomSpecial || ""}
                  onChange={(e) => updateFamilier(i, "nomSpecial", e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="Val Spécial"
                  value={f.valSpecial ?? 0}
                  onChange={(e) => updateFamilier(i, "valSpecial", num(e.target.value))}
                />
              </div>

              {/* Ligne 3: XP + meta */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="XP min"
                  value={f.xpMin ?? 0}
                  onChange={(e) => updateFamilier(i, "xpMin", num(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="XP max"
                  value={f.xpMax ?? 0}
                  onChange={(e) => updateFamilier(i, "xpMax", num(e.target.value))}
                />
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Forces"
                  value={f.forces || ""}
                  onChange={(e) => updateFamilier(i, "forces", e.target.value)}
                />
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Faiblesses"
                  value={f.faiblesses || ""}
                  onChange={(e) => updateFamilier(i, "faiblesses", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mt-2">
                <textarea
                  className="w-full border rounded px-2 py-1 min-h-[70px]"
                  placeholder="Description"
                  value={f.description || ""}
                  onChange={(e) => updateFamilier(i, "description", e.target.value)}
                />
              </div>

              {/* Objets du PNJ */}
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Objets</h4>
                  <button
                    onClick={() => addObjet(i)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    ➕ Ajouter un objet
                  </button>
                </div>

                {(!f.objets || f.objets.length === 0) ? (
                  <p className="text-sm opacity-70 mt-1">Aucun objet.</p>
                ) : (
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Nom</th>
                          <th className="border px-2 py-1">PR</th>
                          <th className="border px-2 py-1">DGT</th>
                          <th className="border px-2 py-1">PDE</th>
                          <th className="border px-2 py-1">Qualité</th>
                          <th className="border px-2 py-1">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {f.objets.map((o, oi) => (
                          <tr key={oi} className="odd:bg-white even:bg-gray-50">
                            <td className="border px-2 py-1">
                              <input
                                className="w-40 border rounded px-2 py-1"
                                value={o.nom || ""}
                                onChange={(e) => updateObjet(i, oi, "nom", e.target.value)}
                                placeholder="Nom"
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <input
                                className="w-24 border rounded px-2 py-1"
                                value={o.PR || ""}
                                onChange={(e) => updateObjet(i, oi, "PR", e.target.value)}
                                placeholder="PR"
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <input
                                className="w-24 border rounded px-2 py-1"
                                value={o.DGT || ""}
                                onChange={(e) => updateObjet(i, oi, "DGT", e.target.value)}
                                placeholder="DGT"
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <input
                                className="w-24 border rounded px-2 py-1"
                                value={o.PDE || ""}
                                onChange={(e) => updateObjet(i, oi, "PDE", e.target.value)}
                                placeholder="PDE"
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <input
                                className="w-28 border rounded px-2 py-1"
                                value={o.qualite || ""}
                                onChange={(e) => updateObjet(i, oi, "qualite", e.target.value)}
                                placeholder="Qualité"
                              />
                            </td>
                            <td className="border px-2 py-1 text-right">
                              <button
                                onClick={() => removeObjet(i, oi)}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                title="Supprimer l'objet"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PnjsTab;
