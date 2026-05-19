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
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-lg font-bold text-slate-800">Cronograma Diario</p>
          <p className="text-xs text-slate-500">Gestiona tareas, eventos e insights IA</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {user?.name || "Usuario"}
          </span>
          <button
            onClick={handleLogout}
            className="btn bg-slate-900 text-white hover:bg-slate-700"
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
