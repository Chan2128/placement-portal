import { useMemo, useState } from "react";
import "./App.css";
import Register from "./Register";
import Login from "./Login";

const companies = [
  {
    name: "TCS",
    role: "Software Engineer",
    package: "7.2 LPA",
    cgpa: 7.0,
    branches: ["CSE", "CST", "IT"],
    location: "Hyderabad",
    type: "Full Time",
  },
  {
    name: "Infosys",
    role: "Systems Engineer",
    package: "6.5 LPA",
    cgpa: 6.5,
    branches: ["CSE", "CST", "ECE"],
    location: "Bengaluru",
    type: "Full Time",
  },
  {
    name: "Deloitte",
    role: "Analyst",
    package: "8.0 LPA",
    cgpa: 7.5,
    branches: ["CSE", "CST"],
    location: "Hyderabad",
    type: "Full Time",
  },
  {
    name: "Accenture",
    role: "Application Developer",
    package: "7.8 LPA",
    cgpa: 7.0,
    branches: ["CSE", "CST", "IT"],
    location: "Pune",
    type: "Full Time",
  },
  {
    name: "Wipro",
    role: "Project Engineer",
    package: "6.2 LPA",
    cgpa: 6.0,
    branches: ["CSE", "CST", "ECE"],
    location: "Chennai",
    type: "Full Time",
  },
  {
    name: "Microsoft",
    role: "Software Development Engineer",
    package: "18 LPA",
    cgpa: 8.0,
    branches: ["CSE", "CST"],
    location: "Hyderabad",
    type: "Full Time",
  },
];

function App() {
  const [authPage, setAuthPage] = useState("register");
  const [page, setPage] = useState("Dashboard");
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [showProfile, setShowProfile] = useState(false);

  const [student, setStudent] = useState({
    name: "Student",
    rollNo: "24A81A0000",
    branch: "CST",
    cgpa: 8.5,
  });

  // ================================
  // REGISTRATION SUCCESS
  // ================================

  const handleRegisterSuccess = (user) => {
    if (user) {
      setStudent({
        name: user.name,
        rollNo: user.rollNo,
        branch: user.branch,
        cgpa: user.cgpa,
      });
    }

    setAuthPage("dashboard");
  };

  // ================================
  // ELIGIBILITY
  // ================================

  const isEligible = (company) =>
    student.cgpa >= company.cgpa &&
    company.branches.includes(student.branch);

  // ================================
  // APPLY
  // ================================

  const apply = (company) => {
    if (!isEligible(company)) {
      alert(
        `You are not eligible for ${company.name}.\nRequired CGPA: ${company.cgpa}`
      );
      return;
    }

    if (applied.includes(company.name)) {
      alert("You have already applied to this company.");
      return;
    }

    setApplied([...applied, company.name]);

    alert(
      `Application submitted successfully to ${company.name}!`
    );
  };

  // ================================
  // LOCATIONS
  // ================================

  const locations = useMemo(
    () => [
      "All",
      ...new Set(companies.map((company) => company.location)),
    ],
    []
  );

  // ================================
  // SEARCH + FILTER
  // ================================

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      company.role
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesLocation =
      locationFilter === "All" ||
      company.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const eligibleCount = companies.filter(isEligible).length;

  // ================================
  // REGISTER PAGE
  // ================================

 if (authPage === "register") {
  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      goToLogin={() => setAuthPage("login")}
    />
  );
}

if (authPage === "login") {
  return (
    <Login
      onLoginSuccess={handleRegisterSuccess}
      goToRegister={() => setAuthPage("register")}
    />
  );
}

  // ================================
  // MAIN APPLICATION
  // ================================

  return (
    <div className="app">

      {/* ================================
          SIDEBAR
      ================================= */}

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
            onClick={() => setPage("Dashboard")}
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            className={
              page === "Companies"
                ? "activeNav"
                : ""
            }
            onClick={() => setPage("Companies")}
          >
            🏢 <span>Companies</span>
          </button>

          <button
            className={
              page === "Applications"
                ? "activeNav"
                : ""
            }
            onClick={() => setPage("Applications")}
          >
            📩 <span>My Applications</span>
          </button>

          <button
            className={
              page === "Profile"
                ? "activeNav"
                : ""
            }
            onClick={() => setPage("Profile")}
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

        </div>

      </aside>

      {/* ================================
          MAIN
      ================================= */}

      <main className="main">

        {/* HEADER */}

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
              setShowProfile(!showProfile)
            }
          >

            <span className="avatar">
              {student.name.charAt(0).toUpperCase()}
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

            </div>
          )}

        </header>

        {/* ================================
            DASHBOARD
        ================================= */}

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
                    {applied.length}
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
                number={companies.length}
                label="Companies"
              />

              <Stat
                icon="📩"
                number={applied.length}
                label="Applications"
              />

              <Stat
                icon="🎯"
                number={eligibleCount}
                label="Eligible for You"
              />

              <Stat
                icon="⭐"
                number={student.cgpa}
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

              {companies
                .slice(0, 4)
                .map((company) => (
                  <CompanyCard
                    key={company.name}
                    company={company}
                    eligible={isEligible(company)}
                    applied={applied.includes(
                      company.name
                    )}
                    apply={apply}
                  />
                ))}

            </div>

          </>
        )}

        {/* ================================
            COMPANIES
        ================================= */}

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
                    setSearch(e.target.value)
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

                {locations.map((location) => (
                  <option
                    key={location}
                  >
                    {location}
                  </option>
                ))}

              </select>

            </div>

            <div className="cards">

              {filteredCompanies.length > 0 ? (
                filteredCompanies.map(
                  (company) => (
                    <CompanyCard
                      key={company.name}
                      company={company}
                      eligible={isEligible(
                        company
                      )}
                      applied={applied.includes(
                        company.name
                      )}
                      apply={apply}
                    />
                  )
                )
              ) : (
                <div className="emptyState">

                  <div>🔎</div>

                  <h3>
                    No companies found
                  </h3>

                  <p>
                    Try a different search or
                    location.
                  </p>

                </div>
              )}

            </div>

          </>
        )}

        {/* ================================
            APPLICATIONS
        ================================= */}

        {page === "Applications" && (
          <>

            <div className="pageIntro">

              <div>

                <h2>
                  My Applications 📩
                </h2>

                <p>
                  Track all your placement
                  applications.
                </p>

              </div>

            </div>

            <section className="applicationPanel">

              {applied.length === 0 ? (

                <div className="emptyState">

                  <div>📭</div>

                  <h3>
                    No applications yet
                  </h3>

                  <p>
                    Explore companies and apply
                    for suitable opportunities.
                  </p>

                  <button
                    className="explore smallExplore"
                    onClick={() =>
                      setPage("Companies")
                    }
                  >
                    Browse Companies
                  </button>

                </div>

              ) : (

                applied.map((companyName) => {

                  const company =
                    companies.find(
                      (item) =>
                        item.name ===
                        companyName
                    );

                  return (
                    <div
                      className="application"
                      key={companyName}
                    >

                      <div className="applicationLogo">
                        {companyName[0]}
                      </div>

                      <div className="applicationInfo">

                        <strong>
                          {companyName}
                        </strong>

                        <span>
                          {company.role}
                        </span>

                      </div>

                      <div className="applicationPackage">
                        ₹{company.package}
                      </div>

                      <div className="status">
                        <span>✓</span>{" "}
                        Applied
                      </div>

                    </div>
                  );
                })

              )}

            </section>

          </>
        )}

        {/* ================================
            PROFILE
        ================================= */}

        {page === "Profile" && (
          <>

            <div className="pageIntro">

              <div>

                <h2>
                  My Profile 👤
                </h2>

                <p>
                  Manage your academic and
                  placement information.
                </p>

              </div>

            </div>

            <section className="profileCard">

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
                    Active Student
                  </span>

                </div>

              </div>

              <div className="profileGrid">

                <ProfileItem
                  label="Branch"
                  value={student.branch}
                />

                <ProfileItem
                  label="CGPA"
                  value={student.cgpa}
                />

                <ProfileItem
                  label="Placement Season"
                  value="2026"
                />

                <ProfileItem
                  label="Applications"
                  value={applied.length}
                />

              </div>

            </section>

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
// PROFILE ITEM
// ========================================

function ProfileItem({
  label,
  value,
}) {
  return (
    <div className="profileItem">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

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
  apply,
}) {
  return (
    <div className="companyCard">

      <div className="companyTop">

        <div className="companyLogo">
          {company.name[0]}
        </div>

        <div className="companyTitle">

          <h3>
            {company.name}
          </h3>

          <p>
            {company.role}
          </p>

        </div>

        <span className="package">
          ₹{company.package}
        </span>

      </div>

      <div className="companyDetails">

        <span>
          📍 {company.location}
        </span>

        <span>
          🎓 CGPA {company.cgpa}+
        </span>

        <span>
          💼 {company.type}
        </span>

      </div>

      <div className="branches">

        {company.branches.map(
          (branch) => (
            <span key={branch}>
              {branch}
            </span>
          )
        )}

      </div>

      <div className="eligibilityRow">

        {eligible ? (

          <span className="eligible">
            ✓ Eligible for you
          </span>

        ) : (

          <span className="notEligible">
            × Not eligible
          </span>

        )}

        <button
          className={
            applied
              ? "appliedButton"
              : eligible
              ? "applyButton"
              : "disabledButton"
          }
          disabled={!eligible || applied}
          onClick={() =>
            apply(company)
          }
        >

          {applied
            ? "✓ Applied"
            : eligible
            ? "Apply Now →"
            : "Not Eligible"}

        </button>

      </div>

    </div>
  );
}

export default App;