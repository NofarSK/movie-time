import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/NavBar';
import SearchPage from './components/Search';
import MovieDetail from './components/MovieDetail';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
