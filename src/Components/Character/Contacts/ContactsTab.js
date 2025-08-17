// Components/Character/Contacts/ContactsTab.js

import React, { useState, useEffect, useRef } from "react";
import ContactForm from "./ContactForm";

const LOCAL_STORAGE_KEY = "character_contacts";

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const storedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (storedContacts) {
        const parsed = JSON.parse(storedContacts);
        console.log("📥 Chargement contacts:", parsed);
        setContacts(parsed);
      }
    } catch (e) {
      console.error("Erreur de parsing contacts:", e);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("💾 Sauvegarde contacts:", contacts);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = (index, updatedContact) => {
    const newList = [...contacts];
    newList[index] = updatedContact;
    setContacts(newList);
  };

  const handleAdd = () => {
    setContacts([...contacts, {}]);
  };

  const handleRemove = (index) => {
    const newList = contacts.filter((_, i) => i !== index);
    setContacts(newList);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      {contacts.map((contact, index) => (
        <ContactForm
          key={index}
          index={index}
          contact={contact}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Ajouter un contact
      </button>
    </div>
  );
};

export default ContactsTab;
