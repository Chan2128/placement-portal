import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Register from "./Register";
import Login from "./Login";
import ResumeUpload from "./ResumeUpload";
import CompanyDashboard from "./CompanyDashboard";
import CompanyRegister from "./CompanyRegister";

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  // ========================================
  // AUTH + PAGE
  // ========================================

  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("Dashboard");

  // ========================================
  // DATA
  // ========================================

  const [companies, setCompanies] = useState([]);
const [applications, setApplications] = useState([]);
const [companyOpportunities, setCompanyOpportunities] =
  useState([]);

  

  // ========================================
  // SEARCH + UI
  // ========================================

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("All");

  const [showProfile, setShowProfile] =
    useState(false);

  // ========================================
  // LOADING
  // ========================================

  const [loadingCompanies, setLoadingCompanies] =
    useState(false);

  const [loadingApplications, setLoadingApplications] =
    useState(false);

  const [applyingCompanyId, setApplyingCompanyId] =
    useState(null);

  // ========================================
  // RESUME
  // ========================================

  const [resume, setResume] = useState(null);

  // ========================================
  // ERROR
  // ========================================

  const [error, setError] = useState("");

  // ========================================
  // STUDENT
  // ========================================

  const [student, setStudent] = useState({
    name: "Student",
    rollNo: "24A81A0000",
    branch: "CST",
    cgpa: 8.5,
    role: "student",
  });

  // ========================================
  // GET TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem(
      "placeTrackToken"
    );
  };

  // ========================================
  // AUTH HEADERS
  // ========================================

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ========================================
  // LOGIN / REGISTER SUCCESS
  // ========================================
const handleAuthSuccess = async (user) => {
  if (user) {
    setStudent({
      name: user.name || "Student",
      rollNo: user.rollNo || "24A81A0000",
      branch: user.branch || "CST",
      cgpa:
        typeof user.cgpa === "number"
          ? user.cgpa
          : Number(user.cgpa) || 0,
      role: user.role || "student",
    });

    // ========================================
    // COMPANY LOGIN
    // ========================================

    if (user.role === "company") {
      try {
        const token =
          localStorage.getItem(
            "placeTrackToken"
          );

        const response = await fetch(
          `${API_BASE_URL}/companies/my-opportunities`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load opportunities."
          );
        }

        setCompanyOpportunities(
          data.opportunities || []
        );
      } catch (error) {
        console.error(
          "Company opportunities error:",
          error
        );

        setCompanyOpportunities([]);
      }
    }
  }

  setAuthPage("dashboard");
};

  // ========================================
  // COMPANY REGISTER SUCCESS
  // ========================================

  const handleCompanyRegisterSuccess = () => {
    setAuthPage("login");
  };
  // ========================================
// LOGOUT
// ========================================

const handleLogout = () => {
  localStorage.removeItem("placeTrackToken");

  setStudent({
    name: "Student",
    rollNo: "24A81A0000",
    branch: "CST",
    cgpa: 8.5,
    role: "student",
  });

  setCompanies([]);
  setApplications([]);
  setResume(null);
  setShowProfile(false);
  setError("");
  setPage("Dashboard");

  // Go back to common login page
  setAuthPage("login");
};

  // ========================================
  // FETCH COMPANIES
  // ========================================

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/companies`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch companies."
        );
      }

      const companyList =
        Array.isArray(data)
          ? data
          : data.companies || [];

      setCompanies(companyList);
    } catch (err) {
      console.error(
        "Companies error:",
        err
      );

      setError(
        err.message ||
          "Could not connect to the backend."
      );
    } finally {
      setLoadingCompanies(false);
    }
  };

  // ========================================
  // FETCH MY APPLICATIONS
  // ========================================

  const fetchApplications = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setLoadingApplications(true);

      const response = await fetch(
        `${API_BASE_URL}/applications/my-applications`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not retrieve applications."
        );
      }

      setApplications(
        data.applications || []
      );
    } catch (err) {
      console.error(
        "Applications error:",
        err
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  // ========================================
  // FETCH MY RESUME
  // ========================================

  const fetchResume = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/resume/my-resume`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 404) {
        setResume(null);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not retrieve resume."
        );
      }

      setResume(
        data.resume || null
      );
    } catch (err) {
      console.error(
        "Resume error:",
        err
      );

      setResume(null);
    }
  };

 

// ========================================
// LOAD DATA AFTER LOGIN
// ========================================

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

useEffect(() => {
  if (authPage === "dashboard") {
    fetchCompanies();
    fetchApplications();
    fetchResume();
  }
}, [authPage]);

/* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // ========================================
  // ELIGIBILITY
  // ========================================

  const isEligible = (company) => {
    if (!company) {
      return false;
    }

    const eligibleByCGPA =
      Number(student.cgpa) >=
      Number(company.cgpa);

    const eligibleByBranch =
      Array.isArray(company.branches) &&
      company.branches.includes(
        student.branch
      );

    return (
      eligibleByCGPA &&
      eligibleByBranch
    );
  };

  // ========================================
  // LOCATIONS
  // ========================================

  const locations = useMemo(() => {
    return [
      "All",
      ...new Set(
        companies.map(
          (company) =>
            company.location
        )
      ),
    ];
  }, [companies]);

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredCompanies =
    companies.filter((company) => {
      const searchText =
        search.toLowerCase();

      const companyName =
        company.name?.toLowerCase() || "";

      const companyRole =
        company.role?.toLowerCase() || "";

      const matchesSearch =
        companyName.includes(searchText) ||
        companyRole.includes(searchText);

      const matchesLocation =
        locationFilter === "All" ||
        company.location ===
          locationFilter;

      return (
        matchesSearch &&
        matchesLocation
      );
    });

  // ========================================
  // ELIGIBLE COUNT
  // ========================================

  const eligibleCount =
    companies.filter(isEligible).length;

  // ========================================
  // APPLY TO COMPANY
  // ========================================

  const apply = async (company) => {
    if (!company || !company._id) {
      alert(
        "Company information is missing."
      );
      return;
    }

    if (!isEligible(company)) {
      alert(
        `You are not eligible for ${company.name}.\nRequired CGPA: ${company.cgpa}`
      );
      return;
    }

    const alreadyApplied =
      applications.some(
        (application) =>
          application.company?._id ===
            company._id ||
          application.company ===
            company._id ||
          application.companyName ===
            company.name
      );

    if (alreadyApplied) {
      alert(
        "You have already applied to this company."
      );
      return;
    }

    if (
      !resume ||
      !resume.fileName
    ) {
      alert(
        "Please upload your resume before applying."
      );

      setPage("Profile");

      return;
    }

    const token = getToken();

    if (!token) {
      alert("Please login again.");

      setAuthPage("login");

      return;
    }

    try {
      setApplyingCompanyId(
        company._id
      );

      const response = await fetch(
        `${API_BASE_URL}/applications/apply`,
        {
          method: "POST",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            companyId: company._id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not submit application."
        );
      }

      alert(
        data.message ||
          `Application submitted successfully to ${company.name}!`
      );

      await fetchApplications();

    } catch (err) {
      console.error(
        "Application error:",
        err
      );

      alert(
        err.message ||
          "Could not submit application."
      );

    } finally {
      setApplyingCompanyId(null);
    }
  };

  // ========================================
  // RESUME UPDATED
  // ========================================

  const handleResumeChange = (
    updatedResume
  ) => {
    setResume(
      updatedResume || null
    );
  };

  // ========================================
  // AUTH PAGES
  // ========================================

  if (authPage === "register") {
    return (
      <Register
        onRegisterSuccess={
          handleAuthSuccess
        }
        goToLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }

  if (authPage === "login") {
    return (
      <Login
        onLoginSuccess={
          handleAuthSuccess
        }
        goToRegister={() =>
          setAuthPage("register")
        }
        goToCompanyRegister={() =>
  setAuthPage("companyRegister")
}
      />
    );
  }

  if (authPage === "companyRegister") {
    return (
      <CompanyRegister
        onCompanyRegisterSuccess={
          handleCompanyRegisterSuccess
        }
        goToLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }

  // ========================================
  // MAIN APPLICATION
  // ========================================
if (student.role === "company") {
  return (
    <CompanyDashboard
      opportunities={companyOpportunities}
      setOpportunities={setCompanyOpportunities}
      onLogout={handleLogout}
    />
  );
}
  return (
    <div className="app">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="sidebar">

        <div>
          <h2>🎓 PlaceTrack</h2>

          <p className="subtitle">
            Smart Placement Portal
          </p>
        </div>

        <nav>

          <button
            className={
              page === "Dashboard"
                ? "activeNav"
                : ""
            }
            onClick={() =>
              setPage("Dashboard")
            }
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            className={
              page === "Companies"
                ? "activeNav"
                : ""
            }
            onClick={() =>
              setPage("Companies")
            }
          >
            🏢 <span>Companies</span>
          </button>

          <button
            className={
              page === "Applications"
                ? "activeNav"
                : ""
            }
            onClick={() =>
              setPage("Applications")
            }
          >
            📩 <span>My Applications</span>
          </button>

          <button
            className={
              page === "Profile"
                ? "activeNav"
                : ""
            }
            onClick={() =>
              setPage("Profile")
            }
          >
            👤 <span>My Profile</span>
          </button>

        </nav>

       <div className="sidebarBottom">

  <div className="seasonBadge">
    <span>●</span>
    2026 Placement Drive
  </div>

  <small>
    College Placement Cell
  </small>

  <button
    className="logoutButton"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>

</div>

      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="main">

        {/* ========================================
            HEADER
        ======================================== */}

        <header>

          <div>

            <p className="smallTitle">
              PLACEMENT MANAGEMENT SYSTEM
            </p>

            <h1>
              {page === "Dashboard"
                ? `Welcome back, ${student.name} 👋`
                : page}
            </h1>

          </div>

          <button
            className="student"
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
          >

            <span className="avatar">
              {student.name
                .charAt(0)
                .toUpperCase()}
            </span>

            <span>

              <strong>
                {student.name}
              </strong>

              <small>
                {student.branch} • CGPA{" "}
                {student.cgpa}
              </small>

            </span>

            <span>⌄</span>

          </button>

          {showProfile && (
            <div className="profileDropdown">

              <strong>
                {student.name}
              </strong>

              <span>
                {student.rollNo}
              </span>

              <span>
                {student.branch} • CGPA{" "}
                {student.cgpa}
              </span>

              <span>
                {resume
                  ? "✅ Resume uploaded"
                  : "⚠️ Resume not uploaded"}
              </span>

            </div>
          )}

        </header>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="authError">
            {error}
          </div>
        )}

        {/* ========================================
            DASHBOARD
        ======================================== */}

        {page === "Dashboard" && (
          <>

            <section className="hero">

              <div className="heroText">

                <span className="heroBadge">
                  ✨ 2026 Placement Season
                </span>

                <h2>
                  Build your career.
                  <br />

                  <span>
                    Find your opportunity.
                  </span>
                </h2>

                <p>
                  Discover companies, check
                  eligibility, apply for
                  opportunities and track your
                  placement journey — all in one
                  place.
                </p>

                <button
                  className="explore"
                  onClick={() =>
                    setPage("Companies")
                  }
                >
                  Explore Opportunities →
                </button>

              </div>

              <div className="heroVisual">

                <div className="floatingCard cardOne">

                  🎯

                  <strong>
                    {eligibleCount}
                  </strong>

                  <small>
                    Eligible
                  </small>

                </div>

                <div className="rocket">
                  🚀
                </div>

                <div className="floatingCard cardTwo">

                  📩

                  <strong>
                    {applications.length}
                  </strong>

                  <small>
                    Applied
                  </small>

                </div>

              </div>

            </section>

            <section className="stats">

              <Stat
                icon="🏢"
                number={
                  loadingCompanies
                    ? "..."
                    : companies.length
                }
                label="Companies"
              />

              <Stat
                icon="📩"
                number={
                  loadingApplications
                    ? "..."
                    : applications.length
                }
                label="Applications"
              />

              <Stat
                icon="🎯"
                number={
                  eligibleCount
                }
                label="Eligible for You"
              />

              <Stat
                icon="⭐"
                number={
                  student.cgpa
                }
                label="Your CGPA"
              />

            </section>

            <div className="sectionHeader">

              <div>

                <h2>
                  Latest Opportunities
                </h2>

                <p>
                  Explore companies currently
                  participating in placements.
                </p>

              </div>

              <button
                className="viewAll"
                onClick={() =>
                  setPage("Companies")
                }
              >
                View All →
              </button>

            </div>

            <div className="cards">

              {loadingCompanies ? (

                <div className="emptyState">

                  <div>⏳</div>

                  <h3>
                    Loading companies...
                  </h3>

                </div>

              ) : companies.length > 0 ? (

                companies
                  .slice(0, 4)
                  .map((company) => (
                    <CompanyCard
                      key={
                        company._id ||
                        company.name
                      }
                      company={company}
                      eligible={
                        isEligible(company)
                      }
                      applied={
                        applications.some(
                          (application) =>
                            application.company?._id ===
                              company._id ||
                            application.companyName ===
                              company.name
                        )
                      }
                      applying={
                        applyingCompanyId ===
                        company._id
                      }
                      apply={apply}
                    />
                  ))

              ) : (

                <div className="emptyState">

                  <div>🏢</div>

                  <h3>
                    No companies available
                  </h3>

                  <p>
                    Please check your backend
                    connection.
                  </p>

                </div>

              )}

            </div>

          </>
        )}

        {/* ========================================
            COMPANIES
        ======================================== */}

        {page === "Companies" && (
          <>

            <div className="pageIntro">

              <div>

                <h2>
                  Explore Companies 🏢
                </h2>

                <p>
                  Find the right opportunity
                  based on your skills, branch
                  and eligibility.
                </p>

              </div>

              <div className="resultCount">
                {filteredCompanies.length}{" "}
                opportunities
              </div>

            </div>

            <div className="filters">

              <div className="searchBox">

                🔍

                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(
                    e.target.value
                  )
                }
              >

                {locations.map(
                  (location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="cards">

              {filteredCompanies.length >
              0 ? (

                filteredCompanies.map(
                  (company) => (
                    <CompanyCard
                      key={
                        company._id ||
                        company.name
                      }
                      company={company}
                      eligible={
                        isEligible(company)
                      }
                      applied={
                        applications.some(
                          (application) =>
                            application.company?._id ===
                              company._id ||
                            application.company ===
                              company._id ||
                            application.companyName ===
                              company.name
                        )
                      }
                      applying={
                        applyingCompanyId ===
                        company._id
                      }
                      apply={apply}
                    />
                  )
                )

              ) : (

                <div className="emptyState">

                  <div>🔍</div>

                  <h3>
                    No opportunities found
                  </h3>

                  <p>
                    Try changing your search
                    or location filter.
                  </p>

                </div>

              )}

            </div>

          </>
        )}

        {/* ========================================
            APPLICATIONS
        ======================================== */}

        {page === "Applications" && (
          <>

            <div className="pageIntro">

              <div>

                <h2>
                  My Applications 📩
                </h2>

                <p>
                  Track the companies you have
                  applied to.
                </p>

              </div>

              <div className="resultCount">
                {applications.length}{" "}
                applications
              </div>

            </div>

            <div className="applicationPanel">

              {loadingApplications ? (

                <div className="emptyState">

                  <div>⏳</div>

                  <h3>
                    Loading applications...
                  </h3>

                </div>

              ) : applications.length === 0 ? (

                <div className="emptyState">

                  <div>📭</div>

                  <h3>
                    No applications yet
                  </h3>

                  <p>
                    Explore companies and apply
                    for suitable opportunities.
                  </p>

                </div>

              ) : (

                applications.map(
                  (application) => (

                    <div
                      className="application"
                      key={
                        application._id
                      }
                    >

                      <div className="applicationLogo">
                        {application.companyName
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div className="applicationInfo">

                        <strong>
                          {
                            application.companyName
                          }
                        </strong>

                        <span>
                          {application.role}
                        </span>

                        <span>
                          Applied on{" "}
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </span>

                      </div>

                      <div className="applicationPackage">
                        {application.package}
                      </div>

                      <div className="status">
                        {application.status ||
                          "Applied"}
                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </>
        )}

        {/* ========================================
            PROFILE
        ======================================== */}

        {page === "Profile" && (
          <>

            <div className="pageIntro">

              <div>

                <h2>
                  My Profile 👤
                </h2>

                <p>
                  Manage your student details
                  and resume.
                </p>

              </div>

            </div>

            <div className="profileCard">

              <div className="profileHero">

                <div className="bigAvatar">
                  {student.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h2>
                    {student.name}
                  </h2>

                  <p>
                    {student.rollNo}
                  </p>

                  <span className="profileTag">
                    Student
                  </span>

                </div>

              </div>

              <div className="profileGrid">

                <div className="profileItem">

                  <span>
                    Full Name
                  </span>

                  <strong>
                    {student.name}
                  </strong>

                </div>

                <div className="profileItem">

                  <span>
                    Roll Number
                  </span>

                  <strong>
                    {student.rollNo}
                  </strong>

                </div>

                <div className="profileItem">

                  <span>
                    Branch
                  </span>

                  <strong>
                    {student.branch}
                  </strong>

                </div>

                <div className="profileItem">

                  <span>
                    CGPA
                  </span>

                  <strong>
                    {student.cgpa}
                  </strong>

                </div>

              </div>

            </div>

            <div style={{ marginTop: "25px" }}>

              <ResumeUpload
                resume={resume}
                onResumeChange={
                  handleResumeChange
                }
              />

            </div>

          </>
        )}

      </main>

    </div>
  );
}

// ========================================
// STAT COMPONENT
// ========================================

function Stat({
  icon,
  number,
  label,
}) {
  return (
    <div className="stat">

      <div className="statIcon">
        {icon}
      </div>

      <div>

        <strong>
          {number}
        </strong>

        <p>
          {label}
        </p>

      </div>

    </div>
  );
}

// ========================================
// COMPANY CARD
// ========================================

function CompanyCard({
  company,
  eligible,
  applied,
  applying,
  apply,
}) {
  return (
    <div className="companyCard">

      <div className="companyTop">

        <div className="companyLogo">
          {company.name
            ?.charAt(0)
            ?.toUpperCase() || "C"}
        </div>

        <div className="companyTitle">

          <h3>
            {company.name}
          </h3>

          <p>
            {company.role}
          </p>

        </div>

        <div className="package">
          {company.package}
        </div>

      </div>

      <div className="companyDetails">

        <span>
          📍 {company.location}
        </span>

        <span>
          💼 {company.type}
        </span>

        <span>
          🎓 CGPA {company.cgpa}+
        </span>

      </div>

      <div className="branchesSection">

        <span className="branchesLabel">
          Eligible Branches
        </span>

        <div className="branches">

          {Array.isArray(
            company.branches
          ) &&
            company.branches.map(
              (branch) => (
                <span
                  className="branchTag"
                  key={branch}
                >
                  {branch}
                </span>
              )
            )}

        </div>

      </div>

      <div className="eligibilityRow">

        <span
          className={
            eligible
              ? "eligible"
              : "notEligible"
          }
        >
          {eligible
            ? "✓ You are eligible"
            : "✕ Not eligible"}
        </span>

        {applied ? (

          <button
            type="button"
            className="appliedButton"
            disabled
          >
            ✓ Applied
          </button>

        ) : eligible ? (

          <button
            type="button"
            className="applyButton"
            onClick={() =>
              apply(company)
            }
            disabled={applying}
          >
            {applying
              ? "Applying..."
              : "Apply Now"}
          </button>

        ) : (

          <button
            type="button"
            className="disabledButton"
            disabled
          >
            Not Eligible
          </button>

        )}

      </div>

    </div>
  );
}

export default App;