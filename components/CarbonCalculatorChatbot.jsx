// components/CarbonCalculatorChatbot.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const activitiesDefault = [
  { key: "tree", label: "Tree Planting", points: 10 },
  { key: "recycling", label: "Recycling", points: 10 },
  { key: "cleanup", label: "Campus Cleanup", points: 10 },
  { key: "energy", label: "Energy Efficient Step", points: 10 },
  { key: "water", label: "Water Conservation", points: 10 },
];

function getMockResult(input) {
  // Simple static mock result for fallback
  return {
    summary:
      "Based on your actions, you've reduced about 25 kg CO₂ and earned 50 green points. Great job!",
    details: [
      { label: "Carbon saved", value: "25 kg CO₂" },
      { label: "Points earned", value: "50 points" },
      { label: "Equivalent to planting", value: "1.2 trees" },
    ],
  };
}

export default function CarbonCalculatorChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  // default: start with tree selected (so UI isn't empty)
  const [selected, setSelected] = useState(["tree"]);
  const [input, setInput] = useState({
    tree: "2",
    recycling: "",
    cleanup: "",
    energy: "",
    water: "",
    waterSaved: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Compose and call Gemini (or fallback)
  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);

    const prompt = `I did these eco activities on my university campus:

${selected.includes("tree") ? `Planted ${input.tree || 0} trees. ` : ""}
${selected.includes("recycling") ? `Recycled ${input.recycling || 0} kg waste. ` : ""}
${selected.includes("cleanup") ? `Cleaned ${input.cleanup || 0} km area. ` : ""}
${selected.includes("energy") ? `Energy steps: ${input.energy || ""}` : ""}
${selected.includes("water") ? `Water steps: ${input.water || ""}. Saved ${input.waterSaved || 0} litres.` : ""}

Please estimate my carbon impact in kg co2 saved, points (10 per action), and give a short friendly summary.`;

    try {
      if (!apiKey) throw new Error("No API key"); // force fallback if key missing

   const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
    }),
  }
);

      if (!res.ok) throw new Error("API request failed: " + res.status);

      const data = await res.json();

      // Robustly extract text from various possible shapes
      let text = "";

      // Example shapes:
      // data.candidates -> array of candidates
      // candidate.content -> may be array of pieces, or object with parts
      if (data?.candidates && Array.isArray(data.candidates)) {
        for (const cand of data.candidates) {
          if (!cand) continue;
          // candidate.content might be an array or object
          const content = cand.content ?? cand;
          if (Array.isArray(content)) {
            // each content item may have parts which have text
            for (const c of content) {
              if (c?.parts && Array.isArray(c.parts)) {
                for (const p of c.parts) {
                  if (p?.text) {
                    text += (text ? "\n" : "") + p.text;
                  }
                }
              } else if (typeof c === "string") {
                text += (text ? "\n" : "") + c;
              } else if (c?.text) {
                text += (text ? "\n" : "") + c.text;
              }
            }
          } else if (content?.parts && Array.isArray(content.parts)) {
            for (const p of content.parts) {
              if (p?.text) text += (text ? "\n" : "") + p.text;
            }
          } else if (cand?.text) {
            text += (text ? "\n" : "") + cand.text;
          }
        }
      } else if (typeof data?.text === "string") {
        text = data.text;
      }

      // final fallback to empty string
      text = (text || "").trim();

      if (!text) throw new Error("No text returned from API");

      setResult({
        summary: text,
        details: [],
      });
    } catch (e) {
      // fallback mock result
      setResult(getMockResult(input));
      // (optional) console for dev
      // console.error("Calc failed, using fallback:", e);
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  // UI helpers
  function reset() {
    setInput({
      tree: "2",
      recycling: "",
      cleanup: "",
      energy: "",
      water: "",
      waterSaved: "",
    });
    setStep(1);
    setResult(null);
    setSelected(["tree"]);
  }

  // keep ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-[1000]">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.75 }}
              transition={{ duration: 0.18, type: "spring" }}
              onClick={() => setOpen(true)}
              className="w-16 h-16 rounded-full shadow-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white text-3xl flex items-center justify-center border-4 border-white hover:scale-110 transition-all"
              aria-label="Open Carbon Calculator"
            >
              🌱
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Modal popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[1100] flex items-end justify-end"
            style={{ pointerEvents: "auto" }}
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* overlay */}
            <div
              className="fixed inset-0 bg-black/40"
              style={{ zIndex: 10 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel/modal */}
            <motion.div
              initial={{ y: 200, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 150, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md mx-auto mb-8 mr-8 bg-white rounded-3xl shadow-2xl border border-emerald-200 relative z-50 overflow-hidden"
              style={{ minWidth: 350 }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-5 py-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-100 to-green-50">
                <div className="font-bold text-emerald-700 text-lg flex items-center gap-2">
                  <span className="text-2xl">🌱</span> Carbon Calculator
                </div>
                <button
                  className="text-2xl text-emerald-600 hover:text-red-500 rounded-full p-1 hover:bg-emerald-100"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              {/* Multi-step Content */}
              <div className="p-6">
                {step === 1 && (
                  <>
                    <div className="mb-5 text-center">
                      <div className="font-bold text-emerald-700 mb-1">
                        Select Your Activities
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        Pick the activities you did today.
                        <br />
                        <span className="text-xs">
                          (Each gives you points and climate impact!)
                        </span>
                      </div>
                      {/* Activities Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {activitiesDefault.map((act) => (
                          <button
                            key={act.key}
                            type="button"
                            onClick={() =>
                              setSelected((prev) =>
                                prev.includes(act.key)
                                  ? prev.filter((k) => k !== act.key)
                                  : [...prev, act.key]
                              )
                            }
                            className={`rounded-xl p-3 font-semibold border text-sm flex flex-col items-center transition bg-white hover:bg-emerald-50 ${
                              selected.includes(act.key)
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow"
                                : "border-gray-200 text-gray-700"
                            }`}
                          >
                            {act.label}
                            <span className="text-xs mt-1 text-emerald-600 font-bold">
                              +{act.points} points
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="w-full py-2 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition"
                      onClick={() => setStep(2)}
                      disabled={selected.length === 0}
                    >
                      Next
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-2 text-emerald-700 font-bold">
                      Activity Details
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCalculate();
                      }}
                    >
                      {selected.includes("tree") && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 text-sm mb-1">
                            Tree Planting
                          </div>
                          <input
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200"
                            type="number"
                            min="0"
                            step="1"
                            value={input.tree}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                tree: e.target.value,
                              }))
                            }
                            placeholder="Number of trees planted"
                          />
                        </div>
                      )}
                      {selected.includes("recycling") && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 text-sm mb-1">
                            Recycling (kg)
                          </div>
                          <input
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200"
                            type="number"
                            min="0"
                            step="0.1"
                            value={input.recycling}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                recycling: e.target.value,
                              }))
                            }
                            placeholder="Weight recycled (kg)"
                          />
                        </div>
                      )}
                      {selected.includes("cleanup") && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 text-sm mb-1">
                            Campus Cleanup (km)
                          </div>
                          <input
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200"
                            type="number"
                            min="0"
                            step="0.1"
                            value={input.cleanup}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                cleanup: e.target.value,
                              }))
                            }
                            placeholder="Distance cleaned (km)"
                          />
                        </div>
                      )}
                      {selected.includes("energy") && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 text-sm mb-1">
                            Energy Efficient Step
                          </div>
                          <textarea
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200"
                            rows={2}
                            value={input.energy}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                energy: e.target.value,
                              }))
                            }
                            placeholder="Describe what you did"
                          />
                        </div>
                      )}
                      {selected.includes("water") && (
                        <div className="mb-4">
                          <div className="font-semibold text-gray-700 text-sm mb-1">
                            Water Conservation
                          </div>
                          <textarea
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200"
                            rows={2}
                            value={input.water}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                water: e.target.value,
                              }))
                            }
                            placeholder="Describe the action"
                          />
                          <div className="mt-2 text-xs text-gray-500 text-center">
                            OR
                          </div>
                          <input
                            className="w-full border px-3 py-2 rounded-lg border-emerald-200 mt-1"
                            type="number"
                            min="0"
                            step="1"
                            value={input.waterSaved}
                            onChange={(e) =>
                              setInput((inp) => ({
                                ...inp,
                                waterSaved: e.target.value,
                              }))
                            }
                            placeholder="Water saved (litres)"
                          />
                        </div>
                      )}
                      <button
                        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition mt-4"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Calculating..." : "Calculate Carbon Impact"}
                      </button>
                      <button
                        className="w-full mt-2 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                        type="button"
                        onClick={reset}
                        disabled={loading}
                      >
                        Back
                      </button>
                    </form>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="mb-3 flex items-center gap-2 text-emerald-700 font-bold">
                      <span className="text-xl">✅</span> Result
                    </div>
                    <div className="mb-4 bg-emerald-50 p-3 rounded-lg text-gray-800 text-sm shadow-inner">
                      {result && (
                        <div>
                          <div className="mb-2 font-semibold">{result.summary}</div>
                          {result.details && (
                            <ul className="space-y-1">
                              {result.details.map((d, i) => (
                                <li key={i}>
                                  <span className="font-medium">{d.label}:</span> {d.value}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      className="w-full mb-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 transition hover:from-emerald-600 hover:to-green-800"
                      onClick={() => reset()}
                    >
                      Calculate again
                    </button>
                    <button
                      className="w-full py-2 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
