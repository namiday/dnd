// Components/Character/Skills/SkillsTab.js

import React, { useState, useEffect, useRef } from "react";
import SkillForm from "./SkillForm";

const LOCAL_STORAGE_KEY = "character_skills";

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const hasLoaded = useRef(false); // ← évite la 1re sauvegarde vide

  // Chargement depuis localStorage au premier rendu
  useEffect(() => {
    const storedSkills = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (storedSkills) {
        const parsed = JSON.parse(storedSkills);
        console.log("📥 Chargement initial depuis localStorage :", parsed);
        setSkills(parsed);
      }
    } catch (e) {
      console.error("Erreur de parsing localStorage :", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("💾 Sauvegarde skills :", skills);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skills));
  }, [skills]);

  const handleSkillChange = (index, updatedSkill) => {
    const newSkills = [...skills];
    newSkills[index] = updatedSkill;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, {}]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
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
