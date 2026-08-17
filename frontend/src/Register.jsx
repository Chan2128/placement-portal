import { useState } from "react";
import "./Register.css";

function Register({ onRegisterSuccess, goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
    branch: "CST",
    cgpa: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            cgpa: Number(form.cgpa),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setMessage("Registration successful! 🎉");

      setForm({
        name: "",
        rollNo: "",
        email: "",
        password: "",
        branch: "CST",
        cgpa: "",
      });

      setTimeout(() => {
        // IMPORTANT:
        // Send the registered user data to App.jsx
        onRegisterSuccess(data.user);
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">

      <div className="authCard">

        <div className="authHeader">

          <div className="authLogo">
            🎓
          </div>

          <h1>
            Create Student Account
          </h1>

          <p>
            Register for the PlaceTrack placement portal.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <label>
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>
            Roll Number
          </label>

          <input
            type="text"
            name="rollNo"
            placeholder="Enter your roll number"
            value={form.rollNo}
            onChange={handleChange}
            required
          />

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          <div className="formRow">

            <div>

              <label>
                Branch
              </label>

              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
              >

                <option value="CST">
                  CST
                </option>

                <option value="CSE">
                  CSE
                </option>

                <option value="ECE">
                  ECE
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="EEE">
                  EEE
                </option>

                <option value="MECH">
                  MECH
                </option>

              </select>

            </div>

            <div>

              <label>
                CGPA
              </label>

              <input
                type="number"
                name="cgpa"
                placeholder="8.5"
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {error && (
            <div className="authError">
              {error}
            </div>
          )}

          {message && (
            <div className="authSuccess">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="authButton"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account →"}

          </button>

        </form>

        <div className="authFooter">

          Already have an account?

          <button
            type="button"
            onClick={goToLogin}
            className="authLink"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;