import React from "react";

const ContactForm = ({ contact, index, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...contact, [name]: value });
  };

  return (
    <div className="border p-4 rounded shadow mb-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="nom"
          value={contact.nom || ""}
          onChange={handleChange}
          placeholder="Nom"
          className="border p-2 rounded"
        />
        <input
          name="fonction"
          value={contact.fonction || ""}
          onChange={handleChange}
          placeholder="Fonction"
          className="border p-2 rounded"
        />
        <input
          name="aptitudes"
          value={contact.aptitudes || ""}
          onChange={handleChange}
          placeholder="Aptitudes"
          className="border p-2 rounded"
        />
        <input
          name="conditions"
          value={contact.conditions || ""}
          onChange={handleChange}
          placeholder="Conditions"
          className="border p-2 rounded"
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Supprimer le contact
      </button>
    </div>
  );
};

export default ContactForm;
