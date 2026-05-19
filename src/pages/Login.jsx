import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", form);
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <section className="w-full max-w-md rounded-2xl border border-brand-blue/20 bg-white p-6 shadow-sm">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Uvirtual" className="h-20 w-auto" />
        </div>
        <h1 className="mb-1 text-2xl font-bold text-brand-ink">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-slate-500">Accede para gestionar tu cronograma diario.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Contraseña</label>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          {error ? <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p> : null}

          <button type="submit" className="btn w-full bg-brand-blue text-white hover:bg-brand-blueDark" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-semibold text-brand-blue hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
