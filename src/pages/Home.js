import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    }
}));

function Home() {

    const [workflow,setWorkFlow] = useState([]);

    useEffect(()=>{
        axios.get('https://64307b10d4518cfb0e50e555.mockapi.io/workflow ')
        .then((res)=>{
            setWorkFlow(res.data);
            console.log(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    if(workflow.length === 0)
    return <div>Loading...</div>


  return (
    <>
    <Navbar />
    <Box paddingTop={4} justifyContent={'center'} display={'flex'}>
        <Box minWidth={900}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 850 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Input Type</StyledTableCell>
            <StyledTableCell align="left">Created At</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workflow.map((module,index) => {
            const createdAt = module.createdAt.substring(0,10);
            return (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link to={`/workflow/${module.id}`}>{module.name}</Link>
              </TableCell>
              <TableCell align="center">{module.input_type}</TableCell>
              <TableCell align="left">{createdAt}</TableCell>
            </TableRow>
            )})}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Box>
    </>
  )
}

export default Home