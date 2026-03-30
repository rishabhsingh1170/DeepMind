import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  // Common fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Admin fields
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Employee fields
  const [employeeId, setEmployeeId] = useState("");
  const [companyId, setCompanyId] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    let newUser = {};

    if (role === "admin") {
      newUser = {
        role,
        name,
        email,
        companyName,
        password,
      };

      // check duplicate email
      const exists = users.find((u) => u.email === email);
      if (exists) {
        alert("Admin already exists!");
        return;
      }
    } else {
      newUser = {
        role,
        name,
        employeeId,
        companyName,
        companyId,
        password,
      };

      // check duplicate employeeId
      const exists = users.find((u) => u.employeeId === employeeId);
      if (exists) {
        alert("Employee already exists!");
        return;
      }
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-800 to-indigo-500">
      <div className="w-[900px] h-[520px] bg-white/10 rounded-lg shadow-lg flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 p-10 flex flex-col justify-center">

          {/* Tabs */}
          <div className="flex gap-6 mb-6 text-white">
            <span
              className="cursor-pointer hover:border-b-2 border-white"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
            <span className="border-b-2 border-white-500 text-white-600 pb-1">
              Sign up
            </span>
          </div>

          {/* Role Selection */}
          <div className="flex gap-6 mb-4 text-sm text-white">
            <label>
              <input
                type="radio"
                value="admin"
                
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Admin
            </label>

            <label>
              <input
                type="radio"
                value="employee"
                
                checked={role === "employee"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Employee
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-full px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* ADMIN FIELDS */}
            {role === "admin" && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-full px-4 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full border rounded-full px-4 py-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </>
            )}

            {/* EMPLOYEE FIELDS */}
            {role === "employee" && (
              <>
                <input
                  type="text"
                  placeholder="Employee ID"
                  className="w-full border rounded-full px-4 py-2"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full border rounded-full px-4 py-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Company ID (provided by Admin)"
                  className="w-full border rounded-full px-4 py-2"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                />
              </>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-full px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Button */}
            <div className="flex justify-between items-center mt-4">
              <button className="bg-indigo-800 text-white px-6 py-2 rounded-full hover:bg-indigo-600">
                Sign up
              </button>

              <span
                className="text-sm text-white cursor-pointer hover:border-b"
                onClick={() => navigate("/login")}
              >
                Already have an account?
              </span>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-white/80 flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
            alt="illustration"
            className="w-64"
          />
        </div>
      </div>
    </div>
  );
}