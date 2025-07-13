import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./AuthStyles.css";


const Login = ({ setUser, setMessage, setError}) => {
  const [ formData, setFormData] = useState({
    email: " ",
    password: " ",
  });

  const [ errors, setErrors ] = useState({});
  const [islOading, setIsLoading] =useState(false);
  const navigate = useNavigate();

  const validators = () => {
    const newErros = {};

    if(!formData.email) {
      newErros.emnail = " Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErros.email = " Enter a valide email";
    }

    if(!formData.password) {
      newErros.password = " Password is required";
    } else if( formData.password.length < 5){
      newErros.password - "Password must be at least 5 characters"
    }

    setErrors(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validators()) return;

    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      const { token, user } = response.data;

      // Save token and user to localStorage
      localStorage.setItem("mockAuthToken", token);
      localStorage.setItem("mockUser", JSON.stringify(user));

      setUser(user);
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "An error occurred during login" });
      }
    } finally {
      setIsLoading(false);
    }

      const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );


  };
}

export default Login;