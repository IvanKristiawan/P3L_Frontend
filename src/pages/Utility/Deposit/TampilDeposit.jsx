import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDeposit } from "../../../components/ShowTable";
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

const TampilDeposit = () => {
  const reportTemplateRef = useRef(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noDeposit, setNoDeposit] = useState("");
  const [jumlahDeposit, setJumlahDeposit] = useState("");
  const [userId, setUserId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [sisaDeposit, setSisaDeposit] = useState("");
  const [deposit, setDeposit] = useState("");
  const [previewPdf, setPreviewPdf] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [deposits, setDeposits] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = deposits.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noDeposit.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jumlahDeposit.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.user.username.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(deposits, PER_PAGE);

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
        await doc.save("Deposit");
      },
      html2canvas: { scale: 0.5 },
    });
  };

  useEffect(() => {
    getDeposits();
    id && getDepositById();
  }, [id]);

  const getDeposits = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/deposits`, {
        _id: user.id,
        token: user.token,
      });
      setDeposits(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getDepositById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/deposits/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNoDeposit(response.data.noDeposit);
      setSisaDeposit(response.data.sisaDeposit);
      setJumlahDeposit(response.data.jumlahDeposit);
      setUserId(response.data.user.username);
      setMemberId(response.data.user.id);
      const findUser = await axios.post(
        `${tempUrl}/findUser/${response.data.user.id}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setDeposit(findUser.data.deposit);
    }
  };

  const deleteDeposit = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteDeposit/${id}`, {
        userId: memberId,
        _id: user.id,
        token: user.token,
      });
      getDeposits();
      setNoDeposit("");
      setJumlahDeposit("");
      navigate("/deposit");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${noDeposit} tidak bisa dihapus karena sudah ada data!`);
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
      <h5 style={{ fontWeight: 400 }}>Daftar Deposit</h5>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/deposit/tambahDeposit`}
          editLink={null}
          deleteUser={deleteDeposit}
          nameUser={noDeposit}
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
            <p>Deposit</p>
            <p>No Deposit: {noDeposit}</p>
            <p>Deposit: {jumlahDeposit.toLocaleString()}</p>
            <p>Sisa Deposit: {sisaDeposit.toLocaleString()}</p>
            <p>
              Total Deposit: {(jumlahDeposit + sisaDeposit).toLocaleString()}
            </p>
            <p>Member: {userId}</p>
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
                    No. Deposit :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={noDeposit} disabled readOnly />
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
                    Jml. Deposit :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={jumlahDeposit.toLocaleString()}
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
        <ShowTableDeposit currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilDeposit;

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
