import { updateMessage, deleteMessage } from "../../lib/api";
import { MessageSquare, Trash2, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";

interface MessagesTabProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function MessagesTab({ messages, loadingMessages, onRefresh, showToast }: MessagesTabProps) {
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
          <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Leads received via contact form</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loadingMessages}
          className="text-xs font-mono uppercase text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={loadingMessages ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {loadingMessages && <div className="text-center py-10 font-mono text-xs">LOADING MESSAGE LEADS...</div>}

      {!loadingMessages && messages.length === 0 && (
        <div className="text-center py-20 border border-dashed">
          <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-4" strokeWidth={1.2} />
          <p className="font-mono text-xs text-muted-foreground">NO MESSAGES IN INBOX YET</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`py-0 transition-colors ${
              msg.is_read
                ? "bg-muted/40 opacity-80"
                : "bg-card border-foreground/20 font-semibold shadow-md"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
                <div>
                  {msg.is_read ? (
                    <Badge variant="secondary" className="text-[9px] font-mono font-bold px-1.5 py-0.5 mr-3 text-muted-foreground">
                      READ
                    </Badge>
                  ) : (
                    <Badge className="text-[9px] font-mono font-bold px-1.5 py-0.5 mr-3 bg-yellow-400 text-black">
                      NEW SUBMISSION
                    </Badge>
                  )}
                  <span className="text-xs font-bold">{msg.name}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-2">&lt;{msg.email}&gt;</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider font-mono">
                  Subject: <span className="text-foreground font-semibold">{msg.subject || "No Subject"}</span>
                </p>
                <p className="text-sm leading-relaxed font-sans text-muted-foreground">
                  {msg.message}
                </p>
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleReadMessage(msg)}
                  className="text-xs font-mono uppercase text-muted-foreground hover:text-foreground"
                >
                  <Eye />
                  Mark as {msg.is_read ? "Unread" : "Read"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="text-xs font-mono uppercase text-muted-foreground hover:text-destructive hover:border-destructive/30"
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
