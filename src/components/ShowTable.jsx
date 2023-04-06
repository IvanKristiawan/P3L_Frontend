import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

export function ShowTableUser({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Username
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tipe User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarUser/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.tipeUser}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJadwalInstruktur({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Dari
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Sampai
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tanggal
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Jml.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Jml. Max</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaKelas
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.dariJam.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.sampaiJam
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.jumlahMember == searchTerm ||
                val.jumlahMemberMax == searchTerm
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/jadwalInstruktur/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaKelas}
                </TableCell>
                <TableCell>{user.dariJam}</TableCell>
                <TableCell>{user.sampaiJam}</TableCell>
                <TableCell>{user.tanggal}</TableCell>
                <TableCell>{user.jumlahMember.toLocaleString()}</TableCell>
                <TableCell>{user.jumlahMemberMax.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJadwalGym({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Dari
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Sampai
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tanggal
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Jml.
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Jml. Max
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Libur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.dariJam.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.sampaiJam
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.jumlahMember == searchTerm ||
                val.jumlahMemberMax == searchTerm ||
                val.libur.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/jadwalGym/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.dariJam}
                </TableCell>
                <TableCell>{user.sampaiJam}</TableCell>
                <TableCell>{user.tanggal}</TableCell>
                <TableCell>{user.jumlahMember.toLocaleString()}</TableCell>
                <TableCell>{user.jumlahMemberMax.toLocaleString()}</TableCell>
                <TableCell>{user.libur}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
