import React, { useState } from "react";
import PnjForm from "./PnjForm";

const PnjsTab = () => {
  const [pnjs, setPnjs] = useState([]);

  const handlePnjChange = (index, updatedPnj) => {
    const updated = [...pnjs];
    updated[index] = updatedPnj;
    setPnjs(updated);
  };

  const handleAddPnj = () => {
    setPnjs([...pnjs, {}]);
  };

  const handleRemovePnj = (index) => {
    const updated = pnjs.filter((_, i) => i !== index);
    setPnjs(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">PNJ / Familiers</h2>

      {pnjs.map((pnj, index) => (
        <PnjForm
          key={index}
          index={index}
          pnj={pnj}
          onChange={handlePnjChange}
          onRemove={handleRemovePnj}
        />
      ))}

      <button
        type="button"
        onClick={handleAddPnj}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Ajouter un PNJ / Familier
      </button>
    </div>
  );
};

export default PnjsTab;
