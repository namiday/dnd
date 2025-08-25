// src/Components/Character/Contacts/ContactsTab.js
import React, { useEffect, useRef, useState } from "react";

const LS_KEY = "character_contacts";

const EMPTY_CONTACT = {
  nom: "",
  fonction: "",
  aptitudes: "",
  conditions: "",
};

function ContactsTab() {
  // 1) Hydrate once from LocalStorage at first render
  const [contacts, setContacts] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      const arr = Array.isArray(v) ? v : [];
      console.log("📥 Chargement contacts:", arr);
      return arr;
    } catch {
      console.log("📥 Chargement contacts: []");
      return [];
    }
  });

  // 2) Save to LS on change, but skip the very first run (prevents nuking imported data)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(contacts));
      console.log("💾 Sauvegarde contacts:", contacts);
    } catch (e) {
      console.error("Erreur sauvegarde contacts:", e);
    }
  }, [contacts]);

  // Helpers
  const addContact = () => setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  const removeContact = (index) =>
    setContacts((prev) => prev.filter((_, i) => i !== index));
  const updateContact = (index, field, value) =>
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );

  // UI
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Contacts</h2>
        <button
          onClick={addContact}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
        >
          ➕ Ajouter un contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-sm opacity-70">Aucun contact pour l’instant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Nom</th>
                <th className="border px-2 py-1">Fonction</th>
                <th className="border px-2 py-1">Aptitudes</th>
                <th className="border px-2 py-1">Conditions</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">
                    <input
                      className="w-48 border rounded px-2 py-1"
                      value={c.nom || ""}
                      onChange={(e) => updateContact(idx, "nom", e.target.value)}
                      placeholder="Nom"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-56 border rounded px-2 py-1"
                      value={c.fonction || ""}
                      onChange={(e) => updateContact(idx, "fonction", e.target.value)}
                      placeholder="Fonction"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-72 border rounded px-2 py-1"
                      value={c.aptitudes || ""}
                      onChange={(e) => updateContact(idx, "aptitudes", e.target.value)}
                      placeholder="Aptitudes"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-72 border rounded px-2 py-1"
                      value={c.conditions || ""}
                      onChange={(e) =>
                        updateContact(idx, "conditions", e.target.value)
                      }
                      placeholder="Conditions"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <button
                      onClick={() => removeContact(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm opacity-70 mt-2">Total : {contacts.length}</p>
        </div>
      )}
    </div>
  );
}

export default ContactsTab;
