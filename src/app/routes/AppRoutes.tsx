import { Routes, Route } from "react-router-dom";

// Auth
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import RoleSelectionPage from "../../features/auth/pages/RoleSelectionPage";
import VerifyEmailPage from "../../features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";

import ProtectedRoute from "./ProtectedRoute";

import SpacePage from "../../features/spaces/pages/SpacesPage";
import JoinSpacePage from "../../features/spaces/pages/JoinPage";
import AccessibilityPage from "../../features/accessibility/pages/AccessibilityPage";
import AccessibilitySettingsPage from "../../features/accessibility/pages/AccessibilitySettingsPage";

import RecordingPage from "../../features/recording/pages/RecordingPage";
import RecordingStartPage from "../../features/recording/pages/RecordingStartPage";
import SessionSetupPage from "../../features/recording/pages/SessionSetupPage";
import SessionSavedPage from "../../features/recording/pages/SessionSavedPage";

import RecordingsPage from "../../features/recordings/pages/RecordingsPage";
import MembersPage from "../../features/spaces/pages/MembersPage";
import JoinPage from "../../features/spaces/pages/JoinPage";
import LiveRecordingPage from "../../features/live/pages/LiveRecordingPage";
import RecordingDetailsPage from "../../features/recordings/pages/RecordingDetailsPage";
import TranscriptPage from "../../features/recordings/pages/TranscriptPage";
import SummaryPage from "../../features/recordings/pages/SummaryPage";

// Main
//import ProfilePage from "../../features/profile/pages/ProfilePage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/verificar-correo" element={<VerifyEmailPage />} />

            <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />

            <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />

            <Route path="/roles" element={<ProtectedRoute><RoleSelectionPage /></ProtectedRoute>} />

            <Route path="/spaces" element={<ProtectedRoute><SpacePage /></ProtectedRoute>} /> 

            <Route path="/spaces/join" element={<ProtectedRoute><JoinSpacePage /></ProtectedRoute>} />

            <Route path="/accessibility" element={<ProtectedRoute><AccessibilityPage /> </ProtectedRoute>}/>

            <Route path="/accessibility/settings" element={<ProtectedRoute> <AccessibilitySettingsPage /> </ProtectedRoute>}/>
            
            <Route path="/recording/start" element={<ProtectedRoute><RecordingStartPage /> </ProtectedRoute>}/>
            <Route path="/recording/setup" element={<ProtectedRoute><SessionSetupPage /></ProtectedRoute>}/>
            <Route path="/recording/live" element={<ProtectedRoute> <RecordingPage /></ProtectedRoute>}/>
            <Route path="/recording/saved" element={<ProtectedRoute><SessionSavedPage /></ProtectedRoute>}/>

            <Route path="/spaces/:spaceId/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
            <Route path="/spaces/:spaceId/live/:recordingId" element={<ProtectedRoute><LiveRecordingPage /></ProtectedRoute>} />
            <Route path="/join/:code" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />

            <Route path="/spaces/:spaceId/recordings" element={<ProtectedRoute><RecordingsPage /></ProtectedRoute>} />
            <Route path="/recordings/:recordingId" element={<ProtectedRoute><RecordingPage /></ProtectedRoute>} />
            <Route path="/recordings/:recordingId/details" element={<ProtectedRoute><RecordingDetailsPage /></ProtectedRoute>} />
            <Route path="/recordings/:recordingId/transcript" element={<ProtectedRoute><TranscriptPage /></ProtectedRoute>} />
            <Route path="/recordings/:recordingId/summary" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />

        </Routes>
    );
}