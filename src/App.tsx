import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DrillLibrary from "./pages/DrillLibrary";
import Plans from "./pages/Plans";
import PlanBuilder from "./pages/PlanBuilder";
import PlanView from "./pages/PlanView";
import PracticeHistory from "./pages/PracticeHistory";
import Coaches from "./pages/Coaches";
import SharedPlan from "./pages/SharedPlan";
import "./index.css";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
