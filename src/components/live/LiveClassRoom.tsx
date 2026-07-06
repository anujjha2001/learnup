"use client";

import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import io from "socket.io-client";

interface LiveClassRoomProps {
  roomId: string;
  courseTitle: string;
  isInstructor: boolean;
  user: any; // User object containing name and id
  onLeave: () => void;
}

const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ roomId, courseTitle, isInstructor, user, onLeave }) => {
  const [viewers, setViewers] = useState(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const socketRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    // Connect to the custom server running on port 3001
    const socketUrl = typeof window !== "undefined" ? `${window.location.hostname}:3001` : "http://localhost:3001";
    socketRef.current = io(socketUrl);

    socketRef.current.on("connect", () => {
      console.log("Connected to Live Class Chat Server");
      socketRef.current.emit("join-room", roomId, { name: user?.name });
    });

    socketRef.current.on("viewer-count", (count: number) => {
      setViewers(count);
    });

    socketRef.current.on("chat-message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, user]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msg = {
      id: Date.now().toString(),
      senderId: user?.id,
      senderName: user?.name || "Anonymous",
      text: chatInput.trim(),
      timestamp: new Date().toISOString(),
      isInstructor
    };

    socketRef.current.emit("send-message", roomId, msg);
    setChatInput("");
  };

  return (
    <div className="flex flex-col lg:flex-row h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Jitsi Video Container */}
      <div className="flex-1 bg-black relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={`LearnUp_${roomId}`}
          configOverwrite={{
            startWithAudioMuted: !isInstructor,
            startWithVideoMuted: !isInstructor,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: user?.name || "Student",
          }}
          onApiReady={(externalApi) => {
            externalApi.addListener("videoConferenceLeft", () => {
              onLeave();
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
        />
        
        {/* Overlay Viewer Count */}
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <span className="material-symbols-outlined text-slate-300 text-sm">visibility</span>
          <span className="text-white text-xs font-black">{viewers}</span>
        </div>
      </div>

      {/* Live Chat Sidebar */}
      <div className="w-full lg:w-80 bg-[#0b0a1d]/90 backdrop-blur-xl border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f97316]">chat</span>
            Live Chat
          </h3>
          <p className="text-slate-400 text-xs mt-1 truncate">{courseTitle}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">forum</span>
              <p className="text-xs">No messages yet.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.isSystem ? 'items-center' : 'items-start'} gap-1`}>
                {msg.isSystem ? (
                  <span className="text-[10px] text-slate-500 bg-white/5 px-3 py-1 rounded-full">{msg.text}</span>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${msg.isInstructor ? 'text-[#8b5cf6]' : 'text-[#f97316]'}`}>
                        {msg.senderName} {msg.isInstructor && ' (Instructor)'}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.senderId === user?.id 
                        ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSendMessage} className="flex gap-2 relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#8b5cf6] text-white rounded-lg px-3 flex items-center justify-center hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveClassRoom;
