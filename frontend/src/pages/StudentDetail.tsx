import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
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
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Download,
} from "lucide-react";

// ── Theme ────────────────────────────────────────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";
const PALETTE    = ["#2563eb","#0891b2","#7c3aed","#059669","#d97706","#dc2626"];

// =============================================================================
//  MARK SCHEME
//  IA1, IA2  → out of 30  each
//  FINAL     → out of 100
// =============================================================================

type Scheme = "ia" | "final";

const toNum = (v: any): number | null =>
  v != null && v !== "" && !isNaN(Number(v)) ? Number(v) : null;

const getEffective = (m: any): { mark: number; scheme: Scheme } | null => {
  const fin = toNum(m.FINAL);
  if (fin !== null) return { mark: fin, scheme: "final" };
  const ia1 = toNum(m.IA1);
  const ia2 = toNum(m.IA2);
  if (ia1 !== null && ia2 !== null) return { mark: (ia1 + ia2) / 2, scheme: "ia" };
  if (ia1 !== null)                 return { mark: ia1,             scheme: "ia" };
  return null;
};

const MAX: Record<Scheme, number> = { ia: 30, final: 100 };

const toGradePoint = (mark: number, scheme: Scheme): number => {
  const pct = (mark / MAX[scheme]) * 100;
  if (pct >= 90) return 10;
  if (pct >= 80) return 9;
  if (pct >= 70) return 8;
  if (pct >= 60) return 7;
  if (pct >= 50) return 6;
  if (pct >= 40) return 5;
  return 0;
};

const toLetterGrade = (mark: number, scheme: Scheme): string => {
  const pct = (mark / MAX[scheme]) * 100;
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B+";
  if (pct >= 50) return "B";
  if (pct >= 40) return "C";
  return "F";
};

const getCourseGrade = (m: any): string => {
  const eff = getEffective(m);
  if (!eff) return "—";
  return toLetterGrade(eff.mark, eff.scheme);
};

const calculateCGPA = (marks: any[]): string => {
  if (!marks?.length) return "N/A";
  const gps = marks
    .map(getEffective)
    .filter((v): v is { mark: number; scheme: Scheme } => v !== null)
    .map(({ mark, scheme }) => toGradePoint(mark, scheme));
  if (!gps.length) return "N/A";
  return (gps.reduce((a, b) => a + b, 0) / gps.length).toFixed(2);
};

// ── Custom chart tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "10px 16px", fontSize: 13, color: "#1e293b",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    }}>
      <p style={{ marginBottom: 4, color: "#64748b", fontWeight: 500 }}>{label}</p>
      <p style={{ color: BLUE, fontWeight: 700 }}>{payload[0]?.value}%</p>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminStudentDetail = () => {
  const { user } = useAuth();
  const Layout = user?.role === "faculty" ? FacultyDashboardLayout : AdminDashboardLayout;
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]           = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/student-full/?id=${id}`);
      res.data.overview.cgpa = calculateCGPA(res.data.marks);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch student data:", err);
    }
  };

  const downloadPDF = async () => {
    const jsPDF     = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc   = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // ── Header ───────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(student.name, 14, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.department}  ·  Year ${student.year}  ·  ${student.usn}`, 14, 22);

    let y = 36;

    // ── Student Info ─────────────────────────────────────────────────
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Field", "Value"]],
      body: [
        ["USN",          student.usn],
        ["Department",   student.department],
        ["Year",         `Year ${student.year}`],
        ["Email",        student.email],
        ["Phone",        student.phone],
        ["CGPA",         String(overview.cgpa)],
        ["Avg Marks",    String(overview.avg_marks)],
        ["Avg Attendance", `${overview.avg_attendance}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Courses ──────────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Courses", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Course Name", "Code", "Faculty", "Semester"]],
      body: courses.map((c: any) => [c.name, c.code, c.faculty_name, `Sem ${c.semester}`]),
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
    doc.text("Attendance by Course", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Course", "Attendance %", "Status"]],
      body: attendance.map((a: any) => {
        const pct = Number(a.percentage);
        return [a.course, `${pct}%`, pct >= 75 ? "Good" : pct >= 60 ? "Low" : "Critical"];
      }),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      didParseCell: (hookData: any) => {
        if (hookData.column.index === 2 && hookData.section === "body") {
          const val = hookData.cell.text[0];
          if (val === "Good")     hookData.cell.styles.textColor = [22, 163, 74];
          if (val === "Low")      hookData.cell.styles.textColor = [217, 119, 6];
          if (val === "Critical") hookData.cell.styles.textColor = [220, 38, 38];
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
      head: [["Course", "IA1 /30", "IA2 /30", "Final /100", "Effective", "Grade", "GP"]],
      body: marks.map((m: any) => {
        const eff   = getEffective(m);
        const grade = getCourseGrade(m);
        const gp    = eff ? toGradePoint(eff.mark, eff.scheme) : "—";
        const effVal = eff
          ? (eff.mark % 1 === 0 ? String(eff.mark) : eff.mark.toFixed(1))
          : "—";
        return [
          m.course,
          m.IA1   ?? "—",
          m.IA2   ?? "—",
          m.FINAL ?? "—",
          effVal,
          grade,
          String(gp),
        ];
      }),
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
      head: [["Title", "Course", "Faculty", "Status"]],
      body: assignments.map((a: any) => [a.title, a.course, a.faculty, a.status]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    // ── Leaves ───────────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Leaves", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["From", "To", "Reason", "Status"]],
      body: leaves.map((l: any) => [l.from, l.to, l.reason, l.status]),
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

    doc.save(`${student.name.replace(/\s+/g, "_")}_Report.pdf`);
  };

  if (!data) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:400 }}>
        <div style={{ textAlign:"center", color:"#94a3b8" }}>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            border:"3px solid #e2e8f0", borderTopColor:BLUE,
            animation:"sd-spin 0.8s linear infinite", margin:"0 auto 12px",
          }}/>
          <p style={{ fontSize:14 }}>Loading student data…</p>
        </div>
      </div>
    );
  }

  const { student, overview, courses, attendance, marks, assignments, leaves } = data;

  const TABS = [
    { id:"overview",    label:"Overview",    Icon: GraduationCap },
    { id:"courses",     label:"Courses",     Icon: BookOpen      },
    { id:"attendance",  label:"Attendance",  Icon: Calendar      },
    { id:"marks",       label:"Marks",       Icon: ClipboardList },
    { id:"assignments", label:"Assignments", Icon: FileText      },
    { id:"leaves",      label:"Leaves",      Icon: Calendar      },
  ];

  return (
    <Layout>
      <style>{`
        @keyframes sd-spin   { to { transform:rotate(360deg); } }
        @keyframes sd-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .sd-fadeup  { animation:sd-fadeup 0.3s ease both; }
        .sd-stat    { transition:box-shadow 0.2s,transform 0.2s; }
        .sd-stat:hover { box-shadow:0 4px 20px rgba(37,99,235,0.12); transform:translateY(-2px); }
        .sd-row     { transition:background 0.1s; }
        .sd-row:hover { background:#f8faff !important; }
        .sd-tab     { transition:background 0.12s,color 0.12s; }
        .sd-tab:hover { background:${BLUE_LIGHT}; color:${BLUE}; }
        .sd-back    { transition:color 0.12s; }
        .sd-back:hover { color:${BLUE} !important; }
        .sd-progress { transition:width 0.7s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2px" }}>

        {/* Back + Download ───────────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <button className="sd-back" onClick={() => navigate(-1)} style={{
            display:"flex", alignItems:"center", gap:6,
            fontSize:13, color:"#64748b", background:"none", border:"none",
            cursor:"pointer", padding:0,
          }}>
            <ArrowLeft size={15}/> Back
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

        {/* Profile card */}
        <div className="sd-fadeup" style={{
          background:"#fff", borderRadius:16, border:"1px solid #e2e8f0",
          padding:"24px 28px", marginBottom:20,
          boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:20 }}>
            <div style={{
              width:56, height:56, borderRadius:"50%",
              background:BLUE_LIGHT, border:`2px solid ${BLUE}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, fontWeight:700, color:BLUE, flexShrink:0,
            }}>
              {student.name?.[0]?.toUpperCase() ?? "S"}
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:0 }}>{student.name}</h1>
              <p style={{ fontSize:13, color:"#64748b", marginTop:3 }}>
                {student.department} &nbsp;·&nbsp; Year {student.year}
              </p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))", gap:12 }}>
            {[
              { label:"USN",        value:student.usn },
              { label:"Department", value:student.department },
              { label:"Year",       value:`Year ${student.year}` },
              { label:"Email",      value:student.email },
              { label:"Phone",      value:student.phone },
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

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid #e2e8f0" }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} className="sd-tab" onClick={() => setActiveTab(id)} style={{
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
          <div className="sd-fadeup">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
              {[
                { label:"Courses Enrolled", value:overview.total_courses, hi:false },
                { label:"Avg Attendance",   value:`${overview.avg_attendance}%`, hi:false },
                { label:"Avg Marks",        value:overview.avg_marks, hi:false },
                { label:"CGPA",             value:overview.cgpa, hi:true },
              ].map(({ label, value, hi }) => (
                <div key={label} className="sd-stat" style={{
                  background:"#fff", borderRadius:14, padding:"18px 22px",
                  border:hi ? `1.5px solid ${BLUE}` : "1px solid #e2e8f0",
                  boxShadow:hi ? `0 0 0 4px ${BLUE_LIGHT}` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <p style={{ fontSize:12, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
                  <p style={{ fontSize:26, fontWeight:700, color:hi ? BLUE : "#0f172a" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{
              background:"#fff", borderRadius:14, border:"1px solid #e2e8f0",
              padding:"24px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize:15, fontWeight:600, color:"#0f172a", marginBottom:20 }}>Attendance by Course</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendance} barCategoryGap="35%" margin={{ top:4, right:12, left:0, bottom:4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="course" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${v}%`} width={38}/>
                  <Tooltip content={<CustomTooltip/>} cursor={{ fill:"#f8faff" }}/>
                  <Bar dataKey="percentage" radius={[6,6,0,0]} maxBarSize={48}>
                    {attendance.map((_:any, i:number) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ COURSES ═══════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="sd-fadeup">
            <LightTable
              headers={["Course Name","Code","Faculty","Semester"]}
              rows={courses.map((c:any) => [
                <CoursePill>{c.name}</CoursePill>,
                <Mono>{c.code}</Mono>,
                c.faculty_name,
                `Sem ${c.semester}`,
              ])}
            />
          </div>
        )}

        {/* ══ ATTENDANCE ════════════════════════════════════════════════ */}
        {activeTab === "attendance" && (
          <div className="sd-fadeup" style={{ display:"flex", flexDirection:"column", gap:10 }}>
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
                    <div className="sd-progress" style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ MARKS ════════════════════════════════════════════════════ */}
        {activeTab === "marks" && (
          <div className="sd-fadeup">
            <div style={{ display:"flex", gap:16, marginBottom:14, flexWrap:"wrap" }}>
              {[
                { label:"IA1 / IA2", note:"out of 30 each", color:"#7c3aed" },
                { label:"Final",     note:"out of 100",      color:"#2563eb" },
              ].map(({ label, note, color }) => (
                <div key={label} style={{
                  display:"flex", alignItems:"center", gap:8,
                  background:"#fff", border:"1px solid #e2e8f0",
                  borderRadius:8, padding:"6px 12px", fontSize:12,
                }}>
                  <span style={{ width:10, height:10, borderRadius:3, background:color, display:"inline-block" }}/>
                  <span style={{ fontWeight:600, color:"#374151" }}>{label}</span>
                  <span style={{ color:"#94a3b8" }}>{note}</span>
                </div>
              ))}
              <div style={{
                background:"#fffbeb", border:"1px solid #fde68a",
                borderRadius:8, padding:"6px 12px", fontSize:12, color:"#92400e",
              }}>
                Grade thresholds applied as % of max marks per scheme
              </div>
            </div>

            <LightTable
              headers={["Course","IA1 /30","IA2 /30","Final /100","Effective","Scheme","Grade","GP"]}
              rows={marks.map((m:any) => {
                const eff   = getEffective(m);
                const grade = getCourseGrade(m);
                const gp    = eff ? toGradePoint(eff.mark, eff.scheme) : null;
                const effDisplay = eff
                  ? <span style={{ fontWeight:700, color:BLUE }}>{eff.mark % 1 === 0 ? eff.mark : eff.mark.toFixed(1)}</span>
                  : <span style={{ color:"#cbd5e1" }}>—</span>;
                const schemeChip = eff
                  ? <span style={{
                      background: eff.scheme === "final" ? BLUE_LIGHT : "#f5f3ff",
                      color:      eff.scheme === "final" ? BLUE       : "#7c3aed",
                      fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99,
                    }}>
                      {eff.scheme === "final" ? "Final /100" : "IA /30"}
                    </span>
                  : <span style={{ color:"#cbd5e1" }}>—</span>;
                return [
                  <span style={{ fontWeight:500, color:"#1e293b" }}>{m.course}</span>,
                  <MarkCell value={m.IA1}   max={30}/>,
                  <MarkCell value={m.IA2}   max={30}/>,
                  <MarkCell value={m.FINAL} max={100}/>,
                  effDisplay,
                  schemeChip,
                  <GradeBadge grade={grade}/>,
                  gp !== null ? <span style={{ fontWeight:700, color:"#374151" }}>{gp}</span> : <span style={{ color:"#cbd5e1" }}>—</span>,
                ];
              })}
            />
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:10, paddingLeft:4 }}>
              Effective = Final if available → avg(IA1+IA2) → IA1 alone. Courses with no marks are excluded from CGPA.
            </p>
          </div>
        )}

        {/* ══ ASSIGNMENTS ══════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <div className="sd-fadeup">
            <LightTable
              headers={["Title","Course","Faculty","Status"]}
              rows={assignments.map((a:any) => [
                a.title,
                <Mono>{a.course}</Mono>,
                a.faculty,
                <StatusChip status={a.status}/>,
              ])}
            />
          </div>
        )}

        {/* ══ LEAVES ═══════════════════════════════════════════════════ */}
        {activeTab === "leaves" && (
          <div className="sd-fadeup">
            <LightTable
              headers={["From","To","Reason","Status"]}
              rows={leaves.map((l:any) => [
                l.from, l.to, l.reason,
                <StatusChip status={l.status}/>,
              ])}
            />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminStudentDetail;

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
          <tr key={i} className="sd-row" style={{ borderTop:"1px solid #f1f5f9" }}>
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

const MarkCell = ({ value, max }: { value:any; max:number }) => {
  if (value == null || value === "") return <span style={{ color:"#cbd5e1" }}>—</span>;
  const v   = Number(value);
  const pct = (v / max) * 100;
  const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : pct >= 40 ? "#ea580c" : "#dc2626";
  return <span style={{ color, fontWeight:500 }}>{v}</span>;
};

const GradeBadge = ({ grade }:{ grade:string }) => {
  if (grade === "—") return <span style={{ color:"#cbd5e1" }}>—</span>;
  const map: Record<string,{ bg:string; color:string }> = {
    O:    { bg:"#dcfce7", color:"#15803d" },
    "A+": { bg:"#dbeafe", color:"#1d4ed8" },
    A:    { bg:"#ede9fe", color:"#6d28d9" },
    "B+": { bg:"#fef9c3", color:"#a16207" },
    B:    { bg:"#ffedd5", color:"#c2410c" },
    C:    { bg:"#f1f5f9", color:"#475569" },
    F:    { bg:"#fee2e2", color:"#b91c1c" },
  };
  const s = map[grade] || { bg:"#f1f5f9", color:"#475569" };
  return (
    <span style={{
      background:s.bg, color:s.color,
      fontWeight:700, padding:"3px 10px", borderRadius:6, fontSize:12,
    }}>{grade}</span>
  );
};

const StatusChip = ({ status }:{ status:string }) => {
  const map: Record<string,{ bg:string; color:string }> = {
    Pending:   { bg:"#fef9c3", color:"#a16207" },
    Submitted: { bg:"#dcfce7", color:"#15803d" },
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