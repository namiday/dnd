import React from "react";

const PnjObjectForm = ({ obj, index, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsed = type === "number" ? parseFloat(value) || 0 : value;
    onChange(index, { ...obj, [name]: parsed });
  };

  return (
    <div className="border p-2 rounded bg-white mb-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          name="nom"
          value={obj.nom || ""}
          onChange={handleChange}
          placeholder="Nom"
          className="border p-1 rounded"
        />
        <input
          name="pr"
          type="number"
          value={obj.pr ?? 0}
          onChange={handleChange}
          placeholder="PR"
          className="border p-1 rounded"
        />
        <input
          name="dgt"
          type="number"
          value={obj.dgt ?? 0}
          onChange={handleChange}
          placeholder="DGT"
          className="border p-1 rounded"
        />
        <input
          name="pde"
          type="number"
          value={obj.pde ?? 0}
          onChange={handleChange}
          placeholder="PDE"
          className="border p-1 rounded"
        />
        <select
          name="qualite"
          value={obj.qualite || ""}
          onChange={handleChange}
          className="border p-1 rounded"
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
      </div>
      <button
        onClick={() => onRemove(index)}
        className="mt-2 text-sm text-red-500 underline"
        type="button"
      >
        Supprimer objet
      </button>
    </div>
  );
};

export default PnjObjectForm;
