import { useEffect, useMemo, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  task_date: "",
  start_time: "",
  end_time: "",
  priority: "medium",
  status: "pending",
};

const calculateMinutes = (date, startTime, endTime) => {
  if (!date || !startTime || !endTime) return 0;

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const minutes = Math.round((end - start) / 60000);

  return minutes > 0 ? minutes : 0;
};

function TaskForm({ initialData, defaultDate, onSubmit, onCancel, submitting }) {
  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        ...emptyTask,
        ...initialData,
      };
    }
    return { ...emptyTask, task_date: defaultDate };
  }, [initialData, defaultDate]);

  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const estimatedMinutes = useMemo(
    () => calculateMinutes(form.task_date, form.start_time, form.end_time),
    [form.task_date, form.start_time, form.end_time]
  );

  const isEndBeforeStart = form.task_date && form.start_time && form.end_time && estimatedMinutes === 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEndBeforeStart) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    onSubmit({
      ...form,
      estimated_minutes: estimatedMinutes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h3 className="text-base font-semibold text-brand-ink">
        {initialData ? "Editar tarea" : "Nueva tarea"}
      </h3>

      <input className="input" name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
      <textarea
        className="input min-h-20"
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />
      <div>
        <input className="input" type="date" name="task_date" value={form.task_date} onChange={handleChange} required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
        <input className="input" type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
      </div>
      <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 px-3 py-2 text-sm text-brand-blueDark">
        Minutos estimados: <span className="font-semibold">{estimatedMinutes}</span>
      </div>
      {error ? <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="input" name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Prioridad baja</option>
          <option value="medium">Prioridad media</option>
          <option value="high">Prioridad alta</option>
        </select>
        <select className="input" name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className="btn border border-slate-300 text-slate-700 hover:bg-slate-100" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn bg-brand-blue text-white hover:bg-brand-blueDark" disabled={submitting}>
          {submitting ? "Guardando..." : initialData ? "Actualizar tarea" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
