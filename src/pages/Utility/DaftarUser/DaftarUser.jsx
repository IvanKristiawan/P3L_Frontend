import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableUser } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Pagination,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from "@mui/material";

const DaftarUser = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [grouping, setGrouping] = useState("SEMUA");

  // Akses Master
  const [bookingGym, setBookingGym] = useState(false);
  const [bookingKelas, setBookingKelas] = useState(false);
  const [jadwalGym, setJadwalGym] = useState(false);
  const [jadwalInstruktur, setJadwalInstruktur] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUser] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = users.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(users, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getUsers();
    id && getUserById();
  }, [id]);

  const handleChangeGrouping = (event) => {
    setGrouping(event.target.value);
    if (event.target.value === "SEMUA") {
      getUsers();
    } else if (event.target.value === "MANAGER") {
      getUsersManager();
    } else if (event.target.value === "ADMIN") {
      getUsersAdmin();
    } else if (event.target.value === "INSTRUKTUR") {
      getUsersInstruktur();
    } else if (event.target.value === "MEMBER") {
      getUsersMember();
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.post(`${tempUrl}/users`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getUsersManager = async () => {
    try {
      const response = await axios.post(`${tempUrl}/usersManager`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getUsersAdmin = async () => {
    try {
      const response = await axios.post(`${tempUrl}/usersAdmin`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getUsersInstruktur = async () => {
    try {
      const response = await axios.post(`${tempUrl}/usersInstruktur`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getUsersMember = async () => {
    try {
      const response = await axios.post(`${tempUrl}/usersMember`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getUserById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/findUser/${id}`, {
        _id: user.id,
        token: user.token
      });
      setUsername(response.data.username);
      setTipeUser(response.data.tipeUser);

      // Akses Master
      setBookingGym(response.data.akses.bookingGym);
      setBookingKelas(response.data.akses.bookingKelas);
      setJadwalGym(response.data.akses.jadwalGym);
      setJadwalInstruktur(response.data.akses.jadwalInstruktur);

      // Akses Utility
      setProfilUser(response.data.akses.profilUser);
      setDaftarUser(response.data.akses.daftarUser);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/users/deleteUser/${id}`, {
        tipeUser: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      getUsers();

      navigate("/daftarUser");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${username} tidak bisa dihapus karena sudah ada data!`);
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
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar User</h5>
      <Row>
        <FormControl sx={{ marginTop: 1 }}>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Tipe User
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            defaultValue="SEMUA"
            value={grouping}
            onChange={handleChangeGrouping}
          >
            <FormControlLabel value="SEMUA" control={<Radio />} label="Semua" />
            <FormControlLabel
              value="MANAGER"
              control={<Radio />}
              label="Manager"
            />
            <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
            <FormControlLabel
              value="INSTRUKTUR"
              control={<Radio />}
              label="Instruktur"
            />
            <FormControlLabel
              value="MEMBER"
              control={<Radio />}
              label="Member"
            />
          </RadioGroup>
        </FormControl>
      </Row>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/daftarUser/tambahUser`}
          editLink={`/daftarUser/${id}/edit`}
          deleteUser={deleteUser}
          nameUser={username}
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
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={username} disabled readOnly />
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
                    <Form.Control value={tipeUser} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          {user.tipeUser !== "ADMIN" && (
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Master</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Booking Gym"
                      disabled
                      checked={bookingGym}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Booking Kelas"
                      disabled
                      checked={bookingKelas}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Jadwal Gym"
                      disabled
                      checked={jadwalGym}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Jadwal Instruktur"
                      disabled
                      checked={jadwalInstruktur}
                    />
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={secondCheckboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      disabled
                      checked={profilUser}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      disabled
                      checked={daftarUser}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
          )}
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableUser currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default DaftarUser;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const showDataContainer = {
  mt: 2,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 2
  }
};

const checkboxTitle = {
  marginBottom: 0
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0
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
