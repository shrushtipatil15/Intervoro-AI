
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import CreateInterview from "./pages/CreateInterview";
import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";
import InterviewHistory from "./pages/InterviewHistory";

import Result from "./pages/Result";
import Report from "./pages/Report";
import ConceptTransfer from "./pages/ConceptTransfer";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />

            <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Interview */}
                <Route
                    path="/create-interview"
                    element={<CreateInterview />}
                />

                <Route
                    path="/setup"
                    element={<InterviewSetup />}
                />

                <Route
                    path="/interview-history"
                    element={<InterviewHistory />}
                />

                <Route
                    path="/interview/:id"
                    element={<Interview />}
                />

                {/* Results and Reports */}
                <Route
                    path="/result/:id"
                    element={<Result />}
                />

                <Route
                    path="/report/:id"
                    element={<Report />}
                />

                {/* Concept Transfer Verification */}
                <Route
                    path="/concept-transfer"
                    element={<ConceptTransfer />}
                />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
