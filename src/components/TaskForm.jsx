import { useEffect, useMemo, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  task_date: "",
  start_time: "",
  end_time: "",
  estimated_minutes: "",
  priority: "medium",
  status: "pending",
};

function TaskForm({ initialData, defaultDate, onSubmit, onCancel, submitting }) {
  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        ...emptyTask,
        ...initialData,
        estimated_minutes: initialData.estimated_minutes ?? "",
      };
    }
    return { ...emptyTask, task_date: defaultDate };
  }, [initialData, defaultDate]);

  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      estimated_minutes: form.estimated_minutes ? Number(form.estimated_minutes) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h3 className="text-base font-semibold text-slate-800">
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
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" type="date" name="task_date" value={form.task_date} onChange={handleChange} required />
        <input className="input" type="number" min="0" name="estimated_minutes" placeholder="Minutos estimados" value={form.estimated_minutes} onChange={handleChange} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
        <input className="input" type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
      </div>
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
        <button type="submit" className="btn bg-blue-600 text-white hover:bg-blue-700" disabled={submitting}>
          {submitting ? "Guardando..." : initialData ? "Actualizar tarea" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
