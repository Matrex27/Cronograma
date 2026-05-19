import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/register", form);
      setSuccess("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo completar el registro.");
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
        <h1 className="mb-1 text-2xl font-bold text-brand-ink">Crear cuenta</h1>
        <p className="mb-6 text-sm text-slate-500">Regístrate para comenzar a planificar tus días.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Nombre</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Contraseña</label>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          {error ? <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p> : null}
          {success ? <p className="rounded-lg bg-brand-blue/10 px-3 py-2 text-sm text-brand-blueDark">{success}</p> : null}

          <button type="submit" className="btn w-full bg-brand-blue text-white hover:bg-brand-blueDark" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-brand-blue hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
