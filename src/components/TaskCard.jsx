function TaskCard({ task, onEdit, onDelete }) {
  const priorityColor = {
    low: "bg-sky-100 text-sky-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-rose-100 text-rose-700",
  };

  return (
    <article className="card border-l-4 border-l-blue-500">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{task.title}</p>
          <p className="text-xs text-slate-500">
            {task.start_time} - {task.end_time}
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColor[task.priority] || "bg-slate-100 text-slate-600"}`}>
          {task.priority || "medium"}
        </span>
      </div>
      {task.description ? <p className="mb-3 text-sm text-slate-600">{task.description}</p> : null}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Estado: {task.status || "pending"}</span>
        <span>{task.estimated_minutes || 0} min</span>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => onEdit(task)} className="btn border border-slate-300 text-slate-700 hover:bg-slate-100">
          Editar
        </button>
        <button type="button" onClick={() => onDelete(task.id)} className="btn bg-rose-600 text-white hover:bg-rose-700">
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
