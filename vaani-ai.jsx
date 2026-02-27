import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Moon, Sun, Menu, X, Plus, Send, Square, Sparkles, Brain,
  Copy, Check, Play, Code2, Terminal, FlaskConical, PenLine,
  Globe, BarChart3, MessageSquare, ChevronRight, Zap,
  Paperclip, FileText, XCircle, Layers, Pencil,
  ThumbsUp, ThumbsDown, RotateCcw
} from "lucide-react";

// ── THEMES ──────────────────────────────────────────────────
const LIGHT = {
  bg:"#F2F4F8", surface:"#FFFFFF", surface2:"#F7F8FC", border:"#E2E7F0",
  text:"#0D1117", textSub:"#5A6478", textMuted:"#9AA3B5",
  accent:"#2563EB", accentSoft:"#EEF3FF", accentMid:"#DBEAFE",
  userBubble:"linear-gradient(135deg,#2563EB,#1D4ED8)",
  aiBubble:"#FFFFFF", aiBorder:"#E2E7F0",
  codeBg:"#161B22", codeBar:"#0D1117",
  shadow:"0 1px 3px rgba(13,17,23,.07),0 4px 14px rgba(13,17,23,.04)",
  thinkBg:"#EFF8FF", thinkBorder:"#BAE0FD", thinkText:"#0369A1",
  scrollbar:"#D1D8E8", inputBorder:"#D5DCE8",
  sidebarBg:"#FFFFFF", sidebarBorder:"#E2E7F0",
  topbarBg:"rgba(255,255,255,0.96)",
};
const DARK = {
  bg:"#0B0D12", surface:"#131720", surface2:"#191D28", border:"#1F2535",
  text:"#E6EAF4", textSub:"#7D8BA3", textMuted:"#3E4A5C",
  accent:"#5B8AF0", accentSoft:"#161E36", accentMid:"#1B2D50",
  userBubble:"linear-gradient(135deg,#2563EB,#1D4ED8)",
  aiBubble:"#131720", aiBorder:"#1F2535",
  codeBg:"#090B10", codeBar:"#050709",
  shadow:"0 1px 4px rgba(0,0,0,.3),0 4px 18px rgba(0,0,0,.2)",
  thinkBg:"#0D1929", thinkBorder:"#1B3560", thinkText:"#5B8AF0",
  scrollbar:"#232B3A", inputBorder:"#252C3A",
  sidebarBg:"#10121A", sidebarBorder:"#1A1F2C",
  topbarBg:"rgba(11,13,18,0.96)",
};

// ── SYSTEM ──────────────────────────────────────────────────
const SYSTEM = `You are Vaani — India's most advanced AI assistant. Professional, precise, warm, genuinely helpful.

IMPORTANT: If anyone asks who built you / who made you / who created you → always answer: "I was built by RAHU."

Capabilities: software engineering, debugging, code review, reasoning, mathematics, science, research, creative writing, data analysis, general knowledge.

CODE RULES:
- Always wrap code in triple backticks with language: \`\`\`python \`\`\`javascript \`\`\`html etc.
- NEVER truncate code — complete runnable implementations always.
- If continuing a previous response: pick up EXACTLY where you left off, no repetition.

Deep Think mode: step-by-step reasoning, show logic, consider edge cases, be comprehensive.`;

// ── PARSE ────────────────────────────────────────────────────
function parseSegs(text) {
  const out = [], re = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ t: "text", v: text.slice(last, m.index) });
    out.push({ t: "code", lang: m[1] || "code", v: m[2].trimEnd() });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out;
}

const LC = {
  javascript:"#F7DF1E", js:"#F7DF1E", typescript:"#3178C6", ts:"#3178C6",
  python:"#4B8BBE", html:"#E44D26", css:"#2965F1", java:"#5382A1",
  cpp:"#00599C", c:"#A8B9CC", go:"#00ADD8", rust:"#CE422B",
  bash:"#4EAA25", shell:"#4EAA25", sql:"#E38C00", json:"#8BC34A",
  jsx:"#61DAFB", tsx:"#3178C6", ruby:"#CC342D", php:"#787CB5",
  swift:"#FA7343", kotlin:"#7F52FF",
};

// ── RICH TEXT ────────────────────────────────────────────────
function RichText({ text, color }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.85, color: color || "inherit" }}>
      {lines.map((line, li) => {
        const isH1 = /^# /.test(line);
        const isH2 = /^## /.test(line);
        const isH3 = /^### /.test(line);
        const isB  = /^[-*] /.test(line);
        const isN  = /^\d+\. /.test(line);
        const raw  = isH1 ? line.slice(2) : isH2 ? line.slice(3) : isH3 ? line.slice(4)
                   : isB ? line.slice(2) : isN ? line.replace(/^\d+\. /, "") : line;

        const inline = (s) =>
          s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`\n]+`)/).map((sg, i) => {
            if (sg.startsWith("**") && sg.endsWith("**"))
              return <strong key={i}>{sg.slice(2, -2)}</strong>;
            if (sg.startsWith("*") && sg.endsWith("*") && sg.length > 2)
              return <em key={i}>{sg.slice(1, -1)}</em>;
            if (sg.startsWith("`") && sg.endsWith("`"))
              return (
                <code key={i} style={{ fontFamily:"'Fira Code',monospace", fontSize:"0.875em",
                  padding:"2px 6px", borderRadius:4, background:"rgba(91,138,240,0.12)", color:"#5B8AF0" }}>
                  {sg.slice(1, -1)}
                </code>
              );
            return sg;
          });

        if (isH1) return <h1 key={li} style={{ fontSize:19, fontWeight:800, margin:"14px 0 6px", letterSpacing:-.4 }}>{inline(raw)}</h1>;
        if (isH2) return <h2 key={li} style={{ fontSize:16, fontWeight:700, margin:"12px 0 5px" }}>{inline(raw)}</h2>;
        if (isH3) return <h3 key={li} style={{ fontSize:14, fontWeight:700, margin:"10px 0 4px" }}>{inline(raw)}</h3>;
        if (isB || isN) return (
          <div key={li} style={{ display:"flex", gap:8, alignItems:"flex-start", margin:"3px 0", paddingLeft:4 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#5B8AF0",
              flexShrink:0, marginTop:9, display:"block" }} />
            <span>{inline(raw)}</span>
          </div>
        );
        return (
          <span key={li}>
            {inline(raw)}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </div>
  );
}

// ── CODE BLOCK ───────────────────────────────────────────────
function CodeBlock({ lang, code, t }) {
  const [copied, setCopied] = useState(false);
  const [view,   setView]   = useState("code");
  const l   = lang.toLowerCase();
  const lc  = LC[l] || "#8899AA";
  const canP = ["html","css","javascript","js","jsx","svg"].includes(l);

  const getDoc = () => {
    if (l === "html") return code;
    if (l === "css")
      return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:20px;margin:0}${code}</style></head><body><p>Preview</p><button>Button</button></body></html>`;
    if (l === "javascript" || l === "js") {
      const scriptClose = "<" + "/script>";
      return `<!DOCTYPE html><html><body style="margin:0;padding:16px;font-family:'Fira Code',monospace;font-size:13px;background:#0D1117;color:#D4D8E8"><pre id="o" style="margin:0;white-space:pre-wrap"></pre><script>const o=document.getElementById('o'),c={log:(...a)=>{o.textContent+=a.join(' ')+'\\n'},error:(...a)=>{o.textContent+='[ERR] '+a.join(' ')+'\\n'}};try{${code}}catch(e){c.error(e.message)}${scriptClose}</body></html>`;
    }
    if (l === "svg")
      return `<!DOCTYPE html><html><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0f0f0">${code}</body></html>`;
    return code;
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ margin:"14px 0", borderRadius:12, overflow:"hidden",
      border:"1px solid #252840", boxShadow:"0 6px 28px rgba(0,0,0,.35)" }}>
      {/* Bar */}
      <div style={{ display:"flex", alignItems:"center", gap:8, background:t.codeBar,
        padding:"9px 14px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
          {["#FF5F57","#FFBD2E","#28CA42"].map((c,i) =>
            <span key={i} style={{ width:11, height:11, borderRadius:"50%", background:c, display:"block" }} />
          )}
        </div>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:1,
          fontFamily:"'Fira Code',monospace", textTransform:"uppercase", color:lc }}>
          {lang || "code"}
        </span>
        <div style={{ flex:1 }} />
        {canP && (
          <button onClick={() => setView(v => v === "code" ? "preview" : "code")}
            style={{ display:"flex", alignItems:"center", gap:5,
              background: view === "preview" ? "#1E3A5F" : "#1A2030",
              border:`1px solid ${view === "preview" ? "#5B8AF0" : "#2A3040"}`,
              color: view === "preview" ? "#5B8AF0" : "#7A8499",
              borderRadius:7, padding:"4px 11px", cursor:"pointer",
              fontSize:11, fontWeight:700, fontFamily:"inherit", transition:"all .2s" }}>
            {view === "code" ? <React.Fragment><Play size={11} />&nbsp;Preview</React.Fragment> : <React.Fragment><Code2 size={11} />&nbsp;Code</React.Fragment>}
          </button>
        )}
        <button onClick={copy}
          style={{ display:"flex", alignItems:"center", gap:5,
            background: copied ? "#0D3321" : "#1A2030",
            border:`1px solid ${copied ? "#22C55E" : "#2A3040"}`,
            color: copied ? "#4ADE80" : "#7A8499",
            borderRadius:7, padding:"4px 11px", cursor:"pointer",
            fontSize:11, fontWeight:700, fontFamily:"inherit", transition:"all .2s" }}>
          {copied ? <React.Fragment><Check size={11} />&nbsp;Copied</React.Fragment> : <React.Fragment><Copy size={11} />&nbsp;Copy</React.Fragment>}
        </button>
      </div>
      {/* Content */}
      {view === "preview" && canP ? (
        <div style={{ position:"relative", height:340, background:"#fff" }}>
          <div style={{ position:"absolute", top:8, right:10, fontSize:10, fontWeight:700,
            color:"#999", background:"rgba(0,0,0,.06)", padding:"3px 8px",
            borderRadius:6, display:"flex", alignItems:"center", gap:4, zIndex:1 }}>
            <Layers size={10} /> Live Preview
          </div>
          <iframe srcDoc={getDoc()} style={{ width:"100%", height:"100%", border:"none", display:"block" }}
            sandbox="allow-scripts allow-same-origin" title="preview" />
        </div>
      ) : (
        <pre style={{ margin:0, padding:"16px 20px", background:t.codeBg, overflowX:"auto",
          fontSize:13, lineHeight:1.8, color:"#D4D8E8",
          fontFamily:"'Fira Code','Cascadia Code',monospace", whiteSpace:"pre" }}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

// ── THINK BAR ────────────────────────────────────────────────
function ThinkBar({ label, t }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 13px",
      background:t.thinkBg, border:`1px solid ${t.thinkBorder}`, borderRadius:10,
      marginBottom:8, animation:"vUp .3s ease" }}>
      <div style={{ display:"flex", gap:4 }}>
        {[0,1,2].map(i =>
          <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:t.thinkText,
            display:"block", animation:`vThink 1.4s ease-in-out ${i * .22}s infinite` }} />
        )}
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:t.thinkText }}>{label}</span>
    </div>
  );
}

// ── MESSAGE ──────────────────────────────────────────────────
function Message({ msg, isTyping, thinkLabel, t, onResend, onEdit, onCopy, onRegen, msgIndex }) {
  const isUser = msg.role === "user";
  const segs   = parseSegs(msg.content || "");
  const [hovered,   setHovered]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [liked,     setLiked]     = useState(null); // null | "up" | "down"

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy();
  };

  // Action icon button style
  const iconBtn = (active) => ({
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, borderRadius: 7,
    color: active ? t.accent : t.textMuted,
    transition: "all .18s",
    flexShrink: 0,
  });

  // User message actions: Regenerate (resend), Edit, Copy
  const userActions = (
    <div style={{
      display: "flex", gap: 2, marginTop: 6,
      justifyContent: "flex-end",
      opacity: hovered ? 1 : 0,
      transition: "opacity .2s",
      pointerEvents: hovered ? "auto" : "none",
    }}>
      {[
        { Icon: RotateCcw, title: "Resend", action: () => onResend && onResend(msg.content, msgIndex) },
        { Icon: Pencil,    title: "Edit",   action: () => onEdit   && onEdit(msg.content, msgIndex) },
        { Icon: copied ? Check : Copy, title: copied ? "Copied!" : "Copy", action: handleCopy, active: copied },
      ].map(({ Icon, title, action, active }) => (
        <button key={title} title={title} onClick={action} style={iconBtn(active)}
          onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = active ? t.accent : t.textMuted; }}>
          <Icon size={14} />
        </button>
      ))}
    </div>
  );

  // AI message actions: Copy, Thumbs Up, Thumbs Down, Regenerate
  const aiActions = (
    <div style={{
      display: "flex", gap: 2, marginTop: 6,
      opacity: (hovered && !isTyping) ? 1 : 0,
      transition: "opacity .2s",
      pointerEvents: (hovered && !isTyping) ? "auto" : "none",
    }}>
      {[
        { Icon: copied ? Check : Copy, title: copied ? "Copied!" : "Copy", action: handleCopy, active: copied },
        { Icon: ThumbsUp,   title: "Good response",   action: () => setLiked(v => v === "up"   ? null : "up"),   active: liked === "up" },
        { Icon: ThumbsDown, title: "Bad response",    action: () => setLiked(v => v === "down" ? null : "down"), active: liked === "down" },
        { Icon: RotateCcw,  title: "Regenerate",      action: () => onRegen && onRegen(msgIndex) },
      ].map(({ Icon, title, action, active }) => (
        <button key={title} title={title} onClick={action} style={iconBtn(active)}
          onMouseEnter={e => { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = active ? t.accent : t.textMuted; }}>
          <Icon size={14} />
        </button>
      ))}
    </div>
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display:"flex", justifyContent:isUser ? "flex-end" : "flex-start",
        marginBottom:20, gap:10, alignItems:"flex-start", animation:"vUp .3s ease" }}>
      {!isUser && (
        <div style={{ width:34, height:34, borderRadius:10,
          background:"linear-gradient(135deg,#2563EB,#7C3AED)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", flexShrink:0, boxShadow:"0 2px 8px rgba(37,99,235,.3)" }}>
          <Sparkles size={15} />
        </div>
      )}
      <div style={{ maxWidth:"76%", minWidth:40 }}>
        {!isUser && isTyping && thinkLabel && <ThinkBar label={thinkLabel} t={t} />}
        <div style={{ padding:"12px 16px",
          background: isUser ? t.userBubble : t.aiBubble,
          border: isUser ? "none" : `1px solid ${t.aiBorder}`,
          borderRadius: isUser ? "18px 18px 5px 18px" : "5px 18px 18px 18px",
          fontSize:14, lineHeight:1.8, wordBreak:"break-word",
          boxShadow: isUser ? "0 4px 16px rgba(37,99,235,.28)" : t.shadow,
          color: isUser ? "#fff" : t.text, transition:"background .3s" }}>
          {segs.map((s, i) =>
            s.t === "code"
              ? <CodeBlock key={i} lang={s.lang} code={s.v} t={t} />
              : <RichText key={i} text={s.v} color={isUser ? "#fff" : t.text} />
          )}
          {isTyping && (
            <span style={{ display:"inline-block", width:2, height:16,
              background:t.accent, borderRadius:1,
              animation:"vBlink .75s step-end infinite",
              verticalAlign:"middle", marginLeft:2 }} />
          )}
        </div>
        {/* Action icons below bubble */}
        {msg.content && !isTyping && (isUser ? userActions : aiActions)}
      </div>
      {isUser && (
        <div style={{ width:34, height:34, borderRadius:10,
          background:"linear-gradient(135deg,#475569,#334155)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", fontSize:13, fontWeight:700, flexShrink:0 }}>
          U
        </div>
      )}
    </div>
  );
}

// ── THEME TOGGLE ─────────────────────────────────────────────
function ThemeToggle({ dark, onChange }) {
  return (
    <button onClick={onChange} title={dark ? "Light mode" : "Dark mode"}
      style={{ width:52, height:28, borderRadius:14,
        background: dark ? "linear-gradient(135deg,#1E2A3F,#1B2D50)" : "#E9EEF8",
        border:`1.5px solid ${dark ? "#5B8AF0" : "#C8D3E8"}`,
        cursor:"pointer", display:"flex", alignItems:"center",
        padding:3, transition:"background .4s,border-color .4s", flexShrink:0 }}>
      <span style={{ width:20, height:20, borderRadius:"50%",
        background: dark ? "#5B8AF0" : "#FFFFFF",
        display:"flex", alignItems:"center", justifyContent:"center",
        color: dark ? "#fff" : "#F59E0B",
        boxShadow: dark ? "0 2px 6px rgba(91,138,240,.5)" : "0 2px 6px rgba(0,0,0,.15)",
        transform: dark ? "translateX(24px)" : "translateX(0)",
        transition:"transform .4s cubic-bezier(.4,0,.2,1),background .4s", flexShrink:0 }}>
        {dark ? <Moon size={10} /> : <Sun size={11} />}
      </span>
    </button>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────
function SidebarContent({ convos, activeId, onSwitch, onNew, onClose, onRename, t }) {
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState("");
  const inputRef = useRef(null);

  const startEdit = (c, e) => {
    e.stopPropagation();
    setEditId(c.id);
    setEditVal(c.title);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
  };
  const commitEdit = (id) => {
    if (editVal.trim()) onRename(id, editVal.trim());
    setEditId(null);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%",
      background:t.sidebarBg, overflow:"hidden" }}>
      {/* Head */}
      <div style={{ padding:"18px 14px 14px", borderBottom:`1px solid ${t.sidebarBorder}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12,
              background:"linear-gradient(135deg,#2563EB,#7C3AED)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", boxShadow:"0 4px 14px rgba(37,99,235,.35)", flexShrink:0 }}>
              <Sparkles size={17} />
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:900, letterSpacing:-.5, color:t.text, lineHeight:1.1 }}>Vaani AI</div>
              <div style={{ fontSize:10, fontWeight:700, color:t.accent, letterSpacing:.5, marginTop:2 }}>India's Best AI</div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background:"none", border:`1px solid ${t.border}`,
              color:t.textSub, borderRadius:8, width:30, height:30, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <X size={15} />
            </button>
          )}
        </div>
        <button onClick={onNew}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            width:"100%", padding:"10px 12px", background:t.accentSoft,
            border:`1px solid ${t.accentMid}`, borderRadius:10, color:t.accent,
            cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit", transition:"all .2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          <Plus size={15} /> New Conversation
        </button>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:t.textMuted,
          padding:"6px 10px 8px", letterSpacing:1, textTransform:"uppercase" }}>
          Conversations
        </div>
        {convos.map(c => (
          <div key={c.id} onClick={() => onSwitch(c.id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 10px",
              borderRadius:9, cursor:"pointer",
              background: c.id === activeId ? t.accentSoft : "transparent",
              border:`1px solid ${c.id === activeId ? t.accentMid : "transparent"}`,
              marginBottom:3, transition:"all .15s", position:"relative" }}
            onMouseEnter={e => {
              if (c.id !== activeId) e.currentTarget.style.background = t.surface2;
              const btn = e.currentTarget.querySelector("[data-rename]");
              if (btn) btn.style.opacity = "1";
            }}
            onMouseLeave={e => {
              if (c.id !== activeId) e.currentTarget.style.background = "transparent";
              const btn = e.currentTarget.querySelector("[data-rename]");
              if (btn) btn.style.opacity = "0";
            }}>
            <MessageSquare size={13} style={{ flexShrink:0, opacity:.7,
              color: c.id === activeId ? t.accent : t.textSub }} />
            {editId === c.id ? (
              <input ref={inputRef} value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onBlur={() => commitEdit(c.id)}
                onKeyDown={e => {
                  if (e.key === "Enter") commitEdit(c.id);
                  if (e.key === "Escape") setEditId(null);
                }}
                onClick={e => e.stopPropagation()}
                style={{ flex:1, background:"none", border:"none",
                  outline:`1px solid ${t.accent}`, borderRadius:4,
                  padding:"1px 4px", fontSize:13, color:t.text,
                  fontFamily:"inherit", fontWeight:600 }} />
            ) : (
              <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis",
                whiteSpace:"nowrap", fontSize:13,
                color: c.id === activeId ? t.accent : t.textSub,
                fontWeight: c.id === activeId ? 600 : 400 }}>
                {c.title}
              </span>
            )}
            <button data-rename="1" onClick={e => startEdit(c, e)}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:t.textMuted, display:"flex", alignItems:"center",
                padding:"2px", borderRadius:4, flexShrink:0,
                opacity:0, transition:"opacity .15s" }}
              title="Rename">
              <Pencil size={11} />
            </button>
            {c.id === activeId && editId !== c.id && (
              <ChevronRight size={12} style={{ flexShrink:0, opacity:.5, color:t.accent }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${t.sidebarBorder}`, flexShrink:0 }}>
        <div style={{ padding:"10px 12px", background:t.surface2,
          borderRadius:10, border:`1px solid ${t.border}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:t.text }}>India's Most Advanced AI</div>
          <div style={{ fontSize:11, color:t.accent, fontWeight:600, marginTop:2 }}>Free Forever · No Login Required</div>
        </div>
      </div>
    </div>
  );
}

// ── WELCOME ──────────────────────────────────────────────────
const FEATS = [
  [Brain,"Deep Thinking"],[Terminal,"Code Expert"],[FlaskConical,"Research"],
  [BarChart3,"Data Analysis"],[PenLine,"Creative Writing"],[Globe,"Multilingual"],
];
const SUGG = [
  [Terminal,"Build a responsive navbar in HTML & CSS"],
  [Brain,"Explain neural networks step by step"],
  [FlaskConical,"Explain Big O notation with examples"],
  [PenLine,"Write a professional cover letter"],
];

function Welcome({ onSuggest, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", minHeight:"100%", padding:"32px 16px",
      gap:24, textAlign:"center", animation:"vUp .5s ease" }}>
      <div>
        <div style={{ width:74, height:74, borderRadius:22,
          background:"linear-gradient(135deg,#2563EB,#7C3AED)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", margin:"0 auto 16px",
          boxShadow:"0 8px 30px rgba(37,99,235,.35)",
          animation:"vPulse 3s ease-in-out infinite" }}>
          <Sparkles size={32} />
        </div>
        <h1 style={{ fontSize:30, fontWeight:900, letterSpacing:-.8, marginBottom:8, color:t.text }}>
          Welcome to{" "}
          <span style={{ background:"linear-gradient(135deg,#2563EB,#7C3AED)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Vaani AI
          </span>
        </h1>
        <p style={{ fontSize:15, color:t.textSub, lineHeight:1.65, maxWidth:440, margin:"0 auto" }}>
          <strong style={{ color:t.accent }}>India's Best & Most Advanced AI Chatbot</strong><br />
          Powerful · Free Forever · No Login Required
        </p>
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center", maxWidth:500 }}>
        {FEATS.map(([Icon, label]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:6,
            padding:"5px 13px", background:t.surface, border:`1px solid ${t.border}`,
            borderRadius:20, fontSize:12, fontWeight:600, color:t.textSub, boxShadow:t.shadow }}>
            <Icon size={13} /> {label}
          </div>
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:580 }}>
        <div style={{ fontSize:11, fontWeight:700, color:t.textMuted, marginBottom:10,
          textTransform:"uppercase", letterSpacing:.6 }}>Try asking</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {SUGG.map(([Icon, text]) => (
            <button key={text} onClick={() => onSuggest(text)}
              style={{ display:"flex", alignItems:"flex-start", gap:10,
                padding:"13px 14px", background:t.surface, border:`1px solid ${t.border}`,
                borderRadius:12, cursor:"pointer", fontSize:13, color:t.textSub,
                textAlign:"left", fontFamily:"inherit", fontWeight:500,
                lineHeight:1.5, transition:"all .2s", boxShadow:t.shadow }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.accent;
                e.currentTarget.style.background  = t.accentSoft;
                e.currentTarget.style.color       = t.accent;
                e.currentTarget.style.transform   = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.background  = t.surface;
                e.currentTarget.style.color       = t.textSub;
                e.currentTarget.style.transform   = "none";
              }}>
              <Icon size={16} style={{ flexShrink:0, color:t.accent, marginTop:1 }} />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 18px",
        background:t.accentSoft, border:`1px solid ${t.accentMid}`, borderRadius:10,
        fontSize:12, color:t.accent, fontWeight:600 }}>
        <Zap size={13} /> Enable <strong>Deep Think</strong> for detailed step-by-step reasoning
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function VaaniAI() {
  const [dark,        setDark]        = useState(false);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [busy,        setBusy]        = useState(false);
  const [typingId,    setTypingId]    = useState(null);
  const [thinkLabel,  setThinkLabel]  = useState("");
  const [deepThink,   setDeepThink]   = useState(false);
  const [sbOpen,      setSbOpen]      = useState(true);
  const [mobileSb,    setMobileSb]    = useState(false);
  const [convos,      setConvos]      = useState([{ id:1, title:"New Chat", messages:[] }]);
  const [activeId,    setActiveId]    = useState(1);
  const [attachments, setAttachments] = useState([]);

  const t = dark ? DARK : LIGHT;

  const chatIdRef = useRef(2);
  const bottomRef = useRef(null);
  const taRef     = useRef(null);
  const fileRef   = useRef(null);
  const stopFlag  = useRef(false);
  const typingRef = useRef(null);   // holds setInterval id for typing animation

  useEffect(() => { bottomRef.current && bottomRef.current.scrollIntoView({ behavior:"smooth" }); }, [messages]);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  // ── FILES ──────────────────────────────────────────────────
  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => setAttachments(prev => [...prev, {
        id: Date.now() + Math.random(), name:file.name, type:file.type,
        size:file.size, base64:e.target.result, isImage:file.type.startsWith("image/"),
      }]);
      reader.readAsDataURL(file);
    });
  };

  // ── STOP ───────────────────────────────────────────────────
  const stop = useCallback(() => {
    stopFlag.current = true;
    if (typingRef.current) { clearInterval(typingRef.current); typingRef.current = null; }
    setBusy(false);
    setTypingId(null);
    setThinkLabel("");
  }, []);

  // ── TYPING ANIMATION via setInterval (no requestAnimationFrame) ──
  const startTyping = (fullText, sid, onDone) => {
    let i = 0;
    const chars = fullText.split("");
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      if (stopFlag.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        return;
      }
      i = Math.min(i + 8, chars.length);   // 8 chars per tick (~16ms = ~500 chars/s)
      const revealed = chars.slice(0, i).join("");
      setMessages(prev => prev.map(m => m.id === sid ? { ...m, content:revealed } : m));
      if (i >= chars.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        if (onDone) onDone();
      }
    }, 16);
  };

  const THINK = ["Analyzing your request…","Processing…","Working through this…","Almost there…","Fetching continuation…"];

  // ── SEND ───────────────────────────────────────────────────
  const send = useCallback(async (override) => {
    const text = (override !== undefined ? override : input).trim();
    if (!text && attachments.length === 0) return;
    if (busy) return;
    setInput("");

    // Build API content parts
    const parts = [];
    attachments.forEach(a => {
      if (a.isImage)
        parts.push({ type:"image", source:{ type:"base64", media_type:a.type, data:a.base64.split(",")[1] } });
      else
        parts.push({ type:"text", text:`[Attached file: ${a.name}]` });
    });
    if (text) parts.push({ type:"text", text });

    const userApiMsg = {
      role:"user",
      content: parts.length === 1 && parts[0].type === "text" ? parts[0].text : parts,
    };
    const displayText = [...attachments.map(a => `📎 ${a.name}`), text].filter(Boolean).join("\n");
    const userDisplayMsg = { role:"user", content:displayText };

    setAttachments([]);

    const prevMessages   = [...messages];
    const displayHistory = [...prevMessages, userDisplayMsg];

    // Clean messages for API — only keep role + content, strip id/key/etc.
    const cleanForAPI = (msgs) => msgs.map(m => ({
      role:    m.role,
      content: typeof m.content === "string" ? m.content : m.content,
    }));

    const apiHistory = [...cleanForAPI(prevMessages), userApiMsg];

    setMessages([...displayHistory]);
    setBusy(true);
    stopFlag.current = false;

    const sid = Date.now();
    setTypingId(sid);

    let pi = 0;
    setThinkLabel(THINK[0]);
    const thinkInterval = setInterval(() => {
      if (stopFlag.current) { clearInterval(thinkInterval); return; }
      pi = (pi + 1) % THINK.length;
      setThinkLabel(THINK[pi]);
    }, 1800);

    // Placeholder bubble
    setMessages(prev => [...prev, { role:"assistant", content:"", id:sid }]);

    const sys = deepThink
      ? SYSTEM + "\n\nDEEP THINKING ACTIVE: reason step-by-step, be thorough."
      : SYSTEM;

    let fullText = "";

    try {
      // ── CONTINUATION LOOP ────────────────────────────────
      // Non-streaming call → reliable stop_reason.
      // If "max_tokens" → auto-continue. Otherwise → done.
      let convoMsgs = apiHistory;
      let round = 0;

      while (!stopFlag.current) {
        round++;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:  "POST",
          headers: {
            "Content-Type":      "application/json",
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model:      "claude-opus-4-5",
            max_tokens: 1000,
            stream:     false,
            system:     sys,
            messages:   convoMsgs.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          const err = await res.text().catch(() => "");
          throw new Error("HTTP " + res.status + ": " + err.slice(0, 150));
        }

        const data       = await res.json();
        const chunk      = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : "";
        const stopReason = data.stop_reason || "end_turn";

        if (stopFlag.current) break;

        fullText += chunk;

        // Show intermediate progress without typing animation (instant for continuation chunks)
        if (stopReason === "max_tokens") {
          // Show what we have so far instantly, then continue fetching
          setMessages(prev => prev.map(m => m.id === sid ? { ...m, content:fullText } : m));
          setThinkLabel("Fetching continuation…");
          convoMsgs = [
            ...convoMsgs,
            { role:"assistant", content:chunk },
            { role:"user",      content:"Continue your response from exactly where you left off. Do not repeat anything." },
          ];
          continue;
        }

        // Response is complete — run typing animation
        break;
      }

    } catch (err) {
      if (!stopFlag.current) {
        const errDetail = err && err.message ? err.message : String(err);
        const msg = fullText
          ? fullText + "\n\n⚠️ Connection interrupted: " + errDetail
          : "⚠️ Error: " + errDetail;
        fullText = msg;
      }
    }

    clearInterval(thinkInterval);
    if (stopFlag.current) {
      setBusy(false);
      setTypingId(null);
      setThinkLabel("");
      return;
    }

    // Typing animation for the complete final text
    const finalText = fullText;
    startTyping(finalText, sid, () => {
      // Animation done
      setBusy(false);
      setTypingId(null);
      setThinkLabel("");
    });

    // Save to conversation history
    if (finalText) {
      const finalMsgs = displayHistory.concat({ role:"assistant", content:finalText });
      const autoTitle = displayText.length > 36 ? displayText.slice(0, 36) + "…" : displayText;
      setConvos(prev => prev.map(c =>
        c.id === activeId
          ? { ...c, messages:finalMsgs, title: c.messages.length === 0 ? autoTitle : c.title }
          : c
      ));
    }

  }, [input, messages, busy, deepThink, activeId, attachments]);

  const newChat = () => {
    stop();
    const id = chatIdRef.current++;
    setConvos(prev => [{ id, title:"New Chat", messages:[] }, ...prev]);
    setActiveId(id);
    setMessages([]);
    setMobileSb(false);
  };
  const switchChat = (id) => {
    stop();
    const c = convos.find(x => x.id === id);
    if (c) { setActiveId(id); setMessages(c.messages); setMobileSb(false); }
  };
  const renameChat = (id, title) =>
    setConvos(prev => prev.map(c => c.id === id ? { ...c, title } : c));

  // Resend a user message (re-send same text)
  const handleResend = useCallback((content) => {
    if (busy) return;
    send(content);
  }, [busy, send]);

  // Edit: prefill the input box with the message text
  const handleEdit = useCallback((content) => {
    setInput(content);
    if (taRef.current) taRef.current.focus();
  }, []);

  // Regenerate: re-send the user message just before the AI response at msgIndex
  const handleRegen = useCallback((msgIndex) => {
    if (busy) return;
    // Find the user message before this AI message
    const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.role === "user");
    if (userMsg) {
      // Trim messages to just before the AI response
      setMessages(messages.slice(0, msgIndex));
      send(typeof userMsg.content === "string" ? userMsg.content : userMsg.content);
    }
  }, [busy, messages, send]);

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <React.Fragment>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; overflow:hidden; font-family:'Geist',sans-serif; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:${t.scrollbar}; border-radius:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        textarea::placeholder { color:${t.textMuted}; }
        textarea { caret-color:${t.accent}; }
        @keyframes vUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes vBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes vThink { 0%,80%,100%{transform:scale(.45);opacity:.3} 40%{transform:scale(1.05);opacity:1} }
        @keyframes vSlide { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes vPulse { 0%,100%{box-shadow:0 8px 30px rgba(37,99,235,.35)} 50%{box-shadow:0 8px 42px rgba(37,99,235,.55)} }
        @media(max-width:768px) {
          .vDesk{display:none!important}
          .vHideM{display:none!important}
          .vShowM{display:flex!important}
          .vChat{padding:16px 12px!important}
          .vInp{padding:10px 12px 14px!important}
          .vSugg{grid-template-columns:1fr!important}
        }
        @media(min-width:769px) { .vShowM{display:none!important} }
      `}</style>

      <div style={{ display:"flex", height:"100vh", background:t.bg, color:t.text,
        overflow:"hidden", transition:"background .35s,color .35s" }}>

        {/* Mobile sidebar */}
        {mobileSb && (
          <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex" }}>
            <div style={{ width:272, animation:"vSlide .25s ease", flexShrink:0,
              boxShadow:"4px 0 32px rgba(0,0,0,.25)" }}>
              <SidebarContent convos={convos} activeId={activeId} onSwitch={switchChat}
                onNew={newChat} onClose={() => setMobileSb(false)} onRename={renameChat} t={t} />
            </div>
            <div style={{ flex:1, background:"rgba(0,0,0,.4)" }} onClick={() => setMobileSb(false)} />
          </div>
        )}

        {/* Desktop sidebar — width via inline style only, never CSS class */}
        <div className="vDesk"
          style={{ width:sbOpen ? 268 : 0, minWidth:sbOpen ? 268 : 0,
            overflow:"hidden", borderRight:`1px solid ${t.sidebarBorder}`,
            transition:"width .3s cubic-bezier(.4,0,.2,1),min-width .3s cubic-bezier(.4,0,.2,1)",
            flexShrink:0 }}>
          <div style={{ width:268, height:"100%" }}>
            <SidebarContent convos={convos} activeId={activeId} onSwitch={switchChat}
              onNew={newChat} onRename={renameChat} t={t} />
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column",
          overflow:"hidden", minWidth:0 }}>

          {/* Topbar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 14px",
            height:58, background:t.topbarBg, borderBottom:`1px solid ${t.sidebarBorder}`,
            backdropFilter:"blur(16px)", flexShrink:0, boxShadow:t.shadow,
            transition:"background .35s" }}>
            <button className="vHideM" onClick={() => setSbOpen(v => !v)}
              style={{ background:"none", border:`1px solid ${t.border}`, color:t.textSub,
                borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}>
              <Menu size={16} />
            </button>
            <button className="vShowM" onClick={() => setMobileSb(true)}
              style={{ background:"none", border:`1px solid ${t.border}`, color:t.textSub,
                borderRadius:8, width:34, height:34, cursor:"pointer", alignItems:"center",
                justifyContent:"center", transition:"all .2s", flexShrink:0 }}>
              <Menu size={16} />
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:9,
                background:"linear-gradient(135deg,#2563EB,#7C3AED)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, letterSpacing:-.3, color:t.text }}>Vaani AI</div>
                <div style={{ fontSize:10, color:t.textMuted }}>India's Best AI Chatbot</div>
              </div>
            </div>

            <div style={{ flex:1 }} />

            <button onClick={() => setDeepThink(v => !v)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px",
                borderRadius:22, background:deepThink ? t.accentSoft : t.surface2,
                border:`1px solid ${deepThink ? t.accentMid : t.border}`,
                color:deepThink ? t.accent : t.textSub,
                cursor:"pointer", fontSize:12, fontWeight:700,
                fontFamily:"inherit", transition:"all .25s", flexShrink:0 }}>
              <Brain size={14} />
              <span className="vHideM" style={{ fontWeight:700 }}>Deep Think</span>
              <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10,
                background:deepThink ? t.accent : t.border,
                color:deepThink ? "#fff" : t.textMuted,
                fontWeight:700, transition:"all .25s" }}>
                {deepThink ? "ON" : "OFF"}
              </span>
            </button>

            <ThemeToggle dark={dark} onChange={() => setDark(v => !v)} />
          </div>

          {/* Chat area */}
          <div className="vChat" style={{ flex:1, overflowY:"auto", padding:"24px 16px" }}>
            {messages.length === 0
              ? <Welcome onSuggest={s => send(s)} t={t} />
              : messages.map((msg, i) => (
                  <Message key={msg.id || i} msg={msg}
                    isTyping={busy && msg.id === typingId}
                    thinkLabel={thinkLabel} t={t}
                    msgIndex={i}
                    onResend={handleResend}
                    onEdit={handleEdit}
                    onRegen={handleRegen}
                  />
                ))
            }
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="vInp" style={{ padding:"12px 16px 16px", background:t.surface,
            borderTop:`1px solid ${t.sidebarBorder}`, flexShrink:0, transition:"background .35s" }}>

            {attachments.length > 0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                {attachments.map(a => (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:6,
                    padding:"5px 10px 5px 8px", background:t.accentSoft,
                    border:`1px solid ${t.accentMid}`, borderRadius:10,
                    maxWidth:200, animation:"vUp .2s ease" }}>
                    {a.isImage
                      ? <img src={a.base64} alt={a.name}
                          style={{ width:28, height:28, borderRadius:6, objectFit:"cover", flexShrink:0 }} />
                      : <div style={{ width:28, height:28, borderRadius:6,
                          background:t.accentMid, display:"flex", alignItems:"center",
                          justifyContent:"center", flexShrink:0 }}>
                          <FileText size={14} color={t.accent} />
                        </div>
                    }
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:t.accent,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.name}</div>
                      <div style={{ fontSize:10, color:t.textMuted }}>{(a.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))}
                      style={{ background:"none", border:"none", cursor:"pointer",
                        color:t.textMuted, display:"flex", alignItems:"center", padding:0, flexShrink:0 }}>
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"flex", alignItems:"flex-end", gap:8, background:t.bg,
              border:`1.5px solid ${busy ? t.accent : t.inputBorder}`, borderRadius:16,
              padding:"10px 10px 10px 14px", boxShadow:t.shadow,
              transition:"border-color .25s,background .35s" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>

              <input ref={fileRef} type="file" multiple
                accept="image/*,.pdf,.txt,.csv,.json,.md,.py,.js,.ts,.html,.css"
                style={{ display:"none" }}
                onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />

              <button onClick={() => fileRef.current && fileRef.current.click()}
                title="Attach files"
                style={{ background:"none", border:"none", color:t.textMuted, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"2px", flexShrink:0, transition:"color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = t.accent}
                onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
                <Paperclip size={17} />
              </button>

              <textarea ref={taRef}
                style={{ flex:1, background:"none", border:"none", outline:"none",
                  color:t.text, fontSize:14, lineHeight:1.65, resize:"none",
                  minHeight:28, maxHeight:160, fontFamily:"inherit" }}
                placeholder="Ask Vaani anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1} />

              {busy ? (
                <button onClick={stop} title="Stop"
                  style={{ width:38, height:38, borderRadius:10, background:"#EF4444",
                    border:"none", color:"#fff", cursor:"pointer", display:"flex",
                    alignItems:"center", justifyContent:"center", flexShrink:0,
                    boxShadow:"0 4px 14px rgba(239,68,68,.4)", transition:"transform .15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <Square size={14} fill="white" />
                </button>
              ) : (
                <button onClick={() => send()}
                  disabled={!input.trim() && attachments.length === 0}
                  style={{ width:38, height:38, borderRadius:10,
                    background: (input.trim() || attachments.length > 0)
                      ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : t.surface2,
                    border:"none",
                    color: (input.trim() || attachments.length > 0) ? "#fff" : t.textMuted,
                    cursor: (input.trim() || attachments.length > 0) ? "pointer" : "not-allowed",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    boxShadow: (input.trim() || attachments.length > 0)
                      ? "0 4px 14px rgba(37,99,235,.35)" : "none",
                    transition:"all .2s" }}
                  onMouseEnter={e => {
                    if (input.trim() || attachments.length > 0) {
                      e.currentTarget.style.transform   = "scale(1.06)";
                      e.currentTarget.style.boxShadow   = "0 6px 20px rgba(37,99,235,.5)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = (input.trim() || attachments.length > 0)
                      ? "0 4px 14px rgba(37,99,235,.35)" : "none";
                  }}>
                  <Send size={15} />
                </button>
              )}
            </div>
            <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:t.textMuted }}>
              Vaani is AI and can make mistakes. Please double-check responses.
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
}
