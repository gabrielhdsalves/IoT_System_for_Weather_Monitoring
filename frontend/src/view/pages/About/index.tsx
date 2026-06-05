import Header from "@/view/components/header";
import {
  Users,
  Cpu,
  CloudRain,
  Database,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function About() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-6 overflow-y-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-8 font-sans text-white transition-all duration-1000 sm:p-10 md:p-12">
      <div className="animate-fade-in mb-16 flex w-full max-w-6xl flex-col gap-6">
        <Header />

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center shadow-lg backdrop-blur-md md:p-10 md:text-left">
          <div className="flex items-center gap-2 self-center md:self-start">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Projeto de Computação em Nuvem e Visão Computacional
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Estação Meteorológica Híbrida &amp; IA
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">
            Esta plataforma inovadora integra sensores físicos locais (IoT) de
            baixo custo, previsões regionais de alta precisão e algoritmos
            avançados de Visão Computacional para monitoramento climático em
            tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/2 p-6 shadow-md transition-all hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Estação Física Local
            </h4>
            <p className="text-xs leading-relaxed text-white/50">
              Uso de microcontroladores integrados ao sensor{" "}
              <strong>DHT11</strong> para medir a temperatura e a umidade
              relativa do ar. Os dados são enviados periodicamente para a nuvem
              através de planilhas.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/2 p-6 shadow-md transition-all hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CloudRain className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Magnus-Tetens &amp; Precipitação
            </h4>
            <p className="text-xs leading-relaxed text-white/50">
              Previsão termodinâmica de chuva calculando a pressão de vapor de
              saturação (e<sub>s</sub>), pressão real (e<sub>a</sub>), ponto de
              orvalho (T<sub>o</sub>) e coluna de água precipitável (W) a partir
              dos dados do sensor local.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/2 p-6 shadow-md transition-all hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Classificação de Nuvens
            </h4>
            <p className="text-xs leading-relaxed text-white/50">
              Um modelo de Deep Learning baseado na arquitetura{" "}
              <strong>Xception</strong> (Treinado no dataset{" "}
              <strong>CCSN_v2</strong>) analisa fotos do céu enviadas no
              navegador para identificar 11 tipos diferentes de formações de
              nuvens.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold tracking-wide text-white">
              Desenvolvedores
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/3 p-4">
              <span className="text-sm font-bold text-white">
                Gabriel Alves
              </span>
              <span className="text-xs text-white/50">
                Ciência da Computação &bull; UNIFEI
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/3 p-4">
              <span className="text-sm font-bold text-white">
                Juliana Azevedo
              </span>
              <span className="text-xs text-white/50">
                Ciência da Computação &bull; UNIFEI
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 text-xs leading-relaxed text-white/60">
            <BookOpen className="mt-0.5 h-4.5 w-4.5 shrink-0 text-indigo-400" />
            <div>
              <strong>Sobre a Disciplina:</strong> Trabalho prático desenvolvido
              para a matéria de
              <strong> Computação em Nuvem e Visão Computacional</strong> da
              Universidade Federal de Itajubá (UNIFEI), visando o
              desenvolvimento de arquiteturas de dados resilientes, escaláveis e
              com processamento híbrido (borda/nuvem).
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-40 w-full border-t border-white/5 bg-slate-900/60 py-6 text-center text-xs text-white/40 backdrop-blur-md">
        Desenvolvido por Gabriel Alves e Juliana Azevedo
      </footer>
    </div>
  );
}
