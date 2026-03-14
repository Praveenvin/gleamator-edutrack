import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  id: number;
  sender: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const API = "http://127.0.0.1:8000/api/messages/";

const FacultyMessages = () => {

  const [conversations, setConversations] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API);
      setConversations(res.data);

      if (res.data.length > 0) {
        setSelected(res.data[0]);
      }

    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendReply = async () => {

    if (!reply.trim() || !selected) return;

    try {

      await axios.post(API, {
        subject: `Reply: ${selected.subject}`,
        message: reply,
        receiver: selected.sender
      });

      setReply("");
      fetchMessages();

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <FacultyDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: 400 }}>

        {/* LEFT PANEL */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">

          <div className="p-3 border-b border-border">
            <input
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              placeholder="Search messages..."
            />
          </div>

          <div className="divide-y divide-border">

            {conversations.map(c => (

              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  selected?.id === c.id
                    ? "bg-primary/5"
                    : "hover:bg-secondary"
                }`}
              >

                <div className="flex justify-between items-center">

                  <span className={`text-sm ${
                    !c.is_read ? "font-semibold text-foreground" : "text-foreground"
                  }`}>
                    {c.sender}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleTimeString()}
                  </span>

                </div>

                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {c.subject}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* MESSAGE VIEW */}

        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 flex flex-col">

          {selected && (

            <>
              <div className="border-b border-border pb-3 mb-4">

                <h3 className="font-semibold text-foreground">
                  {selected.sender}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selected.subject}
                </p>

              </div>

              <div className="flex-1">

                <div className="bg-secondary/50 rounded-lg p-4 max-w-[80%]">

                  <p className="text-sm text-foreground">
                    {selected.message}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>

                </div>

              </div>

              <div className="flex gap-2 mt-4">

                <input
                  value={reply}
                  onChange={(e)=>setReply(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                  placeholder="Type a reply..."
                />

                <button
                  onClick={sendReply}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                >
                  Send
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </FacultyDashboardLayout>
  );
};

export default FacultyMessages;