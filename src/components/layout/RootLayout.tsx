import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SmartsuppChat } from '../chat/SmartsuppChat';
import { N8NChatTest } from '../chat/N8NChatTest';
import ScrollToTop from '../ScrollToTop';

// Toggle which chatbot is active: 'legacy' (SmartSupp) or 'n8n' (N8NChatTest)
const CHATBOT_MODE: 'legacy' | 'n8n' = 'n8n';

export function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showLegacyChat = CHATBOT_MODE === 'legacy';
  const showN8NChat = CHATBOT_MODE === 'n8n' && isHome;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      {showLegacyChat && <SmartsuppChat />}
      {showN8NChat && <N8NChatTest />}
    </div>
  );
}
