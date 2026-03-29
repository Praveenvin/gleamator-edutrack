import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout"; // student layout
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
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Download,
} from "lucide-react";

// ── Theme (identical to Student & Faculty pages) ──────────────────────────────
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
const AdminCourseDetail = () => {
  const { user } = useAuth();
const Layout =
  user?.role === "admin"
    ? AdminDashboardLayout
    : user?.role === "faculty"
    ? FacultyDashboardLayout
    : DashboardLayout; // student
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]           = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/course-full/?id=${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch course data:", err);
    }
  };

  const downloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // ── Header ──────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(course.name, 14, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${course.department}  ·  Semester ${course.semester}  ·  Faculty: ${course.faculty_name}`, 14, 22);

    let y = 36;

    // ── Course Info ──────────────────────────────────────────────────
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Course Information", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Field", "Value"]],
      body: [
        ["Course Code",   course.code],
        ["Department",    course.department],
        ["Semester",      `Sem ${course.semester}`],
        ["Faculty",       course.faculty_name],
        ["Total Students", String(overview.total_students)],
        ["Avg Attendance", `${overview.overall_attendance}%`],
        ["Avg Marks",     String(overview.avg_marks)],
        ["Pending Eval",  String(overview.pending_evaluation)],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Students ─────────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Students", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Name", "USN", "Department", "Year"]],
      body: students.map((s: any) => [s.name, s.usn, s.department, `Year ${s.year}`]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Attendance ───────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Attendance", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Student", "Attendance %", "Status"]],
      body: attendance.map((a: any) => {
        const pct = Number(a.percentage);
        return [a.student, `${pct}%`, pct >= 75 ? "Good" : pct >= 60 ? "Low" : "Critical"];
      }),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      didParseCell: (hookData: any) => {
        if (hookData.column.index === 2 && hookData.section === "body") {
          const val = hookData.cell.text[0];
          if (val === "Good")     { hookData.cell.styles.textColor = [22, 163, 74];  }
          if (val === "Low")      { hookData.cell.styles.textColor = [217, 119, 6];  }
          if (val === "Critical") { hookData.cell.styles.textColor = [220, 38, 38];  }
        }
      },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Marks ────────────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Marks", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Student", "USN", "IA1 /30", "IA2 /30", "Final /100"]],
      body: marks.map((m: any) => [
        m.student, m.usn,
        m.IA1   ?? "—",
        m.IA2   ?? "—",
        m.FINAL ?? "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Assignments ──────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Assignments", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Title", "Submitted", "Evaluated", "Pending", "Due Date"]],
      body: assignments.map((a: any) => {
        const pending = Number(a.pending ?? (a.submitted - a.evaluated));
        return [a.title, a.submitted, a.evaluated, pending, a.due_date];
      }),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    // ── Footer ───────────────────────────────────────────────────────
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}  ·  Page ${i} of ${pageCount}`,
        pageW / 2, doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    }

    doc.save(`${course.name.replace(/\s+/g, "_")}_Report.pdf`);
  };

  if (!data) {
    return (
      <Layout>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:400 }}>
          <div style={{ textAlign:"center", color:"#94a3b8" }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              border:"3px solid #e2e8f0", borderTopColor:BLUE,
              animation:"cd-spin 0.8s linear infinite", margin:"0 auto 12px",
            }}/>
            <p style={{ fontSize:14 }}>Loading course data…</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { course, overview, students, attendance, marks, assignments } = data;

  const TABS = [
    { id:"overview",     label:"Overview",     Icon: LayoutDashboard },
    { id:"students",     label:"Students",     Icon: Users           },
    { id:"attendance",   label:"Attendance",   Icon: Calendar        },
    { id:"marks",        label:"Marks",        Icon: ClipboardList   },
    { id:"assignments",  label:"Assignments",  Icon: FileText        },
  ];

  return (
    <Layout>
      <style>{`
        @keyframes cd-spin   { to { transform:rotate(360deg); } }
        @keyframes cd-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cd-fadeup { animation:cd-fadeup 0.3s ease both; }
        .cd-stat   { transition:box-shadow 0.2s,transform 0.2s; }
        .cd-stat:hover { box-shadow:0 4px 20px rgba(37,99,235,0.12); transform:translateY(-2px); }
        .cd-row    { transition:background 0.1s; }
        .cd-row:hover { background:#f8faff !important; }
        .cd-tab    { transition:background 0.12s,color 0.12s; }
        .cd-tab:hover { background:${BLUE_LIGHT}; color:${BLUE}; }
        .cd-back   { transition:color 0.12s; }
        .cd-back:hover { color:${BLUE} !important; }
        .cd-progress { transition:width 0.7s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2px" }}>

        {/* Back + Download ───────────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <button className="cd-back" onClick={() => navigate(-1)} style={{
            display:"flex", alignItems:"center", gap:6,
            fontSize:13, color:"#64748b", background:"none", border:"none",
            cursor:"pointer", padding:0,
          }}>
            <ArrowLeft size={15}/> Back to courses
          </button>

          <button onClick={downloadPDF} style={{
            display:"flex", alignItems:"center", gap:6,
            fontSize:13, fontWeight:500, color:BLUE,
            background:BLUE_LIGHT, border:`1px solid ${BLUE}30`,
            borderRadius:8, padding:"7px 14px", cursor:"pointer",
            transition:"background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#dbeafe")}
            onMouseLeave={e => (e.currentTarget.style.background = BLUE_LIGHT)}
          >
            <Download size={14}/> Download PDF
          </button>
        </div>

        {/* Profile card ────────────────────────────────────────────── */}
        <div className="cd-fadeup" style={{
          background:"#fff", borderRadius:16, border:"1px solid #e2e8f0",
          padding:"24px 28px", marginBottom:20,
          boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:20 }}>
            {/* Icon avatar */}
            <div style={{
              width:56, height:56, borderRadius:14,
              background:BLUE_LIGHT, border:`2px solid ${BLUE}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}>
              <FileText size={24} color={BLUE}/>
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:0 }}>{course.name}</h1>
              <p style={{ fontSize:13, color:"#64748b", marginTop:3 }}>
                {course.department} &nbsp;·&nbsp; Semester {course.semester}
              </p>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))", gap:12 }}>
            {[
              { label:"Course Code", value:course.code          },
              { label:"Department",  value:course.department    },
              { label:"Semester",    value:`Sem ${course.semester}` },
              { label:"Faculty",     value:course.faculty_name  },
              { label:"Students",    value:overview.total_students },
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
              <button key={id} className="cd-tab" onClick={() => setActiveTab(id)} style={{
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
          <div className="cd-fadeup">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
              {[
                { label:"Total Students",   value:overview.total_students,      hi:false },
                { label:"Avg Attendance",   value:`${overview.overall_attendance}%`, hi:false },
                { label:"Avg Marks",        value:overview.avg_marks,           hi:false },
                { label:"Pending Eval",     value:overview.pending_evaluation,  hi:true  },
              ].map(({ label, value, hi }) => (
                <div key={label} className="cd-stat" style={{
                  background:"#fff", borderRadius:14, padding:"18px 22px",
                  border:hi ? `1.5px solid ${BLUE}` : "1px solid #e2e8f0",
                  boxShadow:hi ? `0 0 0 4px ${BLUE_LIGHT}` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <p style={{ fontSize:12, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
                  <p style={{ fontSize:26, fontWeight:700, color:hi ? BLUE : "#0f172a" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Per-student attendance chart */}
            <div style={{
              background:"#fff", borderRadius:14, border:"1px solid #e2e8f0",
              padding:"24px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize:15, fontWeight:600, color:"#0f172a", marginBottom:20 }}>
                Attendance by Student
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendance} barCategoryGap="35%" margin={{ top:4, right:12, left:0, bottom:4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="student" tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v}%`} width={38}/>
                  <Tooltip content={<CustomTooltip/>} cursor={{ fill:"#f8faff" }}/>
                  <Bar dataKey="percentage" radius={[6,6,0,0]} maxBarSize={40}>
                    {attendance.map((_:any, i:number) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ STUDENTS ══════════════════════════════════════════════════ */}
        {activeTab === "students" && (
          <div className="cd-fadeup">
            <LightTable
              headers={["Name","USN","Department","Year"]}
              rows={students.map((s:any) => [
                <span style={{ fontWeight:500, color:"#1e293b" }}>{s.name}</span>,
                <Mono>{s.usn}</Mono>,
                <DeptPill>{s.department}</DeptPill>,
                `Year ${s.year}`,
              ])}
            />
          </div>
        )}

        {/* ══ ATTENDANCE ════════════════════════════════════════════════ */}
        {activeTab === "attendance" && (
          <div className="cd-fadeup" style={{ display:"flex", flexDirection:"column", gap:10 }}>
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
                    <span style={{ fontSize:14, fontWeight:500, color:"#1e293b" }}>{a.student}</span>
                    <span style={{
                      fontSize:13, fontWeight:700, color,
                      background:bgCol, padding:"3px 10px", borderRadius:99,
                      border:`1px solid ${color}30`,
                    }}>{pct}%</span>
                  </div>
                  <div style={{ height:7, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
                    <div className="cd-progress" style={{
                      height:"100%", width:`${pct}%`,
                      background:color, borderRadius:99,
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ MARKS ════════════════════════════════════════════════════ */}
        {activeTab === "marks" && (
          <div className="cd-fadeup">
            <LightTable
              headers={["Student","USN","IA1 /30","IA2 /30","Final /100"]}
              rows={marks.map((m:any) => [
                <span style={{ fontWeight:500, color:"#1e293b" }}>{m.student}</span>,
                <Mono>{m.usn}</Mono>,
                <MarkCell value={m.IA1}   max={30}/>,
                <MarkCell value={m.IA2}   max={30}/>,
                <MarkCell value={m.FINAL} max={100}/>,
              ])}
            />
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:10, paddingLeft:4 }}>
              IA1 &amp; IA2 are out of 30 each. Final is out of 100. Colours reflect % of max marks.
            </p>
          </div>
        )}

        {/* ══ ASSIGNMENTS ══════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <div className="cd-fadeup">
            <LightTable
              headers={["Title","Submitted","Evaluated","Pending","Due Date"]}
              rows={assignments.map((a:any) => {
                const pending = Number(a.pending ?? (a.submitted - a.evaluated));
                return [
                  <span style={{ fontWeight:500, color:"#1e293b" }}>{a.title}</span>,
                  <CountChip value={a.submitted}  color={BLUE}/>,
                  <CountChip value={a.evaluated}  color="#16a34a"/>,
                  <CountChip value={pending}       color={pending > 0 ? "#d97706" : "#16a34a"}/>,
                  <span style={{ fontSize:13, color:"#64748b" }}>{a.due_date}</span>,
                ];
              })}
            />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminCourseDetail;

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
          <tr key={i} className="cd-row" style={{ borderTop:"1px solid #f1f5f9" }}>
            {row.map((cell,j) => (
              <td key={j} style={{ padding:"13px 18px", color:"#374151", verticalAlign:"middle" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DeptPill = ({ children }:any) => (
  <span style={{
    background:BLUE_LIGHT, color:BLUE,
    padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:500,
  }}>{children}</span>
);

const Mono = ({ children }:any) => (
  <span style={{ fontFamily:"monospace", fontSize:12, color:"#64748b" }}>{children}</span>
);

/** Colour-coded by percentage of the scheme's max marks */
const MarkCell = ({ value, max }: { value:any; max:number }) => {
  if (value == null || value === "") return <span style={{ color:"#cbd5e1" }}>—</span>;
  const v   = Number(value);
  const pct = (v / max) * 100;
  const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : pct >= 40 ? "#ea580c" : "#dc2626";
  return <span style={{ color, fontWeight:500 }}>{v}</span>;
};

const CountChip = ({ value, color }:{ value:any; color:string }) => (
  <span style={{
    background:`${color}12`, color,
    fontWeight:600, fontSize:13,
    padding:"2px 10px", borderRadius:6,
  }}>{value}</span>
);