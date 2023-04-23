import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBook,
  FaUserCog,
  FaSignOutAlt,
  FaDochub,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaExchangeAlt,
} from "react-icons/fa";

const Sidebar = ({
  image,
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange,
}) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px",
                }}
              >
                Gofit
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title={"Master"} icon={<FaBook />}>
            {user.akses.jadwalGym === true && (
              <MenuItem>
                Jadwal Gym <NavLink to="/jadwalGym" />
              </MenuItem>
            )}
            {user.akses.jadwalInstruktur === true && (
              <MenuItem>
                Jadwal Instruktur <NavLink to="/jadwalInstruktur" />
              </MenuItem>
            )}
            {user.akses.bookingGym === true && (
              <MenuItem>
                Booking Gym <NavLink to="/bookingGym" />
              </MenuItem>
            )}
            {user.akses.bookingKelas === true && (
              <MenuItem>
                Booking Kelas <NavLink to="/bookingKelas" />
              </MenuItem>
            )}
            {user.akses.izinInstruktur === true && (
              <MenuItem>
                Izin Instruktur <NavLink to="/izinInstruktur" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Laporan"} icon={<FaBook />}>
            {user.akses.laporanGym === true && (
              <MenuItem>
                Laporan Gym <NavLink to="/laporanGym" />
              </MenuItem>
            )}
            {user.akses.laporanKelas === true && (
              <MenuItem>
                Laporan Kelas <NavLink to="/laporanKelas" />
              </MenuItem>
            )}
            {user.akses.laporanInstruktur === true && (
              <MenuItem>
                Laporan Instruktur <NavLink to="/laporanInstruktur" />
              </MenuItem>
            )}
            {user.akses.laporanPendapatan === true && (
              <MenuItem>
                Laporan Pendapatan <NavLink to="/laporanPendapatan" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Utility"} icon={<FaUserCog />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Profil User <NavLink to="/profilUser" />
              </MenuItem>
            )}
            {user.akses.daftarUser === true && (
              <MenuItem>
                Daftar User <NavLink to="/daftarUser" />
              </MenuItem>
            )}
            {user.akses.aktivasi === true && (
              <MenuItem>
                Aktivasi <NavLink to="/aktivasi" />
              </MenuItem>
            )}
            {user.akses.deposit === true && (
              <MenuItem>
                Deposit <NavLink to="/deposit" />
              </MenuItem>
            )}
            {user.akses.depositKelas === true && (
              <MenuItem>
                Deposit Kelas <NavLink to="/depositKelas" />
              </MenuItem>
            )}
          </SubMenu>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>{user.username}</p>
        <div className="sidebar-btn-wrapper" style={{ paddingBottom: "10px" }}>
          <Link
            className="sidebar-btn"
            style={{ cursor: "pointer" }}
            to="/"
            onClick={logoutButtonHandler}
          >
            <span style={{ marginRight: "6px" }}>Logout</span>
            <FaSignOutAlt />
          </Link>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;
