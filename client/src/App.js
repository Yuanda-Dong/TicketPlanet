import './App.css';
import Landing from './pages/Landing/Landing';
import SearchPage from './pages/SearchPage/SearchPage';
import SignInSide from './pages/Signin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
