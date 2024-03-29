import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableAktivasi } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, ButtonGroup, Button, Pagination } from "@mui/material";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const TampilAktivasi = () => {
  const reportTemplateRef = useRef(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeAktivasi, setKodeAktivasi] = useState("");
  const [masaAktif, setMasaAktif] = useState("");
  const [jumlahAktivasi, setJumlahAktivasi] = useState("");
  const [userId, setUserId] = useState("");
  const [usernama, setUsernama] = useState("");
  const [previewPdf, setPreviewPdf] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [aktivasis, setAktivasis] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = aktivasis.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeAktivasi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.masaAktif.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jumlahAktivasi == searchTerm ||
      val.user.noMember.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(aktivasis, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("Aktivasi");
      },
      html2canvas: { scale: 0.5 },
    });
  };

  useEffect(() => {
    getAktivasis();
    id && getAktivasiById();
  }, [id]);

  const getAktivasis = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/aktivasis`, {
        _id: user.id,
        token: user.token,
      });
      setAktivasis(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getAktivasiById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/aktivasis/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setKodeAktivasi(response.data.kodeAktivasi);
      let newTanggal = new Date(response.data.masaAktif);
      let tempTanggal = `${newTanggal.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${(newTanggal.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${newTanggal.getFullYear()}`;
      setMasaAktif(tempTanggal);
      setUserId(`${response.data.user.noMember}`);
      setUsernama(`${response.data.user.username}`);
      setJumlahAktivasi(response.data.jumlahAktivasi);
    }
  };

  const deleteAktivasi = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteAktivasi/${id}`, {
        _id: user.id,
        token: user.token,
      });
      getAktivasis();
      setKodeAktivasi("");
      setMasaAktif("");
      setJumlahAktivasi("");
      navigate("/aktivasi");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${kodeAktivasi} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Aktivasi</h5>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/aktivasi/tambahAktivasi`}
          editLink={null}
          deleteUser={deleteAktivasi}
          nameUser={kodeAktivasi}
        />
      </Box>
      {id && (
        <Box sx={downloadButtons}>
          <ButtonGroup variant="outlined" color="secondary">
            <Button
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => {
                setPreviewPdf(!previewPdf);
              }}
            >
              PDF
            </Button>
          </ButtonGroup>
        </Box>
      )}
      {previewPdf && (
        <>
          <div>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handleGeneratePdf}
            >
              CETAK
            </Button>
          </div>
          <div ref={reportTemplateRef} style={cetakContainer}>
            <p>GoFit</p>
            <p>Jl. Centralpark No. 10 Yogyakarta</p>
            <p>Aktivasi</p>
            <p>No Aktivasi: {kodeAktivasi}</p>
            <p>Masa Aktif: {masaAktif}</p>
            <p>Jml. Rp: {jumlahAktivasi.toLocaleString()}</p>
            <p>Member Id: {userId}</p>
            <p>Member: {usernama}</p>
            <p>Kasir: {user.username}</p>
          </div>
        </>
      )}
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
                    Kode Aktivasi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeAktivasi} disabled readOnly />
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
                    Masa Aktif :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={masaAktif} disabled readOnly />
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
                    Jumlah Aktivasi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={jumlahAktivasi} disabled readOnly />
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
                    User :
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
        <ShowTableAktivasi
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

export default TampilAktivasi;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const cetakContainer = {
  width: "300px",
  fontSize: "16px",
  letterSpacing: "0.01px",
};

const cetakCenter = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
};
