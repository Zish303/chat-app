import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/user/signup", formData);
      setCookie("accessToken", data.token, { path: "/" });
      navigate("/");
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 409) setError("User already exists.");
        else if (status === 500) setError("Server error. Please try again later.");
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        className="p-4 bg-white shadow rounded w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <h4 className="mb-4">Signup</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
