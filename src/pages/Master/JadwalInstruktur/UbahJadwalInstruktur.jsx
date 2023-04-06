import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";

const UbahJadwalInstruktur = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [dariJam, setDariJam] = useState("");
  const [sampaiJam, setSampaiJam] = useState("");
  const [inputTanggal, setInputTanggal] = useState(new Date());
  const [jumlahMemberMax, setJumlahMemberMax] = useState("");
  const [harga, setHarga] = useState("");
  const [userId, setUserId] = useState("");

  const [instrukturs, setInstrukturs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getInstruktursData();
    getJadwalInstrukturById();
  }, []);

  const getInstruktursData = async (kodeUnit) => {
    setUserId("");
    const response = await axios.post(`${tempUrl}/usersInstruktur`, {
      _id: user.id,
      token: user.token
    });
    setInstrukturs(response.data);
    setUserId(response.data[0].id);
  };

  const getJadwalInstrukturById = async () => {
    setLoading(true);
    const picked = await axios.post(`${tempUrl}/jadwalInstrukturs/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNamaKelas(picked.data.namaKelas);
    setInputTanggal(new Date(picked.data.tanggal));
    setDariJam(picked.data.dariJam);
    setSampaiJam(picked.data.sampaiJam);
    setJumlahMemberMax(picked.data.jumlahMemberMax);
    setHarga(picked.data.harga);
    setLoading(false);
  };

  const updateJadwalInstruktur = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateJadwalInstruktur/${id}`, {
          namaKelas,
          dariJam,
          sampaiJam,
          tanggal: inputTanggal,
          jumlahMemberMax,
          harga,
          userId,
          userIdUpdate: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate(`/jadwalInstruktur/${id}`);
      } catch (error) {
        alert(error);
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
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Jadwal Instruktur</h5>
      <hr />
      <Card>
        <Card.Header>Jadwal Instruktur</Card.Header>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={updateJadwalInstruktur}
          >
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaKelas}
                      onChange={(e) =>
                        setNamaKelas(e.target.value.toUpperCase())
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
                    Dari Jam :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={dariJam}
                      onChange={(e) => setDariJam(e.target.value.toUpperCase())}
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
                    Sampai Jam :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={sampaiJam}
                      onChange={(e) =>
                        setSampaiJam(e.target.value.toUpperCase())
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
                    Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={inputTanggal}
                      customInput={<Form.Control required />}
                      onChange={(date) => setInputTanggal(date)}
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
                    Jml. Member Max :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={jumlahMemberMax}
                      onChange={(e) =>
                        setJumlahMemberMax(e.target.value.toUpperCase())
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
                    Harga :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={harga}
                      onChange={(e) => setHarga(e.target.value.toUpperCase())}
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
                    Instruktur :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                      }}
                    >
                      {instrukturs.map((instruktur, index) => (
                        <option value={instruktur.id}>
                          {instruktur.username}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/jadwalInstruktur/${id}`)}
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

export default UbahJadwalInstruktur;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
