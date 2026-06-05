import { Sun, Settings, Info } from "lucide-react";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="flex w-full flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-lg backdrop-blur-md md:flex-row">
      <div className="flex items-center gap-6">
        <div className="rounded-xl bg-white/10 p-2.5">
          <Sun className="h-6 w-6 animate-pulse text-amber-300" />
        </div>
        <div>
          <h1 className="bg-linear-to-r from-white to-amber-200 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Previsão do Tempo
          </h1>
          <p className="text-xs text-white/60">
            Consulte como foi a previsão do tempo de dias específicos
          </p>
        </div>
      </div>
      <nav className="mt-4 flex flex-col items-center gap-4 border-t border-white/10 pt-3 md:ml-auto md:mt-0 md:flex-row md:gap-6 md:border-t-0 md:pt-0">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              isActive ? "text-amber-300" : "text-white/70 hover:text-white"
            }`
          }
        >
          <Sun className="h-4 w-4" />
          Previsão do Tempo
        </NavLink>

        <NavLink 
          to="/about" 
          className={({ isActive }) => 
            `flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              isActive ? "text-amber-300" : "text-white/70 hover:text-white"
            }`
          }
        >
          <Info className="h-4 w-4" />
          Sobre
        </NavLink>
      </nav>
    </header>
  );
}
