import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahUser = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");

  // Akses Master
  const [bookingGym, setBookingGym] = useState(false);
  const [bookingKelas, setBookingKelas] = useState(false);
  const [jadwalGym, setJadwalGym] = useState(false);
  const [kelas, setKelas] = useState(false);
  const [jadwalInstruktur, setJadwalInstruktur] = useState(false);
  const [izinInstruktur, setIzinInstruktur] = useState(false);

  // Akses Laporan
  const [laporanGym, setLaporanGym] = useState(false);
  const [laporanKelas, setLaporanKelas] = useState(false);
  const [laporanInstruktur, setLaporanInstruktur] = useState(false);
  const [laporanPendapatan, setLaporanPendapatan] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [aktivasi, setAktivasi] = useState(false);
  const [depositAkses, setDepositAkses] = useState(false);
  const [depositKelas, setDepositKelas] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlertUsername, setOpenAlertUsername] = useState(false);

  const handleClickOpenAlertUsername = () => {
    setOpenAlertUsername(true);
  };

  const handleCloseAlertUsername = () => {
    setOpenAlertUsername(false);
  };

  const tipeUserOption = ["MANAGER", "ADMIN", "INSTRUKTUR", "MEMBER"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token,
        });

        let isUsernameAlreadyExist = tempUsername.data.length > 0;
        if (isUsernameAlreadyExist) {
          handleClickOpenAlertUsername();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/auth/register`, {
            username,
            password,
            alamat,
            telepon,
            tanggalLahir,
            tipeUser,
            akses: {
              bookingGym,
              bookingKelas,
              jadwalGym,
              kelas,
              jadwalInstruktur,
              izinInstruktur,
              laporanGym,
              laporanKelas,
              laporanInstruktur,
              laporanPendapatan,
              profilUser,
              daftarUser,
              aktivasi,
              deposit: depositAkses,
              depositKelas,
            },
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate("/daftarUser");
        }
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah User</h5>
      <Dialog
        open={openAlertUsername}
        onClose={handleCloseAlertUsername}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertUsername}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveUser}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Alamat :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Telepon :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Tanggal Lahir :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={tanggalLahir}
                      onChange={(e) =>
                        setTanggalLahir(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Tipe User :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={tipeUser}
                      onChange={(e) => {
                        setTipeUser(e.target.value);
                      }}
                    >
                      {tipeUserOption.map((tipeUser) => (
                        <option value={tipeUser}>{tipeUser}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Password :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Master</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Booking Gym"
                      checked={bookingGym}
                      onChange={() => setBookingGym(!bookingGym)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Booking Kelas"
                      checked={bookingKelas}
                      onChange={() => setBookingKelas(!bookingKelas)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Jadwal Gym"
                      checked={jadwalGym}
                      onChange={() => setJadwalGym(!jadwalGym)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Kelas"
                      checked={kelas}
                      onChange={() => setKelas(!kelas)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Jadwal Instruktur"
                      checked={jadwalInstruktur}
                      onChange={() => setJadwalInstruktur(!jadwalInstruktur)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Izin Instruktur"
                      checked={izinInstruktur}
                      onChange={() => setIzinInstruktur(!izinInstruktur)}
                    />
                  </Form>
                  <p style={checkboxTitle}>Laporan</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Laporan Gym"
                      checked={laporanGym}
                      onChange={() => setLaporanGym(!laporanGym)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Laporan Kelas"
                      checked={laporanKelas}
                      onChange={() => setLaporanKelas(!laporanKelas)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Laporan Instruktur"
                      checked={laporanInstruktur}
                      onChange={() => setLaporanInstruktur(!laporanInstruktur)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Laporan Pendapatan"
                      checked={laporanPendapatan}
                      onChange={() => setLaporanPendapatan(!laporanPendapatan)}
                    />
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={secondCheckboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      checked={profilUser}
                      onChange={() => setProfilUser(!profilUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      checked={daftarUser}
                      onChange={() => setDaftarUser(!daftarUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Aktivasi"
                      checked={aktivasi}
                      onChange={() => setAktivasi(!aktivasi)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Deposit"
                      checked={depositAkses}
                      onChange={() => setDepositAkses(!depositAkses)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Deposit Kelas"
                      checked={depositKelas}
                      onChange={() => setDepositKelas(!depositKelas)}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/daftarUser")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default TambahUser;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw",
  },
};

const secondWrapper = {
  marginLeft: {
    sm: 4,
  },
  marginTop: {
    sm: 0,
    xs: 4,
  },
};

const checkboxTitle = {
  marginBottom: 0,
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0,
};
