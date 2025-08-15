import React from 'react';

const ObjetVehiculeForm = () => {
  return (
    <div className="flex p-2 gap-2 text-xs font-semibold">
      {/* Zone image */}
      <div className="border w-60 h-[300px] bg-white" />

      {/* Formulaire */}
      <div className="flex flex-col gap-1 w-full">
        {/* Première ligne : PR, Réservoir */}
        <div className="flex gap-1">
          <div className="flex flex-col w-12">
            <div className="bg-black text-white p-1">PR</div>
            <input type="text" className="border h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="bg-black text-white p-1">RÉSERVOIR</div>
            <input type="text" className="border h-6" />
          </div>
        </div>

        {/* Deuxième ligne : DGT, Prix du plein */}
        <div className="flex gap-1">
          <div className="flex flex-col w-12">
            <div className="bg-black text-white p-1">DGT</div>
            <input type="text" className="border h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="bg-black text-white p-1">PRIX DU PLEIN</div>
            <input type="text" className="border h-6" />
          </div>
        </div>

        {/* Troisième ligne : PDE, NB. DE KM */}
        <div className="flex gap-1">
          <div className="flex flex-col w-12">
            <div className="bg-black text-white p-1">PDE</div>
            <input type="text" className="border h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="bg-black text-white p-1">NB. DE KM</div>
            <input type="text" className="border h-6" />
          </div>
        </div>

        {/* Titre principal */}
        <div className="bg-black text-white text-center py-1">FICHE OBJET / VÉHICULE</div>

        {/* Nom */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">NOM</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">TYPE D'OBJET / VÉHICULE</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Qualité */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">QUALITÉ</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Prix */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">PRIX</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Poids */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">POIDS</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Type de minerai */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">TYPE DE MINERAI</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Quantité de minerai */}
        <div className="flex flex-col">
          <div className="bg-black text-white p-1">QUANTITÉ DE MINERAI</div>
          <input type="text" className="border h-6" />
        </div>

        {/* Bonus */}
        <div className="flex flex-col relative">
          <div className="bg-black text-white p-1">BONUS</div>
          <textarea className="border h-16 resize-none" />
          <button className="absolute right-1 bottom-1 w-6 h-6 bg-white border">+</button>
        </div>

        {/* Malus */}
        <div className="flex flex-col relative">
          <div className="bg-black text-white p-1">MALUS</div>
          <textarea className="border h-16 resize-none" />
          <button className="absolute right-1 bottom-1 w-6 h-6 bg-white border">-</button>
        </div>
      </div>
    </div>
  );
};

export default ObjetVehiculeForm;
