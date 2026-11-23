import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Boxes, BrainCircuit, Check,
  ChevronDown, CircleHelp, Clock3, Command, GitBranch, GitCommitHorizontal,
  Layers3, LayoutDashboard, Menu, MoreHorizontal, Plus, RotateCcw,
  Save, Settings2, ShieldCheck, Sparkles, Workflow, X, Zap
} from "lucide-react";

type Module = { id: string; name: string; kind: string; detail: string; enabled: boolean; color: string };
type Snapshot = { id: number; name: string; date: string; modules: string[]; note: string };
type Environment = { id: number; name: string; task: string; status: string; updated: string; modules: Module[]; snapshots: Snapshot[] };

const seedModules: Module[] = [
  { id: "planner", name: "Task Planner", kind: "CORE", detail: "Breaks goals into verifiable steps", enabled: true, color: "violet" },
  { id: "web", name: "Web Research", kind: "TOOL", detail: "Search and source collection", enabled: true, color: "blue" },
  { id: "memory", name: "Context Memory", kind: "SKILL", detail: "Project notes and source recall", enabled: true, color: "cyan" },
  { id: "review", name: "Quality Reviewer", kind: "AGENT", detail: "Checks evidence and completeness", enabled: false, color: "amber" },
];
const initial: Environment[] = [{
  id: 1, name: "Research Workspace", task: "Investigate emerging agent runtime architectures",
  status: "Draft", updated: "Just now", modules: seedModules,
  snapshots: [
    { id: 3, name: "Baseline · v0.3", date: "Today, 10:42", modules: ["planner", "web", "memory"], note: "Initial research setup" },
    { id: 2, name: "Lean setup · v0.2", date: "Yesterday, 16:18", modules: ["planner", "web"], note: "Reduced context footprint" },
    { id: 1, name: "Starter · v0.1", date: "Yesterday, 14:05", modules: ["planner"], note: "First workspace draft" },
  ]
}];

const iconMap: Record<string, typeof BrainCircuit> = {
  planner: BrainCircuit, web: Workflow, memory: Layers3, review: ShieldCheck
};

function loadEnvironments(): Environment[] {
  try {
    const saved = localStorage.getItem("dsh-res-environments");
    if (saved) return JSON.parse(saved) as Environment[];
  } catch { /* use safe demo defaults */ }
  return initial;
}

export default function App() {
  const [environments, setEnvironments] = useState<Environment[]>(loadEnvironments);
  const [activeId, setActiveId] = useState(1);
  const [activeNav, setActiveNav] = useState("Workspace");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("Untitled environment");
  const [newTask, setNewTask] = useState("");
  const [compare, setCompare] = useState(false);
  const [toast, setToast] = useState("");
  const active = environments.find(e => e.id === activeId) ?? environments[0];

  useEffect(() => {
    localStorage.setItem("dsh-res-environments", JSON.stringify(environments));
  }, [environments]);

  const enabledCount = active?.modules.filter(m => m.enabled).length ?? 0;
  const latest = active?.snapshots[0];
  const activeModules = useMemo(() => active?.modules.filter(m => m.enabled) ?? [], [active]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }
  function updateActive(fn: (env: Environment) => Environment) {
    setEnvironments(current => current.map(env => env.id === activeId ? fn(env) : env));
  }
  function toggleModule(id: string) {
    updateActive(env => ({ ...env, modules: env.modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m), updated: "Just now" }));
  }
  function saveSnapshot() {
    updateActive(env => {
      const nextId = Math.max(0, ...env.snapshots.map(s => s.id)) + 1;
      const snapshot: Snapshot = {
        id: nextId, name: `Configuration · v0.${nextId}`, date: new Date().toLocaleString(),
        modules: env.modules.filter(m => m.enabled).map(m => m.id), note: "Saved from workspace"
      };
      return { ...env, snapshots: [snapshot, ...env.snapshots], updated: "Just now" };
    });
    notify("Configuration snapshot saved");
  }
  function restore(snapshot: Snapshot) {
    updateActive(env => ({ ...env, modules: env.modules.map(m => ({ ...m, enabled: snapshot.modules.includes(m.id) })), updated: "Just now" }));
    notify(`Restored ${snapshot.name}`);
  }
  function createEnvironment() {
    if (!newName.trim()) return;
    const id = Math.max(0, ...environments.map(e => e.id)) + 1;
    const env: Environment = { id, name: newName.trim(), task: newTask.trim() || "Describe the task this environment should support", status: "Draft", updated: "Just now", modules: seedModules.map(m => ({ ...m, enabled: m.id === "planner" })), snapshots: [] };
    setEnvironments(prev => [env, ...prev]);
    setActiveId(id); setShowNew(false); setNewName("Untitled environment"); setNewTask("");
    notify("New environment created");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><div><strong>RUNTIME<span> / </span>EVOLUTION</strong><small>STUDIO · EARLY ACCESS</small></div></div>
        <div className="workspace-switch"><div className="workspace-avatar">D</div><div><b>DeepSeek Harness</b><small>Local workspace</small></div><ChevronDown size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        {[
          { label: "Workspace", icon: LayoutDashboard },
          { label: "Environments", icon: Boxes },
          { label: "Experiments", icon: Activity },
          { label: "Evolution history", icon: GitBranch },
        ].map(item => <button key={item.label} className={`nav-item ${activeNav === item.label ? "selected" : ""}`} onClick={() => setActiveNav(item.label)}><item.icon size={17}/>{item.label}{item.label === "Experiments" && <span className="nav-count">2</span>}</button>)}
        <div className="nav-label second">SYSTEM</div>
        <button className={`nav-item ${activeNav === "Settings" ? "selected" : ""}`} onClick={() => setActiveNav("Settings")}><Settings2 size={17}/>Settings</button>
        <div className="sidebar-bottom"><div className="status-line"><span className="pulse-dot"/> Local mode <span className="status-version">v0.1.0</span></div><div className="user-row"><div className="user-avatar">G</div><div><b>Workspace owner</b><small>Community edition</small></div><MoreHorizontal size={17}/></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="crumb"><span>Studio</span><span className="slash">/</span><b>{activeNav}</b></div><div className="top-actions"><div className="connection"><span className="pulse-dot"/> Local storage</div><button className="icon-button" aria-label="Help"><CircleHelp size={18}/></button><button className="icon-button mobile-menu" aria-label="Menu"><Menu size={18}/></button></div></header>

        <div className="content">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> RUNTIME CONTROL CENTER</div><h1>{activeNav === "Workspace" ? "Workspace overview" : activeNav}</h1><p>Design, compose and validate adaptive environments for your AI agents.</p></div><div className="heading-actions"><button className="button secondary" onClick={() => setCompare(v => !v)}><GitCommitHorizontal size={16}/>{compare ? "Hide comparison" : "Compare versions"}</button><button className="button primary" onClick={saveSnapshot}><Save size={16}/>Save snapshot</button></div></section>

          <section className="metrics-grid">
            <Metric icon={<Boxes size={17}/>} label="Environments" value={String(environments.length).padStart(2,"0")} delta="Workspace total" />
            <Metric icon={<Workflow size={17}/>} label="Active modules" value={String(enabledCount).padStart(2,"0")} delta={`${active?.modules.length ?? 0} available`} />
            <Metric icon={<GitBranch size={17}/>} label="Saved snapshots" value={String(active?.snapshots.length ?? 0).padStart(2,"0")} delta="Version checkpoints" />
            <Metric icon={<Zap size={17}/>} label="Runtime status" value="Draft" delta="Not connected to DSH" neutral />
          </section>

          {activeNav !== "Workspace" && <div className="notice"><CircleHelp size={17}/><div><b>Workspace preview</b><p>This starter release focuses on the environment designer. The selected section is represented by the shared workspace data model.</p></div></div>}

          <section className="section-head"><div><h2>Environment designer</h2><p>Configure the building blocks for your current agent task.</p></div><button className="text-button" onClick={() => setShowNew(true)}><Plus size={16}/>New environment</button></section>

          <div className="workspace-grid">
            <section className="panel environment-panel">
              <div className="panel-head"><div><div className="panel-kicker">CURRENT ENVIRONMENT</div><h3>{active?.name}</h3></div><button className="icon-button"><MoreHorizontal size={18}/></button></div>
              <div className="task-box"><div className="task-icon"><BrainCircuit size={17}/></div><div><small>MISSION BRIEF</small><p>{active?.task}</p></div></div>
              <div className="flow-label"><span>RUNTIME COMPOSITION</span><span className="flow-legend"><i/> Enabled</span></div>
              <div className="flow-canvas">
                <div className="flow-node trigger"><div className="node-icon"><Sparkles size={16}/></div><div><b>Task input</b><small>User objective</small></div><span className="node-state">START</span></div>
                <div className="connector"><span/></div>
                <div className="module-flow">
                  {activeModules.length ? activeModules.map((m, i) => {
                    const Icon = iconMap[m.id] ?? Boxes;
                    return <div className="flow-node" key={m.id}><div className={`node-icon ${m.color}`}><Icon size={16}/></div><div><b>{m.name}</b><small>{m.kind.toLowerCase()} module</small></div><span className="node-index">{String(i+1).padStart(2,"0")}</span></div>;
                  }) : <div className="empty-flow">Enable at least one module to compose this environment.</div>}
                </div>
                <div className="connector"><span/></div>
                <div className="flow-node output"><div className="node-icon green"><Check size={16}/></div><div><b>Verified output</b><small>Evidence & result checks</small></div><span className="node-state">END</span></div>
              </div>
              <div className="panel-foot"><span><span className="pulse-dot"/> Configuration draft</span><span>Updated {active?.updated}</span></div>
            </section>

            <section className="panel modules-panel">
              <div className="panel-head"><div><div className="panel-kicker">BUILDING BLOCKS</div><h3>Runtime modules <span className="muted-count">{enabledCount}/{active?.modules.length ?? 0}</span></h3></div><button className="icon-button"><Plus size={17}/></button></div>
              <p className="panel-description">Toggle modules to shape the environment for this task.</p>
              <div className="module-list">{active?.modules.map(m => {
                const Icon = iconMap[m.id] ?? Boxes;
                return <div className={`module-row ${m.enabled ? "is-enabled" : ""}`} key={m.id}><div className={`module-icon ${m.color}`}><Icon size={17}/></div><div className="module-copy"><div><b>{m.name}</b><span className="kind-tag">{m.kind}</span></div><small>{m.detail}</small></div><button className={`toggle ${m.enabled ? "on" : ""}`} onClick={() => toggleModule(m.id)} aria-label={`Toggle ${m.name}`}><span/></button></div>;
              })}</div>
              <div className="module-hint"><Sparkles size={14}/> Changes stay local until you export or connect a runtime.</div>
            </section>
          </div>

          {compare && <section className="panel compare-panel"><div className="panel-head"><div><div className="panel-kicker">CONFIGURATION REVIEW</div><h3>Version comparison</h3></div><button className="icon-button" onClick={() => setCompare(false)}><X size={17}/></button></div><div className="compare-grid"><CompareColumn title="Current draft" modules={active?.modules.filter(m=>m.enabled).map(m=>m.name) ?? []}/><div className="compare-divider"><ArrowDownRight size={18}/></div><CompareColumn title={latest?.name ?? "No snapshot yet"} modules={active?.modules.filter(m=>latest?.modules.includes(m.id)).map(m=>m.name) ?? []}/></div><p className="compare-note">This is a configuration-level comparison, not a measured runtime performance benchmark.</p></section>}

          <section className="bottom-grid">
            <section className="panel history-panel"><div className="panel-head"><div><div className="panel-kicker">CHANGE CONTROL</div><h3>Evolution history</h3></div><button className="text-button small" onClick={saveSnapshot}><Plus size={15}/>Save version</button></div>
              {active?.snapshots.length ? <div className="timeline">{active.snapshots.slice(0,4).map((s,i)=><div className="timeline-item" key={s.id}><div className={`timeline-marker ${i===0?"current":""}`}><GitCommitHorizontal size={13}/></div><div className="timeline-copy"><b>{s.name}</b><small>{s.date} · {s.modules.length} modules</small></div><button className="restore-button" onClick={()=>restore(s)}><RotateCcw size={13}/>Restore</button></div>)}</div> : <div className="empty-state">No saved versions yet. Save a snapshot to create your first checkpoint.</div>}
            </section>
            <section className="panel insight-panel"><div className="panel-head"><div><div className="panel-kicker">STUDIO INSIGHT</div><h3>Next recommended step</h3></div><div className="insight-spark"><Sparkles size={16}/></div></div><div className="insight-body"><div className="insight-title">Validate before you evolve</div><p>Run this configuration in an isolated sandbox and define success criteria before applying changes to a live agent.</p><div className="insight-tags"><span><ShieldCheck size={12}/> Safe by default</span><span><Clock3 size={12}/> Planned feature</span></div></div></section>
          </section>
          <footer className="footer"><span>DSH Runtime Evolution Studio <b>v0.1.0</b></span><span>Built for transparent, reversible agent adaptation.</span></footer>
        </div>
      </main>

      {showNew && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowNew(false)}}><div className="modal"><div className="modal-head"><div><div className="panel-kicker">WORKSPACE SETUP</div><h3>Create environment</h3></div><button className="icon-button" onClick={()=>setShowNew(false)}><X size={18}/></button></div><label>Environment name<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Code review workspace"/></label><label>Task objective<textarea value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="What should this environment help the agent accomplish?"/></label><div className="modal-actions"><button className="button secondary" onClick={()=>setShowNew(false)}>Cancel</button><button className="button primary" onClick={createEnvironment}><Plus size={16}/>Create environment</button></div></div></div>}
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}

function Metric({icon,label,value,delta,neutral=false}:{icon:React.ReactNode;label:string;value:string;delta:string;neutral?:boolean}) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><MoreHorizontal size={16} className="metric-more"/></div><div className="metric-value">{value}</div><div className={`metric-delta ${neutral?"neutral":""}`}>{!neutral && <ArrowUpRight size={13}/>} {delta}</div></div>;
}
function CompareColumn({title,modules}:{title:string;modules:string[]}) {
  return <div className="compare-column"><b>{title}</b>{modules.length ? modules.map(m=><span className="compare-module" key={m}><Check size={13}/>{m}</span>) : <small>No modules enabled</small>}</div>;
}