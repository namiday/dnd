import React, { useState } from "react";
import PnjObjectForm from "./PnjObjectForm";

const PnjForm = ({ pnj, index, onChange, onRemove }) => {
  const [objects, setObjects] = useState(pnj.objects || []);

  const handleFieldChange = (e) => {
    const { name, value, type } = e.target;
    const parsed = type === "number" ? parseFloat(value) || 0 : value;
    onChange(index, { ...pnj, [name]: parsed, objects });
  };

  const handleObjectChange = (objIndex, updatedObj) => {
    const newObjects = [...objects];
    newObjects[objIndex] = updatedObj;
    setObjects(newObjects);
    onChange(index, { ...pnj, objects: newObjects });
  };

  const handleAddObject = () => {
    const updated = [...objects, { nom: "", pr: 0, dgt: 0, pde: 0, qualite: "" }];
    setObjects(updated);
    onChange(index, { ...pnj, objects: updated });
  };

  const handleRemoveObject = (objIndex) => {
    const updated = objects.filter((_, i) => i !== objIndex);
    setObjects(updated);
    onChange(index, { ...pnj, objects: updated });
  };

  return (
    <div className="border p-4 rounded shadow mb-6 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <input name="nom" value={pnj.nom || ""} onChange={handleFieldChange} placeholder="Nom" className="border p-2 rounded" />
        <input name="niveau" type="number" value={pnj.niveau ?? 0} onChange={handleFieldChange} placeholder="Niveau" className="border p-2 rounded" />
        <input name="pv_min" type="number" value={pnj.pv_min ?? 0} onChange={handleFieldChange} placeholder="PV min" className="border p-2 rounded" />
        <input name="pv_max" type="number" value={pnj.pv_max ?? 0} onChange={handleFieldChange} placeholder="PV max" className="border p-2 rounded" />
        <input name="pe_min" type="number" value={pnj.pe_min ?? 0} onChange={handleFieldChange} placeholder="PE min" className="border p-2 rounded" />
        <input name="pe_max" type="number" value={pnj.pe_max ?? 0} onChange={handleFieldChange} placeholder="PE max" className="border p-2 rounded" />
        <input name="attaque_nom" value={pnj.attaque_nom || ""} onChange={handleFieldChange} placeholder="Nom attaque" className="border p-2 rounded" />
        <input name="attaque_val" type="number" value={pnj.attaque_val ?? 0} onChange={handleFieldChange} placeholder="Valeur attaque" className="border p-2 rounded" />
        <input name="defense_nom" value={pnj.defense_nom || ""} onChange={handleFieldChange} placeholder="Nom défense" className="border p-2 rounded" />
        <input name="defense_val" type="number" value={pnj.defense_val ?? 0} onChange={handleFieldChange} placeholder="Valeur défense" className="border p-2 rounded" />
        <input name="volonte_nom" value={pnj.volonte_nom || ""} onChange={handleFieldChange} placeholder="Nom volonté" className="border p-2 rounded" />
        <input name="volonte_val" type="number" value={pnj.volonte_val ?? 0} onChange={handleFieldChange} placeholder="Valeur volonté" className="border p-2 rounded" />
        <input name="special_nom" value={pnj.special_nom || ""} onChange={handleFieldChange} placeholder="Nom spécial" className="border p-2 rounded" />
        <input name="special_val" type="number" value={pnj.special_val ?? 0} onChange={handleFieldChange} placeholder="Valeur spécial" className="border p-2 rounded" />
        <input name="xp_min" type="number" value={pnj.xp_min ?? 0} onChange={handleFieldChange} placeholder="XP min" className="border p-2 rounded" />
        <input name="xp_max" type="number" value={pnj.xp_max ?? 0} onChange={handleFieldChange} placeholder="XP max" className="border p-2 rounded" />
      </div>

      <textarea name="description" value={pnj.description || ""} onChange={handleFieldChange} placeholder="Description" className="border mt-4 w-full p-2 rounded" />
      <input name="forces" value={pnj.forces || ""} onChange={handleFieldChange} placeholder="Forces" className="border mt-2 w-full p-2 rounded" />
      <input name="faiblesses" value={pnj.faiblesses || ""} onChange={handleFieldChange} placeholder="Faiblesses" className="border mt-2 w-full p-2 rounded" />

      {/* Objets simplifiés */}
      <div className="mt-4">
        <h4 className="font-semibold">Objets</h4>
        {objects.map((obj, i) => (
          <PnjObjectForm key={i} index={i} obj={obj} onChange={handleObjectChange} onRemove={handleRemoveObject} />
        ))}
        <button
          type="button"
          onClick={handleAddObject}
          className="mt-2 text-sm text-blue-600 underline"
        >
          Ajouter un objet
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
      >
        Supprimer le PNJ
      </button>
    </div>
  );
};

export default PnjForm;
