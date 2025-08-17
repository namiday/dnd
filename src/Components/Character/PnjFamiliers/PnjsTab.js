// Components/Character/PnjFamiliers/PnjsTab.js

import React, { useState, useEffect, useRef } from "react";
import PnjForm from "./PnjForm";

const LOCAL_STORAGE_KEY = "character_familiers";

const PnjsTab = () => {
  const [familiers, setFamiliers] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const storedFamiliers = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (storedFamiliers) {
        const parsed = JSON.parse(storedFamiliers);
        console.log("📥 Chargement familiers:", parsed);
        setFamiliers(parsed);
      }
    } catch (e) {
      console.error("Erreur de parsing familiers:", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("💾 Sauvegarde familiers:", familiers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(familiers));
  }, [familiers]);

  const handleChange = (index, updatedPnj) => {
    const newList = [...familiers];
    newList[index] = updatedPnj;
    setFamiliers(newList);
  };

  const handleAdd = () => {
    setFamiliers([...familiers, {}]);
  };

  const handleRemove = (index) => {
    const newList = familiers.filter((_, i) => i !== index);
    setFamiliers(newList);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">PNJ / Familiers</h2>
      {familiers.map((pnj, index) => (
        <PnjForm
          key={index}
          index={index}
          pnj={pnj}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Ajouter un PNJ / Familier
      </button>
    </div>
  );
};

export default PnjsTab;
