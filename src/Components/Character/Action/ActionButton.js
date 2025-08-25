// src/Components/Action/ActionButton.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ============================
   Small helpers
============================ */
const num = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const signed = (v) => {
  if (v === null || v === undefined) return 0;
  const m = String(v).trim().match(/[+-]?\d+(\.\d+)?/);
  return m ? Number(m[0]) || 0 : 0;
};

/* ============================
   Focus trap (no external libs)
============================ */
function useFocusTrap(enabled, returnToRef) {
  const containerRef = useRef(null);
  const prevActiveRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    prevActiveRef.current = document.activeElement;

    const selector =
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () => {
      const nodes = Array.from(container.querySelectorAll(selector));
      return nodes.filter((el) => el.offsetParent !== null || el === container);
    };

    // Initial focus
    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const list = getFocusable();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === first || current === container) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (current === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      const rtn = returnToRef?.current || prevActiveRef.current;
      if (rtn && typeof rtn.focus === "function") {
        setTimeout(() => rtn.focus(), 0);
      }
    };
  }, [enabled, returnToRef]);

  return containerRef;
}

/* ============================
   SlideOver (Drawer from right)
   - Portal to body
   - Backdrop (click closes)
   - ESC to close
   - Focus trap
   - Body scroll lock
============================ */
function SlideOver({
  open,
  onClose,
  titleId = "action-drawer-title",
  widthClass = "w-full max-w-[520px]",
  children,
}) {
  const panelRef = useRef(null);
  const closeRef = useRef(null); // return focus to trigger (parent passes it)
  const trapRef = useFocusTrap(open, closeRef);

  // Attach the returnToRef from parent (if provided) through a setter
  useEffect(() => {
    // no-op here; parent sets closeRef.current externally before open
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel (right) */}
      <div
        ref={(node) => {
          panelRef.current = node;
          trapRef.current = node; // focus trap container
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 ${widthClass}
                    transform transition-transform duration-300 ease-out translate-x-0`}
        // stop click from closing when clicking inside
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ============================
   ActionButton (opens SlideOver)
============================ */
export default function ActionButton({
  characteristics = {}, // { attaque, defense, volonte }
  skills = [],
  objects = [],
}) {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);

  // base caracs
  const baseCaracs = {
    attaque: num(characteristics.attaque),
    defense: num(characteristics.defense),
    volonte: num(characteristics.volonte),
  };

  // selections
  const [selectedCarac, setSelectedCarac] = useState("attaque");
  const [skillIndex, setSkillIndex] = useState(-1);
  const [skillPart, setSkillPart] = useState("none"); // 'none' | 'part1' | 'part2'
  const [objectIndex, setObjectIndex] = useState(-1);

  // roll
  const [dSides, setDSides] = useState(20);
  const [rolled, setRolled] = useState(null);

  // selected entities
  const selectedSkill = useMemo(
    () => (skillIndex >= 0 && skillIndex < skills.length ? skills[skillIndex] : null),
    [skillIndex, skills]
  );
  const selectedObject = useMemo(
    () => (objectIndex >= 0 && objectIndex < objects.length ? objects[objectIndex] : null),
    [objectIndex, objects]
  );

  const base = baseCaracs[selectedCarac] ?? 0;
  const skillBonus =
    selectedSkill && skillPart === "part1"
      ? num(selectedSkill.part1_bonus)
      : selectedSkill && skillPart === "part2"
      ? num(selectedSkill.part2_bonus)
      : 0;
  const objectBonus = selectedObject ? signed(selectedObject.bonus) : 0;
  const objectMalusAbs = Math.abs(selectedObject ? signed(selectedObject.malus) : 0);
  const total = base + skillBonus + objectBonus - objectMalusAbs;

  const doRoll = () => {
    const sides = Math.max(2, num(dSides));
    const r = Math.floor(Math.random() * sides) + 1;
    setRolled(r);
  };

  return (
    <>
      {/* Trigger lives in normal layout */}
      <button
        ref={triggerRef}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        onClick={() => setOpen(true)}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        🎯 Action
      </button>

      {/* SlideOver renders ABOVE layout via portal */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        titleId="action-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 id="action-drawer-title" className="text-base font-semibold text-gray-900">
            Préparer une action
          </h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 px-2 py-1"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 grid md:grid-cols-2 gap-4 h-[calc(100%-56px)] overflow-auto">
          {/* Left: choices */}
          <div className="space-y-4">
            {/* Carac */}
            <div>
              <div className="text-xs font-medium text-gray-600 mb-2">Caractéristique</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "attaque", label: `Attaque (${baseCaracs.attaque || 0})` },
                  { key: "defense", label: `Défense (${baseCaracs.defense || 0})` },
                  { key: "volonte", label: `Volonté (${baseCaracs.volonte || 0})` },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedCarac(opt.key)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedCarac === opt.key
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill */}
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Compétence (optionnelle)</div>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={skillIndex}
                onChange={(e) => {
                  setSkillIndex(Number(e.target.value));
                  setSkillPart("none");
                }}
              >
                <option value={-1}>— Aucune —</option>
                {skills.map((s, idx) => (
                  <option key={`${s.nom}-${idx}`} value={idx}>
                    {s.nom} {s.info ? `— ${s.info}` : ""}
                  </option>
                ))}
              </select>

              {selectedSkill && (
                <div className="mt-2 space-y-2">
                  <div className="text-[11px] text-gray-500">
                    Caracs: {selectedSkill.carac1 || "—"} / {selectedSkill.carac2 || "—"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className={`text-sm px-2 py-1 rounded border cursor-pointer ${skillPart==="none" ? "bg-gray-100" : "bg-white"}`}>
                      <input
                        type="radio"
                        name="skillPart"
                        value="none"
                        className="mr-1"
                        checked={skillPart === "none"}
                        onChange={() => setSkillPart("none")}
                      />
                      Aucune
                    </label>
                    {selectedSkill.part1 && (
                      <label className={`text-sm px-2 py-1 rounded border cursor-pointer ${skillPart==="part1" ? "bg-gray-100" : "bg-white"}`}>
                        <input
                          type="radio"
                          name="skillPart"
                          value="part1"
                          className="mr-1"
                          checked={skillPart === "part1"}
                          onChange={() => setSkillPart("part1")}
                        />
                        {selectedSkill.part1} (+{num(selectedSkill.part1_bonus)}) · {selectedSkill.part1_uses ?? 0} uses
                      </label>
                    )}
                    {selectedSkill.part2 && (
                      <label className={`text-sm px-2 py-1 rounded border cursor-pointer ${skillPart==="part2" ? "bg-gray-100" : "bg-white"}`}>
                        <input
                          type="radio"
                          name="skillPart"
                          value="part2"
                          className="mr-1"
                          checked={skillPart === "part2"}
                          onChange={() => setSkillPart("part2")}
                        />
                        {selectedSkill.part2} (+{num(selectedSkill.part2_bonus)}) · {selectedSkill.part2_uses ?? 0} uses
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Object */}
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Objet (optionnel)</div>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={objectIndex}
                onChange={(e) => setObjectIndex(Number(e.target.value))}
              >
                <option value={-1}>— Aucun —</option>
                {objects.map((o, idx) => (
                  <option key={`${o.nom}-${idx}`} value={idx}>
                    {o.nom} {o.categorie ? `— ${o.categorie}` : ""}
                  </option>
                ))}
              </select>
              {selectedObject && (
                <div className="mt-2 text-[12px] text-gray-600">
                  Bonus: {signed(selectedObject.bonus)} / Malus: {signed(selectedObject.malus)}
                </div>
              )}
            </div>
          </div>

          {/* Right: summary + roll */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Résumé</div>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>
                  Base (<span className="capitalize">{selectedCarac}</span>): <b>{base}</b>
                </li>
                <li>Compétence: <b>{skillBonus >= 0 ? `+${skillBonus}` : skillBonus}</b></li>
                <li>Objet: <b>{objectBonus >= 0 ? `+${objectBonus}` : objectBonus}</b></li>
                <li>Malus objet: <b>-{objectMalusAbs}</b></li>
              </ul>
              <div className="mt-2 text-lg">
                Total: <b>{total}</b>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Jet (optionnel)</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Dé</span>
                <input
                  type="number"
                  min={2}
                  step={1}
                  value={dSides}
                  onChange={(e) => setDSides(e.target.value)}
                  className="w-20 border rounded px-2 py-1"
                />
                <button
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded"
                  onClick={doRoll}
                  type="button"
                >
                  🎲 Lancer
                </button>
              </div>
              {rolled !== null && (
                <div className="mt-2 text-sm text-gray-800">
                  Jet: <b>{rolled}</b> → Résultat: <b>{rolled + total}</b>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
                onClick={() => setOpen(false)}
                type="button"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </SlideOver>
    </>
  );
}
