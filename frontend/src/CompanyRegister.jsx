import { useState } from "react";
import "./Register.css";

const API_BASE_URL = "http://localhost:5000/api";

function CompanyRegister({
  goToLogin,
  onCompanyRegisterSuccess,
}) {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
  });

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

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/company-register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Company registration failed."
        );
      }

      alert(
        "Company registered successfully!"
      );

      if (onCompanyRegisterSuccess) {
        onCompanyRegisterSuccess(data.user);
      }
    } catch (err) {
      console.error(
        "Company registration error:",
        err
      );

      setError(
        err.message ||
          "Failed to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">

      <div className="authCard">

        <div className="authHeader">

          <div className="authLogo">
            🏢
          </div>

          <h1>
            Company Registration
          </h1>

          <p>
            Create your company account on
            PlaceTrack.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <label>
            Company Name
          </label>

          <input
            type="text"
            name="companyName"
            placeholder="Enter company name"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <label>
            Company Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter company email"
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
          />

          {error && (
            <div className="authError">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="authButton"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Company Account →"}
          </button>

        </form>

        <div className="authFooter">

          Already have a company account?

          <button
            type="button"
            onClick={goToLogin}
            className="authLink"
          >
            Login
          </button>

        </div>

        <div className="authFooter">

          🎓 Student?

          <button
            type="button"
            onClick={goToLogin}
            className="authLink"
          >
            Student Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default CompanyRegister;