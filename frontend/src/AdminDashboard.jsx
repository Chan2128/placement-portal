import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";

function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("students");

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("placeTrackToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsRes, companiesRes, applicationsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/admin/students`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/admin/companies`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/admin/applications`, {
            headers: getAuthHeaders(),
          }),
        ]);

      const studentsData = await studentsRes.json();
      const companiesData = await companiesRes.json();
      const applicationsData = await applicationsRes.json();

      if (!studentsRes.ok)
        throw new Error(studentsData.message);
      if (!companiesRes.ok)
        throw new Error(companiesData.message);
      if (!applicationsRes.ok)
        throw new Error(applicationsData.message);

      setStudents(studentsData.students || []);
      setCompanies(companiesData.companies || []);
      setApplications(applicationsData.applications || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
useEffect(() => {
  fetchAll();
}, []);
/* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const handleAdminLogout = () => {
    localStorage.removeItem("placeTrackToken");
    localStorage.removeItem("placeTrackUser");

    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="companyDashboard">
      <div className="companyWelcome">
        <div>
          <p>ADMIN PORTAL</p>
          <h1>Placement Cell Dashboard 🛡️</h1>
          <span>
            View all students, companies, and applications.
          </span>
        </div>

        <button
          type="button"
          className="logoutButton"
          onClick={handleAdminLogout}
        >
          🚪 Logout
        </button>
      </div>

      <div className="companyStats">
        <div className="companyStatCard">
          <span>🎓</span>
          <strong>{students.length}</strong>
          <p>Students</p>
        </div>

        <div className="companyStatCard">
          <span>🏢</span>
          <strong>{companies.length}</strong>
          <p>Opportunities</p>
        </div>

        <div className="companyStatCard">
          <span>📩</span>
          <strong>{applications.length}</strong>
          <p>Applications</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <button
          type="button"
          className={
            tab === "students" ? "activeNav" : ""
          }
          onClick={() => setTab("students")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background:
              tab === "students" ? "#4f46e5" : "#eef0f6",
            color: tab === "students" ? "white" : "#555",
          }}
        >
          Students
        </button>

        <button
          type="button"
          onClick={() => setTab("companies")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background:
              tab === "companies" ? "#4f46e5" : "#eef0f6",
            color: tab === "companies" ? "white" : "#555",
          }}
        >
          Companies
        </button>

        <button
          type="button"
          onClick={() => setTab("applications")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background:
              tab === "applications"
                ? "#4f46e5"
                : "#eef0f6",
            color:
              tab === "applications" ? "white" : "#555",
          }}
        >
          Applications
        </button>
      </div>

      {error && <div className="authError">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {tab === "students" && (
            <table
              width="100%"
              cellPadding="10"
              style={{
                background: "white",
                borderRadius: "12px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.rollNo}</td>
                    <td>{s.email}</td>
                    <td>{s.branch}</td>
                    <td>{s.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "companies" && (
            <table
              width="100%"
              cellPadding="10"
              style={{
                background: "white",
                borderRadius: "12px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Min CGPA</th>
                  <th>Location</th>
                  <th>Posted By</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.role}</td>
                    <td>{c.package}</td>
                    <td>{c.cgpa}</td>
                    <td>{c.location}</td>
                    <td>{c.owner?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "applications" && (
            <table
              width="100%"
              cellPadding="10"
              style={{
                background: "white",
                borderRadius: "12px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a._id}>
                    <td>{a.studentName}</td>
                    <td>{a.rollNo}</td>
                    <td>{a.companyName}</td>
                    <td>{a.role}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;