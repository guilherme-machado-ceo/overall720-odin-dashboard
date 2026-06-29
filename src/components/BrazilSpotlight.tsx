import { useRef } from "react";
import { inflectionPoints, countryDebtData, kpis, latestYearIndex } from "@/data/lcBondsData";
import { t, getLocale } from "@/i18n";
import ExportButton from "./ExportButton";
import EstBadge from "./EstBadge";
import { ArrowRight, ChevronRight, Share2 } from "lucide-react";

interface Props { onSourceClick: (id: string) => void; onEmbedClick: (id: string) => void; }

// SVG FX Infrastructure — substitui imagem quebrada /3d-infra.jpg
function FXInfraSVG() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bgGrad)" />
      {/* Grid */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 15} x2="400" y2={i * 15} stroke="#1a1a1a" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 27 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 15} y1="0" x2={i * 15} y2="300" stroke="#1a1a1a" strokeWidth="0.5" />
      ))}
      {/* Central hub — B3 */}
      <circle cx="200" cy="150" r="30" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.6" />
      <circle cx="200" cy="150" r="20" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.4" />
      <text x="200" y="155" textAnchor="middle" fill="#00FFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">B3</text>
      {/* Nodes */}
      {[
        { x: 80, y: 80, label: "CFETS", sub: "China" },
        { x: 320, y: 80, label: "CIPS", sub: "Yuan" },
        { x: 80, y: 220, label: "NDB", sub: "BRICS" },
        { x: 320, y: 220, label: "TCX", sub: "Hedge" },
        { x: 200, y: 50, label: "PBOC", sub: "Swap" },
        { x: 200, y: 250, label: "BCB", sub: "Ptax" },
      ].map((node, i) => (
        <g key={i}>
          <line x1="200" y1="150" x2={node.x} y2={node.y} stroke="url(#cyanGrad)" strokeWidth="1" opacity="0.5" />
          <circle cx={node.x} cy={node.y} r="18" fill="#111" stroke="#00FFFF" strokeWidth="1" opacity="0.7" />
          <text x={node.x} y={node.y - 2} textAnchor="middle" fill="#e0e0e0" fontSize="8" fontFamily="monospace" fontWeight="bold">{node.label}</text>
          <text x={node.x} y={node.y + 8} textAnchor="middle" fill="#555" fontSize="6" fontFamily="monospace">{node.sub}</text>
        </g>
      ))}
      {/* Animated pulse ring */}
      <circle cx="200" cy="150" r="35" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="30;40;30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function BrazilSpotlight({ onSourceClick, onEmbedClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const locale = getLocale();
  const brazil = countryDebtData.find((c) => c.country === "Brazil")!;
  const ndbProgress = (kpis.ndbLCShare / kpis.ndbLCTarget) * 100;
  const jsonData = { brazil: { lcDebt: brazil.localCurrencyDebt[latestYearIndex], fcDebt: brazil.foreignCurrencyDebt[latestYearIndex], debtToGDP: kpis.dividaBrutaBR } };

  return (
    <section id="brazil-spotlight" className="border-b border-[#1a1a1a] bg-[#050505] relative neon-pulse">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent" />
      <div className="max-w-[1440px] mx-auto px-4 py-8" ref={chartRef}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-[#00FFFF]" /><span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#00FFFF]">{t("brazilSticky.label")}</span></div>
            <h2 className="text-xl md:text-2xl font-bold text-[#e0e0e0] tracking-tight">{t("section1.title")}</h2>
            <p className="text-[11px] font-mono text-[#555] mt-1">{t("section1.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton chartRef={chartRef} filename="brazil-spotlight" jsonData={jsonData} />
            <button onClick={() => onEmbedClick("brazil-spotlight")} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#555] hover:text-[#00FFFF] transition-colors border border-[#222] hover:border-[#00FFFF]/40"><Share2 size={12} /></button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
              {inflectionPoints.map((point) => (
                <div key={point.event} className="bg-[#111] p-4 group hover:bg-[#161616] transition-colors relative">
                  {point.isEstimated && <div className="absolute top-2 right-2"><EstBadge /></div>}
                  <div className="text-[9px] font-mono text-[#00FFFF] mb-1">{point.year}</div>
                  <div className="text-[11px] font-mono text-[#aaa] mb-2 group-hover:text-[#e0e0e0] transition-colors">{locale === "pt" ? point.eventPt : point.event}</div>
                  <div className="text-[16px] font-mono font-bold text-[#e0e0e0]">{point.value}</div>
                  <button onClick={() => onSourceClick("bloomberg")} className="text-[8px] font-mono text-[#444] mt-2 hover:text-[#00FFFF] transition-colors">{point.source} →</button>
                </div>
              ))}
            </div>
            <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-mono uppercase tracking-widest text-[#555]">{t("section1.ndbProgress")}</span><span className="text-[9px] font-mono text-[#00FFFF]">{kpis.ndbLCShare}% → {kpis.ndbLCTarget}%</span></div>
              <div className="w-full h-2 bg-[#222] relative"><div className="h-full bg-gradient-to-r from-[#00FFFF] to-[#00FF88] transition-all duration-1000" style={{ width: `${ndbProgress}%` }} /></div>
              <div className="flex items-center justify-between mt-2"><span className="text-[8px] font-mono text-[#444]">0%</span><span className="text-[8px] font-mono text-[#00FFFF]">Current: {kpis.ndbLCShare}%</span><span className="text-[8px] font-mono text-[#00FF88]">Target: {kpis.ndbLCTarget}%</span></div>
            </div>
            <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-4">
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#555] mb-4">{t("section1.infographic")}</div>
              <div className="flex flex-col md:flex-row items-stretch gap-0">
                {[t("section1.flowStep1"), t("section1.flowStep2"), t("section1.flowStep3"), t("section1.flowStep4"), t("section1.flowStep5")].map((step, i) => (
                  <div key={i} className="flex md:flex-col items-center flex-1">
                    <div className="bg-[#111] border border-[#222] p-3 flex-1 w-full flex md:flex-col items-center gap-2 md:gap-1 group hover:border-[#00FFFF]/30 transition-colors">
                      <span className="text-[10px] font-mono text-[#00FFFF] w-5 h-5 flex items-center justify-center border border-[#00FFFF]/30 shrink-0">{i + 1}</span>
                      <span className="text-[9px] font-mono text-[#aaa] text-center leading-tight group-hover:text-[#e0e0e0] transition-colors">{step}</span>
                    </div>
                    {i < 4 && <><div className="flex md:hidden items-center justify-center w-4"><ChevronRight size={10} className="text-[#333]" /></div><div className="hidden md:flex items-center justify-center h-3"><div className="w-px h-full bg-[#222]" /></div></>}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
              <div className="bg-[#111] p-4">
                <div className="text-[9px] font-mono uppercase tracking-widest text-[#555] mb-2">{t("brazilSticky.lcDebt")}</div>
                <div className="text-2xl font-mono font-bold text-[#00FFFF]">{brazil.localCurrencyDebt[latestYearIndex]}%</div>
                <div className="w-full h-1 bg-[#222] mt-2"><div className="h-full bg-[#00FFFF]" style={{ width: `${brazil.localCurrencyDebt[latestYearIndex]}%` }} /></div>
              </div>
              <div className="bg-[#111] p-4">
                <div className="text-[9px] font-mono uppercase tracking-widest text-[#555] mb-2">{t("brazilSticky.fcDebt")}</div>
                <div className="text-2xl font-mono font-bold text-[#FF8C00]">{brazil.foreignCurrencyDebt[latestYearIndex]}%</div>
                <div className="w-full h-1 bg-[#222] mt-2"><div className="h-full bg-[#FF8C00]" style={{ width: `${brazil.foreignCurrencyDebt[latestYearIndex]}%` }} /></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="border border-[#1a1a1a] bg-[#0a0a0a] h-full min-h-[400px] relative overflow-hidden group">
              {/* SVG substitui imagem quebrada /3d-infra.jpg */}
              <FXInfraSVG />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#00FFFF]">FOREIGN EXCHANGE INFRASTRUCTURE</span>
                <div className="text-[10px] font-mono text-[#555] mt-1">B3 / CFETS / CIPS / NDB / TCX</div>
              </div>
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00FFFF]/30" /><div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00FFFF]/30" /><div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00FFFF]/30" /><div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00FFFF]/30" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => onSourceClick("bcb")} className="text-[9px] font-mono text-[#444] hover:text-[#00FFFF] transition-colors">{t("section1.source")}: BCB / PBOC / NDB / CIPS →</button>
          <a href="https://www.bcb.gov.br/estabilidadefinanceira/trocaisonomada" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#00FFFF] hover:underline flex items-center gap-1">{t("section1.readAnalysis")} <ArrowRight size={10} /></a>
        </div>
      </div>
    </section>
  );
}
