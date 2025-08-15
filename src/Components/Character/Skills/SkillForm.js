// Components/Character/Skills/SkillForm.js

import React from "react";

const SkillForm = ({ skill, index, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value, 10) || 0 : value;
    const updatedSkill = { ...skill, [name]: parsedValue };
    onChange(index, updatedSkill);
  };

  const getValue = (field) =>
    skill[field] !== undefined && skill[field] !== null ? skill[field] : "";

  return (
    <div className="border p-4 rounded shadow-md mb-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="nom"
          value={getValue("nom")}
          onChange={handleChange}
          placeholder="Nom"
          className="border p-2 rounded"
        />
        <input
          name="info"
          value={getValue("info")}
          onChange={handleChange}
          placeholder="Information"
          className="border p-2 rounded"
        />

        <select
          name="carac1"
          value={getValue("carac1")}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Caractéristique 1</option>
          <option value="force">Force</option>
          <option value="dexterite">Dextérité</option>
          <option value="intelligence">Intelligence</option>
          <option value="sagesse">Sagesse</option>
          <option value="constitution">Constitution</option>
          <option value="charisme">Charisme</option>
        </select>

        <select
          name="carac2"
          value={getValue("carac2")}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Caractéristique 2</option>
          <option value="force">Force</option>
          <option value="dexterite">Dextérité</option>
          <option value="intelligence">Intelligence</option>
          <option value="sagesse">Sagesse</option>
          <option value="constitution">Constitution</option>
          <option value="charisme">Charisme</option>
        </select>

        <input
          name="part1"
          value={getValue("part1")}
          onChange={handleChange}
          placeholder="Particularité 1"
          className="border p-2 rounded"
        />
        <input
          name="part1_uses"
          type="number"
          value={skill.part1_uses ?? 0}
          onChange={handleChange}
          placeholder="Nb utilisations part. 1"
          className="border p-2 rounded"
        />
        <input
          name="part1_bonus"
          type="number"
          value={skill.part1_bonus ?? 0}
          onChange={handleChange}
          placeholder="Compteur bonus part. 1 (0/7)"
          className="border p-2 rounded"
        />

        <input
          name="part2"
          value={getValue("part2")}
          onChange={handleChange}
          placeholder="Particularité 2"
          className="border p-2 rounded"
        />
        <input
          name="part2_uses"
          type="number"
          value={skill.part2_uses ?? 0}
          onChange={handleChange}
          placeholder="Nb utilisations part. 2"
          className="border p-2 rounded"
        />
        <input
          name="part2_bonus"
          type="number"
          value={skill.part2_bonus ?? 0}
          onChange={handleChange}
          placeholder="Compteur bonus part. 2 (0/7)"
          className="border p-2 rounded"
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Supprimer la compétence
      </button>
    </div>
  );
};

export default SkillForm;
