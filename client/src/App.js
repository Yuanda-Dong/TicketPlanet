import './App.css';
import Landing from './pages/Landing/Landing';
import SearchPage from './pages/SearchPage/SearchPage';
import SignInSide from './pages/Signin';
import SignUp from './pages/SignUp';
import EventDetail from './pages/EventDetail/EventDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Events from './components/Dashboard/Events';
import Reports from './components/Dashboard/Reports';
// import Payment from './pages/Payment/Payment';
// import Navbar from './components/Navbar/NavBar';
import Footer from './components/Footer/Footer';
import PostPage from './pages/PostPage/PostPage';
import FindPassword from './pages/FindPassword';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="signin" element={<SignInSide />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="find-password" element={<FindPassword />} />
          <Route path="account-setting" element={<Account />} />

          <Route path="event">
            <Route path=":id" element={<EventDetail />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          {/* <Route path="payment" element={<Payment />} />
           */}
          <Route path="post" element={<PostPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
