import React from "react";

const ExportButton = ({ level, generalInfo }) => {
  const sanitize = (v) => {
    if (v === null || v === undefined) return "";
    return String(v).replace(/;/g, ",").replace(/\r?\n|\r/g, " ");
  };

  // --- Wanted label helpers ---
  const WANTED_LEVELS = [
    null,
    "petit vol",
    "violence aggravée",
    "meurtre",
    "Multiples meurtres",
    "Attentat",
    "Génocide",
    "Destruction planétaire",
  ];
  const clampWanted = (n) =>
    Number.isFinite(n) ? Math.min(7, Math.max(1, n)) : 1;

  const getWantedIndexFromLS = () => {
    try {
      const raw = localStorage.getItem("character_wanted_index");
      if (raw != null) {
        try {
          return clampWanted(Number(JSON.parse(raw)));
        } catch {
          return clampWanted(Number(raw));
        }
      }
    } catch {}
    return 1;
  };

  const zero = (n) => (n < 10 ? `0${n}` : String(n));
  const toSlug = (s) =>
    String(s || "fiche")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/[^a-zA-Z0-9-_]+/g, "-") // safe chars
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

  const handleExport = () => {
    let csvContent = "FICHE DE PERSONNAGE\n";

    // Merge props + LS for general info
    const lsInfo = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_generalInfo")) || {};
      } catch {
        return {};
      }
    })();
    const info = { ...lsInfo, ...(generalInfo || {}) };

    // Resolve level
    const resolveLevel = () => {
      if (Number.isFinite(level)) return Number(level);
      try {
        const raw = localStorage.getItem("character_level");
        if (raw !== null) {
          try {
            const n = Number(JSON.parse(raw));
            if (Number.isFinite(n)) return n;
          } catch {
            const n = Number(raw);
            if (Number.isFinite(n)) return n;
          }
        }
      } catch {}
      const cands = ["niveau", "Niveau", "level", "Level"];
      for (const k of cands) {
        const n = Number(info?.[k]);
        if (Number.isFinite(n)) return n;
      }
      return 0;
    };
    const charLevel = resolveLevel();

    // Resolve wanted → label
    const wantedIndex = getWantedIndexFromLS();
    const wantedLabel = `${WANTED_LEVELS[wantedIndex]} (${Array(wantedIndex)
      .fill("⭐")
      .join("")})`;

    // Resolve XP (LS first, then generalInfo fallbacks)
    const resolveXP = () => {
      try {
        const raw = localStorage.getItem("character_xp");
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
      const keys = ["XP", "xp", "experience", "exp"];
      for (const k of keys) {
        const n = Number(info?.[k]);
        if (Number.isFinite(n)) return n;
      }
      return 0;
    };
    const xp = resolveXP();

    // --- Informations Générales ---
    csvContent += "\n[Informations Générales]\n";
    csvContent += `Niveau;${charLevel}\n`;
    csvContent += `Indice de recherche;${sanitize(wantedLabel)}\n`;
    csvContent += `XP;${xp}\n`;

    const identityKeys = [
      "nom",
      "prenom",
      "pseudo",
      "ordre",
      "religion",
      "metier",
    ];
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

    identityKeys.forEach((k) => {
      csvContent += `${k};${sanitize(info[k])}\n`;
    });
    csvContent += `${descriptionKey};${sanitize(info[descriptionKey])}\n`;
    financeKeys.forEach((k) => {
      csvContent += `${k};${sanitize(info[k])}\n`;
    });

    const alreadyWritten = new Set([
      "niveau",
      "Niveau",
      "level",
      "Level",
      "Indice de recherche",
      "IndiceDeRecherche",
      "WantedIndex",
      "XP",
      "xp",
      ...identityKeys,
      descriptionKey,
      ...financeKeys,
    ]);
    Object.entries(info).forEach(([key, value]) => {
      if (!alreadyWritten.has(key)) {
        csvContent += `${key};${sanitize(value)}\n`;
      }
    });

    // --- Caractéristiques (FOR + legacy ATT mapping) ---
    const rawStats = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_stats")) || {};
      } catch {
        return {};
      }
    })();
    const stats = {
      FOR: rawStats.FOR ?? rawStats.ATT ?? 0,
      DEX: rawStats.DEX ?? 0,
      CON: rawStats.CON ?? 0,
      INT: rawStats.INT ?? 0,
      SAG: rawStats.SAG ?? 0,
      CHA: rawStats.CHA ?? 0,
    };

    csvContent += "\n[Caractéristiques]\n";
    ["FOR", "DEX", "CON", "INT", "SAG", "CHA"].forEach((k) => {
      csvContent += `${k};${stats[k]}\n`;
    });
    const pv = localStorage.getItem("character_pv") || "0";
    const pe = localStorage.getItem("character_pe") || "0";
    csvContent += `PV;${pv}\nPE;${pe}\n`;

    // --- Compétences ---
    const skills = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_skills")) || [];
      } catch {
        return [];
      }
    })();
    csvContent += "\n[Compétences]\n";
    csvContent +=
      "Nom;Info;Carac1;Carac2;Part1;Uses1;Bonus1;Part2;Uses2;Bonus2\n";
    for (const s of skills) {
      csvContent += [
        s.nom ?? "",
        s.info ?? "",
        s.carac1 ?? "",
        s.carac2 ?? "",
        s.part1 ?? "",
        s.part1_uses ?? "",
        s.part1_bonus ?? "",
        s.part2 ?? "",
        s.part2_uses ?? "",
        s.part2_bonus ?? "",
      ]
        .map(sanitize)
        .join(";") + "\n";
    }

    // --- Objets ---
    const objects = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_objects")) || [];
      } catch {
        return [];
      }
    })();
    csvContent += "\n[Objets]\n";
    csvContent +=
      "Nom;PR;DGT;PDE;Réservoir;Plein;Km;Qualité;Prix;Poids;Type;Minerai;QtéMinerai;Bonus;Malus;Catégorie\n";
    for (const o of objects) {
      csvContent += [
        o.nom,
        o.PR,
        o.DGT,
        o.PDE,
        o.reservoir,
        o.prix_plein,
        o.nb_km,
        o.qualite,
        o.prix,
        o.poids,
        o.type_objet,
        o.type_minerai,
        o.qte_minerai,
        o.bonus,
        o.malus,
        o.categorie,
      ]
        .map(sanitize)
        .join(";") + "\n";
    }

    // --- PNJ / Familiers ---
    const familiers = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_familiers")) || [];
      } catch {
        return [];
      }
    })();
    csvContent += "\n[PNJ / Familiers]\n";
    csvContent +=
      "Nom;Niveau;PVmin;PVmax;PEmin;PEmax;Attaque;VAtt;Défense;VDéf;Volonté;VVol;Spécial;VSpécial;XPmin;XPmax;Description;Forces;Faiblesses;Objets(nom:PR:DGT:PDE:qualité)\n";
    for (const f of familiers) {
      const objets = (f.objets || [])
        .map(
          (o) =>
            `${(o.nom ?? "").replace(/;/g, ",")}:${(o.PR ?? "")
              .toString()
              .replace(/;/g, ",")}:${(o.DGT ?? "")
              .toString()
              .replace(/;/g, ",")}:${(o.PDE ?? "")
              .toString()
              .replace(/;/g, ",")}:${(o.qualite ?? "")
              .toString()
              .replace(/;/g, ",")}`
        )
        .join("|");
      csvContent += [
        f.nom,
        f.niveau,
        f.pvMin,
        f.pvMax,
        f.peMin,
        f.peMax,
        f.nomAttaque,
        f.valAttaque,
        f.nomDefense,
        f.valDefense,
        f.nomVolonte,
        f.valVolonte,
        f.nomSpecial,
        f.valSpecial,
        f.xpMin,
        f.xpMax,
        f.description,
        f.forces,
        f.faiblesses,
        objets,
      ]
        .map(sanitize)
        .join(";") + "\n";
    }

    // --- Contacts ---
    const contacts = (() => {
      try {
        return JSON.parse(localStorage.getItem("character_contacts")) || [];
      } catch {
        return [];
      }
    })();
    csvContent += "\n[Contacts]\n";
    csvContent += "Nom;Fonction;Aptitudes;Conditions\n";
    for (const c of contacts) {
      csvContent += [c.nom, c.fonction, c.aptitudes, c.conditions]
        .map(sanitize)
        .join(";") + "\n";
    }

    // ---------- Filename: <name>_<level>_<YYYY-MM-DD>_<HH-mm>.csv ----------
    const baseName =
      info.nom?.trim() || info.pseudo?.trim() || "fiche";
    const slug = toSlug(baseName);
    const now = new Date(); // local time
    const yyyy = now.getFullYear();
    const mm = zero(now.getMonth() + 1);
    const dd = zero(now.getDate());
    const HH = zero(now.getHours());
    const MM = zero(now.getMinutes());
    const filename = `${slug}_${charLevel}_${yyyy}-${mm}-${dd}_${HH}-${MM}.csv`;

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
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
