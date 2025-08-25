// Components/Character/GeneralInfoTab.js
import React, { useEffect, useRef, useState } from "react";
import GeneralInfoForm from "./GeneralInfoForm";

const LS_KEY = "character_generalInfo";

const GeneralInfoTab = ({ onInfoChange }) => {
  const [initialInfo, setInitialInfo] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let parsed = {};
    try {
      const raw = localStorage.getItem(LS_KEY);
      parsed = raw ? JSON.parse(raw) : {};
    } catch {}
    setInitialInfo(parsed);
    onInfoChange?.(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (updated) => {
    onInfoChange?.(updated || {});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Informations Générales</h2>
      <GeneralInfoForm onChange={handleChange} />
    </div>
  );
};

export default GeneralInfoTab;
