import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaveIcon from "@mui/icons-material/Save";

const TambahJadwalInstruktur = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [dariJam, setDariJam] = useState("");
  const [sampaiJam, setSampaiJam] = useState("");
  const [tanggal, setTanggal] = useState(new Date());
  const [jumlahMemberMax, setJumlahMemberMax] = useState("");
  const [harga, setHarga] = useState("");
  const [userId, setUserId] = useState("");

  const [kelas, setKelas] = useState([]);
  const [instrukturs, setInstrukturs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getInstruktursData();
    getKelasData();
  }, []);

  const getKelasData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/kelas`, {
      _id: user.id,
      token: user.token,
    });
    setKelas(response.data);
    setKelasId(`${response.data[0].id} - ${response.data[0].namaKelas}`);
  };

  const getInstruktursData = async (kodeUnit) => {
    setUserId("");
    const response = await axios.post(`${tempUrl}/usersInstruktur`, {
      _id: user.id,
      token: user.token,
    });
    setInstrukturs(response.data);
    setUserId(response.data[0].id);
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const saveJadwalInstruktur = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        // await axios.post(`${tempUrl}/saveJadwalInstruktur`, {
        //   kelasId: kelasId.split(" ", 1)[0],
        //   namaKelas: kelasId.split("- ", 2)[1],
        //   dariJam,
        //   sampaiJam,
        //   tanggal,
        //   jumlahMemberMax,
        //   harga,
        //   userId,
        //   _id: user.id,
        //   token: user.token,
        // });

        alert(kelasId.split("- ", 2)[1]);
        let tempDate = tanggal;
        for (let i = 0; i < 7; i++) {
          await axios.post(`${tempUrl}/saveJadwalInstruktur`, {
            kelasId: kelasId.split(" ", 1)[0],
            namaKelas: kelasId.split("- ", 2)[1],
            dariJam,
            sampaiJam,
            tanggal: tempDate,
            jumlahMemberMax,
            harga,
            userId,
            _id: user.id,
            token: user.token,
          });
          tempDate = addDays(tempDate, 1);
        }

        setLoading(false);
        navigate("/jadwalInstruktur");
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
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Jadwal Instruktur</h5>
      <hr />
      <Card>
        <Card.Header>Jadwal Instruktur</Card.Header>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveJadwalInstruktur}
          >
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Kelas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={userId}
                      onChange={(e) => {
                        setKelasId(e.target.value);
                      }}
                    >
                      {kelas.map((kel, index) => (
                        <option value={`${kel.id} - ${kel.namaKelas}`}>
                          {kel.namaKelas}
                        </option>
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
                      selected={tanggal}
                      customInput={<Form.Control required />}
                      onChange={(date) => setTanggal(date)}
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
                onClick={() => navigate("/jadwalInstruktur")}
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

export default TambahJadwalInstruktur;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
