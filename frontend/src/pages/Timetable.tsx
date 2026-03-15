import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const times = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM"];

const subjectColors:any = {
  "Data Structures":"bg-blue-100 text-blue-700",
  "Database Management Systems":"bg-purple-100 text-purple-700",
  "Operating Systems":"bg-green-100 text-green-700",
  "Computer Networks":"bg-indigo-100 text-indigo-700",
  "Machine Learning":"bg-yellow-100 text-yellow-700",
  "Artificial Intelligence":"bg-pink-100 text-pink-700"
};

const activityColor =
"bg-orange-100 text-orange-700 border border-orange-200";

const Timetable = () => {

  const [schedule,setSchedule] = useState<any>({});
  const [activities,setActivities] = useState<any>({});
  const [showModal,setShowModal] = useState(false);
  const [selectedSlot,setSelectedSlot] = useState<any>(null);
  const [activity,setActivity] = useState("");

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async ()=>{
    await fetchTimetable();
    await fetchActivities();
  };

  const fetchTimetable = async ()=>{

    try{

      const studentId = 103;

      const res = await axios.get(
        `http://127.0.0.1:8000/api/timetable/?student=${studentId}`
      );

      const rows = res.data;

      let formatted:any = {};

      rows.forEach((r:any)=>{

        if(!formatted[r.day]){
          formatted[r.day] = {};
        }

        formatted[r.day][r.time] = {
          subject: r.subject,
          location: r.location
        };

      });

      setSchedule(formatted);

    }
    catch(error){
      console.log(error);
    }

  };

  const fetchActivities = async ()=>{

    try{

      const studentId = 103;

      const res = await axios.get(
        `http://127.0.0.1:8000/api/student-activities/?student=${studentId}`
      );

      const rows = res.data;

      let formatted:any = {};

      rows.forEach((r:any)=>{

        if(!formatted[r.day]){
          formatted[r.day] = {};
        }

        formatted[r.day][r.time] = {
          activity: r.activity,
          id: r.id
        };

      });

      setActivities(formatted);

    }
    catch(error){
      console.log(error);
    }

  };

  const openAddModal = (day:string,time:string)=>{
    setSelectedSlot({day,time});
    setActivity("");
    setShowModal(true);
  };
  const deleteActivity = async (id:number)=>{

  try{

    await axios.delete(
      `http://127.0.0.1:8000/api/student-activities/${id}/`
    );

    loadData();

  }
  catch(error){
    console.log(error);
  }

};


const editActivity = (day:string,time:string,currentActivity:string,id:number)=>{

  setSelectedSlot({day,time,id});
  setActivity(currentActivity);
  setShowModal(true);

};
  const saveActivity = async ()=>{

  try{

    const studentId = 103;

    if(selectedSlot.id){

      await axios.put(
        `http://127.0.0.1:8000/api/student-activities/${selectedSlot.id}/`,
        {
          student: studentId,
          day: selectedSlot.day,
          time: selectedSlot.time,
          activity: activity
        }
      );

    } else {

      await axios.post(
        "http://127.0.0.1:8000/api/student-activities/",
        {
          student: studentId,
          day: selectedSlot.day,
          time: selectedSlot.time,
          activity: activity
        }
      );

    }

    setShowModal(false);

    loadData();

  }
  catch(error){
    console.log(error);
  }

};

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-semibold mb-6">
      Timetable
    </h1>

    <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">

      <table className="w-full text-sm min-w-[700px]">

        <thead>

          <tr className="border-b bg-muted/40">

            <th className="px-3 py-3 text-center font-semibold text-muted-foreground">
              Time
            </th>

            {days.map((d)=>(
              <th key={d} className="px-3 py-3 text-center font-semibold text-muted-foreground">
                {d}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {times.map((t)=>{

            if(t === "12:00 PM"){

              return (

                <tr key={t} className="border-b bg-orange-50">

                  <td className="px-3 py-4 text-center font-semibold text-orange-600">
                    {t}
                  </td>

                  <td colSpan={5} className="text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium text-sm">
                      🍽 Lunch Break
                    </div>

                  </td>

                </tr>

              )

            }

            return (

              <tr key={t} className="border-b hover:bg-muted/20 transition">

                <td className="px-3 py-4 text-center font-medium text-muted-foreground">
                  {t}
                </td>

                {days.map((d)=>{

                  const subjectSlot = schedule[d]?.[t];
                  const activitySlot = activities[d]?.[t];

                  return (

                    <td key={d} className="px-2 py-3 text-center">

                      {activitySlot ? (

<div
className={`group mx-auto max-w-[140px] p-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition ${activityColor}`}
>

<div className="flex justify-between items-start">

<span className="truncate text-left">
{activitySlot.activity}
</span>

<div className="hidden group-hover:flex gap-1 ml-1">

<button
onClick={()=>editActivity(d,t,activitySlot.activity,activitySlot.id)}
className="p-[2px] rounded hover:bg-blue-100 text-blue-600"
>
<Pencil size={12} />
</button>

<button
onClick={()=>deleteActivity(activitySlot.id)}
className="p-[2px] rounded hover:bg-red-100 text-red-600"
>
<Trash2 size={12} />
</button>

</div>

</div>

</div>

) : subjectSlot ? (

                        <div
                        className={`mx-auto max-w-[140px] p-2 rounded-lg text-xs font-medium shadow-sm
                        ${subjectColors[subjectSlot.subject] || "bg-gray-100 text-gray-700"}`}
                        >

                          <div className="font-semibold leading-tight">
                            {subjectSlot.subject}
                          </div>

                          <div className="text-[10px] opacity-70 mt-1">
                            {subjectSlot.location}
                          </div>

                        </div>

                      ) : (

                        <button
                        onClick={()=>openAddModal(d,t)}
                        className="mx-auto flex flex-col items-center justify-center
                        w-[120px] h-[55px]
                        rounded-md border border-dashed border-gray-300
                        text-gray-500 text-xs
                        hover:border-emerald-400 hover:text-emerald-600
                        hover:bg-emerald-50 transition"
                        >

                          <span className="text-lg leading-none">+</span>
                          Add

                        </button>

                      )}

                    </td>

                  )

                })}

              </tr>

            )

          })}

        </tbody>

      </table>

    </div>


{/* Modal */}

{showModal && (

<div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

<div className="bg-white rounded-xl shadow-xl w-[360px] p-6">

<h2 className="text-lg font-semibold mb-1">
Add Activity
</h2>

<p className="text-sm text-gray-500 mb-4">
{selectedSlot?.day} • {selectedSlot?.time}
</p>

<input
type="text"
value={activity}
onChange={(e)=>setActivity(e.target.value)}
placeholder="Gym, Study, Project..."
className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
/>

<div className="flex justify-end gap-3">

<button
onClick={()=>setShowModal(false)}
className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
>
Cancel
</button>

<button
onClick={saveActivity}
className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
>
Save
</button>

</div>

</div>

</div>

)}

  </DashboardLayout>

  );

};

export default Timetable;