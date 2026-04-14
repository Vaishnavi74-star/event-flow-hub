import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const defaultSuggestions = [
  'Suggest event ideas for this weekend',
  'How should I price my tech conference?',
  'Best practices for increasing attendance',
  'Tips for choosing a venue',
];

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI event assistant. I can help with event suggestions, pricing strategies, venue recommendations, and more. What can I help you with?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with real AI call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'pricing': "For a tech conference, consider tiered pricing:\n\n• **Early Bird**: 30-40% discount (first 2 weeks)\n• **Regular**: Standard price\n• **VIP**: 2-3x regular with premium perks\n\nResearch similar events in your area for benchmarking.",
        'attendance': "Top strategies for increasing attendance:\n\n1. **Early bird discounts** — create urgency\n2. **Social media campaigns** — 4-6 weeks before\n3. **Influencer partnerships** — leverage their audience\n4. **Email sequences** — build anticipation\n5. **Referral incentives** — attendees bring friends",
        'venue': "When choosing a venue, consider:\n\n• **Capacity** — aim for 80% fill rate\n• **Location** — accessible by public transport\n• **Amenities** — WiFi, AV equipment, catering\n• **Parking** — adequate for your audience\n• **Ambiance** — matches your event theme",
        'weekend': "Here are some trending event ideas:\n\n🎵 **Live Music Showcase** — Local bands, food trucks\n💻 **Hackathon** — 24-hour coding challenge\n🎨 **Art Workshop** — Painting, pottery, or digital art\n🏃 **Community Fun Run** — Health & wellness themed\n🍷 **Wine Tasting** — Partner with local vineyards",
      };

      const key = Object.keys(responses).find(k => text.toLowerCase().includes(k));
      const response = key ? responses[key] : "Great question! Based on current event trends, I'd recommend focusing on hybrid events that combine in-person and virtual experiences. This maximizes reach while keeping the intimate feel. Would you like me to go deeper on any specific aspect?";

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1200);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-premium animate-glow-pulse group"
      >
        <Bot className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-premium" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-premium animate-scale-in ${
      minimized
        ? 'bottom-6 right-6 w-72 h-14'
        : 'bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh]'
    }`}>
      <div className="glass-strong rounded-2xl glow-border overflow-hidden flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-heading font-semibold">AI Assistant</p>
              {!minimized && <p className="text-[10px] text-muted-foreground">Powered by EventHub AI</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(!minimized)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-premium">
              {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-premium">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-primary text-primary-foreground rounded-br-md'
                      : 'glass rounded-bl-md'
                  }`}>
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="w-3 h-3" /> Try asking:</p>
                  {defaultSuggestions.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg glass hover:glow-border transition-premium text-muted-foreground hover:text-foreground">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything about events..."
                  className="flex-1 bg-secondary/30 border-border/50 text-sm h-10 rounded-xl focus:border-primary/50"
                  disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-primary hover:opacity-90 shadow-md shadow-primary/20 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
