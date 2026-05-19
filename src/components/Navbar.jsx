import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-brand-blue/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Uvirtual" className="h-11 w-auto" />
          <div>
            <p className="text-lg font-bold text-brand-ink">Cronograma Diario</p>
            <p className="text-xs text-slate-500">Gestiona tareas, eventos e insights IA</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm text-brand-blueDark">
            {user?.name || "Usuario"}
          </span>
          <button
            onClick={handleLogout}
            className="btn bg-brand-ink text-white hover:bg-brand-blueDark"
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
