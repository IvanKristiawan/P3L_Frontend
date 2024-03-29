import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Box, Button } from "@mui/material";
import { Container, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const LaporanInstruktur = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const reportTemplateRef = useRef(null);
  let nowDate = new Date();
  let [dariTanggal, setDariTanggal] = useState(new Date());
  let [sampaiTanggal, setSampaiTanggal] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [lapInstruktursData, setLapInstruktursData] = useState([]);
  const [previewPdf, setPreviewPdf] = useState(false);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px"
    });
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("LaporanInstruktur");
      },
      html2canvas: { scale: 0.44 }
    });
  };

  const tampilPdf = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      let lapInstrukturs = await axios.post(`${tempUrl}/laporanInstruktur`, {
        dariTanggal,
        sampaiTanggal,
        _id: user.id,
        token: user.token
      });
      setLapInstruktursData(lapInstrukturs.data);
      setPreviewPdf(!previewPdf);
    }
  };

  const tableText = {
    letterSpacing: "0.01px"
  };

  const textTableRight = {
    letterSpacing: "0.01px",
    textAlign: "right"
  };

  const list = [];

  let keys = Object.keys(lapInstruktursData);

  for (let i = 0; i < lapInstruktursData.length; i++) {
    list.push(
      <tr style={tableText}>
        <td style={{ fontWeight: 700 }}>
          {lapInstruktursData[keys[i]].username}
        </td>
        <td style={textTableRight}>
          {lapInstruktursData[keys[i]].jmlTerlambat.toLocaleString()}
        </td>
        <td style={textTableRight}>
          {lapInstruktursData[keys[i]].jmlLibur.toLocaleString()}
        </td>
        <td style={textTableRight}>
          {lapInstruktursData[keys[i]].waktuTerlambat.toLocaleString()}
        </td>
      </tr>
    );
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Laporan</h3>
      <h5 style={{ fontWeight: 400 }}>Laporan Instruktur</h5>
      <hr />
      <Box sx={spacingTop}>
        <Form onSubmit={tampilPdf}>
          <Row>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="4" style={textRight}>
                  Dari :
                </Form.Label>
                <Col sm="8">
                  <DatePicker
                    required
                    dateFormat="dd/MM/yyyy"
                    selected={dariTanggal}
                    customInput={<Form.Control required />}
                    onChange={(date) => {
                      setDariTanggal(date);
                      setPreviewPdf(false);
                    }}
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
                <Form.Label column sm="4" style={textRight}>
                  Sampai :
                </Form.Label>
                <Col sm="8">
                  <DatePicker
                    required
                    dateFormat="dd/MM/yyyy"
                    selected={sampaiTanggal}
                    customInput={<Form.Control required />}
                    onChange={(date) => {
                      setSampaiTanggal(date);
                      setPreviewPdf(false);
                    }}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            type="submit"
            style={{ marginTop: "20px" }}
          >
            LIHAT
          </Button>
        </Form>
      </Box>

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
            <p>
              Dicetak Tanggal:
              {` ${nowDate.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${(nowDate.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${nowDate.getFullYear()} `}{" "}
              | Jam:{" "}
              {` ${nowDate.getHours().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${(nowDate.getMinutes() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${nowDate.getSeconds()} `}
            </p>
            <h5 style={{ textAlign: "center", fontWeight: "700" }}>
              Laporan Kinerja Instruktur
            </h5>
            <p>
              Dari Tanggal :
              {` ${dariTanggal.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${(dariTanggal.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${dariTanggal.getFullYear()}`}
            </p>
            <p>
              Sampai Tanggal :
              {` ${sampaiTanggal.getDate().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${(sampaiTanggal.getMonth() + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}-${sampaiTanggal.getFullYear()}`}
            </p>
            <p></p>
            <table style={{ width: "1000px" }}>
              <tbody>
                <tr>
                  <th style={tableTitle}>Nama</th>
                  <th style={tableTitle}>Jml. Hadir</th>
                  <th style={tableTitle}>Jml. Libur</th>
                  <th style={tableTitle}>Waktu Terlambat (detik)</th>
                </tr>
                {list}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LaporanInstruktur;

const spacingTop = {
  mt: 4
};

const pdfContainer = {
  padding: "10px",
  letterSpacing: "0.01px"
};

const tableTitle = {
  border: "1px solid black",
  padding: "10px"
};
