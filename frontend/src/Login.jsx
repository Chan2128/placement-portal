import { useState } from "react";
import "./Register.css";

function Login({
  onLoginSuccess,
  goToRegister,
  goToCompanyRegister,
}) {
  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
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

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");

    setForm({
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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
          data.message || "Login failed."
        );
      }

      // Check whether the selected login
      // matches the actual account role
      if (data.user.role !== role) {
        throw new Error(
          `This account is registered as ${data.user.role}, not ${role}.`
        );
      }

      // Save login token
      localStorage.setItem(
        "placeTrackToken",
        data.token
      );

      // Save logged-in user
      localStorage.setItem(
        "placeTrackUser",
        JSON.stringify(data.user)
      );

      // Send user to App.jsx
      onLoginSuccess(data.user);

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Failed to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const roleName =
    role === "student"
      ? "Student"
      : role === "company"
      ? "Company"
      : "Admin";

  const roleIcon =
    role === "student"
      ? "🎓"
      : role === "company"
      ? "🏢"
      : "🛡️";

  return (
    <div className="authPage">

      <div className="authCard">

        {/* HEADER */}

        <div className="authHeader">

          <div className="authLogo">
            {roleIcon}
          </div>

          <h1>
            {roleName} Login
          </h1>

          <p>
            Login to your PlaceTrack account.
          </p>

        </div>

        {/* ROLE SELECTOR */}

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "25px",
          }}
        >

          {/* STUDENT */}

          <button
            type="button"
            onClick={() =>
              handleRoleChange("student")
            }
            style={{
              flex: 1,
              padding: "14px 8px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",

              background:
                role === "student"
                  ? "#4f46e5"
                  : "#eef0f6",

              color:
                role === "student"
                  ? "white"
                  : "#555",
            }}
          >
            🎓 Student
          </button>

          {/* COMPANY */}

          <button
            type="button"
            onClick={() =>
              handleRoleChange("company")
            }
            style={{
              flex: 1,
              padding: "14px 8px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",

              background:
                role === "company"
                  ? "#4f46e5"
                  : "#eef0f6",

              color:
                role === "company"
                  ? "white"
                  : "#555",
            }}
          >
            🏢 Company
          </button>

          {/* ADMIN */}

          <button
            type="button"
            onClick={() =>
              handleRoleChange("admin")
            }
            style={{
              flex: 1,
              padding: "14px 8px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",

              background:
                role === "admin"
                  ? "#4f46e5"
                  : "#eef0f6",

              color:
                role === "admin"
                  ? "white"
                  : "#555",
            }}
          >
            🛡️ Admin
          </button>

        </div>

        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder={`Enter ${roleName.toLowerCase()} email`}
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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* ERROR */}

          {error && (
            <div className="authError">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="authButton"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : `Login as ${roleName} →`}
          </button>

        </form>

        {/* REGISTER OPTIONS */}

        <div className="authFooter">

          {role === "student" && (
            <>
              Don't have a student account?

              <button
                type="button"
                onClick={goToRegister}
                className="authLink"
              >
                Create Student Account
              </button>
            </>
          )}

          {role === "company" && (
            <>
              Don't have a company account?

              <button
                type="button"
                onClick={goToCompanyRegister}
                className="authLink"
              >
                Register Company
              </button>
            </>
          )}

          {role === "admin" && (
            <span>
              Admin accounts are created by the
              placement administrator.
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default Login;