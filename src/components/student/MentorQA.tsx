import React, { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";

export default function MentorQA({ mentorThreads, currentUser }: { mentorThreads: any[], currentUser: any }) {
  const [activeThread, setActiveThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async (submissionId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/mentor/messages?submissionId=${submissionId}`);
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectThread = (thread: any) => {
    setActiveThread(thread);
    fetchMessages(thread.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;
    const msg = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/mentor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: activeThread.id, message: msg })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages([...messages, newMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (activeThread) {
    return (
      <div className="h-[70vh] flex flex-col bg-[#0b0a1d]/60 border border-white/5 rounded-3xl overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">{activeThread.quiz?.title}</h3>
            <p className="text-xs text-slate-400">Score: {activeThread.score}% • Status: {activeThread.status}</p>
          </div>
          <button onClick={() => setActiveThread(null)} className="text-xs text-slate-400 hover:text-white transition">
            Back to Threads
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {loadingMessages ? (
            <p className="text-center text-xs text-slate-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-xs text-slate-500">No messages yet. Send a message to your mentor.</p>
          ) : (
            messages.map((m, i) => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm font-medium ${isMe ? "bg-[#8b5cf6] text-white rounded-br-sm" : "bg-[#22222d] text-slate-100 border border-white/5 rounded-bl-sm"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-[#f97316]" />
                      <span className={`text-[10px] font-bold ${isMe ? 'text-purple-200' : 'text-[#f97316]'}`}>{m.sender?.name}</span>
                    </div>
                    <span className="text-slate-100 font-medium">{m.message}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="p-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">INSTRUCTOR FEEDBACK</span>
        <h2 className="text-2xl font-black text-white">Mentor Q&A</h2>
        <p className="text-xs text-slate-400 mt-1">Discuss your quiz submissions with your course instructors.</p>
      </div>

      {mentorThreads.length === 0 ? (
        <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-center">
          <p className="text-slate-400 text-sm">No quiz submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mentorThreads.map((thread) => (
            <div key={thread.id} onClick={() => handleSelectThread(thread)} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#0b0a1d]/60 shadow hover:bg-white/5 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{thread.quiz?.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Score: {thread.score}% • Status: {thread.status}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex flex-col items-end">
                {thread.mentorMessages?.[0] ? (
                  <span className="text-purple-400 line-clamp-1 max-w-[200px]">{thread.mentorMessages[0].message}</span>
                ) : (
                  <span>No messages</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
