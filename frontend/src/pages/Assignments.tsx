import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due: string;
  status: string;
}

const statusStyle: Record<string, string> = {
  Completed: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
};

const Assignments = () => {

  const [assignments,setAssignments] = useState<Assignment[]>([]);

  useEffect(()=>{

    fetchAssignments();

  },[]);

  const fetchAssignments = async () => {

    try{

      const res = await axios.get("http://127.0.0.1:8000/api/assignments/");

      const formatted = res.data.map((a:any)=>({
        id: a.id,
        title: a.title,
        subject: a.course || a.subject || "Subject",
        due: a.due_date || a.due || "",
        status: a.status || "Pending"
      }));

      setAssignments(formatted);

    }
    catch(err){

      console.error("Assignments fetch error:",err);

    }

  };

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Assignments
    </h1>

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b border-border bg-secondary/50">

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Title
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Subject
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Due Date
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {assignments.map((a)=>(
            <tr
              key={a.id}
              className="border-b border-border last:border-0 hover:bg-secondary/30"
            >

              <td className="px-6 py-4 text-foreground">
                {a.title}
              </td>

              <td className="px-6 py-4 text-muted-foreground">
                {a.subject}
              </td>

              <td className="px-6 py-4 font-mono-data text-muted-foreground">
                {a.due}
              </td>

              <td className="px-6 py-4">

                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[a.status] || ""}`}>
                  {a.status}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </DashboardLayout>
  );
};

export default Assignments;