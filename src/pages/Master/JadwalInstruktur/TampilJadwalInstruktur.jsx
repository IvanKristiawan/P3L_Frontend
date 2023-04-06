import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableJadwalInstruktur } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination } from "@mui/material";

const TampilJadwalInstruktur = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [dariJam, setDariJam] = useState("");
  const [sampaiJam, setSampaiJam] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlahMember, setJumlahMember] = useState("");
  const [jumlahMemberMax, setJumlahMemberMax] = useState("");
  const [harga, setHarga] = useState("");
  const [userId, setUserId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [jadwalInstrukturs, setJadwalInstrukturs] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = jadwalInstrukturs.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.namaKelas.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.dariJam.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.sampaiJam.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jumlahMember == searchTerm ||
      val.jumlahMemberMax == searchTerm ||
      val.harga == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(jadwalInstrukturs, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getJadwalInstrukturs();
    id && getJadwalInstrukturById();
  }, [id]);

  const getJadwalInstrukturs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/jadwalInstrukturs`, {
        _id: user.id,
        token: user.token
      });
      setJadwalInstrukturs(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getJadwalInstrukturById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/jadwalInstrukturs/${id}`, {
        _id: user.id,
        token: user.token
      });
      setNamaKelas(response.data.namaKelas);
      setDariJam(response.data.dariJam);
      setSampaiJam(response.data.sampaiJam);
      let newTanggal = new Date(response.data.tanggal);
      let tempTanggal = `${newTanggal.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTanggal.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${newTanggal.getFullYear()}`;
      setTanggal(tempTanggal);
      setJumlahMember(response.data.jumlahMember);
      setJumlahMemberMax(response.data.jumlahMemberMax);
      setHarga(response.data.harga);
      setUserId(response.data.user.username);
    }
  };

  const deleteJadwalInstruktur = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteJadwalInstruktur/${id}`, {
        _id: user.id,
        token: user.token
      });
      getJadwalInstrukturs();
      setNamaKelas("");
      setDariJam("");
      setSampaiJam("");
      setTanggal("");
      setJumlahMember("");
      setJumlahMemberMax("");
      navigate("/jadwalInstruktur");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaKelas} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Jadwal Instruktur</h5>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/jadwalInstruktur/tambahJadwalInstruktur`}
          editLink={`/jadwalInstruktur/${id}/edit`}
          deleteUser={deleteJadwalInstruktur}
          nameUser={namaKelas}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Nama Kelas :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaKelas} disabled readOnly />
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
                    <Form.Control value={dariJam} disabled readOnly />
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
                    <Form.Control value={sampaiJam} disabled readOnly />
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
                    <Form.Control value={tanggal} disabled readOnly />
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
                    Jumlah Member :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={jumlahMember} disabled readOnly />
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
                    Jumlah Member Max :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={jumlahMemberMax} disabled readOnly />
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
                      value={harga.toLocaleString()}
                      disabled
                      readOnly
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
                    <Form.Control value={userId} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableJadwalInstruktur
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilJadwalInstruktur;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
