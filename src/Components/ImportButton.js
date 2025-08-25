// src/Components/ImportButton.js
import React from "react";

const KEYS = {
  generalInfo: "character_generalInfo",
  stats: "character_stats",
  pv: "character_pv",
  pe: "character_pe",
  skills: "character_skills",
  objects: "character_objects",
  familiers: "character_familiers",
  contacts: "character_contacts",
  level: "character_level",
  xp: "character_xp",
  wanted: "character_wanted_index",
  wantedLabel: "character_wanted_label",
};

const parseNumber = (v) => {
  const s = (v ?? "").toString().trim();
  if (s === "") return 0;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const parseOptionalNumber = (v) => {
  const s = (v ?? "").toString().trim();
  if (s === "") return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const isSectionHeader = (line) => /^\s*\[.*\]\s*$/.test(line);
const normText = (text) => {
  if (!text) return "";
  let t = text;
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1); // BOM
  t = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return t;
};
const normalize = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const clampWanted = (n) => (Number.isFinite(n) ? Math.min(7, Math.max(1, n)) : 1);

const parseWantedIndex = (val) => {
  if (!val) return 1;
  const raw = val.toString();
  const countEmojiStar = Array.from(raw).filter((c) => c === "⭐").length;
  const countBlackStar = Array.from(raw).filter((c) => c === "★").length;
  const countHollowStar = Array.from(raw).filter((c) => c === "☆").length;
  const starCount = Math.max(countEmojiStar, countBlackStar, countHollowStar);
  if (starCount >= 1 && starCount <= 7) return starCount;
  const asterisk = (raw.match(/\*/g) || []).length;
  if (asterisk >= 1 && asterisk <= 7) return asterisk;
  const nNum = Number(raw);
  if (Number.isFinite(nNum) && nNum >= 1 && nNum <= 7) return nNum;
  const n = normalize(raw);
  const names = [
    null,
    "petit vol",
    "violence aggravee",
    "meurtre",
    "multiples meurtres",
    "attentat",
    "genocide",
    "destruction planetaire",
  ];
  for (let i = 1; i <= 7; i++) if (n.includes(names[i])) return i;
  return 1;
};
const wantedLabelFromIndex = (idx) => {
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
  const i = clampWanted(idx);
  return `${WANTED_LEVELS[i]} (${Array(i).fill("⭐").join("")})`;
};

// ---- Read existing so omitted CSV fields don't wipe data
const readExisting = () => {
  const safeJSON = (k) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const stats = safeJSON(KEYS.stats) || { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 };
  const pv = (() => {
    const raw = localStorage.getItem(KEYS.pv);
    return raw != null ? Number(raw) || 0 : 0;
  })();
  const pe = (() => {
    const raw = localStorage.getItem(KEYS.pe);
    return raw != null ? Number(raw) || 0 : 0;
  })();
  const xp = (() => {
    const raw = localStorage.getItem(KEYS.xp);
    if (raw != null) {
      try {
        const n = Number(JSON.parse(raw));
        if (Number.isFinite(n)) return n;
      } catch {
        const n = Number(raw);
        if (Number.isFinite(n)) return n;
      }
    }
    const gi = safeJSON(KEYS.generalInfo) || {};
    const cands = [gi?.XP, gi?.xp, gi?.experience, gi?.exp];
    for (const c of cands) {
      const n = Number(c);
      if (Number.isFinite(n)) return n;
    }
    return 0;
  })();
  const level = (() => {
    const raw = localStorage.getItem(KEYS.level);
    if (raw != null) {
      try {
        const n = Number(JSON.parse(raw));
        if (Number.isFinite(n)) return n;
      } catch {
        const n = Number(raw);
        if (Number.isFinite(n)) return n;
      }
    }
    return 0;
  })();
  return { stats, pv, pe, xp, level };
};

// Map various labels → canonical short code
const mapStatKey = (rawKey) => {
  const k = normalize(rawKey).toUpperCase();
  const direct = ["FOR", "DEX", "CON", "INT", "SAG", "CHA", "PV", "PE"];
  if (direct.includes(k)) return k;
  const map = {
    FORCE: "FOR",
    DEXTERITE: "DEX",
    CONSTITUTION: "CON",
    INTELLIGENCE: "INT",
    SAGESSE: "SAG",
    CHARISME: "CHA",
    ATT: "FOR",
  };
  return map[k] || null;
};

// NEW: robust header detector for PNJ/Familiers
const isPnjHeaderRow = (line) => {
  const cols = line.split(";");
  if (cols.length < 2) return false;
  const c0 = normalize(cols[0]); // "nom"
  const c1 = normalize(cols[1]); // "niveau" or "level"
  if (!(c0 === "nom" && (c1 === "niveau" || c1 === "level"))) return false;

  // Count presence of expected header tokens among the rest (tolerant to accents/variants)
  const expected = new Set([
    "pvmin",
    "pvmax",
    "pemin",
    "pemax",
    "attaque",
    "vatt",
    "defense",
    "vdef",
    "volonte",
    "vvol",
    "special",
    "vspecial",
    "xpmin",
    "xpmax",
    "description",
    "forces",
    "faiblesses",
  ]);
  let hits = 0;
  for (let i = 2; i < cols.length; i++) {
    const key = normalize(cols[i]).replace(/\s+/g, "");
    if (expected.has(key) || key.startsWith("objets(") || key.startsWith("objets")) hits++;
  }
  return hits >= 4; // enough signals to be sure it's the header
};

const ImportButton = () => {
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = normText(reader.result || "");
        const lines = text.split("\n").map((l) => l.trim());

        const existing = readExisting();

        const generalInfo = (() => {
          try {
            return JSON.parse(localStorage.getItem(KEYS.generalInfo)) || {};
          } catch {
            return {};
          }
        })();
        const stats = { ...existing.stats };
        let pv = existing.pv;
        let pe = existing.pe;
        let level = existing.level;
        let xp = existing.xp;

        let wantedIndex = 1;
        let wantedLabel = wantedLabelFromIndex(1);

        const skills = [];
        const objects = [];
        const familiers = [];
        const contacts = [];

        let i = 0;
        if ((lines[0] || "").toUpperCase().includes("FICHE DE PERSONNAGE")) i = 1;

        const readUntilNextHeader = (handler) => {
          while (i < lines.length && !isSectionHeader(lines[i])) {
            const line = lines[i].trim();
            i++;
            if (!line) continue;
            handler(line);
          }
        };

        while (i < lines.length) {
          const raw = lines[i];
          if (!raw) { i++; continue; }

          if (isSectionHeader(raw)) {
            const section = raw.replace(/^\s*\[|\]\s*$/g, "").trim();
            const secNorm = normalize(section);
            i++;

            // Informations Générales
            if (secNorm === "informations generales") {
              readUntilNextHeader((line) => {
                const [k = "", v = ""] = line.split(";");
                const key = k.trim();
                const val = v.trim();
                const kn = normalize(key);
                if (!key) return;

                if (kn === "niveau" || kn === "level") {
                  level = parseNumber(val);
                } else if (kn === "xp" || kn === "experience" || kn === "exp") {
                  const maybe = parseOptionalNumber(val);
                  if (maybe !== null) xp = maybe;
                } else if (kn === "indice de recherche" || kn === "indicederecherche") {
                  const idx = parseWantedIndex(val);
                  wantedIndex = clampWanted(idx);
                  wantedLabel = wantedLabelFromIndex(wantedIndex);
                } else {
                  generalInfo[key] = val;
                }
              });
              continue;
            }

            // Caractéristiques
            if (
              secNorm === "caracteristiques" ||
              secNorm === "caracs" ||
              secNorm === "stats" ||
              secNorm === "attributs"
            ) {
              readUntilNextHeader((line) => {
                const parts = line.indexOf(";") >= 0 ? line.split(";") : line.split(":");
                const k = (parts[0] || "").trim();
                const v = (parts[1] || "").trim();
                if (!k) return;
                const mapped = mapStatKey(k);
                if (!mapped) return;
                const num = parseNumber(v);
                if (mapped === "PV") pv = num;
                else if (mapped === "PE") pe = num;
                else stats[mapped] = num;
              });
              continue;
            }

            // Compétences
            if (secNorm.startsWith("competences")) {
              let firstRow = true;
              readUntilNextHeader((line) => {
                const cols = line.split(";");
                if (firstRow) {
                  const flat = normalize(line).replace(/\s/g, "");
                  if (
                    flat.startsWith(
                      "nom;info;carac1;carac2;part1;uses1;bonus1;part2;uses2;bonus2"
                    )
                  ) {
                    firstRow = false;
                    return;
                  }
                }
                firstRow = false;
                if (cols.every((c) => c === "")) return;
                if (!cols[0] && !cols[1]) return;
                while (cols.length < 10) cols.push("");
                skills.push({
                  nom: cols[0] || "",
                  info: cols[1] || "",
                  carac1: cols[2] || "",
                  carac2: cols[3] || "",
                  part1: cols[4] || "",
                  part1_uses: parseNumber(cols[5]),
                  part1_bonus: parseNumber(cols[6]),
                  part2: cols[7] || "",
                  part2_uses: parseNumber(cols[8]),
                  part2_bonus: parseNumber(cols[9]),
                });
              });
              continue;
            }

            // Objets
            if (secNorm.startsWith("objets")) {
              let firstRow = true;
              readUntilNextHeader((line) => {
                const cols = line.split(";");
                if (firstRow) {
                  const flat = normalize(line).replace(/\s/g, "");
                  if (flat.startsWith("nom;pr;dgt;pde;reservoir;plein;km;qualite;prix;poids;type;minerai;qteminerai;bonus;malus;categorie")) {
                    firstRow = false;
                    return;
                  }
                }
                firstRow = false;
                if (!cols[0]) return;
                while (cols.length < 16) cols.push("");
                const o = {
                  nom: cols[0] || "",
                  PR: cols[1] || "",
                  DGT: cols[2] || "",
                  PDE: cols[3] || "",
                  reservoir: cols[4] || "",
                  prix_plein: cols[5] || "",
                  nb_km: cols[6] || "",
                  qualite: cols[7] || "",
                  prix: cols[8] || "",
                  poids: cols[9] || "",
                  type_objet: cols[10] || "",
                  type_minerai: cols[11] || "",
                  qte_minerai: cols[12] || "",
                  bonus: cols[13] || "",
                  malus: cols[14] || "",
                  categorie: cols[15] || "",
                };
                if (Object.values(o).every((v) => (v ?? "") === "")) return;
                objects.push(o);
              });
              continue;
            }

            // PNJ / Familiers (FIXED header skip)
            if (secNorm.startsWith("pnj") || secNorm.includes("familiers")) {
              let firstRow = true;
              readUntilNextHeader((line) => {
                if (firstRow && isPnjHeaderRow(line)) {
                  firstRow = false;
                  return; // skip header
                }
                firstRow = false;

                const cols = line.split(";");
                if (!cols[0]) return;
                while (cols.length < 20) cols.push("");

                const objStr = cols[19] || "";
                const objets = objStr
                  .split("|")
                  .map((chunk) => chunk.trim())
                  .filter(Boolean)
                  .map((chunk) => {
                    const [nom, PR, DGT, PDE, qualite] = chunk.split(":");
                    return {
                      nom: nom || "",
                      PR: PR || "",
                      DGT: DGT || "",
                      PDE: PDE || "",
                      qualite: qualite || "",
                    };
                  });

                const f = {
                  nom: cols[0] || "",
                  niveau: parseNumber(cols[1]),
                  pvMin: parseNumber(cols[2]),
                  pvMax: parseNumber(cols[3]),
                  peMin: parseNumber(cols[4]),
                  peMax: parseNumber(cols[5]),
                  nomAttaque: cols[6] || "",
                  valAttaque: parseNumber(cols[7]),
                  nomDefense: cols[8] || "",
                  valDefense: parseNumber(cols[9]),
                  nomVolonte: cols[10] || "",
                  valVolonte: parseNumber(cols[11]),
                  nomSpecial: cols[12] || "",
                  valSpecial: parseNumber(cols[13]),
                  xpMin: parseNumber(cols[14]),
                  xpMax: parseNumber(cols[15]),
                  description: cols[16] || "",
                  forces: cols[17] || "",
                  faiblesses: cols[18] || "",
                  objets,
                };
                if (!f.nom && !f.niveau && !f.description && objets.length === 0) return;
                familiers.push(f);
              });
              continue;
            }

            // Contacts
            if (secNorm.startsWith("contacts")) {
              let firstRow = true;
              readUntilNextHeader((line) => {
                const cols = line.split(";");
                if (firstRow) {
                  const flat = normalize(line).replace(/\s/g, "");
                  if (flat.startsWith("nom;fonction;aptitudes;conditions")) {
                    firstRow = false;
                    return;
                  }
                }
                firstRow = false;
                if (!cols[0]) return;
                while (cols.length < 4) cols.push("");
                const c = {
                  nom: cols[0] || "",
                  fonction: cols[1] || "",
                  aptitudes: cols[2] || "",
                  conditions: cols[3] || "",
                };
                if (Object.values(c).every((v) => (v ?? "") === "")) return;
                contacts.push(c);
              });
              continue;
            }

            // Unknown -> skip until next header
            readUntilNextHeader(() => {});
            continue;
          }

          i++; // not a header, advance
        }

        // Mirror XP for convenience
        generalInfo.XP = xp;

        // Write to localStorage
        try {
          localStorage.setItem(KEYS.generalInfo, JSON.stringify(generalInfo));
          localStorage.setItem(KEYS.stats, JSON.stringify(stats));
          localStorage.setItem(KEYS.pv, String(pv));
          localStorage.setItem(KEYS.pe, String(pe));
          localStorage.setItem(KEYS.skills, JSON.stringify(skills));
          localStorage.setItem(KEYS.objects, JSON.stringify(objects));
          localStorage.setItem(KEYS.familiers, JSON.stringify(familiers));
          localStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
          localStorage.setItem(KEYS.level, JSON.stringify(level));
          localStorage.setItem(KEYS.xp, JSON.stringify(xp));
          localStorage.setItem(KEYS.wanted, JSON.stringify(wantedIndex));
          localStorage.setItem(KEYS.wantedLabel, wantedLabel);
        } catch (err) {
          console.error("localStorage write error:", err);
        }

        console.log("[IMPORT] Done.", {
          stats, pv, pe, level, xp, wantedIndex, wantedLabel,
          counts: { skills: skills.length, objects: objects.length, familiers: familiers.length, contacts: contacts.length },
          samples: { skill: skills[0], object: objects[0], familier: familiers[0], contact: contacts[0] },
          generalInfo,
        });

        window.location.reload();
      } catch (err) {
        console.error("CSV import error:", err);
        alert("Erreur lors de l'import du CSV. Vérifiez le format.");
      }
    };

    reader.readAsText(file, "utf-8");
    e.target.value = "";
  };

  return (
    <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
      📥 Importer CSV
      <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
    </label>
  );
};

export default ImportButton;
