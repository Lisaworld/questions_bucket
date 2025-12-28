import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Roulette from './components/Roulette';
import ManageQuestions from './components/ManageQuestions';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
      >
        🎰 뽑기
      </Link>
      <Link 
        to="/manage" 
        className={location.pathname === '/manage' ? 'nav-link active' : 'nav-link'}
      >
        📝 소재 관리
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Roulette />} />
          <Route path="/manage" element={<ManageQuestions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
