import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const times = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM"];

/* SAMPLE TEMPLATE */

const sampleSchedule:any = {

  Monday:{
    "9:00 AM":"Mathematics",
    "10:00 AM":"Physics",
    "11:00 AM":"Chemistry",
    "2:00 PM":"CS Lab"
  },

  Tuesday:{
    "9:00 AM":"English",
    "10:00 AM":"Computer Science",
    "11:00 AM":"Electronics",
    "3:00 PM":"Physics Lab"
  },

  Wednesday:{
    "9:00 AM":"Mathematics",
    "11:00 AM":"Physics",
    "2:00 PM":"Chemistry",
    "3:00 PM":"CS Tutorial"
  },

  Thursday:{
    "9:00 AM":"Electronics",
    "10:00 AM":"English",
    "11:00 AM":"Computer Science",
    "2:00 PM":"Math Tutorial"
  },

  Friday:{
    "9:00 AM":"Chemistry",
    "10:00 AM":"Mathematics",
    "2:00 PM":"Electronics Lab"
  }

};

/* SUBJECT COLORS */

const subjectColors:any = {

  Mathematics:"bg-blue-100 text-blue-700",
  Physics:"bg-purple-100 text-purple-700",
  Chemistry:"bg-green-100 text-green-700",
  "Computer Science":"bg-indigo-100 text-indigo-700",
  Electronics:"bg-yellow-100 text-yellow-700",
  English:"bg-pink-100 text-pink-700",
  "CS Lab":"bg-cyan-100 text-cyan-700",
  "Physics Lab":"bg-orange-100 text-orange-700",
  "Electronics Lab":"bg-red-100 text-red-700",
  "CS Tutorial":"bg-teal-100 text-teal-700",
  "Math Tutorial":"bg-sky-100 text-sky-700"

};

const Timetable = () => {

  const [schedule,setSchedule] = useState<any>(sampleSchedule);

  useEffect(()=>{
    fetchTimetable();
  },[]);

  const fetchTimetable = async ()=>{

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/timetable/"
      );

      if(res.data && Object.keys(res.data).length > 0){
        setSchedule(res.data);
      }

    }
    catch{
      setSchedule(sampleSchedule);
    }

  };

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Timetable
    </h1>

    <div className="bg-card rounded-lg border border-border overflow-auto shadow-sm">

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b border-border bg-secondary/50">

            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Time
            </th>

            {days.map((d)=>(
              <th
                key={d}
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                {d}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {times.map((t)=>(

            <tr key={t} className="border-b border-border last:border-0">

              <td className="px-4 py-4 font-mono-data text-muted-foreground whitespace-nowrap">
                {t}
              </td>

              {days.map((d)=>{

                const subject = schedule[d]?.[t];

                return (

                  <td key={d} className="px-4 py-4">

                    {subject ? (

                      <div
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium transition hover:scale-105 ${subjectColors[subject] || "bg-gray-100 text-gray-700"}`}
                      >
                        {subject}
                      </div>

                    ) : (

                      <span className="text-muted-foreground text-xs">
                        —
                      </span>

                    )}

                  </td>

                )

              })}

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </DashboardLayout>

  );

};

export default Timetable;