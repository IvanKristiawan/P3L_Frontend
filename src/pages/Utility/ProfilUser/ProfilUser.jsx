import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const ProfilUser = () => {
  const reportTemplateRef = useRef(null);
  const { screenSize } = useStateContext();
  const [masaBerlaku, setMasaBerlaku] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [previewPdf, setPreviewPdf] = useState(false);

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("MemberCard");
      },
      html2canvas: { scale: 0.44 },
    });
  };

  useEffect(() => {
    getAktivasiById();
  }, []);

  const getAktivasiById = async () => {
    const response = await axios.post(`${tempUrl}/aktivasisByUser`, {
      userId: user.id,
      _id: user.id,
      token: user.token,
    });
    let newMasaAktif = new Date(response.data.masaAktif);
    let tempMasaAktif = `${newMasaAktif.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${(newMasaAktif.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${newMasaAktif.getFullYear()}`;
    setMasaBerlaku(tempMasaAktif);
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Profil User</h5>
      <Container className="d-flex justify-content-center">
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(`/profilUser/${user.id}/edit`);
            }}
          >
            Ubah Password
          </Button>
        </ButtonGroup>
      </Container>

      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        type="submit"
        style={{ marginTop: "20px" }}
        onClick={() => setPreviewPdf(!previewPdf)}
      >
        LIHAT
      </Button>

      {previewPdf && (
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleGeneratePdf}
          >
            CETAK
          </Button>
          <div ref={reportTemplateRef} id="content" style={pdfContainer}>
            <p>GoFit</p>
            <p>Jl. Centralpark No. 10 Yogyakarta</p>
            <h5>Member Card</h5>
            <p>Member ID : {user.noMember}</p>
            <p>Nama : {user.username}</p>
            <p>Alamat : {user.alamat}</p>
            <p>Telpon : {user.telepon}</p>
          </div>
        </div>
      )}

      <hr />
      <Container>
        <Form>
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
                  <Form.Control value={user.username} disabled readOnly />
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
                  <Form.Control value={user.alamat} disabled readOnly />
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
                  <Form.Control value={user.telepon} disabled readOnly />
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
                  <Form.Control value={user.tanggalLahir} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          {user.tipeUser === "INSTRUKTUR" && (
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Jml. Terlambat :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={user.jmlTerlambat} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          )}
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
                  <Form.Control value={user.tipeUser} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
          </Row>
          {user.tipeUser === "MEMBER" && (
            <>
              <Row>
                <Col sm={6}>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="3" style={textRight}>
                      Deposit :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control value={user.deposit} disabled readOnly />
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
                      Deposit Kelas :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control value={user.depositKelas} disabled readOnly />
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
                      Masa Berlaku :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control value={masaBerlaku} disabled readOnly />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Container>
    </Container>
  );
};

export default ProfilUser;

const pdfContainer = {
  padding: "10px",
  letterSpacing: "0.01px",
};
