import './EventTable.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../config';
import { useSelector } from 'react-redux';
import usePagination from './usePagination';
import Pagination from '@mui/material/Pagination';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const EventTable = ({ setCurrentEvent }) => {
  // get events
  const { currentUser } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get('/event/published');
      setEvents(res.data.filter((e) => e.host_id === currentUser._id));
      // setEvents(res.data);
    }
    fetchData();
  }, [currentUser?._id]);

  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const handleData = usePagination(events, PER_PAGE);
  const count = Math.ceil(events?.length / PER_PAGE);

  const handlePageChange = (e, p) => {
    setPage(p);
    handleData.jump(p);
    // window.scrollTo({ top: 0 });
  };

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell" align="center">
              Event Name
            </TableCell>
            <TableCell className="tableCell" align="center">
              Category
            </TableCell>
            <TableCell className="tableCell" align="center">
              Start
            </TableCell>
            <TableCell className="tableCell" align="center">
              End
            </TableCell>
            <TableCell className="tableCell" align="center">
              Reports
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {handleData.currentData().map((row) => (
            <TableRow key={row._id}>
              <TableCell className="tableCell" align="center">
                {row.title}
              </TableCell>
              <TableCell className="tableCell" align="center">
                {row.category}
              </TableCell>
              <TableCell className="tableCell" align="center">
                {format(new Date(row.start_dt), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="tableCell" align="center">
                {format(new Date(row.end_dt), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="tableCell" align="center">
                <Link style={{ textDecoration: null }}>
                  <span
                    id={row._id}
                    onClick={(e) => {
                      setCurrentEvent(e.target.id);
                    }}
                  >
                    View Reports
                  </span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={count} page={page} onChange={handlePageChange} shape="rounded" />
    </TableContainer>
  );
};

export default EventTable;
