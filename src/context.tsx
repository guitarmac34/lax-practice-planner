import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Coach, Drill, Player, PracticePlan, ContentPage, ScheduleEvent } from "./types";

interface AppState {
  drills: Drill[];
  coaches: Coach[];
  players: Player[];
  plans: PracticePlan[];
  contentPages: ContentPage[];
  schedule: ScheduleEvent[];
}

interface AppContextType extends AppState {
  addDrill: (drill: Drill) => void;
  updateDrill: (drill: Drill) => void;
  deleteDrill: (id: string) => void;
  addCoach: (coach: Coach) => void;
  updateCoach: (coach: Coach) => void;
  deleteCoach: (id: string) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  addPlan: (plan: PracticePlan) => void;
  updatePlan: (plan: PracticePlan) => void;
  deletePlan: (id: string) => void;
  upsertContentPage: (page: ContentPage) => void;
  addScheduleEvent: (event: ScheduleEvent) => void;
  updateScheduleEvent: (event: ScheduleEvent) => void;
  deleteScheduleEvent: (id: string) => void;
  importSchedule: (events: ScheduleEvent[]) => void;
}

const STORAGE_KEY = "lax-practice-data";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return { drills: [], coaches: [], players: [], plans: [], contentPages: [], schedule: [] };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addDrill = useCallback((drill: Drill) => {
    setState((s) => ({ ...s, drills: [...s.drills, drill] }));
  }, []);

  const updateDrill = useCallback((drill: Drill) => {
    setState((s) => ({
      ...s,
      drills: s.drills.map((d) => (d.id === drill.id ? drill : d)),
    }));
  }, []);

  const deleteDrill = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      drills: s.drills.filter((d) => d.id !== id),
    }));
  }, []);

  const addCoach = useCallback((coach: Coach) => {
    setState((s) => ({ ...s, coaches: [...s.coaches, coach] }));
  }, []);

  const updateCoach = useCallback((coach: Coach) => {
    setState((s) => ({
      ...s,
      coaches: s.coaches.map((c) => (c.id === coach.id ? coach : c)),
    }));
  }, []);

  const deleteCoach = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      coaches: s.coaches.filter((c) => c.id !== id),
    }));
  }, []);

  const addPlayer = useCallback((player: Player) => {
    setState((s) => ({ ...s, players: [...s.players, player] }));
  }, []);

  const updatePlayer = useCallback((player: Player) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) => (p.id === player.id ? player : p)),
    }));
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      players: s.players.filter((p) => p.id !== id),
    }));
  }, []);

  const addPlan = useCallback((plan: PracticePlan) => {
    setState((s) => ({ ...s, plans: [...s.plans, plan] }));
  }, []);

  const updatePlan = useCallback((plan: PracticePlan) => {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => (p.id === plan.id ? plan : p)),
    }));
  }, []);

  const deletePlan = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      plans: s.plans.filter((p) => p.id !== id),
    }));
  }, []);

  const upsertContentPage = useCallback((page: ContentPage) => {
    setState((s) => {
      const exists = s.contentPages.some((p) => p.id === page.id);
      return {
        ...s,
        contentPages: exists
          ? s.contentPages.map((p) => (p.id === page.id ? page : p))
          : [...s.contentPages, page],
      };
    });
  }, []);

  const addScheduleEvent = useCallback((event: ScheduleEvent) => {
    setState((s) => ({ ...s, schedule: [...s.schedule, event] }));
  }, []);

  const updateScheduleEvent = useCallback((event: ScheduleEvent) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((e) => (e.id === event.id ? event : e)),
    }));
  }, []);

  const deleteScheduleEvent = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.filter((e) => e.id !== id),
    }));
  }, []);

  const importSchedule = useCallback((events: ScheduleEvent[]) => {
    setState((s) => ({ ...s, schedule: events }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        addDrill,
        updateDrill,
        deleteDrill,
        addCoach,
        updateCoach,
        deleteCoach,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addPlan,
        updatePlan,
        deletePlan,
        upsertContentPage,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        importSchedule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
