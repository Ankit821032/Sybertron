/* Illustrated card backdrops (pure SVG, no external images). Swap any of them for a real photo later. */
const base = { className: "absolute inset-0 h-full w-full", preserveAspectRatio: "xMidYMid slice" as const, "aria-hidden": true };
const W = "rgba(255,255,255,";

export function AiArt() {
  const hub = { x: 250, y: 190 };
  const nodes = [
    { x: 36, y: 70, w: 100, l: "Inbox" },
    { x: 26, y: 205, w: 90, l: "CRM" },
    { x: 366, y: 56, w: 100, l: "Slack" },
    { x: 380, y: 190, w: 96, l: "Sheets" },
    { x: 200, y: 330, w: 104, l: "Report" },
  ];
  return (
    <svg viewBox="0 0 500 500" {...base}>
      <defs>
        <linearGradient id="ai-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a0f2c" /><stop offset="1" stopColor="#241a6b" /></linearGradient>
        <radialGradient id="ai-hub"><stop offset="0" stopColor="#a5a0ff" /><stop offset="1" stopColor="#4338ca" /></radialGradient>
        <radialGradient id="ai-glow"><stop offset="0" stopColor="#6d63ff" stopOpacity=".5" /><stop offset="1" stopColor="#6d63ff" stopOpacity="0" /></radialGradient>
        <pattern id="ai-dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill={W + ".12)"} /></pattern>
      </defs>
      <rect width="500" height="500" fill="url(#ai-bg)" />
      <rect width="500" height="500" fill="url(#ai-dots)" />
      <circle cx={hub.x} cy={hub.y} r="210" fill="url(#ai-glow)" />
      {nodes.map((n, i) => {
        const cx = n.x + n.w / 2, cy = n.y + 20, mx = (cx + hub.x) / 2;
        const d = `M${cx} ${cy} C${mx} ${cy} ${mx} ${hub.y} ${hub.x} ${hub.y}`;
        return (
          <g key={n.l}>
            <path d={d} stroke="#8b84ff" strokeOpacity=".7" strokeWidth="1.6" fill="none" className="a-dash" />
            <circle r="3.5" fill="#c9c5ff"><animateMotion dur={`${2.6 + i * 0.35}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} /></circle>
            <g className="a-float" style={{ animationDelay: `${i * 0.6}s` }}>
              <rect x={n.x} y={n.y} width={n.w} height="40" rx="12" fill={W + ".08)"} stroke={W + ".2)"} />
              <circle cx={n.x + 16} cy={n.y + 20} r="4.5" fill="#4ade80" className="a-blink" style={{ animationDelay: `${i * 0.4}s` }} />
              <text x={n.x + 30} y={n.y + 25} fontSize="13" fill="#dcdcff" fontFamily="Geist, sans-serif">{n.l}</text>
            </g>
          </g>
        );
      })}
      <circle cx={hub.x} cy={hub.y} r="44" fill="none" stroke="#8b84ff" strokeWidth="2" className="a-ring" />
      <circle cx={hub.x} cy={hub.y} r="44" fill="none" stroke="#8b84ff" strokeWidth="2" className="a-ring" style={{ animationDelay: "1.3s" }} />
      <circle cx={hub.x} cy={hub.y} r="44" fill="url(#ai-hub)" />
      <path d="M250 160 L257 183 L280 190 L257 197 L250 220 L243 197 L220 190 L243 183Z" fill="#fff" />
    </svg>
  );
}

export function WebArt() {
  const bars = [30, 55, 40, 72, 50, 88, 64];
  const pts = bars.map((b, i) => `${137 + i * 29},${200 - b * 0.95}`).join(" ");
  return (
    <svg viewBox="0 0 400 300" {...base}>
      <defs><linearGradient id="web-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0c1230" /><stop offset="1" stopColor="#1f2a6b" /></linearGradient></defs>
      <rect width="400" height="300" fill="url(#web-bg)" />
      <g className="a-float">
        <rect x="52" y="28" width="300" height="196" rx="14" fill="#10133a" stroke={W + ".18)"} />
        <circle cx="68" cy="43" r="3.5" fill="#ff6b6b" /><circle cx="80" cy="43" r="3.5" fill="#ffd166" /><circle cx="92" cy="43" r="3.5" fill="#4ade80" />
        <rect x="60" y="58" width="52" height="158" rx="8" fill={W + ".05)"} />
        {[70, 88, 106].map((y) => <rect key={y} x="68" y={y} width="36" height="6" rx="3" fill={W + ".18)"} />)}
        {[0, 1, 2].map((i) => (
          <g key={i}><rect x={122 + i * 76} y="58" width="68" height="38" rx="8" fill={W + ".07)"} /><rect x={130 + i * 76} y="68" width="30" height="5" rx="2.5" fill={W + ".35)"} /><rect x={130 + i * 76} y="80" width="44" height="8" rx="4" fill="#8b84ff" /></g>
        ))}
        {bars.map((b, i) => <rect key={i} className="a-bar" style={{ animationDelay: `${i * 0.18}s` }} x={130 + i * 29} y={200 - b * 0.95} width="14" height={b * 0.95} rx="4" fill="#6d63ff" fillOpacity=".55" />)}
        <polyline points={pts} fill="none" stroke="#c9c5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="a-line" />
      </g>
      <g className="a-float" style={{ animationDelay: "1.4s" }}>
        <rect x="290" y="168" width="82" height="34" rx="17" fill="#fff" fillOpacity=".95" />
        <circle cx="308" cy="185" r="9" fill="#6d63ff" /><rect x="323" y="177" width="38" height="5" rx="2.5" fill="#1b1b3a" /><rect x="323" y="188" width="26" height="5" rx="2.5" fill="#9a9ab5" />
      </g>
    </svg>
  );
}

export function ShopArt() {
  return (
    <svg viewBox="0 0 400 300" {...base}>
      <defs>
        <linearGradient id="shop-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a0f3d" /><stop offset="1" stopColor="#4a1d7a" /></linearGradient>
        <linearGradient id="shop-bag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5a0ff" /><stop offset="1" stopColor="#4338ca" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#shop-bg)" />
      <g className="a-float">
        <path d="M232 92 C232 48 306 48 306 92" fill="none" stroke="#c9c5ff" strokeWidth="6" strokeLinecap="round" />
        <rect x="204" y="86" width="130" height="136" rx="16" fill="url(#shop-bag)" />
        <path d="M246 150 l16 16 l32 -34" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[{ x: 40, y: 70, p: "₹1,299", c: "#f9a8d4" }, { x: 66, y: 150, p: "₹899", c: "#fcd34d" }].map((c, i) => (
        <g key={c.p} className="a-float" style={{ animationDelay: `${i * 1.1 + 0.4}s` }}>
          <rect x={c.x} y={c.y} width="110" height="64" rx="12" fill={W + ".1)"} stroke={W + ".2)"} />
          <rect x={c.x + 10} y={c.y + 10} width="40" height="44" rx="8" fill={c.c} fillOpacity=".85" />
          <rect x={c.x + 60} y={c.y + 14} width="40" height="6" rx="3" fill={W + ".4)"} />
          <text x={c.x + 60} y={c.y + 44} fontSize="14" fontWeight="700" fill="#fff" fontFamily="Geist, sans-serif">{c.p}</text>
        </g>
      ))}
      <g className="a-float" style={{ animationDelay: "2s" }}><rect x="318" y="60" width="62" height="26" rx="13" fill="#4ade80" /><text x="349" y="77" fontSize="11" fontWeight="700" textAnchor="middle" fill="#052e16" fontFamily="Geist, sans-serif">+1 order</text></g>
    </svg>
  );
}

export function AppArt() {
  return (
    <svg viewBox="0 0 400 300" {...base}>
      <defs>
        <linearGradient id="app-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0b132e" /><stop offset="1" stopColor="#2a1f73" /></linearGradient>
        <linearGradient id="app-hd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6d63ff" /><stop offset="1" stopColor="#c084fc" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#app-bg)" />
      <g className="a-float"><g transform="rotate(-9 215 150)">
        <rect x="152" y="14" width="132" height="258" rx="26" fill="#0b0d24" stroke={W + ".35)"} strokeWidth="2" />
        <rect x="204" y="22" width="28" height="6" rx="3" fill={W + ".2)"} />
        <rect x="162" y="38" width="112" height="56" rx="14" fill="url(#app-hd)" />
        <rect x="172" y="50" width="48" height="7" rx="3.5" fill="#fff" fillOpacity=".9" /><rect x="172" y="64" width="70" height="5" rx="2.5" fill="#fff" fillOpacity=".5" />
        {[106, 144, 182].map((y, i) => (
          <g key={y}><rect x="162" y={y} width="112" height="30" rx="10" fill={W + ".07)"} /><circle cx="178" cy={y + 15} r="8" fill={["#f9a8d4", "#fcd34d", "#67e8f9"][i]} /><rect x="192" y={y + 9} width="48" height="5" rx="2.5" fill={W + ".4)"} /><rect x="192" y={y + 18} width="30" height="4" rx="2" fill={W + ".2)"} /></g>
        ))}
        <rect x="170" y="240" width="96" height="20" rx="10" fill={W + ".08)"} />
        {[188, 208, 228, 248].map((x) => <circle key={x} cx={x} cy="250" r="3.5" fill={W + ".45)"} />)}
      </g></g>
      <g className="a-float" style={{ animationDelay: "0.8s" }}><rect x="42" y="88" width="82" height="32" rx="16" fill="#fff" fillOpacity=".95" /><text x="83" y="108" fontSize="12" fontWeight="700" textAnchor="middle" fill="#3b34c9" fontFamily="Geist, sans-serif">♥ 2.4k</text></g>
      <g className="a-float" style={{ animationDelay: "2.2s" }}><rect x="296" y="170" width="76" height="32" rx="16" fill="#fff" fillOpacity=".95" /><text x="334" y="190" fontSize="12" fontWeight="700" textAnchor="middle" fill="#3b34c9" fontFamily="Geist, sans-serif">★ 4.9</text></g>
    </svg>
  );
}

export function GameArt() {
  const px = [[50, 60, 10, "#ff5d8f"], [330, 50, 14, "#60a5fa"], [70, 200, 12, "#ffd166"], [340, 190, 10, "#4ade80"], [290, 110, 8, "#c084fc"], [110, 110, 8, "#67e8f9"]] as const;
  return (
    <svg viewBox="0 0 400 300" {...base}>
      <defs>
        <linearGradient id="game-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#12082c" /><stop offset="1" stopColor="#35105f" /></linearGradient>
        <linearGradient id="game-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a42c9" /><stop offset="1" stopColor="#262070" /></linearGradient>
        <radialGradient id="game-glow"><stop offset="0" stopColor="#8b84ff" stopOpacity=".55" /><stop offset="1" stopColor="#8b84ff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#game-bg)" />
      <ellipse cx="200" cy="120" rx="190" ry="120" fill="url(#game-glow)" />
      {px.map(([x, y, s, c], i) => <rect key={i} x={x} y={y} width={s} height={s} rx="2" fill={c} className="a-float" style={{ animationDelay: `${i * 0.7}s` }} />)}
      <g className="a-float">
        <circle cx="128" cy="150" r="38" fill="url(#game-body)" /><circle cx="272" cy="150" r="38" fill="url(#game-body)" />
        <rect x="106" y="74" width="188" height="92" rx="46" fill="url(#game-body)" stroke={W + ".3)"} />
        <rect x="140" y="104" width="14" height="40" rx="3" fill="#0e0b2e" /><rect x="127" y="117" width="40" height="14" rx="3" fill="#0e0b2e" />
        <circle cx="256" cy="106" r="8" fill="#ff5d8f" /><circle cx="274" cy="124" r="8" fill="#ffd166" /><circle cx="256" cy="142" r="8" fill="#4ade80" /><circle cx="238" cy="124" r="8" fill="#60a5fa" />
        <circle cx="186" cy="132" r="9" fill="#0e0b2e" /><circle cx="214" cy="132" r="9" fill="#0e0b2e" />
      </g>
    </svg>
  );
}

export function VrArt() {
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs>
        <linearGradient id="vr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a1024" /><stop offset="1" stopColor="#1d1b57" /></linearGradient>
        <linearGradient id="vr-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e2a8a" /><stop offset="1" stopColor="#12113a" /></linearGradient>
        <radialGradient id="vr-lens"><stop offset="0" stopColor="#67e8f9" /><stop offset="1" stopColor="#6d63ff" stopOpacity=".2" /></radialGradient>
      </defs>
      <rect width="600" height="300" fill="url(#vr-bg)" />
      <g stroke="#8b84ff" strokeOpacity=".28" fill="none">
        {[-300, -200, -120, -50, 0, 50, 120, 200, 300].map((dx) => <line key={dx} x1="300" y1="150" x2={300 + dx * 2.4} y2="300" />)}
        {[170, 190, 215, 245, 285].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} />)}
      </g>
      <g className="a-float" style={{ animationDelay: "0.5s" }}><rect x="60" y="62" width="104" height="64" rx="12" fill={W + ".08)"} stroke={W + ".22)"} /><rect x="72" y="76" width="50" height="6" rx="3" fill={W + ".45)"} /><rect x="72" y="90" width="76" height="5" rx="2.5" fill={W + ".2)"} /><rect x="72" y="104" width="40" height="8" rx="4" fill="#67e8f9" /></g>
      <g className="a-spin" style={{ transformOrigin: "490px 100px" }}>
        <path d="M490 60 L522 78 L522 114 L490 132 L458 114 L458 78Z M490 96 L490 132 M490 96 L522 78 M490 96 L458 78" fill="none" stroke="#67e8f9" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
      <g className="a-float">
        <path d="M244 100 C200 96 190 120 190 140 M356 100 C400 96 410 120 410 140" stroke="#312e81" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="236" y="76" width="128" height="68" rx="26" fill="url(#vr-visor)" stroke={W + ".3)"} />
        <ellipse cx="276" cy="112" rx="20" ry="16" fill="url(#vr-lens)" /><ellipse cx="324" cy="112" rx="20" ry="16" fill="url(#vr-lens)" />
        <path d="M300 128 q6 8 0 14" stroke={W + ".35)"} fill="none" />
      </g>
      {[[210, 40], [395, 55], [430, 150], [160, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#c9c5ff" className="a-blink" style={{ animationDelay: `${i * 0.5}s` }} />)}
    </svg>
  );
}

export function MarketArt() {
  const pts = [[30, 220], [120, 196], [200, 205], [290, 150], [380, 160], [470, 96], [560, 60]];
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs>
        <linearGradient id="mk-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a1228" /><stop offset="1" stopColor="#1b2160" /></linearGradient>
        <linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b84ff" stopOpacity=".5" /><stop offset="1" stopColor="#8b84ff" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="600" height="300" fill="url(#mk-bg)" />
      {[80, 130, 180, 230].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke={W + ".07)"} />)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} className="a-bar" style={{ animationDelay: `${i * 0.25}s` }} x={36 + i * 64} y={250 - (20 + ((i * 37) % 50))} width="22" height={20 + ((i * 37) % 50)} rx="5" fill="#8b84ff" fillOpacity=".22" />)}
      <path d={`${line} L560 300 L30 300Z`} fill="url(#mk-area)" />
      <path d={line} fill="none" stroke="#c9c5ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="a-line" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke="#6d63ff" strokeWidth="3" />)}
      <circle cx="560" cy="60" r="10" fill="none" stroke="#c9c5ff" strokeWidth="2" className="a-ring" />
      <g className="a-float" style={{ animationDelay: "0.6s" }}><rect x="60" y="48" width="128" height="34" rx="17" fill="#fff" fillOpacity=".95" /><text x="124" y="70" fontSize="13" fontWeight="700" textAnchor="middle" fill="#3b34c9" fontFamily="Geist, sans-serif">Leads +38%</text></g>
      <g className="a-float" style={{ animationDelay: "1.8s" }}><rect x="360" y="30" width="104" height="34" rx="17" fill="#fff" fillOpacity=".95" /><text x="412" y="52" fontSize="13" fontWeight="700" textAnchor="middle" fill="#3b34c9" fontFamily="Geist, sans-serif">♥ 12.4k</text></g>
    </svg>
  );
}

/* ---- extra illustrations for the Services page ---- */
const F = "Geist, sans-serif";

export function AgentArt() {
  const tasks = ["Read the brief", "Plan the steps", "Call your tools", "Send the report"];
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="ag-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a1124" /><stop offset="1" stopColor="#1f1a5e" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#ag-bg)" />
      <g className="a-float">
        <circle cx="130" cy="150" r="64" fill="none" stroke="#8b84ff" strokeWidth="2" className="a-ring" />
        <rect x="88" y="106" width="84" height="76" rx="26" fill="#4338ca" stroke={W + ".35)"} />
        <circle cx="114" cy="140" r="8" fill="#fff" /><circle cx="146" cy="140" r="8" fill="#fff" />
        <rect x="112" y="160" width="36" height="6" rx="3" fill={W + ".6)"} /><rect x="126" y="90" width="8" height="16" rx="4" fill="#8b84ff" />
        <circle cx="130" cy="86" r="6" fill="#67e8f9" className="a-blink" />
      </g>
      {tasks.map((t, i) => (
        <g key={t} className="a-float" style={{ animationDelay: `${i * 0.5}s` }}>
          <path d={`M176 150 C230 150 220 ${60 + i * 60} 280 ${60 + i * 60}`} fill="none" stroke="#8b84ff" strokeOpacity=".6" className="a-dash" />
          <rect x="280" y={42 + i * 60} width="270" height="38" rx="12" fill={W + ".08)"} stroke={W + ".2)"} />
          <circle cx="302" cy={61 + i * 60} r="8" fill={i < 2 ? "#4ade80" : "none"} stroke="#4ade80" strokeWidth="2" className={i === 2 ? "a-blink" : ""} />
          {i < 2 && <path d={`M298 ${61 + i * 60} l3 3 6 -7`} stroke="#052e16" strokeWidth="2" fill="none" strokeLinecap="round" />}
          <text x="322" y={66 + i * 60} fontSize="14" fill="#dcdcff" fontFamily={F}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

export function ModelArt() {
  const models = ["GPT", "Claude", "Gemini", "Llama"];
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="md-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0b1020" /><stop offset="1" stopColor="#2a1658" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#md-bg)" />
      {models.map((m, i) => {
        const y = 44 + i * 62;
        const d = `M150 ${y + 18} C230 ${y + 18} 250 150 330 150`;
        return (
          <g key={m}>
            <path d={d} fill="none" stroke="#8b84ff" strokeOpacity=".7" strokeWidth="1.6" className="a-dash" />
            <circle r="4" fill="#c9c5ff"><animateMotion dur={`${2.4 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} /></circle>
            <g className="a-float" style={{ animationDelay: `${i * 0.5}s` }}><rect x="40" y={y} width="110" height="36" rx="18" fill={W + ".08)"} stroke={W + ".22)"} /><circle cx="62" cy={y + 18} r="5" fill={["#4ade80", "#fbbf24", "#60a5fa", "#f472b6"][i]} className="a-blink" /><text x="76" y={y + 23} fontSize="14" fill="#fff" fontFamily={F}>{m}</text></g>
          </g>
        );
      })}
      <circle cx="330" cy="150" r="30" fill="none" stroke="#8b84ff" strokeWidth="2" className="a-ring" />
      <circle cx="330" cy="150" r="26" fill="#4338ca" /><path d="M330 134 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5z" fill="#fff" />
      <path d="M356 150 H420" stroke="#8b84ff" strokeWidth="2" className="a-dash" />
      <g className="a-float" style={{ animationDelay: ".8s" }}><rect x="420" y="92" width="150" height="116" rx="14" fill="#fff" fillOpacity=".95" /><rect x="434" y="106" width="70" height="8" rx="4" fill="#3b34c9" /><rect x="434" y="126" width="120" height="6" rx="3" fill="#17171233" /><rect x="434" y="140" width="96" height="6" rx="3" fill="#17171233" /><rect x="434" y="166" width="64" height="24" rx="12" fill="#6d63ff" /><text x="466" y="182" fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily={F}>Ask AI</text></g>
    </svg>
  );
}

export function CustomArt() {
  const lines = [[0, 120, "#8b84ff"], [1, 180, "#67e8f9"], [1, 90, "#fbbf24"], [2, 150, "#8b84ff"], [2, 110, "#f472b6"], [1, 70, "#67e8f9"], [0, 40, "#8b84ff"]] as const;
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="cu-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#10142a" /><stop offset="1" stopColor="#0a2a4a" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#cu-bg)" />
      <g className="a-float"><rect x="60" y="38" width="330" height="224" rx="14" fill="#0b0e1c" stroke={W + ".22)"} /><circle cx="80" cy="56" r="4.5" fill="#f87171" /><circle cx="96" cy="56" r="4.5" fill="#fbbf24" /><circle cx="112" cy="56" r="4.5" fill="#4ade80" />
        {lines.map(([ind, w, c], i) => <rect key={i} className="a-bar" style={{ transformOrigin: "left", animationName: "p-fill", animationDuration: "2.4s", animationDelay: `${i * 0.3}s`, animationIterationCount: "infinite", animationDirection: "alternate", animationTimingFunction: "ease-in-out" }} x={84 + ind * 22} y={82 + i * 24} width={w} height="9" rx="4.5" fill={c} fillOpacity=".85" />)}
        <rect x="92" y="250" width="8" height="2" fill="#fff" className="a-blink" /></g>
      <g className="a-spin" style={{ transformOrigin: "470px 100px" }}><circle cx="470" cy="100" r="40" fill="none" stroke="#67e8f9" strokeWidth="10" strokeDasharray="14 9" /><circle cx="470" cy="100" r="14" fill="#67e8f9" /></g>
      <g className="a-float" style={{ animationDelay: "1s" }}><rect x="430" y="170" width="120" height="68" rx="12" fill={W + ".08)"} stroke={W + ".22)"} /><text x="490" y="200" fontSize="13" textAnchor="middle" fill="#fff" fontFamily={F}>Your tool</text><rect x="448" y="212" width="84" height="8" rx="4" fill="#4ade80" className="a-blink" /></g>
    </svg>
  );
}

export function PluginArt() {
  const piece = (x: number, y: number, c: string, d: number) => (
    <g className="a-float" style={{ animationDelay: `${d}s` }}>
      <path d={`M${x} ${y} h40 v14 a10 10 0 1 1 0 20 v14 h-50 v-14 a10 10 0 1 0 0 -20 v-14z`} fill={c} stroke={W + ".35)"} />
    </g>
  );
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="pl-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a0b2e" /><stop offset="1" stopColor="#3b1573" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#pl-bg)" />
      <rect x="70" y="44" width="460" height="212" rx="14" fill={W + ".06)"} stroke={W + ".2)"} />
      <rect x="70" y="44" width="460" height="30" rx="14" fill={W + ".08)"} />
      {["WordPress", "Shopify", "Magento", "Wix"].map((t, i) => <g key={t}><rect x={90 + i * 104} y="92" width="92" height="26" rx="13" fill={i === 1 ? "#a78bfa" : W + ".1)"} /><text x={136 + i * 104} y="109" fontSize="11" textAnchor="middle" fill="#fff" fontFamily={F}>{t}</text></g>)}
      {piece(120, 150, "#f472b6", 0)}{piece(230, 170, "#67e8f9", 0.7)}{piece(340, 150, "#fbbf24", 1.4)}
      <circle cx="470" cy="190" r="26" fill="none" stroke="#c4b5fd" strokeWidth="2" className="a-ring" /><circle cx="470" cy="190" r="14" fill="#c4b5fd" />
      <path d="M463 190 l5 5 9 -10" fill="none" stroke="#2e1065" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ErpArt() {
  const mods = [["Finance", 60, 50], ["Stock", 400, 50], ["HR", 60, 190], ["Sales", 400, 190]] as const;
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="er-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#06222e" /><stop offset="1" stopColor="#0f4c5c" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#er-bg)" />
      {mods.map(([l, x, y], i) => {
        const d = `M${x + 70} ${y + 30} L300 150`;
        return (
          <g key={l}>
            <path d={d} stroke="#67e8f9" strokeOpacity=".7" strokeWidth="1.6" className="a-dash" fill="none" />
            <circle r="3.5" fill="#fff"><animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={d} /></circle>
            <g className="a-float" style={{ animationDelay: `${i * 0.5}s` }}><rect x={x} y={y} width="140" height="60" rx="14" fill={W + ".08)"} stroke={W + ".22)"} /><rect x={x + 14} y={y + 16} width="22" height="22" rx="6" fill="#67e8f9" fillOpacity=".8" /><text x={x + 46} y={y + 32} fontSize="14" fill="#fff" fontFamily={F}>{l}</text><rect x={x + 46} y={y + 40} width="60" height="5" rx="2.5" fill={W + ".25)"} /></g>
          </g>
        );
      })}
      <circle cx="300" cy="150" r="46" fill="none" stroke="#67e8f9" strokeWidth="2" className="a-ring" />
      <circle cx="300" cy="150" r="38" fill="#0e7490" stroke={W + ".4)"} /><text x="300" y="156" fontSize="16" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily={F}>ERP</text>
    </svg>
  );
}

export function SaasArt() {
  return (
    <svg viewBox="0 0 600 300" {...base}>
      <defs><linearGradient id="sa-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0d1f12" /><stop offset="1" stopColor="#1b4d2e" /></linearGradient></defs>
      <rect width="600" height="300" fill="url(#sa-bg)" />
      {[["Starter", "$19", 40], ["Pro", "$49", 160], ["Scale", "$129", 280]].map(([n, p, x], i) => (
        <g key={n as string} className="a-float" style={{ animationDelay: `${i * 0.6}s` }}>
          <rect x={x as number} y={i === 1 ? 50 : 70} width="108" height={i === 1 ? 190 : 170} rx="14" fill={i === 1 ? "#b8f36b" : W + ".08)"} stroke={W + ".25)"} />
          <text x={(x as number) + 16} y={i === 1 ? 82 : 102} fontSize="13" fill={i === 1 ? "#14301a" : "#fff"} fontFamily={F}>{n}</text>
          <text x={(x as number) + 16} y={i === 1 ? 118 : 138} fontSize="26" fontWeight="700" fill={i === 1 ? "#14301a" : "#fff"} fontFamily={F}>{p}</text>
          {[0, 1, 2].map((r) => <rect key={r} x={(x as number) + 16} y={(i === 1 ? 140 : 160) + r * 18} width={60 - r * 8} height="6" rx="3" fill={i === 1 ? "#14301a" : "#fff"} fillOpacity=".35" />)}
        </g>
      ))}
      <path d="M420 230 C450 200 470 214 500 150 S540 100 570 70" fill="none" stroke="#b8f36b" strokeWidth="3.5" strokeLinecap="round" className="a-line" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} className="a-bar" style={{ animationDelay: `${i * 0.3}s` }} x={424 + i * 30} y={250 - (20 + i * 12)} width="18" height={20 + i * 12} rx="4" fill="#b8f36b" fillOpacity=".3" />)}
      <g className="a-float" style={{ animationDelay: "1s" }}><rect x="430" y="40" width="108" height="30" rx="15" fill="#fff" fillOpacity=".95" /><text x="484" y="60" fontSize="12" fontWeight="700" textAnchor="middle" fill="#14532d" fontFamily={F}>MRR +24%</text></g>
    </svg>
  );
}
