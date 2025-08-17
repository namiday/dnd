// Components/Character/GeneralInfo/GeneralInfoTab.js

import React, { useState, useEffect, useRef } from "react";
import GeneralInfoForm from "./GeneralInfoForm";

const LOCAL_STORAGE_KEY = "character_generalInfo";

const GeneralInfoTab = () => {
  const [info, setInfo] = useState({});
  const hasLoaded = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("📥 Chargement info générales:", parsed);
        setInfo(parsed);
      }
    } catch (e) {
      console.error("Erreur de parsing info générales:", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("💾 Sauvegarde info générales:", info);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(info));
  }, [info]);

  const handleChange = (updatedInfo) => {
    setInfo(updatedInfo);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Informations Générales</h2>
      <GeneralInfoForm data={info} onChange={handleChange} />
    </div>
  );
};

export default GeneralInfoTab;
