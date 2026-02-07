import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Watch from './pages/Watch';
import TV from './pages/TV';
import Movies from './pages/Movies';
import New from './pages/New';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </Router>
  );
}

export default App;
