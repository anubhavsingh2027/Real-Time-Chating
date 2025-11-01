import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";
import useSettingsStore from "./store/useSettingsStore";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useSettingsStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
  {/* DECORATORS - GRID BG & GLOW SHAPES (non-interactive) */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
  <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
  <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
