// src/Components/Layout/AppHeader.js
import React, { useEffect, useMemo, useState } from "react";
import XpProgressCircle from "../XpProgressCircle";

export default function AppHeader() {
  // ---------- helpers ----------
  const readInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("character_generalInfo") || "{}");
    } catch {
      return {};
    }
  };

  const readLevel = () => {
    try {
      const raw = localStorage.getItem("character_level");
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
    return 1;
  };

  const readWantedLabel = () => {
    // Prefer stored label; fall back to index → label
    try {
      const lbl = localStorage.getItem("character_wanted_label");
      if (lbl) return lbl;
    } catch {}
    try {
      const idxRaw = localStorage.getItem("character_wanted_index");
      const idx = idxRaw ? Number(idxRaw) : 1;
      const clamp = (n) => Math.max(1, Math.min(7, Number.isFinite(n) ? n : 1));
      const i = clamp(idx);
      const NAMES = [
        null,
        "petit vol",
        "violence aggravée",
        "meurtre",
        "Multiples meurtres",
        "Attentat",
        "Génocide",
        "Destruction planétaire",
      ];
      return `${NAMES[i]} (${Array(i).fill("⭐").join("")})`;
    } catch {}
    return "petit vol (⭐)";
  };

  const [info, setInfo] = useState(readInfo);
  const [level, setLevel] = useState(readLevel);
  const [wantedLabel, setWantedLabel] = useState(readWantedLabel());

  // Mirror level changes to localStorage (XP circle also writes it on level up)
  useEffect(() => {
    try {
      localStorage.setItem("character_level", JSON.stringify(level));
      window.dispatchEvent(new Event("character_level_updated"));
    } catch {}
  }, [level]);

  // Refresh header data when LS changes (import, other widgets)
  useEffect(() => {
    const refresh = () => {
      setInfo(readInfo());
      setLevel(readLevel());
      setWantedLabel(readWantedLabel());
    };
    const onStorage = (e) => {
      if (!e || e.key == null) return;
      if (
        e.key === "character_generalInfo" ||
        e.key === "character_level" ||
        e.key === "character_xp" ||
        e.key === "character_wanted_label" ||
        e.key === "character_wanted_index"
      ) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    window.addEventListener("character_xp_updated", refresh);
    window.addEventListener("character_level_updated", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("character_xp_updated", refresh);
      window.removeEventListener("character_level_updated", refresh);
    };
  }, []);

  const name =
    (info.nom && String(info.nom).trim()) ||
    (info.pseudo && String(info.pseudo).trim()) ||
    "Personnage";

  // lowercase wanted label for the "small case" requirement
  const wantedSmall = (wantedLabel || "").toLocaleLowerCase("fr-FR");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 h-[100px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full display-flex ">
        <div className="h-full display-flex items-center gap-4" style={{ display: "flex" , alignItems: "center", gap: "16px" }}>
          {/* Left: XP circle (scaled to fit the 100px header) */}
          <div
            className="shrink-0"
            style={{ transform: "scale(0.83)", transformOrigin: "left center" }}
          >
            <XpProgressCircle level={level} setLevel={setLevel} />
          </div>

          {/* Right: Identity block (name, level, wanted) */}
          <div className="min-w-0 display-flex flex flex-col justify-center">
            {/* Title row */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{name}</h1>
            </div>

            {/* Niveau (below the name) */}
            <div className="text-sm text-gray-700 mt-0.5">
              {/* requirement: "niveau XXX" in lowercase "niveau" */}
              <span>niveau {level}</span>
            </div>

            {/* Indice de recherche (below, small text, lowercase) */}
            <div className="text-[11px] text-gray-500 mt-0.5">
              <span>indice de recherche: {wantedSmall}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
