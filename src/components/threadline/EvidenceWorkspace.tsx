import React, { useState, useRef } from "react";
import { Toast, SignalBox } from "./components";
import { ModifyModal, SkipNextStepModal } from "./Modals";
import { ReviewItem } from "./ReviewItem";
import { BRAND, ACCEPTED_BG, REJECTED_BG, DEFERRED_BG, BRAND_LIGHT, 
  DEFERRED_ICON_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, 
  DIVIDER, primaryBtn, outlineBtn, cardStyle, cardHeaderStyle, h1Style, subStyle, TYPE_SCALE } from "./constants";
import { ArrowLeft as BackArrow, RotateCcw as ResetIcon, AlertTriangle, AlertCircle, Edit3 as EditIcon, ExternalLink, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

import { AssessmentGate } from "./AssessmentGate";
import { SectionHeader } from "../common/SectionHeader";
import { WorkspaceContainer } from "../common/WorkspaceContainer";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { ConfidenceBadge, mapScoreToConfidence } from "../ConfidenceBadge";

import { MOCK_EVIDENCE_ITEMS, MOCK_CONFLICTS, MOCK_MISSING_DOCUMENTS } from "./mockData";
import { FEATURE_CONFIDENCE_THRESHOLD as CONFIDENCE_THRESHOLD } from "./constants";

export function EvidenceWorkspace({ 
  onViewProfile, 
  onNavigateToAssessments,
  onNavigateToDocuments 
}: { 
  onViewProfile?: () => void, 
  onNavigateToAssessments?: () => void,
  onNavigateToDocuments?: () => void
}) {
  const { flags } = useFeatureFlags();
  const { setConflicts, setMissingDocuments, setAcceptedMappings, setLowConfidenceMappings } = useWorkspaceAlerts();

  // TODO: acceptedMappings must be written to shared assessment state in EvidenceWorkspace for this check to function
  
  // TODO: Gemini response must include sourceDocumentId per mapping for this feature to function
  const [items, setItems] = useState(MOCK_EVIDENCE_ITEMS);
  
  const [activeItem, setActiveItem] = useState("Journal Entry");
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [deferredItems, setDeferredItems] = useState<string[]>([]);
  const [acceptedItem, setAcceptedItem] = useState<string | null>(null);
  const [rejectedItems, setRejectedItems] = useState<Record<string, string>>({});
  const [isRejecting, setIsRejecting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | 'modify' | null>(null);
  const [rationale, setRationale] = useState("");
  const rationaleRef = useRef<HTMLTextAreaElement>(null);

  const currentItem = items.find(i => i.label === activeItem) || items[0];
  const isCriteria = currentItem.type === 'criteria';
  const isNextStep = currentItem.type === 'nextstep';
  const itemConfidence = parseFloat(currentItem.score);
  const hasConflict = flags.FEATURE_WORKSPACE_STATUS_BAR && (currentItem.hasConflict);
  
  const requiresRationale = (action: 'accept' | 'reject' | 'modify') => {
    if (action === 'reject') return true;
    if (action === 'modify') return true;
    if (action === 'accept' && itemConfidence < CONFIDENCE_THRESHOLD) return true;
    if (hasConflict) return true;
    if (deferredItems.includes(activeItem)) return true;
    return false;
  };

  const getSystemSuggestedRationale = (action: 'accept' | 'reject' | 'modify') => {
    if (action === 'accept') return `Evidence strongly supports the ${currentItem.type} mapping based on clinical guidelines.`;
    if (action === 'reject') return `Insufficient semantic overlap between evidence and ${currentItem.type} criteria.`;
    if (action === 'modify') return `Refined mapping to better capture clinical nuance of ${currentItem.label}.`;
    return "";
  };

  const handleActionClick = (action: 'accept' | 'reject' | 'modify') => {
    if (requiresRationale(action)) {
      setActiveAction(action);
      setRationale(getSystemSuggestedRationale(action));
      setTimeout(() => rationaleRef.current?.focus(), 50);
    } else {
      if (action === 'accept') handleAccept();
      if (action === 'reject') setIsRejecting(true); // Fallback to existing logic if needed
      if (action === 'modify') setIsModifyOpen(true);
    }
  };

  const commitAction = () => {
    if (activeAction === 'accept') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "ACCEPT",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      handleAccept();
    } else if (activeAction === 'reject') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "REJECT",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      handleReject(rationale);
    } else if (activeAction === 'modify') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "MODIFY",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      setIsModifyOpen(true);
    }
    setActiveAction(null);
    setRationale("");
  };

  const handleDefer = () => {
    if (!deferredItems.includes(activeItem)) {
      setDeferredItems([...deferredItems, activeItem]);
    }
  };

  const handleReject = (reason: string) => {
    setRejectedItems({ ...rejectedItems, [activeItem]: reason });
    setIsRejecting(false);
  };

  const handleUndoReject = () => {
    const newRejected = { ...rejectedItems };
    delete newRejected[activeItem];
    setRejectedItems(newRejected);
  };

  const handleAccept = () => {
    setAcceptedItem(activeItem);
    setShowToast(true);

    // Update shared state for completeness check
    const acceptedItemData = items.find(i => i.label === activeItem);
    if (acceptedItemData) {
      setAcceptedMappings((prev: any[]) => {
        // Prevent duplicates
        if (prev.find(m => m.id === activeItem)) return prev;
        return [...prev, { id: activeItem, label: activeItem, confidence: parseFloat(acceptedItemData.score) || 0 }];
      });
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      
      const currentIndex = items.findIndex(i => i.label === activeItem);
      const nextItem = items[currentIndex + 1] || items[currentIndex - 1] || null;
      
      setItems(prev => prev.filter(i => i.label !== activeItem));
      setAcceptedItem(null);
      
      if (nextItem) {
        setActiveItem(nextItem.label);
      }
      transitionTimeoutRef.current = null;
    }, 3000);
  };

  const handleUndoAccept = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setAcceptedMappings((prev: any[]) => prev.filter(m => m.id !== activeItem));
    setAcceptedItem(null);
    setShowToast(false);
  };

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <div style={{ padding: "0 0 64px" }}>
        {/* Page Header */}
        <SectionHeader 
          title="Evidence Workspace"
          subtitle="Review extracted evidence, assess diagnostic criteria, and identify next steps"
          small={true}
        />

        <WorkspaceContainer
          height={800}
          sidebarWidth={280}
          sidebarContent={
            <>
            <div style={{ padding: "24px 20px", borderBottom: `1px solid ${DIVIDER}` }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>Review Queue</h2>
            </div>
            
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f8f9fa" }}>
              Evidence ({items.filter(i => i.type === 'evidence').length})
            </div>
            {items.filter(i => i.type === 'evidence').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
            
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f8f9fa", borderTop: `1px solid ${DIVIDER}` }}>
              Criteria ({items.filter(i => i.type === 'criteria').length})
            </div>
            {items.filter(i => i.type === 'criteria').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
    
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f8f9fa", borderTop: `1px solid ${DIVIDER}` }}>
              Next steps ({items.filter(i => i.type === 'nextstep').length})
            </div>
            {items.filter(i => i.type === 'nextstep').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.type === 'nextstep' ? (item as any).impact : item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
    
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f8f9fa", borderTop: `1px solid ${DIVIDER}` }}>
              Deferred ({deferredItems.length})
            </div>
            {deferredItems.map(item => (
              <div key={item} style={{ padding: "16px 24px", background: "#f0f9f1", borderLeft: `4px solid ${BRAND}` }}>
                <div style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 4, fontWeight: 500 }}>{item}</div>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>Relevance score : <span style={{ fontWeight: 600 }}>0.89</span></div>
              </div>
            ))}
            </>
          }
          mainContent={
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toast message={`${activeItem} successfully accepted`} visible={showToast} />
            <ModifyModal 
              isOpen={isModifyOpen} 
              onClose={() => setIsModifyOpen(false)} 
              item={currentItem}
            />
            <SkipNextStepModal
              isOpen={isSkipOpen}
              onClose={() => setIsSkipOpen(false)}
              item={currentItem}
              onConfirm={handleAccept}
            />
            {/* Stepper + Navigation Row */}
            <div style={{ padding: "20px 32px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'evidence' ? BRAND : "#e0e0e0", color: currentItem.type === 'evidence' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>1</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'evidence' ? 600 : 500, color: currentItem.type === 'evidence' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Evidence</span>
              </div>
              <div style={{ height: 1, width: 40, background: DIVIDER }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'criteria' ? BRAND : "#e0e0e0", color: currentItem.type === 'criteria' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>2</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'criteria' ? 600 : 500, color: currentItem.type === 'criteria' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Criteria</span>
              </div>
              <div style={{ height: 1, width: 40, background: DIVIDER }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'nextstep' ? BRAND : "#e0e0e0", color: currentItem.type === 'nextstep' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>3</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'nextstep' ? 600 : 500, color: currentItem.type === 'nextstep' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Next Steps</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>Item <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{items.findIndex(i => i.label === activeItem) + 1}</span> of {items.length}</span>
              <button 
                onClick={() => {
                  const idx = items.findIndex(i => i.label === activeItem);
                  if (idx > 0) setActiveItem(items[idx - 1].label);
                }}
                disabled={items.findIndex(i => i.label === activeItem) === 0}
                style={{ ...outlineBtn, padding: "8px 24px", color: items.findIndex(i => i.label === activeItem) === 0 ? TEXT_DISABLED : TEXT_PRIMARY, borderColor: DIVIDER, display: "flex", alignItems: "center", gap: 8 }}
              >
                <BackArrow size={16} /> Previous
              </button>
              <button 
                onClick={() => {
                  const idx = items.findIndex(i => i.label === activeItem);
                  if (idx < items.length - 1) setActiveItem(items[idx + 1].label);
                }}
                disabled={items.findIndex(i => i.label === activeItem) === items.length - 1}
                style={{ ...primaryBtn, padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, opacity: items.findIndex(i => i.label === activeItem) === items.length - 1 ? 0.6 : 1 }}
              >
                Next <div style={{ transform: "rotate(180deg)" }}><BackArrow size={16} /></div>
              </button>
            </div>
          </div>
  
          {/* Evidence Detail Container */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            {acceptedItem === activeItem && (
  
              <div style={{ 
                background: "#ecf2eb", padding: "16px 32px", display: "flex", alignItems: "center", gap: 12,
                borderBottom: "1px solid rgba(46, 125, 50, 0.1)"
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", border: "2px solid #4caf50",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#4caf50"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#4caf50" }}>
                  Confirmation received: {isNextStep ? "Next step" : isCriteria ? "Criterion" : "Evidence"} has been accepted.
                </div>
              </div>
            )}
            
            {rejectedItems[activeItem] && (
              <div style={{ 
                background: "#ffebf0", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
                borderBottom: "1px solid rgba(255, 82, 82, 0.1)"
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "#ff5252",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, fontWeight: "bold"
                }}>!</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#ff5252" }}>Evidence rejected</div>
                  <div style={{ fontSize: 13, color: "#ff5252", opacity: 0.8 }}>Reason: {rejectedItems[activeItem]}</div>
                </div>
              </div>
            )}
            
            <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
              {isNextStep ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 15, color: TEXT_SECONDARY, marginBottom: 8 }}>
                      Target criterion :
                    </div>
                    <div style={{ fontSize: 24, color: TEXT_PRIMARY, fontWeight: 600 }}>{activeItem}</div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 12 }}>
                      Suggested question :
                    </div>
                    <div style={{ 
                      background: "#f3f4f6", padding: "16px 20px", borderRadius: 4, 
                      fontSize: 16, color: TEXT_SECONDARY, border: `1px solid #e5e7eb` 
                    }}>
                      "Do you worry that people might judge you negatively in social situations?"
                    </div>
                  </div>
  
                  <div style={{ display: "flex", gap: "15%" }}>
                    <div>
                      <div style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 12 }}>
                        Expected impact :
                      </div>
                      <span style={{ 
                        background: "#e0f2fe", color: "#0ea5e9", padding: "6px 16px", 
                        borderRadius: 20, fontSize: 14, fontWeight: 500, display: "inline-block", 
                        border: "1px solid rgba(14, 165, 233, 0.2)" 
                      }}>
                        {(currentItem as any).impact || "High information gain"}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 12 }}>
                        Reason :
                      </div>
                      <div style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                        -
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 15, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  {isCriteria ? "Criterion name" : "Evidence Type"}
                </div>
                <div style={{ fontSize: 24, color: TEXT_PRIMARY, fontWeight: 600 }}>{activeItem}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {flags.FEATURE_CONFIDENCE_BADGE ? (
                  <ConfidenceBadge 
                    confidence={
                      !isNaN(parseFloat(currentItem.score)) 
                        ? mapScoreToConfidence(parseFloat(currentItem.score))
                        : (currentItem.score.toLowerCase() === 'high' ? 'high' : currentItem.score.toLowerCase() === 'medium' ? 'medium' : 'low')
                    } 
                  />
                ) : (
                  <>
                    <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 8 }}>
                      Certainty Score : <span style={{ fontWeight: 600 }}>{currentItem.score}</span>
                    </div>
                    <span style={{ background: BRAND_LIGHT, color: "#4caf50", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(76, 175, 80, 0.2)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }} /> High Relevance
                    </span>
                  </>
                )}
              </div>
            </div>
  
            {hasConflict && (
              <div style={{ 
                marginBottom: 24, 
                padding: "12px 16px", 
                background: "#fff7ed", 
                border: "1px solid #ffedd5", 
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#9a3412"
              }}>
                <AlertCircle size={18} color="#f97316" />
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  Conflict detected: This evidence contradicts other extracted signals. Please review carefully.
                </div>
              </div>
            )}

            {(isCriteria) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 12 }}>
                    Suggested status :
                  </div>
                  <div style={{ 
                    background: "#e8f5e9", 
                    color: "#2e7d32", 
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, 
                    fontWeight: 500, display: "inline-block", 
                    border: "1px solid rgba(46, 125, 50, 0.1)"
                  }}>
                    Supported
                  </div>
                </div>
  
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 12 }}>
                    Supporting evidence :
                  </div>
                  <div style={{ ...TYPE_SCALE.BodyStandard, lineHeight: 1.8 }}>
                    <div style={{ marginBottom: 4 }}>• "I feel low most days."</div>
                    <div>• PHQ-9 score = 14</div>
                  </div>
                </div>
  
                <div style={{ 
                  borderLeft: "4px solid #f97316", padding: "16px 24px", 
                  borderRadius: "0 4px 4px 0", display: "flex", gap: 16, background: "rgba(255, 152, 0, 0.08)"
                }}>
                  <div style={{ marginTop: 2 }}><AlertTriangle size={20} color="#f97316" /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#9a3412", marginBottom: 4 }}>Missing information</div>
                    <div style={{ fontSize: 14, color: "#c2410c" }}>None</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 12 }}>Evidence text :</div>
                <div style={{ 
                  background: "#f3f4f6", 
                  padding: "24px", 
                  borderRadius: 4, 
                  fontSize: 16, 
                  lineHeight: 1.6, 
                  color: TEXT_PRIMARY, 
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: "italic",
                  marginBottom: 24,
                  borderLeft: `1px solid ${DIVIDER}`
                }}>
                  {activeItem === "Journal Entry" 
                    ? "\"I felt very anxious today when I had to speak in the meeting. I kept thinking everyone was looking at my hands shaking.\""
                    : "\"I mostly just go to work and come home.\""
                  }
                </div>
  
                <SignalBox title="Candidate Signal" description="Reduced social engagement" />
  
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 4 }}>Source :</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                      {activeItem === "Journal Entry" 
                        ? "Client Digital Journal ( May 01, 2026 )"
                        : "Session transcript ( Session 1 - Timestamp 03:17 )"
                      }
                    </div>
                    {flags.FEATURE_EVIDENCE_SOURCE_LINKS && (currentItem as any).sourceDocumentId && (
                      <button 
                        onClick={onNavigateToDocuments}
                        style={{ 
                          display: "flex", alignItems: "center", gap: 6, 
                          background: "none", border: "none", padding: 0, 
                          color: TEXT_SECONDARY, fontSize: 13, cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        <ExternalLink size={14} />
                        View source: {(currentItem as any).sourceDocumentName || (currentItem as any).sourceDocumentId}
                      </button>
                    )}
                  </div>
                </div>
  
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 12 }}>This evidence will be mapped to :</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "#e3f2fd", color: "#2196f3", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500 }}>Reduced activity</div>
                    <div style={{ background: "#e3f2fd", color: "#2196f3", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500 }}>Social withdrawal</div>
                  </div>
                </div>

                {/* Inline Rationale Section for FEATURE_EQUALISED_MAPPING_ACTIONS */}
                {flags.FEATURE_EQUALISED_MAPPING_ACTIONS && activeAction && (
                  <div style={{ 
                    marginTop: 32, padding: "24px", background: "#f8fafc", 
                    borderRadius: 8, border: `1px solid ${BRAND_LIGHT}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ 
                        padding: 8, borderRadius: "50%", 
                        background: activeAction === 'accept' ? "#dcfce7" : activeAction === 'reject' ? "#fee2e2" : "#f1f5f9",
                        color: activeAction === 'accept' ? "#166534" : activeAction === 'reject' ? "#991b1b" : "#475569"
                      }}>
                        {activeAction === 'accept' ? <ThumbsUp size={18} /> : activeAction === 'reject' ? <ThumbsDown size={18} /> : <EditIcon size={18} />}
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>
                        Reason for {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}
                      </span>
                    </div>
                    
                    <textarea 
                      ref={rationaleRef}
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      placeholder="Add clinical rationale..."
                      style={{ 
                        width: "100%", height: 100, padding: 12, borderRadius: 6, 
                        border: `1px solid ${DIVIDER}`, fontSize: 14, outline: "none",
                        fontFamily: "inherit", resize: "none", marginBottom: 16
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                      <button 
                        onClick={() => setActiveAction(null)}
                        style={{ ...outlineBtn, padding: "8px 20px", fontSize: 13 }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={commitAction}
                        disabled={rationale.length === 0}
                        style={{ 
                          ...primaryBtn, 
                          padding: "8px 20px", fontSize: 13,
                          background: activeAction === 'accept' ? "#16a34a" : activeAction === 'reject' ? "#dc2626" : "#0f172a",
                          opacity: rationale.length === 0 ? 0.5 : 1
                        }}
                      >
                        Commit Action
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
              </>
            )}
          </div>
        </div>
  
        {/* Footer Actions */}
          <div style={{ padding: "20px 32px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", background: "#fcfcfc", flexShrink: 0 }}>
            {flags.FEATURE_EQUALISED_MAPPING_ACTIONS ? (
              <div style={{ display: "flex", width: "100%", gap: 16 }}>
                <button 
                  onClick={() => handleActionClick('accept')}
                  disabled={!!acceptedItem || activeAction !== null}
                  style={{ 
                    ...outlineBtn, flex: 1, height: 44, display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                    borderWidth: 2, borderColor: "#22c55e", color: "#166534",
                    opacity: activeAction && activeAction !== 'accept' ? 0.3 : (!!acceptedItem ? 0.5 : 1)
                  }}
                >
                  <ThumbsUp size={18} /> Accept
                </button>
                <button 
                  onClick={() => handleActionClick('reject')}
                  disabled={activeAction !== null}
                  style={{ 
                    ...outlineBtn, flex: 1, height: 44, display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                    borderWidth: 2, borderColor: "#ef4444", color: "#991b1b",
                    opacity: activeAction && activeAction !== 'reject' ? 0.3 : 1
                  }}
                >
                  <ThumbsDown size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleActionClick('modify')}
                  disabled={activeAction !== null}
                  style={{ 
                    ...outlineBtn, flex: 1, height: 44, display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                    borderWidth: 2, borderColor: "#3b82f6", color: "#1e40af",
                    opacity: activeAction && activeAction !== 'modify' ? 0.3 : 1
                  }}
                >
                  <EditIcon size={18} /> Modify
                </button>
              </div>
            ) : isNextStep ? (
              <>
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => setIsModifyOpen(true)}
                    style={{ ...primaryBtn, padding: "10px 24px", background: "#ff9800", color: "white", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <EditIcon size={14} /> Modify Wording
                  </button>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => setIsSkipOpen(true)}
                    style={{ ...outlineBtn, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    Skip <div style={{ transform: "rotate(180deg)" }}><BackArrow size={16} /></div>
                  </button>
                  <button 
                    onClick={handleAccept}
                    style={{ ...primaryBtn, padding: "10px 24px", background: "#06302c", color: "white", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 400 }}>✓</span> Accept
                  </button>
                </div>
              </>
            ) : isRejecting ? (
              <>
                <button 
                  onClick={() => setIsRejecting(false)}
                  style={{ ...outlineBtn, padding: "10px 24px", color: TEXT_PRIMARY, borderColor: DIVIDER }}
                >
                  <span style={{ fontSize: 18, fontWeight: 400, marginRight: 8 }}>✕</span> Cancel
                </button>
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => handleReject("Wrong Criterion")}
                    style={{ ...primaryBtn, background: "#ff5252", padding: "10px 24px" }}
                  >
                     Wrong Criterion
                  </button>
                  <button 
                    onClick={() => handleReject("Not Diagnostic Evidence")}
                    style={{ ...primaryBtn, background: "#ff5252", padding: "10px 24px" }}
                  >
                     Not Diagnostic Evidence
                  </button>
                  <button 
                    onClick={() => handleReject("Too Weak")}
                    style={{ ...primaryBtn, background: "#ff5252", padding: "10px 24px" }}
                  >
                     Too Weak
                  </button>
                </div>
              </>
            ) : rejectedItems[activeItem] ? (
              <>
                <div />
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={handleUndoReject}
                    style={{ ...outlineBtn, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, color: TEXT_PRIMARY, borderColor: DIVIDER }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 010 10H3"/><path d="M7 14L3 10l4-4"/></svg> Undo
                  </button>
                  <button 
                    style={{ ...primaryBtn, padding: "10px 24px", background: "#ff9800", color: "white" }}
                    onClick={() => setIsModifyOpen(true)}
                  >
                    <EditIcon size={14} /> Modify
                  </button>
                </div>
              </>
            ) : acceptedItem === activeItem ? (
              <>
                <div />
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={handleUndoAccept}
                    style={{ ...outlineBtn, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, color: TEXT_PRIMARY, borderColor: DIVIDER }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 010 10H3"/><path d="M7 14L3 10l4-4"/></svg> Undo
                  </button>
                  <button 
                    style={{ ...primaryBtn, padding: "10px 24px", background: "#ff9800", color: "white" }}
                    onClick={() => setIsModifyOpen(true)}
                  >
                    <EditIcon size={14} /> Modify
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={handleDefer}
                    disabled={deferredItems.includes(activeItem)}
                    style={{ 
                      ...outlineBtn, 
                      padding: "10px 24px", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      color: deferredItems.includes(activeItem) ? TEXT_DISABLED : TEXT_PRIMARY, 
                      borderColor: deferredItems.includes(activeItem) ? DIVIDER : TEXT_PRIMARY,
                      cursor: deferredItems.includes(activeItem) ? "default" : "pointer",
                      opacity: deferredItems.includes(activeItem) ? 0.6 : 1
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Defer
                  </button>
                  <button 
                    onClick={() => setIsModifyOpen(true)}
                    style={{ ...primaryBtn, padding: "10px 24px", background: "#ff9800", color: "white" }}
                  >
                    <EditIcon size={14} /> Modify
                  </button>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {(isCriteria || isNextStep) && (
                    <button 
                      onClick={() => setIsRejecting(true)}
                      style={{ ...outlineBtn, padding: "10px 24px", borderColor: "#ff5252", color: "#ff5252", display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <ResetIcon size={16} /> Rule Out
                    </button>
                  )}
                  {!(isCriteria || isNextStep) && (
                    <button 
                      onClick={() => setIsRejecting(true)}
                      style={{ ...outlineBtn, padding: "10px 24px", borderColor: "#ff5252", color: "#ff5252" }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 400, marginRight: 8 }}>✕</span> Reject
                    </button>
                  )}
                  <button 
                    onClick={handleAccept}
                    disabled={!!acceptedItem}
                    style={{ ...primaryBtn, padding: "10px 24px", background: (isCriteria || isNextStep) ? "#06302c" : BRAND, opacity: acceptedItem ? 0.6 : 1 }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 400 }}>✓</span> Accept
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        }
      />
      </div>
    </AssessmentGate>
  );
}
