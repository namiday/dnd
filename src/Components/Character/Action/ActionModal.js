import React, { useState } from 'react';

const ActionModal = ({ onClose, characteristics, skills, objects }) => {
  const [actionType, setActionType] = useState('attaque');
  const [selectedSkills, setSelectedSkills] = useState(["", ""]);
  const [selectedObjects, setSelectedObjects] = useState(["", "", ""]);
  const [result, setResult] = useState(null);

  const rollDice = () => Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);

  const handleSubmit = () => {
    const dice = rollDice();

    if (dice === 2) {
      setResult("🎲 Échec critique !");
      return;
    }

    if (dice === 12) {
      setResult("🎲 Succès critique !");
      return;
    }

    const base = dice;
    const carac = characteristics[actionType] || 0;

    const skillBonus = selectedSkills.reduce((sum, name) => {
      const skill = skills.find((s) => s.nom === name);
      return sum + (parseInt(skill?.part1_bonus || 0) || 0) + (parseInt(skill?.part2_bonus || 0) || 0);
    }, 0);

    const objectBonus = selectedObjects.reduce((sum, name) => {
      const obj = objects.find((o) => o.nom === name);
      return sum + (parseInt(obj?.PR || 0) || 0);
    }, 0);

    const total = base + carac + skillBonus + objectBonus;

    setResult(`🎲 Jet: ${base} | 🧠 Carac: ${carac} | 📘 Comp: ${skillBonus} | 🛡️ Obj: ${objectBonus} → ✅ Score final: ${total}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Effectuer une action</h2>

        {/* Type d'action */}
        <label className="block mb-4">
          Type d’action :
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="border p-2 w-full mt-1"
          >
            <option value="attaque">Attaque</option>
            <option value="defense">Défense</option>
            <option value="volonte">Volonté</option>
          </select>
        </label>

        {/* Sélection compétences */}
        <div className="mb-4">
          <p className="mb-1">Compétences (2 maximum) :</p>
          {[0, 1].map((i) => (
            <select
              key={i}
              value={selectedSkills[i]}
              onChange={(e) => {
                const newSkills = [...selectedSkills];
                newSkills[i] = e.target.value;
                setSelectedSkills(newSkills);
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">-- Sélectionner --</option>
              {skills.map((s, idx) => (
                <option key={idx} value={s.nom}>{s.nom}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Sélection objets */}
        <div className="mb-4">
          <p className="mb-1">Objets (3 maximum) :</p>
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              value={selectedObjects[i]}
              onChange={(e) => {
                const newObjects = [...selectedObjects];
                newObjects[i] = e.target.value;
                setSelectedObjects(newObjects);
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">-- Sélectionner --</option>
              {objects.map((o, idx) => (
                <option key={idx} value={o.nom}>{o.nom}</option>
              ))}
            </select>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Lancer l’action
        </button>

        {result && (
          <div className="mt-4 p-2 border rounded bg-gray-100 text-center">{result}</div>
        )}
      </div>
    </div>
  );
};

export default ActionModal;
