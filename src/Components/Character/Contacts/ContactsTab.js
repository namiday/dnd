import React, { useState } from "react";
import ContactForm from "./ContactForm";

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);

  const handleContactChange = (index, updatedContact) => {
    const updated = [...contacts];
    updated[index] = updatedContact;
    setContacts(updated);
  };

  const handleAddContact = () => {
    setContacts([...contacts, {}]);
  };

  const handleRemoveContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>

      {contacts.map((contact, index) => (
        <ContactForm
          key={index}
          index={index}
          contact={contact}
          onChange={handleContactChange}
          onRemove={handleRemoveContact}
        />
      ))}

      <button
        type="button"
        onClick={handleAddContact}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Ajouter un contact
      </button>
    </div>
  );
};

export default ContactsTab;
