import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahDepositKelas = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noDeposit, setNoDeposit] = useState("");
  const [jumlahDeposit, setJumlahDeposit] = useState("");
  const [userId, setUserId] = useState("");
  const [jadwalInstrukturId, setJadwalInstrukturId] = useState("");

  const [jadwalInstruktur, setJadwalInstruktur] = useState([]);
  const [members, setMembers] = useState([]);
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
    getMembersData();
    getNextKodeDeposit();
    getBookingKelasData();
  }, []);

  const getBookingKelasData = async (kodeUnit) => {
    setJadwalInstrukturId("");
    const response = await axios.post(`${tempUrl}/jadwalInstruktursMasihAda`, {
      _id: user.id,
      token: user.token,
    });
    setJadwalInstruktur(response.data);
    setJadwalInstrukturId(response.data[0].id);
  };

  const getMembersData = async (kodeUnit) => {
    setUserId("");
    const response = await axios.post(`${tempUrl}/usersMember`, {
      _id: user.id,
      token: user.token,
    });
    setMembers(response.data);
    setUserId(response.data[0].id);
  };

  const getNextKodeDeposit = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/depositKelasNextKode`, {
      _id: user.id,
      token: user.token,
    });
    setNoDeposit(response.data);
  };

  const saveDeposit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveDepositKelas`, {
          jumlahDeposit,
          userId,
          jadwalInstrukturId,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate("/depositKelas");
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
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Deposit Kelas</h5>
      <hr />
      <Card>
        <Card.Header>Deposit</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveDeposit}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    No. Deposit :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={noDeposit}
                      onChange={(e) =>
                        setNoDeposit(e.target.value.toUpperCase())
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
                    Jumlah Deposit :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={jumlahDeposit}
                      onChange={(e) =>
                        setJumlahDeposit(e.target.value.toUpperCase())
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
                    Member :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                      }}
                    >
                      {members.map((instruktur, index) => (
                        <option value={instruktur.id}>
                          {instruktur.username}
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
                    Jml. Member Max :
                  </Form.Label>

                  <Col sm="9">
                    <Form.Select
                      required
                      value={jadwalInstrukturId}
                      onChange={(e) => {
                        setJadwalInstrukturId(e.target.value);
                      }}
                    >
                      {jadwalInstruktur.map((jadwalGym, index) => (
                        <option value={jadwalGym.id}>
                          {jadwalGym.namaKelas} | {jadwalGym.tanggal} |{" "}
                          {jadwalGym.dariJam}-{jadwalGym.sampaiJam}
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
                onClick={() => navigate("/depositKelas")}
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

export default TambahDepositKelas;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
