import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface LeaveRequest {
  id: number;
  from_date: string;
  to_date: string;
  reason: string;
  status: string;
}

const statusStyle: Record<string, string> = {
  Approved: "text-success bg-success/10",
  Pending: "text-warning bg-warning/10",
  Rejected: "text-destructive bg-destructive/10",
};

const LeaveRequests = () => {

  const { user } = useAuth();   // logged in student

  const [form,setForm] = useState({
    from_date:"",
    to_date:"",
    reason:""
  });

  const [requests,setRequests] = useState<LeaveRequest[]>([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    fetchRequests();
  },[]);

  const fetchRequests = async () => {

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/leave-requests/"
      );

      setRequests(res.data);

    }
    catch(err){
      console.error("Leave request fetch failed",err);
    }

  };

  const handleSubmit = async () => {

    if(!form.from_date || !form.to_date || !form.reason){
      alert("Please fill all fields");
      return;
    }

    if(form.from_date > form.to_date){
      alert("From date cannot be after To date");
      return;
    }

    try{

      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/api/leave-requests/",
        {
          ...form,
          student: user?.id     // important for DB link
        }
      );

      setForm({
        from_date:"",
        to_date:"",
        reason:""
      });

      fetchRequests();

    }
    catch(err){
      console.error("Leave request submit failed",err);
    }
    finally{
      setLoading(false);
    }

  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-medium text-foreground mb-6">
        Leave Requests
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* APPLY LEAVE */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Apply for Leave
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                From Date
              </label>

              <input
                type="date"
                value={form.from_date}
                onChange={(e)=>setForm({...form,from_date:e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                To Date
              </label>

              <input
                type="date"
                value={form.to_date}
                onChange={(e)=>setForm({...form,to_date:e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Reason
              </label>

              <textarea
                value={form.reason}
                onChange={(e)=>setForm({...form,reason:e.target.value})}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>

        </div>

        {/* PREVIOUS REQUESTS */}

        <div className="bg-card rounded-lg border border-border p-6">

          <h2 className="text-base font-medium text-foreground mb-4">
            Previous Requests
          </h2>

          {requests.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No leave requests yet
            </p>
          )}

          <div className="space-y-3">

            {requests.map((r)=>(
              <div
                key={r.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >

                <div>
                  <p className="text-sm text-foreground">
                    {r.reason}
                  </p>

                  <p className="text-xs font-mono-data text-muted-foreground">
                    {r.from_date} → {r.to_date}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}
                >
                  {r.status}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default LeaveRequests;