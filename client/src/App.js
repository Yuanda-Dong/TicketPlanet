import './App.css';
import Landing from './pages/Landing/Landing';
import SearchPage from './pages/SearchPage/SearchPage';
import SignInSide from './pages/Signin';
import SignUp from './pages/SignUp';
import EventDetail from './components/EventDetail/EventDetail';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Payment from "./pages/Payment/Payment";
// import Navbar from './components/Navbar/NavBar';

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
          <Route path="event">
            <Route path=":id" element={<EventDetail />}>
              <Route path="purchase" element={<Payment/>}/>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
