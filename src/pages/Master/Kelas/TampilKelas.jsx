import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableKelas } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination } from "@mui/material";

const TampilKelas = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [hari, setHari] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [kelass, setKelass] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kelass.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.namaKelas.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.hari.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kelass, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKelass();
    id && getKelasById();
  }, [id]);

  const getKelass = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/kelas`, {
        _id: user.id,
        token: user.token,
      });
      setKelass(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getKelasById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/kelas/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaKelas(response.data.namaKelas);
      setHari(response.data.hari);
    }
  };

  const deleteKelas = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteKelas/${id}`, {
        _id: user.id,
        token: user.token,
      });
      getKelass();
      setNamaKelas("");
      setHari("");
      navigate("/kelas");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaKelas} tidak bisa dihapus karena sudah ada data!`);
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
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Kelas</h5>
      <hr />
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/kelas/tambahKelas`}
          editLink={`/kelas/${id}/edit`}
          deleteUser={deleteKelas}
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
                    Hari :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={hari} disabled readOnly />
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
        <ShowTableKelas currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilKelas;

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
