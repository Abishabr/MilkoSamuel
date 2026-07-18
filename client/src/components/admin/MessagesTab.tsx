import { useTheme } from "../../context/ThemeContext";
import { updateMessage, deleteMessage } from "../../lib/api";
import { MessageSquare, Trash2, Eye, RefreshCw } from "lucide-react";

interface MessagesTabProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function MessagesTab({ messages, loadingMessages, onRefresh, showToast }: MessagesTabProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleToggleReadMessage = async (msg: any) => {
    try {
      await updateMessage(msg.id, { is_read: !msg.is_read });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await deleteMessage(id);
      onRefresh();
      showToast("Message deleted");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Inbox Submissions</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Leads received via contact form</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loadingMessages}
          className="p-2 border border-white/5 text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-mono uppercase"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loadingMessages && <div className="text-center py-10 font-mono text-xs">LOADING MESSAGE LEADS...</div>}

      {!loadingMessages && messages.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10">
          <MessageSquare className="w-10 h-10 mx-auto text-gray-600 mb-4" strokeWidth={1.2} />
          <p className="font-mono text-xs text-gray-500">NO MESSAGES IN INBOX YET</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 border transition-colors ${
              msg.is_read
                ? (isLight ? "bg-zinc-50 border-black/5" : "bg-zinc-900/40 border-white/5 opacity-80")
                : (isLight ? "bg-white border-black font-semibold shadow-md" : "bg-[#161616] border-white/20 font-semibold")
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
              <div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mr-3 ${
                  msg.is_read ? "bg-zinc-800 text-gray-400" : "bg-yellow-400 text-black"
                }`}>
                  {msg.is_read ? "READ" : "NEW SUBMISSION"}
                </span>
                <span className="text-xs font-bold">{msg.name}</span>
                <span className="text-xs text-gray-500 font-mono ml-2">&lt;{msg.email}&gt;</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">
                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider font-mono">
                Subject: <span className={isLight ? "text-black" : "text-white font-semibold"}>{msg.subject || "No Subject"}</span>
              </p>
              <p className={`text-sm leading-relaxed font-sans ${isLight ? "text-gray-800" : "text-gray-300"}`}>
                {msg.message}
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => handleToggleReadMessage(msg)}
                className="px-3 py-1.5 border border-white/10 hover:border-white/20 text-xs font-mono uppercase text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Mark as {msg.is_read ? "Unread" : "Read"}
              </button>
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="px-3 py-1.5 border border-white/10 hover:border-red-500/30 text-xs font-mono uppercase text-gray-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
