import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [role, setRole] = useState("employee");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // For now just log (later connect backend)
        console.log({
            email,
            password,
            role,
        });

        // TEMP auth (replace with backend later)
        localStorage.setItem("role", role);

        if (role === "admin") {
            navigate("/admin-dashboard");
        } else {
            navigate("/employee-dashboard");
        }

        // // Example logic (temporary)
        // if (role === "admin") {
        //     alert("Logging in as Admin");
        // } else {
        //     alert("Logging in as Employee");
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to Your Account
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Role Selection */}
                    <div>
                        <label className="block mb-1 font-medium">Select Role</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("employee")}
                                className={`flex-1 py-2 rounded-lg border ${role === "employee"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                            >
                                Employee
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex-1 py-2 rounded-lg border ${role === "admin"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}

export default LoginPage;