import React from "react";
import GeneralInfoForm from "./GeneralInfoForm";

const GeneralInfoTab = () => {
  const handleInfoChange = (data) => {
    console.log("Données sauvegardées (info générale)", data);
  };

  return (
    <div>
      <GeneralInfoForm onChange={handleInfoChange} />
    </div>
  );
};

export default GeneralInfoTab;
