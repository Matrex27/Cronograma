function EventCard({ event, onEdit, onDelete }) {
  return (
    <article className="card border-l-4 border-l-brand-gold">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-ink">{event.title}</p>
          <p className="text-xs text-slate-500">
            {event.start_time} - {event.end_time}
          </p>
        </div>
        <span className="rounded-full bg-brand-gold/15 px-2 py-1 text-xs font-medium text-brand-gold">
          Evento
        </span>
      </div>
      {event.description ? <p className="mb-3 text-sm text-slate-600">{event.description}</p> : null}
      <div className="text-xs text-slate-500">Ubicación: {event.location || "Sin definir"}</div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => onEdit(event)} className="btn border border-slate-300 text-slate-700 hover:bg-slate-100">
          Editar
        </button>
        <button type="button" onClick={() => onDelete(event.id)} className="btn bg-brand-red text-white hover:bg-red-700">
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default EventCard;
