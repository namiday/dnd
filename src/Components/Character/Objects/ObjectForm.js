// Components/Character/Objects/ObjectForm.js

import React from "react";

const ObjectForm = ({ object, index, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) || 0 : value;
    onChange(index, { ...object, [name]: parsedValue });
  };

  return (
    <div className="border p-4 rounded shadow mb-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">

        {/* Image et Nom */}
        <input
          name="image"
          value={object.image || ""}
          onChange={handleChange}
          placeholder="Image URL (facultatif)"
          className="border p-2 rounded"
        />
        <input
          name="nom"
          value={object.nom || ""}
          onChange={handleChange}
          placeholder="Nom de l'objet"
          className="border p-2 rounded"
        />

        {/* Catégorie obligatoire */}
        <select
          name="categorie"
          value={object.categorie || ""}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="Armes">Armes</option>
          <option value="Véhicules">Véhicules</option>
          <option value="Outils">Outils</option>
          <option value="Artefacts">Artefacts</option>
        </select>

        {/* Type libre */}
        <input
          name="type"
          value={object.type || ""}
          onChange={handleChange}
          placeholder="Type d'objet"
          className="border p-2 rounded"
        />

        {/* Valeurs techniques */}
        <input name="pr" type="number" value={object.pr ?? 0} onChange={handleChange} placeholder="PR" className="border p-2 rounded" />
        <input name="dgt" type="number" value={object.dgt ?? 0} onChange={handleChange} placeholder="DGT" className="border p-2 rounded" />
        <input name="pde" type="number" value={object.pde ?? 0} onChange={handleChange} placeholder="PDE" className="border p-2 rounded" />
        <input name="reservoir" type="number" value={object.reservoir ?? 0} onChange={handleChange} placeholder="Réservoir" className="border p-2 rounded" />
        <input name="prix_plein" type="number" value={object.prix_plein ?? 0} onChange={handleChange} placeholder="Prix du plein" className="border p-2 rounded" />
        <input name="km" type="number" value={object.km ?? 0} onChange={handleChange} placeholder="Nombre de km" className="border p-2 rounded" />

        {/* Qualité (menu déroulant à 7 niveaux) */}
        <select
          name="qualite"
          value={object.qualite || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Qualité</option>
          <option value="faible">Faible</option>
          <option value="basique">Basique</option>
          <option value="bonne">Bonne</option>
          <option value="excellente">Excellente</option>
          <option value="parlante">Parlante</option>
          <option value="magique">Magique</option>
          <option value="divine">Divine</option>
        </select>

        {/* Finances & matériaux */}
        <input name="prix" type="number" value={object.prix ?? 0} onChange={handleChange} placeholder="Prix" className="border p-2 rounded" />
        <input name="poids" type="number" value={object.poids ?? 0} onChange={handleChange} placeholder="Poids" className="border p-2 rounded" />
        <input name="minerai_type" value={object.minerai_type || ""} onChange={handleChange} placeholder="Type de minerai" className="border p-2 rounded" />
        <input name="minerai_qte" type="number" value={object.minerai_qte ?? 0} onChange={handleChange} placeholder="Quantité de minerai" className="border p-2 rounded" />

        {/* Bonus / Malus */}
        <input name="bonus" value={object.bonus || ""} onChange={handleChange} placeholder="Bonus" className="border p-2 rounded" />
        <input name="malus" value={object.malus || ""} onChange={handleChange} placeholder="Malus" className="border p-2 rounded" />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Supprimer l'objet
      </button>
    </div>
  );
};

export default ObjectForm;
