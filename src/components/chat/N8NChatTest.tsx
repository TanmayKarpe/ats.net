import { useEffect } from 'react';

// Toggle to enable/disable the temporary n8n chat widget.
const ENABLE_N8N_CHAT = true;

export function N8NChatTest() {
  useEffect(() => {
    if (!ENABLE_N8N_CHAT) return;

    // Avoid duplicate injection if the component mounts multiple times.
    const existingStyle = document.getElementById('n8n-chat-style');
    const existingScript = document.getElementById('n8n-chat-script');

    if (!existingStyle) {
      const style = document.createElement('link');
      style.id = 'n8n-chat-style';
      style.rel = 'stylesheet';
      style.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(style);
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'n8n-chat-script';
      script.type = 'module';
      script.textContent = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        createChat({
          webhookUrl: 'YOUR_PRODUCTION_WEBHOOK_URL'
        });
      `;
      document.head.appendChild(script);
    }

    return () => {
      // Clean up only the assets we injected in this component.
      const styleEl = document.getElementById('n8n-chat-style');
      if (styleEl) {
        styleEl.remove();
      }
      const scriptEl = document.getElementById('n8n-chat-script');
      if (scriptEl) {
        scriptEl.remove();
      }
    };
  }, []);

  return null;
}

export default N8NChatTest;
