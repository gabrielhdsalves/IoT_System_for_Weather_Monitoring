import {
  ShieldAlert,
  Flame,
  Gauge,
  Thermometer,
  Droplets,
  CloudRain,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface MagnusTetensCardProps {
  reading: {
    data: string;
    temperatura: number;
    umidade: number;
    pressaoSaturacao_hPa: number;
    pressaoAtual_hPa: number;
    pontoOrvalho_C: number;
    depressao_C: number;
    alertaChuva: "Vermelho" | "Amarelo" | "Verde";
    aguaPrecipitavel_mm: number;
    statusCombustivel: string;
    chovendoMateo: boolean;
    probabilidadeChuvaMateo: number;
  };
}

export default function MagnusTetensCard({ reading }: MagnusTetensCardProps) {
  if (!reading) return null;

  const formatVal = (val: any, decimals = 2) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(decimals);
  };

  const getAlertConfig = (alerta: string) => {
    switch (alerta) {
      case "Vermelho":
        return {
          bgColor: "bg-red-500/10 border-red-500/30 text-red-300",
          badgeColor: "bg-red-500 text-white",
          text: "Alta Probabilidade (Ar Quase Saturado)",
        };
      case "Amarelo":
        return {
          bgColor: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          badgeColor: "bg-amber-500 text-slate-900",
          text: "Média Probabilidade (Observação)",
        };
      case "Verde":
        return {
          bgColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          badgeColor: "bg-emerald-500 text-white",
          text: "Baixa Probabilidade (Ar Estável)",
        };
      default:
        return {
          bgColor: "bg-slate-500/10 border-slate-500/30 text-slate-300",
          badgeColor: "bg-slate-500 text-white",
          text: "Sem Alerta",
        };
    }
  };

  const alertConfig = getAlertConfig(reading.alertaChuva || "Verde");

  // Formata o horário da medição
  let timeDisplay = "--:--";
  if (reading.data && typeof reading.data === "string") {
    if (reading.data.includes(" ")) {
      const timePart = reading.data.split(" ")[1];
      timeDisplay = timePart ? timePart.substring(0, 5) : "--:--";
    } else if (reading.data.includes("T")) {
      const date = new Date(reading.data);
      if (!isNaN(date.getTime())) {
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        timeDisplay = `${hours}:${minutes}`;
      } else {
        const parts = reading.data.split("T");
        if (parts[1]) {
          timeDisplay = parts[1].substring(0, 5);
        }
      }
    } else {
      timeDisplay = reading.data;
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur-md">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-base font-bold tracking-wide text-white">
          Análise Termodinâmica (Fórmula de Magnus-Tetens)
        </h3>
        <p className="mt-0.5 text-xs text-white/40">
          Medição das {timeDisplay}
        </p>
      </div>

      <div
        className={`flex flex-col gap-4 rounded-xl border p-4 ${alertConfig.bgColor}`}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-white/55 uppercase">
              Alerta de Precipitação
            </span>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${alertConfig.badgeColor}`}
              >
                {reading.alertaChuva || "Verde"}
              </span>
              <span className="text-sm font-bold text-white">
                {alertConfig.text}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-white/5 pt-3">
          <Flame className="h-5 w-5 shrink-0 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-white/55 uppercase">
              Combustível Atmosférico (PW)
            </span>
            <span className="mt-0.5 text-xs font-semibold text-white/90">
              {reading.statusCombustivel || "Sem dados"} (
              {formatVal(reading.aguaPrecipitavel_mm)} mm)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <Thermometer className="h-4 w-4 text-sky-400" />
            <span className="text-[10px] font-bold uppercase">
              Ponto de Orvalho
            </span>
          </div>
          <span className="text-lg font-black text-white">
            {formatVal(reading.pontoOrvalho_C)}°C
          </span>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Cálculo (Equação 3)
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase">
              Depressão (T - Td)
            </span>
          </div>
          <span className="text-lg font-black text-white">
            {formatVal(reading.depressao_C)}°C
          </span>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Cálculo Local
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <Droplets className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase">
              Água Precipitável
            </span>
          </div>
          <span className="text-lg font-black text-white">
            {formatVal(reading.aguaPrecipitavel_mm)} mm
          </span>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Cálculo (Equação 4)
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <Gauge className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase">
              P. Sat. (e_s)
            </span>
          </div>
          <span className="text-lg font-black text-white">
            {formatVal(reading.pressaoSaturacao_hPa, 3)} hPa
          </span>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Cálculo (Equação 1)
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <Gauge className="h-4 w-4 text-teal-400" />
            <span className="text-[10px] font-bold uppercase">
              P. Real (e_a)
            </span>
          </div>
          <span className="text-lg font-black text-white">
            {formatVal(reading.pressaoAtual_hPa, 3)} hPa
          </span>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Cálculo (Equação 2)
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/3 p-3">
          <div className="flex items-center gap-1.5 text-white/50">
            <CloudRain className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase">
              Chovendo Mateo
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {reading.chovendoMateo ? (
              <>
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Sim ({reading.probabilidadeChuvaMateo ?? 0}%)
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4.5 w-4.5 shrink-0 text-white/30" />
                <span className="text-xs font-bold text-white/50">
                  Não ({reading.probabilidadeChuvaMateo ?? 0}%)
                </span>
              </>
            )}
          </div>
          <span className="mt-auto pt-1 text-[9px] font-bold text-white/20 uppercase">
            Open-Meteo API
          </span>
        </div>
      </div>
    </div>
  );
}
