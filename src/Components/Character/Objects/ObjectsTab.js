// Components/Character/Objects/ObjectsTab.js

import React, { useState } from "react";
import ObjectForm from "./ObjectForm";

const ObjectsTab = () => {
  const [objects, setObjects] = useState([]);
  const [filter, setFilter] = useState("Tous");

  const handleObjectChange = (index, updatedObject) => {
    const updated = [...objects];
    updated[index] = updatedObject;
    setObjects(updated);
  };

  const handleAddObject = () => {
    setObjects([
      ...objects,
      {
        nom: "",
        type: "",
        categorie: "",
        image: "",
        pr: 0,
        dgt: 0,
        pde: 0,
        reservoir: 0,
        prix_plein: 0,
        km: 0,
        qualite: "",
        prix: 0,
        poids: 0,
        minerai_type: "",
        minerai_qte: 0,
        bonus: "",
        malus: "",
      },
    ]);
  };

  const handleRemoveObject = (index) => {
    const updated = objects.filter((_, i) => i !== index);
    setObjects(updated);
  };

  const filteredObjects = filter === "Tous"
    ? objects
    : objects.filter((o) => o.categorie === filter);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Objets</h2>

      {/* Filtre par catégorie */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrer par catégorie :</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Tous">Tous</option>
          <option value="Armes">Armes</option>
          <option value="Véhicules">Véhicules</option>
          <option value="Outils">Outils</option>
          <option value="Artefacts">Artefacts</option>
        </select>
      </div>

      {filteredObjects.map((obj, index) => (
        <ObjectForm
          key={index}
          index={index}
          object={obj}
          onChange={handleObjectChange}
          onRemove={handleRemoveObject}
        />
      ))}

      <button
        type="button"
        onClick={handleAddObject}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Ajouter un objet
      </button>
    </div>
  );
};

export default ObjectsTab;
