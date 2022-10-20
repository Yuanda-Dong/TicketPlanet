import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EventList from "../EventList/EventList";
import usePagination from "./usePagination";
import Pagination from "@mui/material/Pagination";
import { axiosInstance } from "../../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Events = () => {
  const { currentUser } = useSelector((state) => state.user);
  // const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const [events2, setEvents2] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      let res = await axiosInstance.get("/event");
      setEvents2(res.data.filter((e) => e.host_id == currentUser._id));
      // console.log(events2);
    }
    fetchData();
  }, []);

  // const events2 = [10, 11, 12, 13, 14, 15,16,17];
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 7;
  const handleData2 = usePagination(events2, PER_PAGE);
  const count2 = Math.ceil(events2?.length / PER_PAGE);

  const handlePageChange = (e, p) => {
    setPage(p);
    handleData2.jump(p);
    // window.scrollTo({ top: 0 });
  };
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const yourCallback = () => {
  //   axiosInstance.get("/event").then((res) => console.log(res));
  // };

  // useEffect(yourCallback, []);

  return (
    <>
      <h1>Events</h1>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Published Events" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div>
            <div style={{ minHeight: "60vh" }}>
              {handleData2.currentData().map((e) => (
                <EventList key={e._id} eventInfo={e} />
              ))}
            </div>
            <Pagination
              count={count2}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
            />
          </div>
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Events;
