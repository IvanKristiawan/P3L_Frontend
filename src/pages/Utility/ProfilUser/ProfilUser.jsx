import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilUser = () => {
  const { screenSize } = useStateContext();
  const [masaBerlaku, setMasaBerlaku] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  useEffect(() => {
    getAktivasiById();
  }, []);

  const getAktivasiById = async () => {
    const response = await axios.post(`${tempUrl}/aktivasisByUser`, {
      userId: user.id,
      _id: user.id,
      token: user.token
    });
    let newMasaAktif = new Date(response.data.masaAktif);
    let tempMasaAktif = `${newMasaAktif.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newMasaAktif.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
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
