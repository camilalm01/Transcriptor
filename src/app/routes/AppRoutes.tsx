import { Routes, Route } from "react-router-dom";

// Auth
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import RoleSelectionPage from "../../features/auth/pages/RoleSelectionPage";

// Main
//import MeetingsPage from "../../features/meetings/pages/MeetingsPage";
import AccessibilityPage from "../../features/accessibility/pages/AccessibilityPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";

// Recording
import RecordPage from "../../features/recording/pages/RecordPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/roles" element={<RoleSelectionPage />} />

            {/* <Route path="/meetings" element={<MeetingsPage />}/> */}

            <Route path="/record" element={<RecordPage />}/>

            <Route path="/accessibility" element={<AccessibilityPage />} />

            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
}