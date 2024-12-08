import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [, setCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        formData
      );
      setCookie("accessToken", data.token, { path: "/" });
      setCookie("username", data.user.username, { path: "/" });
      navigate("/");
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401) setError("Invalid email or password.");
        else if (status === 404) setError("User not found.");
        else if (status === 500)
          setError("Server error. Please try again later.");
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
        <h4 className="mb-4">Login</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button className="btn btn-primary w-100">Login</button>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
