import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Send, MessageSquare } from 'lucide-react';

export function AIAssistantSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent/80 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles size={16} className="text-secondary" />
              <span className="text-sm font-medium">AI-Powered Assistance</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Ask ATS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-emerald-300">
                AI Assistant
              </span>
            </h2>

            <p className="text-lg text-white/80 leading-relaxed max-w-xl">
              Get instant answers about instruments, sample preparation guidelines, tariffs, booking procedures, and more. Our AI assistant is trained on ATS's complete knowledge base.
            </p>

            <ul className="space-y-3">
              {[
                'Instrument specifications & capabilities',
                'Sample preparation requirements',
                'Tariff information & booking',
                'Policies & procedures'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="mt-4">
              <MessageSquare size={20} />
              Start Conversation
            </Button>
          </div>

          {/* Chat Widget Mockup */}
          <div className="relative">
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto border border-border/50">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">ATS AI Assistant</p>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    Online • Ready to help
                  </p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-4 bg-muted/50 min-h-[300px]">
                {/* Bot Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[80%]">
                    <p className="text-sm">
                      Hello! 👋 I'm the ATS AI Assistant. How can I help you today? You can ask me about:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Instruments', 'Tariffs', 'Booking'].map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
                    <p className="text-sm">What are the sample requirements for FE-SEM analysis?</p>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    disabled
                  />
                  <button className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
