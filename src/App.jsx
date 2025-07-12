import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";

const App = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useSatet('');
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const checkAuth = async () => {

  const storedToken = localStorage.getItem('mockAuthToken');
  const storedUser = localStorage.getItemn('mockUser');

  if ( storedToken && storedUser){
    setUser(JSON.parse(storedUser));
    return; 
  }
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers : {
        Authorization : `Bearer  ${storedToken}`
      }
    });
    setUser(response.data)
  } catch(err) {
    console.log("Not authorized or session expired: ", err);
    setUser(null);
    localStorage.removeItem('mockAuthToken'); //clear invalid toekn
    localStorage.removeItem('mockUser'); // clear i nnvalid user
  }

  };

  // Check authentication status on app load
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const oauthToken = params.get('token');
  const oauthFirstName = params.get('firstname');
  const oauthLastName = params.get('lastname');
  const oauthEmail = params.get('email');
  const oauthProfilePictureUrl = params.get('profilepictureUrl');

  if (oauthToken && oauthFirstName && oauthLastName && oauthEmail) {
    const oauthUser = {
      firstname: oauthFirstName,
      lastname: oauthLastName,
      email: oauthEmail,
      profilePictureUrl: oauthProfilePictureUrl || 'https://via.placeholder.com/150/CCCCCC/000000?text=OAuth'
    };
    localStorage.setItem('mockAuthToken', oauthToken);
    localStorage.setItem('mockUser', JSON.stringify(oauthUser));
    setUser(oauthUser);
    setMessage('OAuth login successful!');
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate('/');
  } else {
    checkAuth();
  }
}, [navigate]);

const handleLogout = () => {
  // clear local storage 
  localStorage.removeItem('mockAuthToken');
  localStorage.removeItem('mockUser');
  setUser(null);
  setMessage('Logged out successfully');
  setError('');
  navigate('/login'); 
}

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <NavBar user={user} onLogout={handleLogout} />
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} setMessage={setMessage} setError={setError} />} />
          <Route path="/signup" element={<Signup setUser={setUser} setMessage={setMessage} setError={setError} />} />
          <Route exact path="/" element={<Home user={user} message={message} error={error} setMessage={setMessage} setError={setError} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
