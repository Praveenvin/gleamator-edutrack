import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceRow {
  id: number;
  subject: string;
  total: number;
  attended: number;
  percentage: string;
}

const Attendance = () => {

  const [data,setData] = useState<AttendanceRow[]>([]);

  useEffect(()=>{

    fetchAttendance();

  },[]);

  const fetchAttendance = async () => {

    try{

      const res = await axios.get("http://127.0.0.1:8000/api/attendance/");

      const formatted = res.data.map((a:any)=>{

        const total = a.total_classes || a.total || 0;
        const attended = a.attended_classes || a.attended || 0;

        const percent =
          total > 0
            ? ((attended / total) * 100).toFixed(1) + "%"
            : "0%";

        return {
          id: a.id,
          subject: a.subject || a.course || "Subject",
          total: total,
          attended: attended,
          percentage: percent
        };

      });

      setData(formatted);

    }
    catch(err){

      console.error("Attendance fetch error:",err);

    }

  };

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Attendance
    </h1>

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b border-border bg-secondary/50">

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Subject
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Total Classes
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Attended
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Percentage
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((r)=>(
            <tr
              key={r.id}
              className="border-b border-border last:border-0 hover:bg-secondary/30"
            >

              <td className="px-6 py-4 text-foreground">
                {r.subject}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {r.total}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {r.attended}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {r.percentage}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </DashboardLayout>
  );
};

export default Attendance;