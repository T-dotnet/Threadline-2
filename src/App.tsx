/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { ConditionList } from "./components/conditions/ConditionList";
import { ConditionDetail } from "./components/conditions/ConditionDetail";
import { StyleGuide } from "./components/playground/StyleGuide";
import { ThreadlineModule } from "./components/threadline/ThreadlineModule";
import { MainSessionListWorkspace } from "./components/threadline/MainSessionListWorkspace";
import { MainAssessmentListWorkspace } from "./components/threadline/MainAssessmentListWorkspace";
import { GlobalModals } from "./components/threadline/Modals";
import { FeatureToggleModal } from "./components/modals/FeatureToggleModal";
import { FeatureToggleProvider, useFeatureFlags } from "./contexts/FeatureToggleContext";
import { Condition } from "./types";
import { COLORS, ALL_CONDITIONS } from "./constants";
import { primaryBtn } from "./components/threadline/constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./components/threadline/mockData";

export default function App() {
  return (
    <FeatureToggleProvider>
      <AppContent />
    </FeatureToggleProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState<Condition[]>(() => [...ALL_CONDITIONS]);
  const [showMockData, setShowMockData] = useState(false);
  const [showFeatureToggles, setShowFeatureToggles] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDebugMinimized, setIsDebugMinimized] = useState(true);

  const handleCreateCondition = (data: { name: string; category: string; guideline: string }) => {
    const newCondition: Condition = {
      id: Math.max(...conditions.map(c => c.id), 0) + 1,
      name: data.name,
      category: data.category,
      guideline: data.guideline,
      code: "NEW",
      status: "Draft",
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " – " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      population: "N/A",
      reviewer: "Current User",
      overview: "Newly created condition guideline.",
      refs: []
    };
    setConditions([newCondition, ...conditions]);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.startsWith('/conditions')) return 'Conditions';
    if (path.startsWith('/clients')) return 'Clients';
    if (path.startsWith('/patients')) return 'Patients';
    if (path.startsWith('/sessions')) return 'Sessions';
    if (path.startsWith('/assessments')) return 'Assessments';
    if (path.startsWith('/resources')) return 'Resources';
    if (path.startsWith('/users')) return 'Users';
    return 'Clients';
  };

  const isPlayground = location.pathname === '/playground';

  const { activeCount, useGroupedTabs, setUseGroupedTabs, flags, setFlag } = useFeatureFlags();

  return (
    <div style={{
      fontFamily: "'Poppins',sans-serif",
      background: "#fcfcfc",
      minHeight: "100vh",
      position: "relative"
    }}>

      {showMockData && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={() => setShowMockData(false)}>
          <div style={{
            background: "white", padding: 24, borderRadius: 8, maxHeight: "80vh", overflowY: "auto",
            width: "80%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginTop: 0}}>Mock Client Data</h2>
            <pre style={{fontSize: 12}}>{JSON.stringify({ MOCK_CLIENTS, MOCK_CLIENT_DATA }, null, 2)}</pre>
            <button onClick={() => setShowMockData(false)} style={{...primaryBtn, marginTop: 16}}>Close</button>
          </div>
        </div>
      )}

      {!isPlayground && (
        <Navbar 
          onClientsClick={() => navigate('/clients')}
          onSessionsClick={() => navigate('/sessions')}
          onAssessmentsClick={() => navigate('/assessments')}
          onResourcesClick={() => navigate('/resources')}
          onUsersClick={() => navigate('/users')}
          onConditionsClick={() => navigate('/conditions')}
          onAvatarClick={() => setShowFeatureToggles(true)}
          activeItem={getActiveItem()}
          isAdminView={isAdminView}
        />
      )}

      <div style={{ padding: "0px 60px 32px 60px", marginTop: 32 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/playground" element={<StyleGuide />} />
              <Route path="/conditions" element={
                <ConditionList
                  conditions={conditions}
                  onCreateCondition={handleCreateCondition}
                  onRowClick={(row) => navigate(`/conditions/${row.id}`)}
                />
              } />
              <Route path="/conditions/:id" element={<ConditionDetailWrapper conditions={conditions} />} />
              <Route path="/clients/*" element={<ThreadlineModule initialView="clients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/patients/*" element={<ThreadlineModule initialView="patients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/sessions" element={<MainSessionListWorkspace />} />
              <Route path="/assessments" element={<MainAssessmentListWorkspace />} />
              <Route path="/resources/*" element={<ThreadlineModule initialView="resources" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/users/*" element={<ThreadlineModule initialView="users" onGuidelinesClick={() => navigate('/conditions')} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ 
        position: "fixed", bottom: 24, right: 24, display: "flex", gap: 12, zIndex: 1000, 
        padding: "8px", background: "white", borderRadius: 32, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        maxWidth: isDebugMinimized ? "40px" : "1000px",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>
         <button 
           onClick={() => setIsDebugMinimized(!isDebugMinimized)}
           style={{
             background: isDebugMinimized ? COLORS.P : "transparent",
             color: isDebugMinimized ? "white" : COLORS.TS,
             border: "none",
             borderRadius: "50%", 
             width: 32, height: 32,
             minWidth: 32,
             cursor: "pointer",
             display: "flex", alignItems: "center", justifyContent: "center",
             fontSize: 14, fontWeight: 700,
             transition: "all .2s",
           }}
           title={isDebugMinimized ? "Show Debug Menu" : "Minimize Debug Menu"}
         >
           {isDebugMinimized ? "⚙️" : "×"}
         </button>
         
         {!isDebugMinimized && (
           <>
             <button 
               onClick={() => setShowFeatureToggles(true)}
               style={{
                 background: showFeatureToggles ? COLORS.P : "transparent",
                 color: showFeatureToggles ? "white" : COLORS.TS,
                 border: "none",
                 borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                 fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                 transition: "all .2s",
                 display: "flex", alignItems: "center", gap: 8
               }}
             >
               Features {activeCount > 0 && (
                 <span style={{ 
                   background: showFeatureToggles ? "white" : COLORS.P, 
                   color: showFeatureToggles ? COLORS.P : "white",
                   borderRadius: 10, px: 6, fontSize: 10, fontWeight: 700,
                   padding: "0 6px"
                 }}>
                   {activeCount}
                 </span>
               )}
             </button>
             <button 
               onClick={() => { navigate(isPlayground ? '/conditions' : '/playground'); }}
               style={{
                 background: isPlayground ? COLORS.P : "transparent",
                 color: isPlayground ? "white" : COLORS.TS,
                 border: "none",
                 borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                 fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                 transition: "all .2s"
               }}
             >
               {isPlayground ? "App" : "Style Guide"}
             </button>
             {!isPlayground && (
               <button 
                 onClick={() => setIsAdminView(!isAdminView)}
                 style={{
                   background: isAdminView ? COLORS.P : "transparent",
                   color: isAdminView ? "white" : COLORS.TS,
                   border: "none",
                   borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                   fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                   transition: "all .2s"
                 }}
               >
                 Admin: {isAdminView ? "ON" : "OFF"}
               </button>
             )}
             {!isPlayground && (
               <button 
                 onClick={() => setShowMockData(true)}
                 style={{
                   background: "transparent",
                   color: COLORS.TS,
                   border: "none",
                   borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                   fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                   transition: "all .2s"
                 }}
               >
                 Mock
               </button>
             )}
             <button 
               onClick={() => setUseGroupedTabs(!useGroupedTabs)}
               style={{
                 background: COLORS.P,
                 color: "white",
                 border: "none",
                 borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                 fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                 transition: "all .2s",
                 opacity: 0.9
               }}
             >
               Nav: {useGroupedTabs ? "Grouped" : "Classic"}
             </button>
             <button 
               onClick={() => setFlag("FEATURE_COMPACT_HUD", !flags.FEATURE_COMPACT_HUD)}
               style={{
                 background: flags.FEATURE_COMPACT_HUD ? COLORS.P : "transparent",
                 color: flags.FEATURE_COMPACT_HUD ? "white" : COLORS.TS,
                 border: `1px solid ${COLORS.P}`,
                 borderRadius: 24, padding: "8px 16px", cursor: "pointer",
                 fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif",
                 transition: "all .2s"
               }}
             >
               HUD: {flags.FEATURE_COMPACT_HUD ? "Compact" : "Normal"}
             </button>
           </>
         )}
      </div>

      <GlobalModals />
      <FeatureToggleModal isOpen={showFeatureToggles} onClose={() => setShowFeatureToggles(false)} />
    </div>
  );
}

import { useParams } from "react-router-dom";
function ConditionDetailWrapper({ conditions }: { conditions: Condition[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const condition = conditions.find(c => c.id === Number(id));
  if (!condition) return <Navigate to="/conditions" replace />;
  return <ConditionDetail row={condition} onBack={() => navigate('/conditions')} />;
}
