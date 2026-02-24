import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Coach, Drill, Player, PracticePlan, ContentPage, ScheduleEvent } from "./types";
import { apiGet, apiPost, apiPut, apiDelete, login as apiLogin } from "./api";

interface AppState {
  drills: Drill[];
  coaches: Coach[];
  players: Player[];
  plans: PracticePlan[];
  contentPages: ContentPage[];
  schedule: ScheduleEvent[];
}

interface AppContextType extends AppState {
  loading: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  addDrill: (drill: Drill) => Promise<void>;
  updateDrill: (drill: Drill) => Promise<void>;
  deleteDrill: (id: string) => Promise<void>;
  addCoach: (coach: Coach) => Promise<void>;
  updateCoach: (coach: Coach) => Promise<void>;
  deleteCoach: (id: string) => Promise<void>;
  addPlayer: (player: Player) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  addPlan: (plan: PracticePlan) => Promise<void>;
  updatePlan: (plan: PracticePlan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  upsertContentPage: (page: ContentPage) => Promise<void>;
  addScheduleEvent: (event: ScheduleEvent) => Promise<void>;
  updateScheduleEvent: (event: ScheduleEvent) => Promise<void>;
  deleteScheduleEvent: (id: string) => Promise<void>;
  importSchedule: (events: ScheduleEvent[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    drills: [], coaches: [], players: [], plans: [], contentPages: [], schedule: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem("admin-token"));

  useEffect(() => {
    Promise.all([
      apiGet<Drill[]>("/drills"),
      apiGet<Coach[]>("/coaches"),
      apiGet<Player[]>("/players"),
      apiGet<PracticePlan[]>("/plans"),
      apiGet<ContentPage[]>("/content-pages"),
      apiGet<ScheduleEvent[]>("/schedule"),
    ])
      .then(([drills, coaches, players, plans, contentPages, schedule]) => {
        setState({ drills, coaches, players, plans, contentPages, schedule });
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const token = await apiLogin(password);
      sessionStorage.setItem("admin-token", token);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin-token");
    setIsAdmin(false);
  }, []);

  // --- Drills ---
  const addDrill = useCallback(async (drill: Drill) => {
    setState((s) => ({ ...s, drills: [...s.drills, drill] }));
    try {
      await apiPost("/drills", drill);
    } catch (err) {
      setState((s) => ({ ...s, drills: s.drills.filter((d) => d.id !== drill.id) }));
      throw err;
    }
  }, []);

  const updateDrill = useCallback(async (drill: Drill) => {
    setState((s) => {
      const prev = s.drills;
      return { ...s, drills: prev.map((d) => (d.id === drill.id ? drill : d)), _prevDrills: prev };
    });
    try {
      await apiPut(`/drills/${drill.id}`, drill);
    } catch (err) {
      setState((s) => {
        const prev = (s as any)._prevDrills;
        return prev ? { ...s, drills: prev } : s;
      });
      throw err;
    }
  }, []);

  const deleteDrill = useCallback(async (id: string) => {
    let removed: Drill | undefined;
    setState((s) => {
      removed = s.drills.find((d) => d.id === id);
      return { ...s, drills: s.drills.filter((d) => d.id !== id) };
    });
    try {
      await apiDelete(`/drills/${id}`);
    } catch (err) {
      if (removed) setState((s) => ({ ...s, drills: [...s.drills, removed!] }));
      throw err;
    }
  }, []);

  // --- Coaches ---
  const addCoach = useCallback(async (coach: Coach) => {
    setState((s) => ({ ...s, coaches: [...s.coaches, coach] }));
    try {
      await apiPost("/coaches", coach);
    } catch (err) {
      setState((s) => ({ ...s, coaches: s.coaches.filter((c) => c.id !== coach.id) }));
      throw err;
    }
  }, []);

  const updateCoach = useCallback(async (coach: Coach) => {
    let prev: Coach[] = [];
    setState((s) => {
      prev = s.coaches;
      return { ...s, coaches: s.coaches.map((c) => (c.id === coach.id ? coach : c)) };
    });
    try {
      await apiPut(`/coaches/${coach.id}`, coach);
    } catch (err) {
      setState((s) => ({ ...s, coaches: prev }));
      throw err;
    }
  }, []);

  const deleteCoach = useCallback(async (id: string) => {
    let removed: Coach | undefined;
    setState((s) => {
      removed = s.coaches.find((c) => c.id === id);
      return { ...s, coaches: s.coaches.filter((c) => c.id !== id) };
    });
    try {
      await apiDelete(`/coaches/${id}`);
    } catch (err) {
      if (removed) setState((s) => ({ ...s, coaches: [...s.coaches, removed!] }));
      throw err;
    }
  }, []);

  // --- Players ---
  const addPlayer = useCallback(async (player: Player) => {
    setState((s) => ({ ...s, players: [...s.players, player] }));
    try {
      await apiPost("/players", player);
    } catch (err) {
      setState((s) => ({ ...s, players: s.players.filter((p) => p.id !== player.id) }));
      throw err;
    }
  }, []);

  const updatePlayer = useCallback(async (player: Player) => {
    let prev: Player[] = [];
    setState((s) => {
      prev = s.players;
      return { ...s, players: s.players.map((p) => (p.id === player.id ? player : p)) };
    });
    try {
      await apiPut(`/players/${player.id}`, player);
    } catch (err) {
      setState((s) => ({ ...s, players: prev }));
      throw err;
    }
  }, []);

  const deletePlayer = useCallback(async (id: string) => {
    let removed: Player | undefined;
    setState((s) => {
      removed = s.players.find((p) => p.id === id);
      return { ...s, players: s.players.filter((p) => p.id !== id) };
    });
    try {
      await apiDelete(`/players/${id}`);
    } catch (err) {
      if (removed) setState((s) => ({ ...s, players: [...s.players, removed!] }));
      throw err;
    }
  }, []);

  // --- Plans ---
  const addPlan = useCallback(async (plan: PracticePlan) => {
    setState((s) => ({ ...s, plans: [...s.plans, plan] }));
    try {
      await apiPost("/plans", plan);
    } catch (err) {
      setState((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== plan.id) }));
      throw err;
    }
  }, []);

  const updatePlan = useCallback(async (plan: PracticePlan) => {
    let prev: PracticePlan[] = [];
    setState((s) => {
      prev = s.plans;
      return { ...s, plans: s.plans.map((p) => (p.id === plan.id ? plan : p)) };
    });
    try {
      await apiPut(`/plans/${plan.id}`, plan);
    } catch (err) {
      setState((s) => ({ ...s, plans: prev }));
      throw err;
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    let removed: PracticePlan | undefined;
    setState((s) => {
      removed = s.plans.find((p) => p.id === id);
      return { ...s, plans: s.plans.filter((p) => p.id !== id) };
    });
    try {
      await apiDelete(`/plans/${id}`);
    } catch (err) {
      if (removed) setState((s) => ({ ...s, plans: [...s.plans, removed!] }));
      throw err;
    }
  }, []);

  // --- Content Pages ---
  const upsertContentPage = useCallback(async (page: ContentPage) => {
    setState((s) => {
      const exists = s.contentPages.some((p) => p.id === page.id);
      return {
        ...s,
        contentPages: exists
          ? s.contentPages.map((p) => (p.id === page.id ? page : p))
          : [...s.contentPages, page],
      };
    });
    try {
      await apiPost("/content-pages", page);
    } catch (err) {
      // Reload on error
      apiGet<ContentPage[]>("/content-pages").then((pages) =>
        setState((s) => ({ ...s, contentPages: pages }))
      );
      throw err;
    }
  }, []);

  // --- Schedule ---
  const addScheduleEvent = useCallback(async (event: ScheduleEvent) => {
    setState((s) => ({ ...s, schedule: [...s.schedule, event] }));
    try {
      await apiPost("/schedule", event);
    } catch (err) {
      setState((s) => ({ ...s, schedule: s.schedule.filter((e) => e.id !== event.id) }));
      throw err;
    }
  }, []);

  const updateScheduleEvent = useCallback(async (event: ScheduleEvent) => {
    let prev: ScheduleEvent[] = [];
    setState((s) => {
      prev = s.schedule;
      return { ...s, schedule: s.schedule.map((e) => (e.id === event.id ? event : e)) };
    });
    try {
      await apiPut(`/schedule/${event.id}`, event);
    } catch (err) {
      setState((s) => ({ ...s, schedule: prev }));
      throw err;
    }
  }, []);

  const deleteScheduleEvent = useCallback(async (id: string) => {
    let removed: ScheduleEvent | undefined;
    setState((s) => {
      removed = s.schedule.find((e) => e.id === id);
      return { ...s, schedule: s.schedule.filter((e) => e.id !== id) };
    });
    try {
      await apiDelete(`/schedule/${id}`);
    } catch (err) {
      if (removed) setState((s) => ({ ...s, schedule: [...s.schedule, removed!] }));
      throw err;
    }
  }, []);

  const importSchedule = useCallback(async (events: ScheduleEvent[]) => {
    let prev: ScheduleEvent[] = [];
    setState((s) => {
      prev = s.schedule;
      return { ...s, schedule: events };
    });
    try {
      await apiPut("/schedule", events);
    } catch (err) {
      setState((s) => ({ ...s, schedule: prev }));
      throw err;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        loading,
        isAdmin,
        login,
        logout,
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
