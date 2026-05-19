function AiSuggestions({ suggestions, loading, onAnalyze, error }) {
  return (
    <section className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brand-ink">Análisis IA del día</h2>
          <p className="text-sm text-slate-500">
            Recibe recomendaciones para optimizar tu agenda.
          </p>
        </div>
        <button
          type="button"
          className="btn bg-brand-ink text-white hover:bg-brand-blueDark"
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? "Analizando..." : "Analizar día con IA"}
        </button>
      </div>

      {error ? <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p> : null}

      {suggestions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No hay sugerencias para esta fecha. Usa el botón para generar análisis.
        </p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((item, index) => (
            <article key={`${item.suggestion_type}-${index}`} className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-blueDark">
                {item.suggestion_type}
              </p>
              <p className="text-sm text-brand-ink">{item.suggestion}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AiSuggestions;
