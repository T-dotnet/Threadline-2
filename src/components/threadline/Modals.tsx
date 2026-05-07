import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { BRAND, DIVIDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, TYPE_SCALE } from "./constants";

export function GlobalModals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modalType = searchParams.get("modal");
  
  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");
    newParams.delete("itemId");
    setSearchParams(newParams);
  };

  if (!modalType) return null;

  // Mock item for demonstration if needed, usually passed via searchParams or context
  const mockItem = { 
    type: 'evidence', 
    label: 'Behavioural pattern', 
    impact: 'Moderate' 
  };

  return (
    <>
      <ModifyModal isOpen={modalType === "modify"} onClose={closeModal} item={mockItem} />
      <SkipNextStepModal isOpen={modalType === "skip"} onClose={closeModal} item={mockItem} onConfirm={() => console.log("Confirmed skip")} />
      <CognitiveLoopModal isOpen={modalType === "cognitive_loop"} onClose={closeModal} />
    </>
  );
}

export function ModifyModal({ isOpen, onClose, item }: { isOpen: boolean, onClose: () => void, item: any }) {
  if (!isOpen) return null;

  const isCriteria = item.type === 'criteria';
  const isNextStep = item.type === 'nextstep';
  const isEvidence = !isCriteria && !isNextStep;

  const title = isNextStep ? "Modify Next Step" : isCriteria ? "Modify Criteria" : "Modify Evidence";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)"
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 480,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${DIVIDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{ fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>
                {title}
              </span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 32, maxHeight: "70vh", overflowY: "auto", boxSizing: "border-box" }}>
              
              {isEvidence ? (
                <>
                  <div style={{ position: "relative", width: "100%" }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "0 12px", display: "flex", alignItems: "center", position: "relative" }}>
                      <select 
                        defaultValue={item.label}
                        style={{ 
                          width: "100%", border: "none", background: "transparent", padding: "16px 0", 
                          fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)",
                          appearance: "none", outline: "none", cursor: "pointer", zIndex: 2
                        }}
                      >
                        <option value={item.label}>{item.label}</option>
                        <option value="Behavioural pattern">Behavioural pattern</option>
                        <option value="Mood Symptom">Mood Symptom</option>
                        <option value="Assessment Result">Assessment Result</option>
                        <option value="Other">Other</option>
                      </select>
                      <div style={{ position: "absolute", right: 12, pointerEvents: "none", zIndex: 1 }}>
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(0,0,0,0.56)">
                           <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                         </svg>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px", zIndex: 3 }}>
                      <p style={{ ...TYPE_SCALE.LabelMicro }}>Evidence Type</p>
                    </div>
                  </div>
                  
                  <div style={{ position: "relative", width: "100%" }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px" }}>
                      <textarea 
                        defaultValue="I mostly just go to work and come home."
                        style={{ 
                          width: "100%", border: "none", outline: "none", 
                          fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)",
                          resize: "none", minHeight: 48, background: "transparent"
                        }} 
                      />
                    </div>
                    <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px", zIndex: 3 }}>
                      <p style={{ ...TYPE_SCALE.LabelMicro }}>Evidence text</p>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px", background: "#eeeeee", fontSize: 16, color: "rgba(0,0,0,0.6)" }}>
                    {item.label}
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                    <p style={{ ...TYPE_SCALE.LabelMicro }}>
                      {isNextStep ? "Next step name:" : "Criterion Name:"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: BRAND, marginBottom: 16 }}>
                  {isEvidence ? "This evidence will be mapped to :" : isNextStep ? "Target level :" : "Suggested Status :"}
                </div>

                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ 
                    border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "12px 16px", 
                    display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 56
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {isEvidence ? (
                        ["Reduced activity", "Social withdrawal"].map(tag => (
                          <div key={tag} style={{ 
                            background: "#e0f2fe", color: "#0ea5e9", padding: "6px 12px", 
                            borderRadius: 20, fontSize: 14, fontWeight: 500,
                            display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(14, 165, 233, 0.2)"
                          }}>
                            {tag}
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, cursor: "pointer" }}>✕</div>
                          </div>
                        ))
                      ) : isNextStep ? (
                         <div style={{ 
                           background: "#e0f2fe", color: "#0ea5e9", padding: "6px 12px", 
                           borderRadius: 20, fontSize: 14, fontWeight: 500,
                           display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(14, 165, 233, 0.2)"
                         }}>
                           {item.impact}
                           <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, cursor: "pointer" }}>✕</div>
                         </div>
                      ) : (
                         <div style={{ 
                           background: "#ffefef", color: "#ff5252", padding: "6px 12px", 
                           borderRadius: 20, fontSize: 14, fontWeight: 500,
                           display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255, 82, 82, 0.2)"
                         }}>
                           Not Supported
                           <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ff5252", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, cursor: "pointer" }}>✕</div>
                         </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
                       <div style={{ cursor: "pointer" }}>
                         {isEvidence ? (
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M18 6L6 18M6 6l12 12"/>
                           </svg>
                         ) : (
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M3 12h14M13 8l4 4-4 4"/><path d="M21 12h-4"/><path d="M10 8L6 12l4 4"/>
                           </svg>
                         )}
                       </div>
                       {!isEvidence && <div style={{ height: 24, width: 1, background: "#d1d5db" }} />}
                       <div style={{ cursor: "pointer" }}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M6 9l6 6 6-6"/>
                         </svg>
                       </div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                    <p style={{ ...TYPE_SCALE.LabelMicro }}>
                      {isEvidence ? "Correct mapping" : isNextStep ? "Impact setting" : "Correct mapping"}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", width: "100%" }}>
                <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px" }}>
                  <textarea 
                    placeholder="Type here..."
                    defaultValue={!isEvidence && !isNextStep ? "No clear evidence in current transcript snippet" : ""}
                    style={{ 
                      width: "100%", border: "none", outline: "none", 
                      fontFamily: "inherit", fontSize: 16, color: "rgba(0,0,0,0.87)",
                      resize: "none", minHeight: 120, background: "transparent",
                      boxSizing: "border-box"
                    }} 
                  />
                </div>
                <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                  <p style={{ ...TYPE_SCALE.LabelMicro }}>
                    {isEvidence ? "Why does this map differently?" : isNextStep ? "Rationale/Additional notes" : "Reason Evidence"}
                  </p>
                </div>
                {isEvidence && (
                  <div style={{ marginTop: 8, ...TYPE_SCALE.LabelMicro }}>
                    Reason (optional)
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              padding: "16px 24px", 
              borderTop: `1px solid ${DIVIDER}`, 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: 12,
              background: "#f8f9fa"
            }}>
              <button 
                onClick={onClose} 
                style={{ 
                  padding: "10px 24px", border: "none", background: "none", 
                  color: BRAND, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" 
                }}
              >
                {isEvidence ? "Discard" : "Cancel"}
              </button>
              <button 
                onClick={onClose}
                style={{ 
                  padding: "10px 24px", border: "none", borderRadius: 4, 
                  background: BRAND, 
                  color: "white", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, 
                  cursor: "pointer", 
                  boxShadow: "0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 1px 5px rgba(0,0,0,.12)" 
                }}
              >
                {isEvidence ? "Save Correction" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SkipNextStepModal({ isOpen, onClose, item, onConfirm }: { isOpen: boolean, onClose: () => void, item: any, onConfirm: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 480, background: "white", borderRadius: 12, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Poppins', sans-serif"
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>Skip Next Step</span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 32, maxHeight: "70vh", overflowY: "auto", boxSizing: "border-box" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px", background: "#eeeeee", fontSize: 16, color: "rgba(0,0,0,0.6)" }}>
                  {item?.label}
                </div>
                <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                  <p style={{ ...TYPE_SCALE.LabelMicro }}>Next step name:</p>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: BRAND, marginBottom: 16 }}>Target level :</div>
                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 56 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ background: "#e0f2fe", color: "#0ea5e9", padding: "6px 12px", borderRadius: 20, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(14, 165, 233, 0.2)" }}>
                        {item?.impact}
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, cursor: "pointer" }}>✕</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                    <p style={{ ...TYPE_SCALE.LabelMicro }}>Impact setting</p>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", width: "100%" }}>
                <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px" }}>
                  <textarea 
                    placeholder="Type here..."
                    style={{ width: "100%", border: "none", outline: "none", fontFamily: "inherit", fontSize: 16, color: "rgba(0,0,0,0.87)", resize: "none", minHeight: 120, background: "transparent", boxSizing: "border-box" }} 
                  />
                </div>
                <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                  <p style={{ ...TYPE_SCALE.LabelMicro }}>Why are you skipping this next step?</p>
                </div>
                <div style={{ marginTop: 8, ...TYPE_SCALE.LabelMicro }}>Reason (optional)</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", gap: 12, background: "#f8f9fa" }}>
              <button onClick={onClose} style={{ padding: "10px 24px", border: "none", background: "none", color: BRAND, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                style={{ padding: "10px 24px", border: "none", borderRadius: 4, background: BRAND, color: "white", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 1px 5px rgba(0,0,0,.12)" }}
              >
                Skip Step
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CognitiveLoopModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 600, background: "white", borderRadius: 12, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Poppins', sans-serif"
            }}
          >
            <div style={{ padding: "24px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: TEXT_PRIMARY }}>The Cognitive Loop</span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 24, maxHeight: "70vh", overflowY: "auto" }}>
              <p style={{ fontSize: 15, color: TEXT_SECONDARY, lineHeight: 1.6, margin: 0 }}>
                The Cognitive Loop is a structured sequential process designed to guide clinical reasoning and ensure thorough evaluation of diagnostic evidence.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { step: 1, label: "Initial Evidence Collection", desc: "Gathering and documenting raw clinical observations and data points." },
                  { step: 2, label: "Feature Extraction", desc: "Identifying key clinical features and patterns from the collected evidence." },
                  { step: 3, label: "Criterion Mapping", desc: "Mapping clinical features to formal diagnostic criteria from established guidelines." },
                  { step: 4, label: "Uncertainty Analysis", desc: "Reviewing mapping confidence and identifying gaps or contradictions in evidence." },
                  { step: 5, label: "Refinement & Next Steps", desc: "Defining specific actions to resolve clinical uncertainty or gather missing data." },
                  { step: 6, label: "Clinical Formulation", desc: "Finalising the working impression based on the validated evidence chain." }
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 16 }}>
                    <div style={{ 
                      width: 28, height: 28, borderRadius: "50%", background: BRAND, color: "white", 
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 
                    }}>
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", background: "#f8f9fa" }}>
              <button 
                onClick={onClose}
                style={{ padding: "10px 32px", borderRadius: 6, background: BRAND, color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
