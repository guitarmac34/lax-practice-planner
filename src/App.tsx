import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DrillLibrary from "./pages/DrillLibrary";
import Plans from "./pages/Plans";
import PlanBuilder from "./pages/PlanBuilder";
import PlanView from "./pages/PlanView";
import PracticeHistory from "./pages/PracticeHistory";
import Coaches from "./pages/Coaches";
import Players from "./pages/Players";
import SharedPlan from "./pages/SharedPlan";
import ParentInfo from "./pages/ParentInfo";
import CoachResources from "./pages/CoachResources";
import Schedule from "./pages/Schedule";
import "./index.css";

function AppRoutes() {
  const { loading } = useApp();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner" />
          <p className="text-muted mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/share/:encoded" element={<SharedPlan />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="drills" element={<DrillLibrary />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/new" element={<PlanBuilder />} />
        <Route path="plans/:id" element={<PlanBuilder />} />
        <Route path="plans/:id/view" element={<PlanView />} />
        <Route path="history" element={<PracticeHistory />} />
        <Route path="coaches" element={<Coaches />} />
        <Route path="players" element={<Players />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="parent-info" element={<ParentInfo />} />
        <Route path="coach-resources" element={<CoachResources />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
