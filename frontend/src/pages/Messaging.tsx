import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id:number
  sender:number
  receiver:number
  subject:string
  body:string
  created_at:string
}

const Messaging = () => {

  const {user} = useAuth()

  const [messages,setMessages] = useState<Message[]>([])
  const [selected,setSelected] = useState<Message | null>(null)
  const [reply,setReply] = useState("")

  useEffect(()=>{

    fetchMessages()

  },[])

  const fetchMessages = async ()=>{

    try{

      const res = await axios.get(
        "http://127.0.0.1:8000/api/messages/"
      )

      setMessages(res.data)

      if(res.data.length>0){
        setSelected(res.data[0])
      }

    }
    catch(err){
      console.error(err)
    }

  }

  const sendMessage = async ()=>{

    if(!reply || !selected) return

    try{

      await axios.post(
        "http://127.0.0.1:8000/api/messages/",
        {
          sender:user?.id,
          receiver:selected.sender,
          subject:selected.subject,
          body:reply
        }
      )

      setReply("")
      fetchMessages()

    }
    catch(err){
      console.error(err)
    }

  }

  return (

  <DashboardLayout>

    <h1 className="text-2xl font-medium text-foreground mb-6">
      Messaging
    </h1>

    <div className="bg-card rounded-xl border border-border flex shadow-sm overflow-hidden"
         style={{height:"520px"}}>

      {/* Inbox */}

      <div className="w-80 border-r border-border overflow-auto">

        {messages.map((m)=>(
          <button
            key={m.id}
            onClick={()=>setSelected(m)}
            className={`w-full text-left px-4 py-3 border-b border-border transition-all duration-200 hover:bg-secondary/40
            ${selected?.id===m.id ? "bg-secondary" : ""}`}
          >

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-foreground">
                User {m.sender}
              </p>

              <span className="text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleDateString()}
              </span>

            </div>

            <p className="text-sm text-primary mt-1">
              {m.subject}
            </p>

            <p className="text-xs text-muted-foreground truncate">
              {m.body}
            </p>

          </button>
        ))}

      </div>

      {/* Chat Panel */}

      <div className="flex-1 flex flex-col p-6">

        {selected && (

          <>
          <div className="mb-4 pb-4 border-b border-border">

            <h3 className="text-base font-semibold text-foreground">
              {selected.subject}
            </h3>

            <p className="text-sm text-muted-foreground">
              From User {selected.sender}
            </p>

          </div>

          <div className="flex-1 overflow-auto">

            <div className="bg-secondary rounded-lg p-4 text-sm text-foreground animate-fade-in">
              {selected.body}
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-border flex gap-2">

            <input
              value={reply}
              onChange={(e)=>setReply(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button
              onClick={sendMessage}
              className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all"
            >
              Send
            </button>

          </div>

          </>
        )}

      </div>

    </div>

  </DashboardLayout>

  )

}

export default Messaging