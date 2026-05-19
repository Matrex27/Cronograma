function AiSuggestions({ suggestions, loading, onAnalyze, error }) {
  return (
    <section className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Análisis IA del día</h2>
          <p className="text-sm text-slate-500">
            Recibe recomendaciones para optimizar tu agenda.
          </p>
        </div>
        <button
          type="button"
          className="btn bg-violet-600 text-white hover:bg-violet-700"
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? "Analizando..." : "Analizar día con IA"}
        </button>
      </div>

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      {suggestions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No hay sugerencias para esta fecha. Usa el botón para generar análisis.
        </p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((item, index) => (
            <article key={`${item.suggestion_type}-${index}`} className="rounded-lg border border-violet-200 bg-violet-50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                {item.suggestion_type}
              </p>
              <p className="text-sm text-violet-900">{item.suggestion}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AiSuggestions;
