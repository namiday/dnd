import React from "react";

const ExportButton = ({ level }) => {
  const sanitize = (v) => {
    if (v === null || v === undefined) return "";
    // Éviter de casser le CSV basé sur ';' et les retours ligne
    return String(v).replace(/;/g, ",").replace(/\r?\n|\r/g, " ");
  };

  const handleExport = () => {
    let csvContent = "FICHE DE PERSONNAGE\n";

    // --- Récupération des infos générales ---
    const info = JSON.parse(localStorage.getItem("character_generalInfo")) || {};

    // Noms de clés attendus par GeneralInfoForm
    const identityKeys = ["nom", "prenom", "pseudo", "ordre", "religion", "metier"];
    const descriptionKey = "description";
    const financeKeys = [
      "liquidite",
      "compte_courant",
      "frais_fixes",
      "livret_a",
      "livret_b",
      "dette_bancaire",
      "dette_perso",
      "preteur",
      "pel",
      "crypto",
      "revenu",
    ];

    // Résolution robuste du niveau (prop > LS > info.*)
    const resolveLevel = () => {
      if (Number.isFinite(level)) return Number(level);

      // character_level dans LS (JSON ou brut)
      try {
        const raw = localStorage.getItem("character_level");
        if (raw !== null) {
          try {
            const parsed = JSON.parse(raw);
            const n = Number(parsed);
            if (Number.isFinite(n)) return n;
          } catch {
            const n = Number(raw);
            if (Number.isFinite(n)) return n;
          }
        }
      } catch {/* ignore */}

      // chercher dans info: niveau / Niveau / level / Level
      const cands = ["niveau", "Niveau", "level", "Level"];
      for (const k of cands) {
        const n = Number(info?.[k]);
        if (Number.isFinite(n)) return n;
      }
      return 0;
    };
    const charLevel = resolveLevel();

    // Écrire [Informations Générales] avec ordre stable
    csvContent += "\n[Informations Générales]\n";
    // Niveau en premier
    csvContent += `Niveau;${charLevel}\n`;

    // Identité
    identityKeys.forEach((k) => {
      csvContent += `${k};${sanitize(info[k])}\n`;
    });

    // Description
    csvContent += `${descriptionKey};${sanitize(info[descriptionKey])}\n`;

    // Finances
    financeKeys.forEach((k) => {
      csvContent += `${k};${sanitize(info[k])}\n`;
    });

    // Clés additionnelles non listées (extensibilité)
    const alreadyWritten = new Set([
      "niveau", "Niveau", "level", "Level",
      ...identityKeys,
      descriptionKey,
      ...financeKeys,
    ]);
    Object.entries(info).forEach(([key, value]) => {
      if (!alreadyWritten.has(key)) {
        csvContent += `${key};${sanitize(value)}\n`;
      }
    });

    // --- Caractéristiques ---
    const stats = JSON.parse(localStorage.getItem("character_stats")) || {};
    csvContent += "\n[Caractéristiques]\n";
    for (const [key, value] of Object.entries(stats)) {
      csvContent += `${key};${sanitize(value)}\n`;
    }

    // --- PV / PE ---
    const pv = localStorage.getItem("character_pv") || "0";
    const pe = localStorage.getItem("character_pe") || "0";
    csvContent += `PV;${sanitize(pv)}\nPE;${sanitize(pe)}\n`;

    // --- Compétences ---
    const skills = JSON.parse(localStorage.getItem("character_skills")) || [];
    csvContent += "\n[Compétences]\n";
    csvContent += "Nom;Info;Carac1;Carac2;Part1;Uses1;Bonus1;Part2;Uses2;Bonus2\n";
    for (const s of skills) {
      csvContent += `${sanitize(s.nom)};${sanitize(s.info)};${sanitize(s.carac1)};${sanitize(s.carac2)};${sanitize(s.part1)};${sanitize(s.part1_uses)};${sanitize(s.part1_bonus)};${sanitize(s.part2)};${sanitize(s.part2_uses)};${sanitize(s.part2_bonus)}\n`;
    }

    // --- Objets ---
    const objects = JSON.parse(localStorage.getItem("character_objects")) || [];
    csvContent += "\n[Objets]\n";
    csvContent += "Nom;PR;DGT;PDE;Réservoir;Plein;Km;Qualité;Prix;Poids;Type;Minerai;QtéMinerai;Bonus;Malus;Catégorie\n";
    for (const o of objects) {
      csvContent += `${sanitize(o.nom)};${sanitize(o.PR)};${sanitize(o.DGT)};${sanitize(o.PDE)};${sanitize(o.reservoir)};${sanitize(o.prix_plein)};${sanitize(o.nb_km)};${sanitize(o.qualite)};${sanitize(o.prix)};${sanitize(o.poids)};${sanitize(o.type_objet)};${sanitize(o.type_minerai)};${sanitize(o.qte_minerai)};${sanitize(o.bonus)};${sanitize(o.malus)};${sanitize(o.categorie)}\n`;
    }

    // --- PNJ / Familiers ---
    const familiers = JSON.parse(localStorage.getItem("character_familiers")) || [];
    csvContent += "\n[PNJ / Familiers]\n";
    csvContent += "Nom;Niveau;PVmin;PVmax;PEmin;PEmax;Attaque;VAtt;Défense;VDéf;Volonté;VVol;Spécial;VSpécial;XPmin;XPmax;Description;Forces;Faiblesses;Objets(nom:PR:DGT:PDE:qualité)\n";
    for (const f of familiers) {
      const objets = (f.objets || [])
        .map((o) => `${sanitize(o.nom)}:${sanitize(o.PR)}:${sanitize(o.DGT)}:${sanitize(o.PDE)}:${sanitize(o.qualite)}`)
        .join("|");
      csvContent += `${sanitize(f.nom)};${sanitize(f.niveau)};${sanitize(f.pvMin)};${sanitize(f.pvMax)};${sanitize(f.peMin)};${sanitize(f.peMax)};${sanitize(f.nomAttaque)};${sanitize(f.valAttaque)};${sanitize(f.nomDefense)};${sanitize(f.valDefense)};${sanitize(f.nomVolonte)};${sanitize(f.valVolonte)};${sanitize(f.nomSpecial)};${sanitize(f.valSpecial)};${sanitize(f.xpMin)};${sanitize(f.xpMax)};${sanitize(f.description)};${sanitize(f.forces)};${sanitize(f.faiblesses)};${objets}\n`;
    }

    // --- Contacts ---
    const contacts = JSON.parse(localStorage.getItem("character_contacts")) || [];
    csvContent += "\n[Contacts]\n";
    csvContent += "Nom;Fonction;Aptitudes;Conditions\n";
    for (const c of contacts) {
      csvContent += `${sanitize(c.nom)};${sanitize(c.fonction)};${sanitize(c.aptitudes)};${sanitize(c.conditions)}\n`;
    }

    // --- Télécharger ---
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fiche_personnage.csv";
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-4"
    >
      📤 Exporter CSV
    </button>
  );
};

export default ExportButton;
