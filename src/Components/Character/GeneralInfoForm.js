// Components/Character/GeneralInfoForm.js

import React from "react";
import { useForm } from "react-hook-form";

const GeneralInfoForm = ({ onChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Informations générales:", data);
    if (onChange) onChange(data);
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
