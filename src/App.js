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
  TampilKelas,
  UbahKelas,
  TambahKelas,
  TampilJadwalGym,
  TambahJadwalGym,
  UbahJadwalGym,
  TampilAktivasi,
  TambahAktivasi,
  TampilDeposit,
  TambahDeposit,
  TampilDepositKelas,
  TambahDepositKelas,
  TampilBookingGym,
  TambahBookingGym,
  TampilBookingKelas,
  TambahBookingKelas,
  TampilIzinInstruktur,
  TambahIzinInstruktur,
  LaporanKelas,
  LaporanGym,
  LaporanInstruktur,
  LaporanPendapatan,
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

  const KELASRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.kelas) {
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

  const BOOKINGGYMRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bookingGym) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BOOKINGKELASRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bookingKelas) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const IZININSTRUKTURRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.izinInstruktur) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPORANKELASRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.laporanKelas) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPORANGYMRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.laporanGym) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPORANINSTRUKTURRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.laporanInstruktur) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const LAPORANPENDAPATANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.laporanPendapatan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const AKTIVASIRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.aktivasi) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DEPOSITRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.deposit) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DEPOSITKELASRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.depositKelas) {
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
          {/*  Kelas */}
          <Route
            path="/kelas"
            element={
              <KELASRoute>
                <TampilKelas />
              </KELASRoute>
            }
          />
          <Route
            path="/kelas/:id"
            element={
              <KELASRoute>
                <TampilKelas />
              </KELASRoute>
            }
          />
          <Route
            path="/kelas/:id/edit"
            element={
              <KELASRoute>
                <UbahKelas />
              </KELASRoute>
            }
          />
          <Route
            path="/kelas/tambahKelas"
            element={
              <KELASRoute>
                <TambahKelas />
              </KELASRoute>
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
          {/*  Aktivasi */}
          <Route
            path="/aktivasi"
            element={
              <AKTIVASIRoute>
                <TampilAktivasi />
              </AKTIVASIRoute>
            }
          />
          <Route
            path="/aktivasi/:id"
            element={
              <AKTIVASIRoute>
                <TampilAktivasi />
              </AKTIVASIRoute>
            }
          />
          <Route
            path="/aktivasi/tambahAktivasi"
            element={
              <AKTIVASIRoute>
                <TambahAktivasi />
              </AKTIVASIRoute>
            }
          />
          {/*  Deposit */}
          <Route
            path="/deposit"
            element={
              <DEPOSITRoute>
                <TampilDeposit />
              </DEPOSITRoute>
            }
          />
          <Route
            path="/deposit/:id"
            element={
              <DEPOSITRoute>
                <TampilDeposit />
              </DEPOSITRoute>
            }
          />
          <Route
            path="/deposit/tambahDeposit"
            element={
              <DEPOSITRoute>
                <TambahDeposit />
              </DEPOSITRoute>
            }
          />
          {/*  Deposit Kelas */}
          <Route
            path="/depositKelas"
            element={
              <DEPOSITKELASRoute>
                <TampilDepositKelas />
              </DEPOSITKELASRoute>
            }
          />
          <Route
            path="/depositKelas/:id"
            element={
              <DEPOSITKELASRoute>
                <TampilDepositKelas />
              </DEPOSITKELASRoute>
            }
          />
          <Route
            path="/depositKelas/tambahDepositKelas"
            element={
              <DEPOSITKELASRoute>
                <TambahDepositKelas />
              </DEPOSITKELASRoute>
            }
          />
          {/*  Booking Gym */}
          <Route
            path="/bookingGym"
            element={
              <BOOKINGGYMRoute>
                <TampilBookingGym />
              </BOOKINGGYMRoute>
            }
          />
          <Route
            path="/bookingGym/:id"
            element={
              <BOOKINGGYMRoute>
                <TampilBookingGym />
              </BOOKINGGYMRoute>
            }
          />
          <Route
            path="/bookingGym/tambahBookingGym"
            element={
              <BOOKINGGYMRoute>
                <TambahBookingGym />
              </BOOKINGGYMRoute>
            }
          />
          {/*  Booking Kelas */}
          <Route
            path="/bookingKelas"
            element={
              <BOOKINGKELASRoute>
                <TampilBookingKelas />
              </BOOKINGKELASRoute>
            }
          />
          <Route
            path="/bookingKelas/:id"
            element={
              <BOOKINGKELASRoute>
                <TampilBookingKelas />
              </BOOKINGKELASRoute>
            }
          />
          <Route
            path="/bookingKelas/tambahBookingKelas"
            element={
              <BOOKINGKELASRoute>
                <TambahBookingKelas />
              </BOOKINGKELASRoute>
            }
          />
          {/*  Izin Instruktur */}
          <Route
            path="/izinInstruktur"
            element={
              <IZININSTRUKTURRoute>
                <TampilIzinInstruktur />
              </IZININSTRUKTURRoute>
            }
          />
          <Route
            path="/izinInstruktur/:id"
            element={
              <IZININSTRUKTURRoute>
                <TampilIzinInstruktur />
              </IZININSTRUKTURRoute>
            }
          />
          <Route
            path="/izinInstruktur/tambahIzinInstruktur"
            element={
              <IZININSTRUKTURRoute>
                <TambahIzinInstruktur />
              </IZININSTRUKTURRoute>
            }
          />
          {/* Laporan */}
          <Route
            path="/laporanKelas"
            element={
              <LAPORANKELASRoute>
                <LaporanKelas />
              </LAPORANKELASRoute>
            }
          />
          <Route
            path="/laporanGym"
            element={
              <LAPORANGYMRoute>
                <LaporanGym />
              </LAPORANGYMRoute>
            }
          />
          <Route
            path="/laporanInstruktur"
            element={
              <LAPORANINSTRUKTURRoute>
                <LaporanInstruktur />
              </LAPORANINSTRUKTURRoute>
            }
          />
          <Route
            path="/laporanPendapatan"
            element={
              <LAPORANPENDAPATANRoute>
                <LaporanPendapatan />
              </LAPORANPENDAPATANRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
