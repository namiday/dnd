// Components/Character/Objects/ObjectsTab.js

import React, { useState, useEffect, useRef } from "react";
import ObjectForm from "./ObjectForm";

const LOCAL_STORAGE_KEY = "character_objects";

const ObjectsTab = () => {
  const [objects, setObjects] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const storedObjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (storedObjects) {
        const parsed = JSON.parse(storedObjects);
        console.log("📥 Chargement objets:", parsed);
        setObjects(parsed);
      }
    } catch (e) {
      console.error("Erreur de parsing objets:", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("💾 Sauvegarde objets:", objects);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objects));
  }, [objects]);

  const handleChange = (index, updatedObject) => {
    const newObjects = [...objects];
    newObjects[index] = updatedObject;
    setObjects(newObjects);
  };

  const handleAdd = () => {
    setObjects([...objects, {}]);
  };

  const handleRemove = (index) => {
    const newObjects = objects.filter((_, i) => i !== index);
    setObjects(newObjects);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Objets</h2>
      {objects.map((object, index) => (
        <ObjectForm
          key={index}
          index={index}
          object={object}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Ajouter un objet
      </button>
    </div>
  );
};

export default ObjectsTab;
