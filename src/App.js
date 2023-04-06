import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { Sidebar, Footer, ScrollToTop } from "./components";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import "./styles.scss";
import {
  Login,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilJadwalInstruktur,
  TambahJadwalInstruktur,
  UbahJadwalInstruktur,
  TampilJadwalGym,
  TambahJadwalGym,
  UbahJadwalGym
} from "./pages/index";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const JADWALINSTRUKTURRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.jadwalInstruktur) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const JADWALGYMRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.jadwalGym) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      {user && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
      )}

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Profil User */}
          <Route
            path="/profilUser"
            element={
              <PROFILUSERRoute>
                <ProfilUser />
              </PROFILUSERRoute>
            }
          />
          <Route
            path="/profilUser/:id/edit"
            element={
              <PROFILUSERRoute>
                <UbahProfilUser />
              </PROFILUSERRoute>
            }
          />
          {/* Daftar User */}
          <Route
            path="/daftarUser"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id/edit"
            element={
              <DAFTARUSERRoute>
                <UbahUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/tambahUser"
            element={
              <DAFTARUSERRoute>
                <TambahUser />
              </DAFTARUSERRoute>
            }
          />
          {/*  Jadwal Instruktur */}
          <Route
            path="/jadwalInstruktur"
            element={
              <JADWALINSTRUKTURRoute>
                <TampilJadwalInstruktur />
              </JADWALINSTRUKTURRoute>
            }
          />
          <Route
            path="/jadwalInstruktur/:id"
            element={
              <JADWALINSTRUKTURRoute>
                <TampilJadwalInstruktur />
              </JADWALINSTRUKTURRoute>
            }
          />
          <Route
            path="/jadwalInstruktur/:id/edit"
            element={
              <JADWALINSTRUKTURRoute>
                <UbahJadwalInstruktur />
              </JADWALINSTRUKTURRoute>
            }
          />
          <Route
            path="/jadwalInstruktur/tambahJadwalInstruktur"
            element={
              <JADWALINSTRUKTURRoute>
                <TambahJadwalInstruktur />
              </JADWALINSTRUKTURRoute>
            }
          />
          {/*  Jadwal Gym */}
          <Route
            path="/jadwalGym"
            element={
              <JADWALGYMRoute>
                <TampilJadwalGym />
              </JADWALGYMRoute>
            }
          />
          <Route
            path="/jadwalGym/:id"
            element={
              <JADWALGYMRoute>
                <TampilJadwalGym />
              </JADWALGYMRoute>
            }
          />
          <Route
            path="/jadwalGym/:id/edit"
            element={
              <JADWALGYMRoute>
                <UbahJadwalGym />
              </JADWALGYMRoute>
            }
          />
          <Route
            path="/jadwalGym/tambahJadwalGym"
            element={
              <JADWALGYMRoute>
                <TambahJadwalGym />
              </JADWALGYMRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
