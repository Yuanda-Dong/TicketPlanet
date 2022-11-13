import './App.css';
import Landing from './pages/Landing/Landing';
import SearchPage from './pages/SearchPage/SearchPage';
import SignInSide from './pages/Signin';
import SignUp from './pages/SignUp';
import EventDetail from './pages/EventDetail/EventDetail';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import MyTickets from './pages/MyTickets/MyTickets';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Events from './components/Dashboard/Events';
import Reports from './components/Dashboard/Reports';
import Footer from './components/Footer/Footer';
import PostPage from './pages/PostPage/PostPage';
import EditPage from './pages/EditPage/EditPage';
import FindPassword from './pages/FindPassword';
import Account from './pages/Account';
import TicketPage from './pages/PostPage/TicketPage';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import NotFound from './pages/404';
import SeatCreationPage from './pages/PostPage/SeatCreationPage';
import TicketPrice from './components/Ticket/TicketPrice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/userSlice';
import { useEffect } from 'react';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    if (token) {
      const decodedJwt = parseJwt(token);

      if (decodedJwt.exp * 1000 < Date.now()) {
        dispatch(logout());
        window.location.replace('http://localhost:3000/signin');
      }
    }
  }, [window.location.href]);

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="signin" element={<SignInSide />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<FindPassword />} />
          <Route path="account-setting" element={<Account />} />
          <Route exact path="event">
            <Route path=":id" element={<EventDetail />} />
            <Route path="price/:id" element={<TicketPrice />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="post" element={<PostPage />} />
          <Route path="edit/:id/" element={<EditPage />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="/tickets/:id/" element={<TicketPage />} />
          <Route path="/tickets/seat_map" element={<SeatCreationPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
