import './index.css';
import Header from './components/Header';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="font-inter">
      <Header />
      <Home />
      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-sm">
        Sudoku Solver
      </footer>
    </div>
  );
}
