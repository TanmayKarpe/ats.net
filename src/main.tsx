import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { supabase } from "./supabase/client"; // <-- make sure this path exists

// DEVELOPMENT ONLY: expose supabase to browser console for debugging
// Only expose in development mode
if (import.meta.env.MODE === 'development') {
	// @ts-ignore
	;(window as any).supabase = supabase;
}

createRoot(document.getElementById("root")!).render(<App />);

