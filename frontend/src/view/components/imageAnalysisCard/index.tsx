import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { evaluateImage } from "../../../app/services/weatherService";

interface AnalysisResult {
  condition: string;
  tempEst: string;
  cloudiness: string;
  confidence: string;
  description: string;
}

const CLOUD_CLASSES = [
  {
    name: "Altocumulus (Ac)",
    condition: "Parcialmente Nublado",
    tempEst: "20°C a 24°C",
    cloudiness: "40% - 60%",
    description:
      "Nuvens de altitude média, parecendo pequenos rolos ou patches. Geralmente indicam tempo estável ou uma transição gradual nas condições climáticas.",
  },
  {
    name: "Altostratus (As)",
    condition: "Nublado",
    tempEst: "18°C a 21°C",
    cloudiness: "70% - 90%",
    description:
      "Uma camada cinzenta ou azulada que cobre a maior parte do céu. Pode trazer chuva leve ou garoa contínua nas próximas horas.",
  },
  {
    name: "Cumulonimbus (Cb)",
    condition: "Tempestade / Chuva Forte",
    tempEst: "15°C a 18°C",
    cloudiness: "90% - 100%",
    description:
      "Nuvens de tempestade gigantescas com desenvolvimento vertical. Indicam probabilidade muito alta de chuva forte, raios, trovoadas e rajadas de vento.",
  },
  {
    name: "Cirrocumulus (Cc)",
    condition: "Tempo Estável ou Mudança Gradual",
    tempEst: "22°C a 26°C",
    cloudiness: "10% - 30%",
    description:
      "Nuvens altas em forma de pequenas ondas ou flocos. Normalmente associadas a tempo estável e frio ou aproximação de uma frente quente.",
  },
  {
    name: "Cirrus (Ci)",
    condition: "Céu Aberto / Ensolarado",
    tempEst: "23°C a 27°C",
    cloudiness: "5% - 15%",
    description:
      "Nuvens altas, finas e fibrosas semelhantes a fios de cabelo. Indicam tempo bom no momento, mas podem sinalizar mudança no clima em 24-36 horas.",
  },
  {
    name: "Cirrostratus (Cs)",
    condition: "Céu Parcialmente Coberto",
    tempEst: "21°C a 25°C",
    cloudiness: "20% - 50%",
    description:
      "Véu de nuvens altas, fino e transparente que cobre parcialmente ou totalmente o céu, frequentemente gerando halos ao redor do Sol ou da Lua.",
  },
  {
    name: "Contrails (Ct)",
    condition: "Trilhas de Condensação",
    tempEst: "22°C a 26°C",
    cloudiness: "5% - 10%",
    description:
      "Trilhas de condensação artificiais geradas por aeronaves. Indicam alta umidade nas camadas mais elevadas da atmosfera.",
  },
  {
    name: "Cumulus (Cu)",
    condition: "Geralmente Tempo Bom",
    tempEst: "24°C a 28°C",
    cloudiness: "20% - 40%",
    description:
      "Nuvens com contornos bem definidos e base plana, parecendo flocos de algodão. Indicam tempo bom e estável (nuvens de bom tempo).",
  },
  {
    name: "Nimbostratus (Ns)",
    condition: "Chuva Contínua / Intensa",
    tempEst: "14°C a 17°C",
    cloudiness: "95% - 100%",
    description:
      "Camada de nuvens cinzentas e escuras, espessas o suficiente para ocultar o Sol. Associadas a chuva ou garoa persistente e contínua.",
  },
  {
    name: "Stratocumulus (Sc)",
    condition: "Nublado",
    tempEst: "17°C a 20°C",
    cloudiness: "60% - 85%",
    description:
      "Nuvens cinzentas ou esbranquiçadas que formam grupos, rolos ou massas onduladas. Podem trazer chuviscos ocasionais, mas geralmente não indicam tempestades.",
  },
  {
    name: "Stratus (St)",
    condition: "Céu Encoberto / Nevoeiro",
    tempEst: "16°C a 19°C",
    cloudiness: "90% - 100%",
    description:
      "Uma camada de nuvens cinzentas muito baixa e uniforme, semelhante a um nevoeiro elevado. Pode causar garoa fina ou chuvisco.",
  },
];

export default function ImageAnalysisCard() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setImagePreview(base64Data);
      setIsAnalyzing(true);
      setResult(null);
      setError(null);

      try {
        const response = await evaluateImage(base64Data);
        if (response.success && typeof response.class_index === "number") {
          const classIdx = response.class_index;
          const cloudInfo = CLOUD_CLASSES[classIdx] || {
            name: "Desconhecido",
            condition: "Não identificada",
            tempEst: "--",
            cloudiness: "--",
            description:
              "O modelo retornou um índice de classe inválido ou não mapeado.",
          };

          const confVal =
            response.confidence !== undefined
              ? `${(response.confidence * 100).toFixed(1)}%`
              : "N/A";

          setResult({
            condition: `${cloudInfo.name} - ${cloudInfo.condition}`,
            tempEst: cloudInfo.tempEst,
            cloudiness: cloudInfo.cloudiness,
            confidence: confVal,
            description: cloudInfo.description,
          });
        } else {
          setError(response.error || "Não foi possível analisar a imagem.");
        }
      } catch (err: any) {
        console.error("Erro na requisição para o backend:", err);
        const errMsg =
          err.response?.data?.error ||
          err.message ||
          "Erro de conexão com o servidor.";
        setError(errMsg);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur-md">
      <div className="border-b border-white/5 pb-4">
        <h3 className="flex items-center gap-2 text-base font-bold tracking-wide text-white">
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          Análise Visual do Céu (IA)
        </h3>
        <p className="mt-1 text-xs text-white/50">
          Envie uma foto em tempo real do céu ou da sua estação local para
          estimar as condições meteorológicas por imagem.
        </p>
      </div>

      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
            isDragging
              ? "border-amber-300 bg-amber-300/5 text-amber-200"
              : "border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:bg-white/5"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <UploadCloud className="h-10 w-10 text-white/40" />
          <div className="text-center text-sm font-medium">
            Arraste e solte sua foto aqui, ou{" "}
            <span className="text-amber-300 hover:underline">
              clique para selecionar
            </span>
          </div>
          <div className="text-xs text-white/30">
            Suporta PNG, JPG ou JPEG de até 5MB
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12">
          <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20 md:col-span-5">
            <img
              src={imagePreview}
              alt="Céu enviado"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80 p-4 text-center backdrop-blur-xs">
                <Loader2 className="h-8 w-8 animate-spin text-amber-300" />
                <span className="text-sm font-semibold tracking-wide text-white">
                  Analisando padrões climáticos...
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-white/2 p-5 md:col-span-7">
            {isAnalyzing ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-white/40">
                <ImageIcon className="h-10 w-10 animate-pulse" />
                <span className="text-xs">
                  Aguardando processamento visual...
                </span>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                    Resultados do Modelo IA
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Confiança: {result.confidence}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-white/5 bg-white/2 p-3">
                    <div className="text-[10px] font-bold text-white/40 uppercase">
                      Condição
                    </div>
                    <div className="mt-1 text-sm leading-tight font-bold text-white">
                      {result.condition}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/2 p-3">
                    <div className="text-[10px] font-bold text-white/40 uppercase">
                      Temp. Estimada
                    </div>
                    <div className="mt-1 text-sm leading-tight font-bold text-white">
                      {result.tempEst}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/2 p-3">
                    <div className="text-[10px] font-bold text-white/40 uppercase">
                      Nebulosidade
                    </div>
                    <div className="mt-1 text-sm leading-tight font-bold text-white">
                      {result.cloudiness}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-xs leading-relaxed font-medium text-white/70">
                  <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Diagnóstico Visual
                  </div>
                  {result.description}
                </div>
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-xs text-rose-400">
                <AlertCircle className="h-8 w-8 text-rose-400" />
                <span className="text-center font-semibold">
                  Falha na análise da imagem:
                </span>
                <span className="px-4 text-center text-white/60">{error}</span>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-8 text-xs text-white/30">
                Houve um erro no carregamento da imagem ou nenhuma imagem foi
                analisada.
              </div>
            )}

            <div className="flex justify-end border-t border-white/5 pt-2">
              <button
                onClick={clearImage}
                disabled={isAnalyzing}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/25 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remover Imagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
