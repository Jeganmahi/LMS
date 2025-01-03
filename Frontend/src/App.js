import logo from './logo.svg';
import './App.css';
import Sidebar from './SideBar';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AddCourse from './AddCourse';
import Admin from './Admin';
import Student from './Student';

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>Welcome to the Learning Management System</h1>
        {/* Your main content goes here */}
      </div>
    </div>
    <Router>
      <Routes>
        
        <Route exact path="/course" element={<AddCourse/>} />
        <Route exact path="/Admin" element={<Admin/>} />
        <Route exact path="/Student" element={<Student/>} />
        
      </Routes>
     
    </Router>
    </div>
  );
}

export default App;
