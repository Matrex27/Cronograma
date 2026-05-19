import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import DateSelector from "../components/DateSelector";
import TaskForm from "../components/TaskForm";
import EventForm from "../components/EventForm";
import TaskCard from "../components/TaskCard";
import EventCard from "../components/EventCard";
import AiSuggestions from "../components/AiSuggestions";
import MonthCalendar from "../components/MonthCalendar";

const getToday = () => new Date().toISOString().slice(0, 10);
const getMonthFromDate = (date) => date.slice(0, 7);

const parseApiError = (error, fallback) => error?.response?.data?.message || fallback;

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedMonth, setSelectedMonth] = useState(getMonthFromDate(getToday()));
  const [viewMode, setViewMode] = useState("month");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [monthTasks, setMonthTasks] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadSuggestions = async (date) => {
    setAiError("");
    try {
      const response = await api.get(`/api/ai/suggestions/${date}`);
      const incoming = response?.data?.suggestions ?? response?.data ?? [];
      setSuggestions(Array.isArray(incoming) ? incoming : []);
    } catch (err) {
      setSuggestions([]);
      setAiError(parseApiError(err, "No se pudieron cargar sugerencias IA."));
    }
  };

  const loadMonthData = async () => {
    setError("");
    setLoadingMonth(true);

    try {
      const [tasksResponse, eventsResponse] = await Promise.all([
        api.get("/api/tasks"),
        api.get("/api/events"),
      ]);

      setMonthTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
      setMonthEvents(Array.isArray(eventsResponse.data) ? eventsResponse.data : []);
    } catch (err) {
      setError(parseApiError(err, "No se pudo cargar el calendario general."));
      setMonthTasks([]);
      setMonthEvents([]);
    } finally {
      setLoadingMonth(false);
    }
  };

  const loadDayData = async (date) => {
    setError("");
    setLoadingData(true);

    try {
      const [tasksResponse, eventsResponse] = await Promise.all([
        api.get(`/api/tasks/day/${date}`),
        api.get("/api/events"),
      ]);

      const fetchedTasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];
      const allEvents = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
      const filteredEvents = allEvents.filter((item) => item.event_date === date);

      setTasks(fetchedTasks);
      setEvents(filteredEvents);
      await loadSuggestions(date);
    } catch (err) {
      setError(parseApiError(err, "No se pudo cargar la información del día."));
      setTasks([]);
      setEvents([]);
      setSuggestions([]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadMonthData();
  }, [selectedMonth]);

  useEffect(() => {
    if (viewMode === "day") {
      loadDayData(selectedDate);
    }
  }, [selectedDate, viewMode]);

  const agendaBlocks = useMemo(() => {
    const taskBlocks = tasks.map((task) => ({
      id: `task-${task.id}`,
      type: "task",
      title: task.title,
      description: task.description,
      start: task.start_time,
      end: task.end_time,
    }));
    const eventBlocks = events.map((event) => ({
      id: `event-${event.id}`,
      type: "event",
      title: event.title,
      description: event.description,
      start: event.start_time,
      end: event.end_time,
    }));

    return [...taskBlocks, ...eventBlocks].sort((a, b) => a.start.localeCompare(b.start));
  }, [tasks, events]);

  const resetTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const resetEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleSelectedDateChange = (date) => {
    setSelectedDate(date);
    setSelectedMonth(getMonthFromDate(date));
  };

  const handleDaySelect = (date) => {
    handleSelectedDateChange(date);
    setViewMode("day");
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedDate(`${month}-01`);
  };

  const handleTaskSubmit = async (payload) => {
    setSavingTask(true);
    setError("");
    try {
      if (editingTask?.id) {
        await api.put(`/api/tasks/${editingTask.id}`, payload);
      } else {
        await api.post("/api/tasks", payload);
      }
      resetTaskForm();
      await loadDayData(selectedDate);
      await loadMonthData();
    } catch (err) {
      setError(parseApiError(err, "No se pudo guardar la tarea."));
    } finally {
      setSavingTask(false);
    }
  };

  const handleTaskDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;
    setError("");
    try {
      await api.delete(`/api/tasks/${id}`);
      await loadDayData(selectedDate);
      await loadMonthData();
    } catch (err) {
      setError(parseApiError(err, "No se pudo eliminar la tarea."));
    }
  };

  const handleEventSubmit = async (payload) => {
    setSavingEvent(true);
    setError("");
    try {
      if (editingEvent?.id) {
        await api.put(`/api/events/${editingEvent.id}`, payload);
      } else {
        await api.post("/api/events", payload);
      }
      resetEventForm();
      await loadDayData(selectedDate);
      await loadMonthData();
    } catch (err) {
      setError(parseApiError(err, "No se pudo guardar el evento."));
    } finally {
      setSavingEvent(false);
    }
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    setError("");
    try {
      await api.delete(`/api/events/${id}`);
      await loadDayData(selectedDate);
      await loadMonthData();
    } catch (err) {
      setError(parseApiError(err, "No se pudo eliminar el evento."));
    }
  };

  const handleAnalyzeDay = async () => {
    setAnalyzing(true);
    setAiError("");
    try {
      const response = await api.post("/api/ai/day-review", { date: selectedDate });
      const incoming = response?.data?.suggestions ?? [];
      if (Array.isArray(incoming) && incoming.length > 0) {
        setSuggestions(incoming);
      } else {
        await loadSuggestions(selectedDate);
      }
    } catch (err) {
      setAiError(parseApiError(err, "No se pudo analizar el día con IA."));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="card space-y-3">
            <h2 className="text-base font-semibold text-brand-ink">Vista</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`btn ${
                  viewMode === "month"
                    ? "bg-brand-blue text-white"
                    : "border border-brand-blue/25 text-brand-blueDark hover:bg-brand-blue/10"
                }`}
                onClick={() => setViewMode("month")}
              >
                General
              </button>
              <button
                type="button"
                className={`btn ${
                  viewMode === "day"
                    ? "bg-brand-blue text-white"
                    : "border border-brand-blue/25 text-brand-blueDark hover:bg-brand-blue/10"
                }`}
                onClick={() => setViewMode("day")}
              >
                Día
              </button>
            </div>
          </div>

          {viewMode === "day" ? (
            <DateSelector value={selectedDate} onChange={handleSelectedDateChange} />
          ) : null}

          <div className="card space-y-3">
            <h2 className="text-base font-semibold text-brand-ink">Acciones rápidas</h2>
            <button
              className="btn w-full bg-brand-blue text-white hover:bg-brand-blueDark"
              type="button"
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm((prev) => !prev);
              }}
            >
              {showTaskForm && !editingTask ? "Cerrar formulario tarea" : "Crear tarea"}
            </button>
            <button
              className="btn w-full bg-brand-gold text-white hover:bg-brand-blueDark"
              type="button"
              onClick={() => {
                setEditingEvent(null);
                setShowEventForm((prev) => !prev);
              }}
            >
              {showEventForm && !editingEvent ? "Cerrar formulario evento" : "Crear evento"}
            </button>
          </div>

          {showTaskForm ? (
            <TaskForm
              initialData={editingTask}
              defaultDate={selectedDate}
              onSubmit={handleTaskSubmit}
              onCancel={resetTaskForm}
              submitting={savingTask}
            />
          ) : null}

          {showEventForm ? (
            <EventForm
              initialData={editingEvent}
              defaultDate={selectedDate}
              onSubmit={handleEventSubmit}
              onCancel={resetEventForm}
              submitting={savingEvent}
            />
          ) : null}
        </aside>

        <section className="space-y-4">
          {error ? <p className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">{error}</p> : null}

          {viewMode === "month" ? (
            <MonthCalendar
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              tasks={monthTasks}
              events={monthEvents}
              loading={loadingMonth}
              onMonthChange={handleMonthChange}
              onDaySelect={handleDaySelect}
            />
          ) : (
            <>
              <div className="card">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-brand-ink">Agenda diaria</h2>
                  <span className="text-sm text-slate-500">{selectedDate}</span>
                </div>

                {loadingData ? (
                  <p className="text-sm text-slate-500">Cargando agenda...</p>
                ) : agendaBlocks.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay tareas ni eventos para este día.</p>
                ) : (
                  <div className="space-y-2">
                    {agendaBlocks.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 ${
                          item.type === "task"
                            ? "border-brand-blue/25 bg-brand-blue/10"
                            : "border-brand-gold/30 bg-brand-gold/10"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <p className="font-medium text-brand-ink">{item.title}</p>
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {item.type === "task" ? "Tarea" : "Evento"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {item.start} - {item.end}
                        </p>
                        {item.description ? <p className="mt-1 text-sm text-slate-700">{item.description}</p> : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-brand-ink">Tareas del día</h2>
                    <span className="text-sm text-slate-500">{tasks.length}</span>
                  </div>
                  {tasks.length === 0 ? (
                    <p className="card text-sm text-slate-500">No hay tareas registradas.</p>
                  ) : (
                    tasks
                      .slice()
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(item) => {
                            setEditingTask(item);
                            setShowTaskForm(true);
                          }}
                          onDelete={handleTaskDelete}
                        />
                      ))
                  )}
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-brand-ink">Eventos del día</h2>
                    <span className="text-sm text-slate-500">{events.length}</span>
                  </div>
                  {events.length === 0 ? (
                    <p className="card text-sm text-slate-500">No hay eventos registrados.</p>
                  ) : (
                    events
                      .slice()
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((eventItem) => (
                        <EventCard
                          key={eventItem.id}
                          event={eventItem}
                          onEdit={(item) => {
                            setEditingEvent(item);
                            setShowEventForm(true);
                          }}
                          onDelete={handleEventDelete}
                        />
                      ))
                  )}
                </section>
              </div>

              <AiSuggestions
                suggestions={suggestions}
                loading={analyzing}
                onAnalyze={handleAnalyzeDay}
                error={aiError}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
