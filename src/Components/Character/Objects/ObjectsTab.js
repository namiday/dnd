// src/Components/Character/Objects/ObjectsTab.js
import React, { useEffect, useRef, useMemo, useState } from "react";

const LS_KEY = "character_objects";

const CATEGORIES = ["Armes", "Véhicules", "Outils", "Artefacts"];
const QUALITES = ["faible", "basique", "bonne", "excellente", "parlante", "magique", "divine"];

const EMPTY_OBJECT = {
  nom: "",
  PR: "",
  DGT: "",
  PDE: "",
  reservoir: "",
  prix_plein: "",
  nb_km: "",
  qualite: "",
  prix: "",
  poids: "",
  type_objet: "",
  type_minerai: "",
  qte_minerai: "",
  bonus: "",
  malus: "",
  categorie: "",
};

function ObjectsTab() {
  const [objects, setObjects] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      const arr = Array.isArray(v) ? v : [];
      console.log("📥 Chargement objets:", arr);
      return arr;
    } catch {
      console.log("📥 Chargement objets: []");
      return [];
    }
  });

  const [categoryFilter, setCategoryFilter] = useState("Tous");

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(objects));
      console.log("💾 Sauvegarde objets:", objects);
      // <-- notify other components (CharacterSheet) to recompute weight
      window.dispatchEvent(new Event("character_objects_updated"));
    } catch (e) {
      console.error("Erreur sauvegarde objets:", e);
    }
  }, [objects]);

  const visibleIdxs = useMemo(() => {
    return objects
      .map((o, idx) => ({ o, idx }))
      .filter(({ o }) => categoryFilter === "Tous" || (o?.categorie || "") === categoryFilter)
      .map(({ idx }) => idx);
  }, [objects, categoryFilter]);

  const addObject = () => { setObjects((prev) => [...prev, { ...EMPTY_OBJECT }]); };
  const removeObject = (index) => { setObjects((prev) => prev.filter((_, i) => i !== index)); };
  const updateObject = (index, field, value) => {
    setObjects((prev) => prev.map((o, i) => (i === index ? { ...o, [field]: value } : o)));
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Objets</h2>

        <div className="flex items-center gap-2">
          <label className="text-sm">Catégorie :</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="Tous">Tous</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={addObject}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
          >
            ➕ Ajouter un objet
          </button>
        </div>
      </div>

      {objects.length === 0 ? (
        <p className="text-sm opacity-70">Aucun objet pour l’instant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Nom</th>
                <th className="border px-2 py-1">PR</th>
                <th className="border px-2 py-1">DGT</th>
                <th className="border px-2 py-1">PDE</th>
                <th className="border px-2 py-1">Réservoir</th>
                <th className="border px-2 py-1">Plein</th>
                <th className="border px-2 py-1">Km</th>
                <th className="border px-2 py-1">Qualité</th>
                <th className="border px-2 py-1">Prix</th>
                <th className="border px-2 py-1">Poids</th>
                <th className="border px-2 py-1">Type d'objet</th>
                <th className="border px-2 py-1">Minerai</th>
                <th className="border px-2 py-1">QtéMinerai</th>
                <th className="border px-2 py-1">Bonus</th>
                <th className="border px-2 py-1">Malus</th>
                <th className="border px-2 py-1">Catégorie</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleIdxs.map((idx) => {
                const o = objects[idx] || {};
                return (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-2 py-1">
                      <input
                        className="w-40 border rounded px-2 py-1"
                        value={o.nom || ""}
                        onChange={(e) => updateObject(idx, "nom", e.target.value)}
                        placeholder="Nom"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-20 border rounded px-2 py-1"
                        value={o.PR || ""}
                        onChange={(e) => updateObject(idx, "PR", e.target.value)}
                        placeholder="PR"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-24 border rounded px-2 py-1"
                        value={o.DGT || ""}
                        onChange={(e) => updateObject(idx, "DGT", e.target.value)}
                        placeholder="DGT"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-24 border rounded px-2 py-1"
                        value={o.PDE || ""}
                        onChange={(e) => updateObject(idx, "PDE", e.target.value)}
                        placeholder="PDE"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-28 border rounded px-2 py-1"
                        value={o.reservoir || ""}
                        onChange={(e) => updateObject(idx, "reservoir", e.target.value)}
                        placeholder="Réservoir"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-24 border rounded px-2 py-1"
                        value={o.prix_plein || ""}
                        onChange={(e) => updateObject(idx, "prix_plein", e.target.value)}
                        placeholder="Plein"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-20 border rounded px-2 py-1"
                        value={o.nb_km || ""}
                        onChange={(e) => updateObject(idx, "nb_km", e.target.value)}
                        placeholder="Km"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="w-36 border rounded px-2 py-1"
                        value={o.qualite || ""}
                        onChange={(e) => updateObject(idx, "qualite", e.target.value)}
                      >
                        <option value="">—</option>
                        {["faible","basique","bonne","excellente","parlante","magique","divine"].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-24 border rounded px-2 py-1"
                        value={o.prix || ""}
                        onChange={(e) => updateObject(idx, "prix", e.target.value)}
                        placeholder="Prix"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-20 border rounded px-2 py-1"
                        value={o.poids || ""}
                        onChange={(e) => updateObject(idx, "poids", e.target.value)}
                        placeholder="Poids"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-36 border rounded px-2 py-1"
                        value={o.type_objet || ""}
                        onChange={(e) => updateObject(idx, "type_objet", e.target.value)}
                        placeholder="Type d'objet"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-28 border rounded px-2 py-1"
                        value={o.type_minerai || ""}
                        onChange={(e) => updateObject(idx, "type_minerai", e.target.value)}
                        placeholder="Minerai"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-24 border rounded px-2 py-1"
                        value={o.qte_minerai || ""}
                        onChange={(e) => updateObject(idx, "qte_minerai", e.target.value)}
                        placeholder="QtéMinerai"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-28 border rounded px-2 py-1"
                        value={o.bonus || ""}
                        onChange={(e) => updateObject(idx, "bonus", e.target.value)}
                        placeholder="Bonus"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        className="w-28 border rounded px-2 py-1"
                        value={o.malus || ""}
                        onChange={(e) => updateObject(idx, "malus", e.target.value)}
                        placeholder="Malus"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        className="w-36 border rounded px-2 py-1"
                        value={o.categorie || ""}
                        onChange={(e) => updateObject(idx, "categorie", e.target.value)}
                      >
                        <option value="">—</option>
                        {["Armes", "Véhicules", "Outils", "Artefacts"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-1 text-right">
                      <button
                        onClick={() => removeObject(idx)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ObjectsTab;
