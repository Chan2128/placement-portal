import { useState } from "react";

const API_BASE_URL = "https://placement-portal-0xsf.onrender.com/api";

function CompanyDashboard({
  opportunities = [],
  setOpportunities,
  onLogout,
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    package: "",
    cgpa: "",
    branches: "",
    location: "",
    type: "",
  });

  // ========================================
  // AUTH HEADER
  // ========================================

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("placeTrackToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      package: "",
      cgpa: "",
      branches: "",
      location: "",
      type: "",
    });
  };

  // ========================================
  // CREATE OPPORTUNITY
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const token =
        localStorage.getItem("placeTrackToken");

      if (!token) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/companies`,
        {
          method: "POST",
          headers: getAuthHeaders(),

          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            package: formData.package,
            cgpa: Number(formData.cgpa),

            branches: formData.branches
              .split(",")
              .map((branch) => branch.trim())
              .filter(
                (branch) => branch !== ""
              ),

            location: formData.location,
            type: formData.type,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create opportunity."
        );
      }

      setOpportunities((previous) => [
        ...previous,
        data,
      ]);

      alert(
        "Opportunity created successfully! 🎉"
      );

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(
        "Opportunity creation error:",
        error
      );

      alert(
        error.message ||
          "Failed to create opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // DELETE OPPORTUNITY
  // ========================================

  const handleDelete = async (opportunityId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this opportunity?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(opportunityId);

      const token =
        localStorage.getItem("placeTrackToken");

      if (!token) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/companies/${opportunityId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete opportunity."
        );
      }

      setOpportunities((previous) =>
        previous.filter(
          (opportunity) =>
            opportunity._id !== opportunityId
        )
      );

      alert(
        "Opportunity removed successfully."
      );
    } catch (error) {
      console.error(
        "Delete opportunity error:",
        error
      );

      alert(
        error.message ||
          "Failed to remove opportunity."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleCompanyLogout = () => {
    localStorage.removeItem("placeTrackToken");
    localStorage.removeItem("placeTrackUser");

    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="companyDashboard">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="companyWelcome">

        <div>
          <p>COMPANY PORTAL</p>

          <h1>
            Company Dashboard 🏢
          </h1>

          <span>
            Manage your placement opportunities
            and connect with eligible students.
          </span>
        </div>

        <button
          type="button"
          className="logoutButton"
          onClick={handleCompanyLogout}
        >
          🚪 Logout
        </button>

      </div>

      {/* ====================================
          STATS
      ==================================== */}

      <div className="companyStats">

        <div className="companyStatCard">
          <span>📢</span>

          <strong>
            {opportunities.length}
          </strong>

          <p>
            Active Opportunities
          </p>
        </div>

        <div className="companyStatCard">
          <span>👨‍🎓</span>

          <strong>0</strong>

          <p>
            Total Applicants
          </p>
        </div>

        <div className="companyStatCard">
          <span>⭐</span>

          <strong>0</strong>

          <p>
            Shortlisted
          </p>
        </div>

      </div>

      {/* ====================================
          SECTION HEADER
      ==================================== */}

      <div className="companySection">

        <div>
          <h2>
            Placement Opportunities
          </h2>

          <p>
            Create and manage opportunities
            for eligible students.
          </p>
        </div>

        <button
          type="button"
          className="addOpportunityButton"
          onClick={() =>
            setShowForm(
              (previous) => !previous
            )
          }
        >
          {showForm
            ? "✕ Close"
            : "+ Add Opportunity"}
        </button>

      </div>

      {/* ====================================
          FORM
      ==================================== */}

      {showForm && (

        <form
          className="opportunityForm"
          onSubmit={handleSubmit}
        >

          <h2>
            Add Placement Opportunity
          </h2>

          <p>
            Enter the details students will
            see on the placement portal.
          </p>

          <div className="formGrid">

            <div className="formGroup">
              <label>
                Company Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. TCS"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label>
                Job Role
              </label>

              <input
                type="text"
                name="role"
                placeholder="e.g. Software Developer"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label>
                Package
              </label>

              <input
                type="text"
                name="package"
                placeholder="e.g. 6 LPA"
                value={formData.package}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label>
                Minimum CGPA
              </label>

              <input
                type="number"
                name="cgpa"
                placeholder="e.g. 7.5"
                min="0"
                max="10"
                step="0.1"
                value={formData.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label>
                Eligible Branches
              </label>

              <input
                type="text"
                name="branches"
                placeholder="e.g. CST, CSE, ECE"
                value={formData.branches}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Hyderabad"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup fullWidth">

              <label>
                Opportunity Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select type
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Internship + Full Time">
                  Internship + Full Time
                </option>

              </select>

            </div>

          </div>

          <div className="formActions">

            <button
              type="button"
              className="cancelOpportunityButton"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="saveOpportunityButton"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Opportunity"}
            </button>

          </div>

        </form>
      )}

      {/* ====================================
          OPPORTUNITY LIST
      ==================================== */}

      {!showForm && (

        <>
          {opportunities.length === 0 ? (

            <div className="companyEmpty">

              <div>
                📋
              </div>

              <h3>
                No opportunities yet
              </h3>

              <p>
                Click "Add Opportunity" to create
                your first placement opportunity.
              </p>

            </div>

          ) : (

            <div className="companyOpportunityGrid">

              {opportunities.map(
                (opportunity) => (

                  <div
                    className="companyOpportunityCard"
                    key={opportunity._id}
                  >

                    <div className="opportunityTop">

                      <div className="companyIcon">
                        🏢
                      </div>

                      <div>
                        <h3>
                          {opportunity.name}
                        </h3>

                        <p>
                          {opportunity.role}
                        </p>
                      </div>

                    </div>

                    <div className="opportunityDetails">

                      <span>
                        💰{" "}
                        {opportunity.package}
                      </span>

                      <span>
                        🎓 CGPA{" "}
                        {opportunity.cgpa}+
                      </span>

                      <span>
                        📍{" "}
                        {opportunity.location}
                      </span>

                      <span>
                        💼{" "}
                        {opportunity.type}
                      </span>

                    </div>

                    <div className="branchTags">

                      {Array.isArray(
                        opportunity.branches
                      ) &&
                        opportunity.branches.map(
                          (branch) => (
                            <span key={branch}>
                              {branch}
                            </span>
                          )
                        )}

                    </div>

                    <button
                      type="button"
                      className="deleteOpportunityButton"
                      onClick={() =>
                        handleDelete(
                          opportunity._id
                        )
                      }
                      disabled={
                        deletingId ===
                        opportunity._id
                      }
                    >
                      {deletingId ===
                      opportunity._id
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>

                )
              )}

            </div>

          )}
        </>

      )}

    </div>
  );
}

export default CompanyDashboard;