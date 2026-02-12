import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProjectPage from "./pages/EditProjectPage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

function App() {
  const { isClerkLoaded, isSignedIn } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/profile" element={isSignedIn ? <ProfilePage/> : <Navigate to={"/"} />} />
          <Route path="/create" element={isSignedIn ? <CreatePage/> : <Navigate to={"/"} />} />
          <Route path="/edit/:id" element={isSignedIn ? <EditProjectPage/> : <Navigate to={"/"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
