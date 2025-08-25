// Components/Character/GeneralInfoForm.js

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const LS_INFO = "character_generalInfo";
const LS_XP = "character_xp";

const parseNum = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const readInfo = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_INFO)) || {};
  } catch {
    return {};
  }
};

const readXP = () => {
  // canonical key first
  try {
    const raw = localStorage.getItem(LS_XP);
    if (raw != null) {
      try {
        const n = Number(JSON.parse(raw));
        if (Number.isFinite(n)) return n;
      } catch {
        const n = Number(raw);
        if (Number.isFinite(n)) return n;
      }
    }
  } catch {}
  // fallback: maybe stored in general info
  const gi = readInfo();
  const cand = parseNum(gi?.XP ?? gi?.xp ?? gi?.experience ?? gi?.exp);
  return cand || 0;
};

const writeAll = (infoObj, xpNumber) => {
  try {
    localStorage.setItem(LS_XP, JSON.stringify(xpNumber));
  } catch {}
  try {
    const merged = { ...(infoObj || {}), XP: xpNumber };
    localStorage.setItem(LS_INFO, JSON.stringify(merged));
  } catch {}
};

const GeneralInfoForm = ({ onChange }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nom: "",
      prenom: "",
      pseudo: "",
      ordre: "",
      religion: "",
      metier: "",
      description: "",
      liquidite: "",
      compte_courant: "",
      frais_fixes: "",
      livret_a: "",
      livret_b: "",
      dette_bancaire: "",
      dette_perso: "",
      preteur: "",
      pel: "",
      crypto: "",
      revenu: "",
      XP: 0,
    },
  });

  // Load from LS at mount (and after reloads)
  useEffect(() => {
    const gi = readInfo();
    const xp = readXP();
    reset({
      nom: gi.nom || "",
      prenom: gi.prenom || "",
      pseudo: gi.pseudo || "",
      ordre: gi.ordre || "",
      religion: gi.religion || "",
      metier: gi.metier || "",
      description: gi.description || "",
      liquidite: gi.liquidite || "",
      compte_courant: gi.compte_courant || "",
      frais_fixes: gi.frais_fixes || "",
      livret_a: gi.livret_a || "",
      livret_b: gi.livret_b || "",
      dette_bancaire: gi.dette_bancaire || "",
      dette_perso: gi.dette_perso || "",
      preteur: gi.preteur || "",
      pel: gi.pel || "",
      crypto: gi.crypto || "",
      revenu: gi.revenu || "",
      XP: xp, // prefill
    });
  }, [reset]);

  const onSubmit = (data) => {
    const xpNumber = parseNum(data?.XP);
    const toSave = { ...data, XP: xpNumber };
    writeAll(toSave, xpNumber);
    if (onChange) onChange(toSave);
    console.log("✅ Informations générales sauvegardées:", toSave);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Identité */}
        <input {...register("nom")} placeholder="Nom" className="border p-2 rounded" />
        <input {...register("prenom")} placeholder="Prénom" className="border p-2 rounded" />
        <input {...register("pseudo")} placeholder="Pseudo" className="border p-2 rounded" />
        <input {...register("ordre")} placeholder="Ordre" className="border p-2 rounded" />
        <input {...register("religion")} placeholder="Religion" className="border p-2 rounded" />
        <input {...register("metier")} placeholder="Métier" className="border p-2 rounded" />
      </div>

      {/* Description */}
      <textarea
        {...register("description")}
        placeholder="Description"
        className="border p-2 rounded w-full h-24"
      />

      {/* XP */}
      <div>
        <h3 className="font-semibold mt-4 mb-2">Progression</h3>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="text-sm text-gray-700">XP (expérience actuelle)</label>
          <input
            type="number"
            step="1"
            min="0"
            {...register("XP")}
            placeholder="0"
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Finance */}
      <h3 className="font-semibold mt-4">Finances</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="number" step="0.01" {...register("liquidite")} placeholder="Liquidité" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("compte_courant")} placeholder="Compte courant" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("frais_fixes")} placeholder="Frais fixes" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("livret_a")} placeholder="Livret A" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("livret_b")} placeholder="Livret B" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("dette_bancaire")} placeholder="Dette bancaire" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("dette_perso")} placeholder="Dette personnelle" className="border p-2 rounded" />
        <input type="text" {...register("preteur")} placeholder="Prêteur" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("pel")} placeholder="PEL" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("crypto")} placeholder="Crypto" className="border p-2 rounded" />
        <input type="number" step="0.01" {...register("revenu")} placeholder="Revenu mensuel" className="border p-2 rounded" />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sauvegarder
      </button>
    </form>
  );
};

export default GeneralInfoForm;
