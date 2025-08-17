import React from "react";

const ImportButton = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
        console.log("🔍 Contenu brut du fichier :", text); // ← Ajout temporaire
      parseCsvContent(text);
    };
    reader.readAsText(file);
  };

  const parseCsvContent = (text) => {
    console.log("📦 Début de parsing CSV");

    const lines = text.split("\n").map((line) => line.trim());
    let section = "";
    const sections = {
      info: {},
      stats: {},
      pv: 0,
      pe: 0,
      skills: [],
      objects: [],
      familiers: [],
      contacts: [],
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("[") && line.endsWith("]")) {
        section = line;
          console.log("➡️ Section détectée :", section); // ← Ajout
        continue;
      }

      if (!line || line.startsWith("FICHE DE PERSONNAGE")) continue;

      switch (section) {
        case "[Informations Générales]": {
          const [key, value] = line.split(";");
          if (key) sections.info[key] = value;
          break;
        }

        case "[Caractéristiques]": {
          const [key, value] = line.split(";");
          if (key === "PV") sections.pv = parseInt(value, 10);
          else if (key === "PE") sections.pe = parseInt(value, 10);
          else if (key) sections.stats[key] = parseInt(value, 10);
          break;
        }

        case "[Compétences]": {
          if (line.startsWith("Nom;")) break;
          const [
            nom, info, carac1, carac2,
            part1, part1_uses, part1_bonus,
            part2, part2_uses, part2_bonus
          ] = line.split(";");

          sections.skills.push({
            nom, info, carac1, carac2,
            part1, part1_uses: +part1_uses, part1_bonus: +part1_bonus,
            part2, part2_uses: +part2_uses, part2_bonus: +part2_bonus
          });
          break;
        }

        case "[Objets]": {
          if (line.startsWith("Nom;")) break;
          const [
            nom, PR, DGT, PDE, reservoir, prix_plein,
            nb_km, qualite, prix, poids,
            type_objet, type_minerai, qte_minerai,
            bonus, malus, categorie
          ] = line.split(";");

          sections.objects.push({
            nom, PR, DGT, PDE, reservoir, prix_plein,
            nb_km, qualite, prix, poids,
            type_objet, type_minerai, qte_minerai,
            bonus, malus, categorie
          });
          break;
        }

        case "[PNJ / Familiers]": {
          if (line.startsWith("Nom;")) break;
          const [
            nom, niveau, pvMin, pvMax, peMin, peMax,
            nomAttaque, valAttaque,
            nomDefense, valDefense,
            nomVolonte, valVolonte,
            nomSpecial, valSpecial,
            xpMin, xpMax, description, forces, faiblesses, objetsStr
          ] = line.split(";");

          const objets = (objetsStr || "")
            .split("|")
            .map(o => {
              const [nom, PR, DGT, PDE, qualite] = o.split(":");
              return { nom, PR, DGT, PDE, qualite };
            })
            .filter(o => o.nom); // évite les vides

          sections.familiers.push({
            nom, niveau, pvMin, pvMax, peMin, peMax,
            nomAttaque, valAttaque,
            nomDefense, valDefense,
            nomVolonte, valVolonte,
            nomSpecial, valSpecial,
            xpMin, xpMax, description, forces, faiblesses, objets
          });
          break;
        }

        case "[Contacts]": {
          if (line.startsWith("Nom;")) break;
          const [nom, fonction, aptitudes, conditions] = line.split(";");
          sections.contacts.push({ nom, fonction, aptitudes, conditions });
          break;
        }

        default:
          break;
      }
    }

    // Sauvegarde
    localStorage.setItem("character_generalInfo", JSON.stringify(sections.info));
    localStorage.setItem("character_stats", JSON.stringify(sections.stats));
    localStorage.setItem("character_pv", sections.pv);
    localStorage.setItem("character_pe", sections.pe);
    localStorage.setItem("character_skills", JSON.stringify(sections.skills));
    localStorage.setItem("character_objects", JSON.stringify(sections.objects));
    localStorage.setItem("character_familiers", JSON.stringify(sections.familiers));
    localStorage.setItem("character_contacts", JSON.stringify(sections.contacts));
    console.log("✅ Sauvegardé compétences :", sections.skills);

    alert("✅ Données importées avec succès !");
    window.location.reload(); // Recharge la page pour tout refléter
  };

  return (
    <div className="mt-4">
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
        📥 Importer CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImportButton;
