import { useMemo } from "react";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const normalizeDate = (date) => (date ? String(date).slice(0, 10) : "");

const formatDate = (year, monthIndex, day) => {
  const month = String(monthIndex + 1).padStart(2, "0");
  const dayNumber = String(day).padStart(2, "0");
  return `${year}-${month}-${dayNumber}`;
};

const formatMonthLabel = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });
};

function MonthCalendar({
  selectedMonth,
  selectedDate,
  tasks,
  events,
  loading,
  onMonthChange,
  onDaySelect,
}) {
  const calendarDays = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const monthIndex = month - 1;
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days = [];

    for (let index = 0; index < startOffset; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = formatDate(year, monthIndex, day);
      const dayTasks = tasks.filter((task) => normalizeDate(task.task_date) === date);
      const dayEvents = events.filter((event) => normalizeDate(event.event_date) === date);

      days.push({
        date,
        day,
        tasks: dayTasks,
        events: dayEvents,
      });
    }

    return days;
  }, [events, selectedMonth, tasks]);

  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 2, 1);
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month, 1);
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <section className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold capitalize text-brand-ink">
            {formatMonthLabel(selectedMonth)}
          </h2>
          <p className="text-sm text-slate-500">
            Haz clic en un día para ver su agenda detallada.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn border border-brand-blue/25 text-brand-blueDark hover:bg-brand-blue/10"
            onClick={handlePreviousMonth}
          >
            Mes anterior
          </button>
          <button
            type="button"
            className="btn border border-brand-blue/25 text-brand-blueDark hover:bg-brand-blue/10"
            onClick={handleNextMonth}
          >
            Mes siguiente
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando calendario...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="grid grid-cols-7 bg-brand-blue/10">
            {weekDays.map((day) => (
              <div key={day} className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wide text-brand-blueDark">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-white">
            {calendarDays.map((item, index) =>
              item ? (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => onDaySelect(item.date)}
                  className={`min-h-32 border-r border-t border-slate-200 p-2 text-left transition hover:bg-brand-blue/5 ${
                    item.date === selectedDate ? "bg-brand-blue/10 ring-2 ring-inset ring-brand-blue" : ""
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-ink shadow-sm">
                      {item.day}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {item.tasks.length + item.events.length} items
                    </span>
                  </div>

                  <div className="space-y-1">
                    {item.tasks.slice(0, 2).map((task) => (
                      <p key={`task-${task.id}`} className="truncate rounded bg-brand-blue/15 px-2 py-1 text-xs text-brand-blueDark">
                        {task.title}
                      </p>
                    ))}
                    {item.events.slice(0, 2).map((event) => (
                      <p key={`event-${event.id}`} className="truncate rounded bg-brand-gold/20 px-2 py-1 text-xs text-brand-ink">
                        {event.title}
                      </p>
                    ))}
                    {item.tasks.length + item.events.length > 4 ? (
                      <p className="text-xs font-medium text-slate-500">
                        +{item.tasks.length + item.events.length - 4} más
                      </p>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div key={`empty-${index}`} className="min-h-32 border-r border-t border-slate-200 bg-slate-50" />
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default MonthCalendar;
