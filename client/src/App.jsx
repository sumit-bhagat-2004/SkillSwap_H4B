import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Dashboard from "./pages/Dashboard";
import Home1 from "./pages/Home1";
import EditorRoom from "./pages/EditorRoom";

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:clerkId" element={<Profile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:roomId" element={<Home1 />} />
        <Route path="/room/:roomId" element={<EditorRoom />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
