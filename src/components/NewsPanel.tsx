import { useEffect, useState } from "react";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  published: string;
  source: string;
  summary: string;
  category: string;
}

export default function NewsPanel() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://hubstry-em-dashboard.vercel.app/api/news")
      .then((r) => r.json())
      .then((data) => { setItems(data.items || []); setLoading(false); })
      .catch(() => { setError("Falha ao carregar noticias"); setLoading(false); });
  }, []);

  if (loading) return (
    <section className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={14} className="text-[#00FFFF]" />
          <h2 className="text-sm font-bold tracking-tight text-[#e0e0e0]">NOTICIAS FINANCEIRAS</h2>
          <span className="text-[8px] font-mono text-[#444] ml-auto">Carregando...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a]">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-[#0a0a0a] p-4 animate-pulse">
              <div className="h-3 bg-[#1a1a1a] rounded mb-2 w-3/4"></div>
              <div className="h-2 bg-[#1a1a1a] rounded mb-1 w-full"></div>
              <div className="h-2 bg-[#1a1a1a] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={14} className="text-[#FF4444]" />
          <h2 className="text-sm font-bold tracking-tight text-[#e0e0e0]">NOTICIAS FINANCEIRAS</h2>
        </div>
        <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
          <span className="text-[11px] font-mono text-[#FF4444]">{error}</span>
        </div>
      </div>
    </section>
  );

  return (
    <section className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={14} className="text-[#00FFFF]" />
          <h2 className="text-sm font-bold tracking-tight text-[#e0e0e0]">NOTICIAS FINANCEIRAS</h2>
          <span className="text-[8px] font-mono text-[#444] ml-auto">{items.length} ITENS &middot; GOOGLE NEWS RSS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
          {items.slice(0, 9).map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
               className="bg-[#0a0a0a] p-4 block hover:bg-[#111] transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#00FFFF] bg-[#001a1a] px-1.5 py-0.5 border border-[#00FFFF22]">
                  {item.category}
                </span>
                <ExternalLink size={10} className="text-[#333] group-hover:text-[#555] flex-shrink-0" />
              </div>
              <h3 className="text-[12px] font-medium text-[#e0e0e0] leading-snug mb-2 line-clamp-3 group-hover:text-[#fff]">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-[10px] text-[#555] leading-relaxed line-clamp-2 mb-2">{item.summary}</p>
              )}
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-[8px] font-mono text-[#444]">
                  {new Date(item.published).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-[8px] font-mono text-[#333]">&middot;</span>
                <span className="text-[8px] font-mono text-[#444] uppercase">{item.source}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
