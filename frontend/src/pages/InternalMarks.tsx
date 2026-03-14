import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface MarkRow {
  id: number;
  subject: string;
  test1: number;
  test2: number;
  test3: number;
  total: string;
}

const InternalMarks = () => {

  const [marks,setMarks] = useState<MarkRow[]>([]);

  useEffect(()=>{

    fetchMarks();

  },[]);

  const fetchMarks = async () => {

    try{

      const res = await axios.get("http://127.0.0.1:8000/api/marks/");

      const formatted = res.data.map((m:any)=>{

        const t1 = m.test1 || m.test_1 || 0;
        const t2 = m.test2 || m.test_2 || 0;
        const t3 = m.test3 || m.test_3 || 0;

        const total = t1 + t2 + t3;

        return {
          id: m.id,
          subject: m.subject || m.course || "Subject",
          test1: t1,
          test2: t2,
          test3: t3,
          total: `${total}/150`
        };

      });

      setMarks(formatted);

    }
    catch(err){

      console.error("Marks fetch error:",err);

    }

  };

  return (
  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Internal Marks
    </h1>

    <div className="bg-card rounded-lg border border-border overflow-hidden">

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b border-border bg-secondary/50">

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Subject
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Test 1 (50)
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Test 2 (50)
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Test 3 (50)
            </th>

            <th className="text-left px-6 py-3 font-medium text-muted-foreground">
              Total (150)
            </th>

          </tr>

        </thead>

        <tbody>

          {marks.map((m)=>(
            <tr
              key={m.id}
              className="border-b border-border last:border-0 hover:bg-secondary/30"
            >

              <td className="px-6 py-4 text-foreground">
                {m.subject}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {m.test1}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {m.test2}
              </td>

              <td className="px-6 py-4 font-mono-data text-foreground">
                {m.test3}
              </td>

              <td className="px-6 py-4 font-mono-data font-medium text-foreground">
                {m.total}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </DashboardLayout>
  );
};

export default InternalMarks;