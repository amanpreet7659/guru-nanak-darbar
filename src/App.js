import React from "react";
import Programs from "./components/Programs/Programs";
import Title from "./components/Title/Title";
import About from "./components/About/About";
import Campus from "./components/Campus/Campus";
import Testimonials from "./components/Testimonials/Testimonials";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TopCarousel from "./components/TopCarousel/crousel";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Route, Routes } from "react-router-dom";
import WaheguruSimranRegistration from "./components/Register/register";
import WaheguruSimranSubmit from "./components/Register/SubmitApplication";
import Layout from "./components/Layout/layout";
import AdminLogin from "./pages/Admin/AdminLogin";
import ProtectedAdminRoute from "./pages/Admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminApplicationView from "./pages/Admin/AdminApplicationView";
import { useTranslation } from "./i18n";

const HomePage = ({ setPlayState }) => {
  const { t } = useTranslation();

  return (
    <Layout showcontact={true}>
      <div className="">
        <TopCarousel />
        <Title
          subTitle={t("home.programSub")}
          title={t("home.programTitle")}
        />
        <Programs />
        <About setPlayState={setPlayState} />
        <Title
          subTitle={t("home.gallerySub")}
          title={t("home.galleryTitle")}
        />
        <Campus />
        <Title
          subTitle={t("home.testimonialsSub")}
          title={t("home.testimonialsTitle")}
        />
        <Testimonials />
      </div>
    </Layout>
  );
};

const App = () => {
  const [playState, setPlayState] = useState(false);

  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<HomePage setPlayState={setPlayState} />} />
        <Route
          path="/waheguru-simran/register"
          element={
            <Layout>
              <WaheguruSimranRegistration />
            </Layout>
          }
        />
        <Route
          path="/waheguru-simran/submit"
          element={
            <Layout>
              <WaheguruSimranSubmit />
            </Layout>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedAdminRoute>
              <AdminApplications />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedAdminRoute>
              <AdminApplicationView />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/applications/:id/edit"
          element={
            <ProtectedAdminRoute>
              <AdminApplicationView />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <VideoPlayer playState={playState} setPlayState={setPlayState} />
      <SpeedInsights />
    </div>
  );
};

export default App;
