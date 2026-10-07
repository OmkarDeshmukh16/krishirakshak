import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmsPage from './pages/farmer/FarmsPage';
import CropsPage from './pages/farmer/CropsPage';
import CropDetailPage from './pages/farmer/CropDetailPage';
import AssessmentPage from './pages/farmer/AssessmentPage';
import RiskPage from './pages/farmer/RiskPage';
import WeatherPage from './pages/farmer/WeatherPage';
import AdvisoryPage from './pages/farmer/AdvisoryPage';
import ExpertSupportPage from './pages/farmer/ExpertSupportPage';
import AssistantPage from './pages/farmer/AssistantPage';
import CommunityPage from './pages/farmer/CommunityPage';
import NotificationsPage from './pages/farmer/NotificationsPage';
import ProfilePage from './pages/farmer/ProfilePage';

// Expert Pages
import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertRequestsPage from './pages/expert/ExpertRequestsPage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import HotspotsPage from './pages/officer/HotspotsPage';
import AnalyticsPage from './pages/officer/AnalyticsPage';
import AlertsPage from './pages/officer/AlertsPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Farmer Routes */}
              <Route path="/farmer" element={<AppLayout />}>
                <Route index element={<Navigate to="/farmer/dashboard" replace />} />
                <Route path="dashboard" element={<FarmerDashboard />} />
                <Route path="farms" element={<FarmsPage />} />
                <Route path="crops" element={<CropsPage />} />
                <Route path="crops/:id" element={<CropDetailPage />} />
                <Route path="assessment" element={<AssessmentPage />} />
                <Route path="risk" element={<RiskPage />} />
                <Route path="weather" element={<WeatherPage />} />
                <Route path="advisory" element={<AdvisoryPage />} />
                <Route path="expert-support" element={<ExpertSupportPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Expert Routes */}
              <Route path="/expert" element={<AppLayout />}>
                <Route index element={<Navigate to="/expert/dashboard" replace />} />
                <Route path="dashboard" element={<ExpertDashboard />} />
                <Route path="requests" element={<ExpertRequestsPage />} />
                <Route path="requests/:id" element={<ExpertRequestsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Agriculture Officer Routes */}
              <Route path="/officer" element={<AppLayout />}>
                <Route index element={<Navigate to="/officer/dashboard" replace />} />
                <Route path="dashboard" element={<OfficerDashboard />} />
                <Route path="hotspots" element={<HotspotsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Catch-all redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
