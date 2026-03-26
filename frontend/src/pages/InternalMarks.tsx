import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MarkRow {
  id: number;
  subject: string;
  faculty?: string;   // ✅ ADD THIS
  ia1: number;
  ia2: number;
  final: number;
  grade: string;
  score: number;
}
const InternalMarks = () => {

  const [marks,setMarks] = useState<MarkRow[]>([]);
  const [gpa,setGpa] = useState<number>(0);

  useEffect(()=>{
    fetchMarks();
  },[]);
  // 🎯 Grade Logic
  const getGrade = (m: { ia1: number; ia2: number; final: number }) => {

  let score = 0;
  let max = 100;

  if (m.final > 0) {
    score = m.final;
    max = 100;
  } 
  else if (m.ia1 > 0 && m.ia2 > 0) {
    score = (m.ia1 + m.ia2) / 2;
    max = 40;
  } 
  else if (m.ia1 > 0) {
    score = m.ia1;
    max = 40;
  } 
  else {
    return { grade: "-", color: "bg-gray-100 text-gray-600" };
  }

  const percent = (score / max) * 100;

  if (percent >= 85) return { grade: "A+", color: "bg-purple-100 text-purple-700" };
  if (percent >= 75) return { grade: "A", color: "bg-green-100 text-green-700" };
  if (percent >= 65) return { grade: "B", color: "bg-blue-100 text-blue-700" };
  if (percent >= 55) return { grade: "C", color: "bg-yellow-100 text-yellow-700" };
  if (percent >= 50) return { grade: "D", color: "bg-orange-100 text-orange-700" };

  return { grade: "F", color: "bg-red-100 text-red-700" };
};
  const downloadPDF = () => {

  const doc = new jsPDF();

  const studentName = localStorage.getItem("username") || "Student";
  const usn = localStorage.getItem("usn") || "N/A";

  // TITLE
  doc.setFontSize(18);
  doc.text("Student Report Card", 14, 15);

  // STUDENT INFO
  doc.setFontSize(11);
  doc.text(`Name: ${studentName}`, 14, 25);
  doc.text(`USN: ${usn}`, 14, 32);
  doc.text(`GPA: ${gpa}`, 14, 39);

  // TABLE
  const tableData = marks.map(m => [
    m.subject,
    m.faculty || "-",
    m.ia1 || "-",
    m.ia2 || "-",
    m.final || "-",
    m.grade
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Subject", "Faculty", "IA1", "IA2", "Final", "Grade"]],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }, // blue header
  });

  doc.save("ReportCard.pdf");
};
  // 🎯 Grade → GPA mapping
  const gradeToPoint = (g:string)=>{
    switch(g){
      case "A+": return 10;
      case "A": return 9;
      case "B": return 8;
      case "C": return 7;
      default: return 5;
    }
  };

  const fetchMarks = async () => {
  try {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) {
      console.error("Student ID missing ❌");
      return;
    }

    const enrollRes = await axios.get(
      `http://127.0.0.1:8000/api/enrollments/?student=${Number(studentId)}`
    );

    const res = await axios.get(
      `http://127.0.0.1:8000/api/marks/?student=${Number(studentId)}`
    );

    const grouped: any = {};

    // STEP A: enrollments
    enrollRes.data.forEach((e: any) => {
  const key = Number(e.course);

  grouped[key] = {
    id: key,
    subject: e.course_name || `Course ${key}`,   
    ia1: 0,
    ia2: 0,
    final: 0,
  };
});

    // STEP B: marks
    res.data.forEach((m: any) => {
      const key = Number(m.course);

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          subject: m.course_name || "Unknown",
          faculty: m.faculty_name || "",
          ia1: 0,
          ia2: 0,
          final: 0,
        };
      }

      // update names
      grouped[key].subject = m.course_name || grouped[key].subject;
      grouped[key].faculty = m.faculty_name || grouped[key].faculty;

      const type = m.exam_type?.trim().toUpperCase();
      const value = Number(m.marks) || 0;

      if (type === "IA1") grouped[key].ia1 = value;
      if (type === "IA2") grouped[key].ia2 = value;
      if (type === "FINAL") grouped[key].final = value;
    });

    const formatted = Object.values(grouped).map((m: any) => {
      let score = 0;

      if (m.final > 0) score = m.final;
      else if (m.ia1 > 0 && m.ia2 > 0) score = (m.ia1 + m.ia2) / 2;
      else if (m.ia1 > 0) score = m.ia1;
      else if (m.ia2 > 0) score = m.ia2;

      const g = getGrade(m);

      return {
        ...m,
        score,
        grade: g.grade,
      };
    });

    setMarks(formatted);

    if (formatted.length) {
      const totalPoints = formatted.reduce(
        (sum, m) => sum + gradeToPoint(m.grade),
        0
      );

      setGpa(Number((totalPoints / formatted.length).toFixed(2)));
    }
  } catch (err) {
    console.error("Marks fetch error:", err);
  }
};

  // 🎯 Grade badge colors
  const gradeColor = (g:string)=>{
    switch(g){
      case "A+": return "bg-green-100 text-green-600";
      case "A": return "bg-blue-100 text-blue-600";
      case "B": return "bg-yellow-100 text-yellow-600";
      case "C": return "bg-orange-100 text-orange-600";
      default: return "bg-red-100 text-red-600";
    }
  };

  // 🎯 Low marks highlight
  const lowMark = (val:number)=> val > 0 && val < 50;

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Internal Marks
    </h1>

    {/* 🎯 GPA CARD */}
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border shadow-sm">

        <p className="text-xs text-blue-500 font-medium mb-1">
          Current GPA
        </p>

        <h2 className="text-4xl font-bold text-blue-600">
          {gpa || 0}
        </h2>

        <p className="text-xs text-muted-foreground mt-2">
          Based on latest marks
        </p>

      </div>

    </div>
    <div className="flex justify-end mb-4">
  <button
    onClick={downloadPDF}
    className="px-4 py-2 rounded-lg text-sm font-medium 
    bg-primary text-white hover:bg-primary/90 shadow"
  >
    Download Report
  </button>
</div>
    {/* 🎯 TABLE */}
<div className="bg-card border border-border rounded-xl overflow-hidden">

  <table className="w-full text-sm">

    {/* HEADER */}
    <thead className="bg-muted/50">
      <tr>
        <th className="px-6 py-3 text-left">Subject</th>
        <th className="px-6 py-3 text-center">IA 1</th>
        <th className="px-6 py-3 text-center">IA 2</th>
        <th className="px-6 py-3 text-center">Final</th>
        <th className="px-6 py-3 text-center">Grade</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {marks.map((m) => {

        const g = getGrade({
          ia1: m.ia1,
          ia2: m.ia2,
          final: m.final
        });

        return (
          <tr
  key={m.id}
  className="border-t hover:bg-muted/40 transition-all duration-200"
>

            {/* SUBJECT */}
            <td className="px-6 py-4">
  <div className="flex flex-col">
    
    {/* SUBJECT NAME */}
    <span className="font-semibold text-foreground text-sm">
      {m.subject}
    </span>

    {/* FACULTY NAME */}
    <span className="text-xs text-muted-foreground mt-0.5">
      {m.faculty || "Faculty"}
    </span>

  </div>
</td>

            {/* IA1 */}
            <td className="px-6 py-4 text-center">
              <span className={`
                px-2 py-1 rounded-md text-sm font-mono-data
                ${lowMark(m.ia1) ? "bg-yellow-50 text-yellow-700" : ""}
              `}>
                {m.ia1 > 0 ? m.ia1 : "-"}
              </span>
            </td>

            {/* IA2 */}
            <td className="px-6 py-4 text-center">
              <span className={`
                px-2 py-1 rounded-md text-sm font-mono-data
                ${lowMark(m.ia2) ? "bg-yellow-50 text-yellow-700" : ""}
              `}>
                {m.ia2 > 0 ? m.ia2 : "-"}
              </span>
            </td>

            {/* FINAL */}
            <td className="px-6 py-4 text-center">
              <span className={`
                px-2 py-1 rounded-md text-sm font-mono-data
                ${lowMark(m.final) ? "bg-yellow-50 text-yellow-700" : ""}
              `}>
                {m.final > 0 ? m.final : "-"}
              </span>
            </td>

            {/* GRADE */}
            <td className="px-6 py-4 text-center">
              <span className={`${g.color} px-3 py-1 rounded-full text-xs font-semibold`}>
  {g.grade}
</span>
            </td>

          </tr>
        );
      })}
    </tbody>

  </table>

</div>

  </DashboardLayout>
  );
};

export default InternalMarks;