import { useEffect, useMemo, useState } from "react";

const emptyEvent = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  location: "",
};

function EventForm({ initialData, defaultDate, onSubmit, onCancel, submitting }) {
  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        ...emptyEvent,
        ...initialData,
      };
    }
    return { ...emptyEvent, event_date: defaultDate };
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
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h3 className="text-base font-semibold text-slate-800">
        {initialData ? "Editar evento" : "Nuevo evento"}
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
        <input className="input" type="date" name="event_date" value={form.event_date} onChange={handleChange} required />
        <input className="input" name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
        <input className="input" type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className="btn border border-slate-300 text-slate-700 hover:bg-slate-100" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn bg-emerald-600 text-white hover:bg-emerald-700" disabled={submitting}>
          {submitting ? "Guardando..." : initialData ? "Actualizar evento" : "Crear evento"}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
