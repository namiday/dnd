// Components/Character/Skills/SkillsTab.js

import React, { useState, useEffect, useRef } from "react";
import SkillForm from "./SkillForm";

const LOCAL_STORAGE_KEY = "character_skills";

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const isFirstRender = useRef(true);

  // Chargement depuis localStorage au premier render
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        console.log("📥 Chargement initial depuis localStorage :", parsed);
        setSkills(parsed);
      } else {
        console.log("📥 Aucun tableau valide trouvé dans localStorage.");
      }
    } catch (e) {
      console.error("❌ Erreur parsing JSON localStorage :", e);
    }

    isFirstRender.current = false;
  }, []);

  // Sauvegarde uniquement après le premier render
  useEffect(() => {
    if (!isFirstRender.current) {
      console.log("💾 Sauvegarde skills :", skills);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skills));
    }
  }, [skills]);

  const handleSkillChange = (index, updatedSkill) => {
    const updated = [...skills];
    updated[index] = updatedSkill;
    setSkills(updated);
  };

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      {
        nom: "",
        info: "",
        carac1: "",
        carac2: "",
        part1: "",
        part1_uses: 0,
        part1_bonus: 0,
        part2: "",
        part2_uses: 0,
        part2_bonus: 0,
      },
    ]);
  };

  const handleRemoveSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Compétences</h2>

      {skills.map((skill, index) => (
        <SkillForm
          key={index}
          index={index}
          skill={skill}
          onChange={handleSkillChange}
          onRemove={handleRemoveSkill}
        />
      ))}

      <button
        type="button"
        onClick={handleAddSkill}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Ajouter une compétence
      </button>
    </div>
  );
};

export default SkillsTab;
