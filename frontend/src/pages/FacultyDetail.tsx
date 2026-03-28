import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  FileText,
} from "lucide-react";

// ── Theme (matches AdminStudentDetail exactly) ────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";
const PALETTE    = ["#2563eb","#0891b2","#7c3aed","#059669","#d97706","#dc2626"];

// ── Custom chart tooltip ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#fff", border:"1px solid #e2e8f0", borderRadius:10,
      padding:"10px 16px", fontSize:13, color:"#1e293b",
      boxShadow:"0 4px 16px rgba(0,0,0,0.10)",
    }}>
      <p style={{ marginBottom:4, color:"#64748b", fontWeight:500 }}>{label}</p>
      <p style={{ color:BLUE, fontWeight:700 }}>{payload[0]?.value}%</p>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminFacultyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]           = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/faculty-full/?id=${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch faculty data:", err);
    }
  };

  if (!data) {
    return (
      <AdminDashboardLayout>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:400 }}>
          <div style={{ textAlign:"center", color:"#94a3b8" }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              border:"3px solid #e2e8f0", borderTopColor:BLUE,
              animation:"fd-spin 0.8s linear infinite", margin:"0 auto 12px",
            }}/>
            <p style={{ fontSize:14 }}>Loading faculty data…</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const { faculty, overview, courses, students, attendance, assignments, leaves } = data;

  const TABS = [
    { id:"overview",     label:"Overview",     Icon: LayoutDashboard },
    { id:"courses",      label:"Courses",      Icon: BookOpen        },
    { id:"students",     label:"Students",     Icon: Users           },
    { id:"attendance",   label:"Attendance",   Icon: Calendar        },
    { id:"assignments",  label:"Assignments",  Icon: ClipboardList   },
    { id:"leaves",       label:"Leaves",       Icon: FileText        },
  ];

  return (
    <AdminDashboardLayout>
      <style>{`
        @keyframes fd-spin   { to { transform:rotate(360deg); } }
        @keyframes fd-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fd-fadeup { animation:fd-fadeup 0.3s ease both; }
        .fd-stat   { transition:box-shadow 0.2s,transform 0.2s; }
        .fd-stat:hover { box-shadow:0 4px 20px rgba(37,99,235,0.12); transform:translateY(-2px); }
        .fd-row    { transition:background 0.1s; }
        .fd-row:hover { background:#f8faff !important; }
        .fd-tab    { transition:background 0.12s,color 0.12s; }
        .fd-tab:hover { background:${BLUE_LIGHT}; color:${BLUE}; }
        .fd-back   { transition:color 0.12s; }
        .fd-back:hover { color:${BLUE} !important; }
        .fd-progress { transition:width 0.7s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2px" }}>

        {/* Back ──────────────────────────────────────────────────────── */}
        <button className="fd-back" onClick={() => navigate(-1)} style={{
          display:"flex", alignItems:"center", gap:6, marginBottom:20,
          fontSize:13, color:"#64748b", background:"none", border:"none",
          cursor:"pointer", padding:0,
        }}>
          <ArrowLeft size={15}/> Back
        </button>

        {/* Profile card ────────────────────────────────────────────── */}
        <div className="fd-fadeup" style={{
          background:"#fff", borderRadius:16, border:"1px solid #e2e8f0",
          padding:"24px 28px", marginBottom:20,
          boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:20 }}>
            {/* Avatar */}
            <div style={{
              width:56, height:56, borderRadius:"50%",
              background:BLUE_LIGHT, border:`2px solid ${BLUE}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, fontWeight:700, color:BLUE, flexShrink:0,
            }}>
              {faculty.name?.[0]?.toUpperCase() ?? "F"}
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:0 }}>{faculty.name}</h1>
              <p style={{ fontSize:13, color:"#64748b", marginTop:3 }}>
                {faculty.designation} &nbsp;·&nbsp; {faculty.department}
              </p>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))", gap:12 }}>
            {[
              { label:"Email",       value:faculty.email       },
              { label:"Department",  value:faculty.department  },
              { label:"Designation", value:faculty.designation },
              { label:"Courses",     value:overview.total_courses },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background:"#f8fafc", borderRadius:10,
                padding:"10px 14px", border:"1px solid #f1f5f9",
              }}>
                <p style={{ fontSize:11, color:"#94a3b8", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
                <p style={{ fontSize:13, color:"#1e293b", fontWeight:500 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs ─────────────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid #e2e8f0" }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} className="fd-tab" onClick={() => setActiveTab(id)} style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"10px 16px", border:"none", background:"none",
                fontSize:13, fontWeight:active ? 600 : 400, cursor:"pointer",
                color:active ? BLUE : "#64748b",
                borderBottom:active ? `2px solid ${BLUE}` : "2px solid transparent",
                marginBottom:-1, borderRadius:"6px 6px 0 0", whiteSpace:"nowrap",
              }}>
                <Icon size={14}/>{label}
              </button>
            );
          })}
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="fd-fadeup">
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
              {[
                { label:"Total Courses",  value:overview.total_courses,     hi:false },
                { label:"Total Students", value:overview.total_students,    hi:false },
                { label:"Avg Attendance", value:`${overview.avg_attendance}%`, hi:false },
                { label:"Pending Work",   value:overview.pending_assignments, hi:true  },
              ].map(({ label, value, hi }) => (
                <div key={label} className="fd-stat" style={{
                  background:"#fff", borderRadius:14, padding:"18px 22px",
                  border:hi ? `1.5px solid ${BLUE}` : "1px solid #e2e8f0",
                  boxShadow:hi ? `0 0 0 4px ${BLUE_LIGHT}` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <p style={{ fontSize:12, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
                  <p style={{ fontSize:26, fontWeight:700, color:hi ? BLUE : "#0f172a" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Attendance bar chart */}
            <div style={{
              background:"#fff", borderRadius:14, border:"1px solid #e2e8f0",
              padding:"24px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize:15, fontWeight:600, color:"#0f172a", marginBottom:20 }}>
                Attendance by Course
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendance} barCategoryGap="35%" margin={{ top:4, right:12, left:0, bottom:4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="course" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v}%`} width={38}/>
                  <Tooltip content={<CustomTooltip/>} cursor={{ fill:"#f8faff" }}/>
                  <Bar dataKey="percentage" radius={[6,6,0,0]} maxBarSize={48}>
                    {attendance.map((_:any, i:number) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ COURSES ═══════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="fd-fadeup">
            <LightTable
              headers={["Course Name","Code","Department","Semester"]}
              rows={courses.map((c:any) => [
                <CoursePill>{c.name}</CoursePill>,
                <Mono>{c.code}</Mono>,
                c.department,
                `Sem ${c.semester}`,
              ])}
            />
          </div>
        )}

        {/* ══ STUDENTS ══════════════════════════════════════════════════ */}
        {activeTab === "students" && (
          <div className="fd-fadeup">
            <LightTable
              headers={["Name","USN","Department"]}
              rows={students.map((s:any) => [
                <span style={{ fontWeight:500, color:"#1e293b" }}>{s.name}</span>,
                <Mono>{s.usn}</Mono>,
                s.department,
              ])}
            />
          </div>
        )}

        {/* ══ ATTENDANCE ════════════════════════════════════════════════ */}
        {activeTab === "attendance" && (
          <div className="fd-fadeup" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {attendance.map((a:any, i:number) => {
              const pct   = Number(a.percentage);
              const color = pct >= 75 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
              const bgCol = pct >= 75 ? "#f0fdf4" : pct >= 60 ? "#fffbeb" : "#fef2f2";
              return (
                <div key={i} style={{
                  background:"#fff", border:"1px solid #e2e8f0",
                  borderRadius:12, padding:"16px 20px",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:14, fontWeight:500, color:"#1e293b" }}>{a.course}</span>
                    <span style={{
                      fontSize:13, fontWeight:700, color,
                      background:bgCol, padding:"3px 10px", borderRadius:99,
                      border:`1px solid ${color}30`,
                    }}>{pct}%</span>
                  </div>
                  <div style={{ height:7, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
                    <div className="fd-progress" style={{
                      height:"100%", width:`${pct}%`,
                      background:color, borderRadius:99,
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ ASSIGNMENTS ══════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <div className="fd-fadeup">
            <LightTable
              headers={["Title","Course","Submitted","Evaluated","Status"]}
              rows={assignments.map((a:any) => {
                const pending = Number(a.pending ?? (a.total_submissions - a.evaluated));
                return [
                  <span style={{ fontWeight:500, color:"#1e293b" }}>{a.title}</span>,
                  <CoursePill>{a.course}</CoursePill>,
                  <CountChip value={a.total_submissions} color={BLUE}/>,
                  <CountChip value={a.evaluated} color="#16a34a"/>,
                  <StatusChip status={pending > 0 ? "Pending" : "Completed"}/>,
                ];
              })}
            />
          </div>
        )}

        {/* ══ LEAVES ═══════════════════════════════════════════════════ */}
        {activeTab === "leaves" && (
          <div className="fd-fadeup">
            <LightTable
              headers={["From","To","Reason","Status"]}
              rows={leaves.map((l:any) => [
                l.from,
                l.to,
                l.reason,
                <StatusChip status={l.status}/>,
              ])}
            />
          </div>
        )}

      </div>
    </AdminDashboardLayout>
  );
};

export default AdminFacultyDetail;

// ── Shared UI components ──────────────────────────────────────────────────────

const LightTable = ({ headers, rows }: { headers:string[]; rows:React.ReactNode[][] }) => (
  <div style={{
    background:"#fff", border:"1px solid #e2e8f0",
    borderRadius:14, overflow:"hidden",
    boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
  }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
      <thead>
        <tr style={{ background:"#f8fafc" }}>
          {headers.map((h,i) => (
            <th key={i} style={{
              padding:"12px 18px", textAlign:"left", color:"#64748b",
              fontWeight:600, fontSize:11, textTransform:"uppercase",
              letterSpacing:"0.06em", borderBottom:"1px solid #e2e8f0",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i) => (
          <tr key={i} className="fd-row" style={{ borderTop:"1px solid #f1f5f9" }}>
            {row.map((cell,j) => (
              <td key={j} style={{ padding:"13px 18px", color:"#374151", verticalAlign:"middle" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CoursePill = ({ children }:any) => (
  <span style={{
    background:BLUE_LIGHT, color:BLUE,
    padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:500,
  }}>{children}</span>
);

const Mono = ({ children }:any) => (
  <span style={{ fontFamily:"monospace", fontSize:12, color:"#64748b" }}>{children}</span>
);

const CountChip = ({ value, color }:{ value:any; color:string }) => (
  <span style={{
    background:`${color}12`, color,
    fontWeight:600, fontSize:13,
    padding:"2px 10px", borderRadius:6,
  }}>{value}</span>
);

const StatusChip = ({ status }:{ status:string }) => {
  const map: Record<string,{ bg:string; color:string }> = {
    Pending:   { bg:"#fef9c3", color:"#a16207" },
    Completed: { bg:"#dcfce7", color:"#15803d" },
    Approved:  { bg:"#dbeafe", color:"#1d4ed8" },
    Rejected:  { bg:"#fee2e2", color:"#b91c1c" },
  };
  const s = map[status] || { bg:"#f1f5f9", color:"#64748b" };
  return (
    <span style={{
      background:s.bg, color:s.color,
      padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600,
    }}>{status}</span>
  );
};