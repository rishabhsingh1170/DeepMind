import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Lock } from "lucide-react";


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
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-indigo-800">

            {/* Top Right Sign Up */}
            <div className="absolute top-6 right-8 text-white">
                <span className="mr-3 text-sm">Not a member?</span>
                <button className="border px-4 py-1 rounded hover:bg-white hover:text-black transition"
                    onClick={() => navigate("/signup")}>
                    Sign Up
                </button>
            </div>

            {/* login card  */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-96 text-white">

                {/* Logo Placeholder */}
                <div className="flex justify-center mb-8">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                        <BrainCircuit className="h-5 w-5" />
                        <Lock className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white p-0.5 text-indigo-700" /></div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to Your Account
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Role Selection */}
                    <div>
                        <label className="block mb-1 font-medium">Role as: </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={role === "admin"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Admin
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="employee"
                                    checked={role === "employee"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Employee
                            </label>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border rounded-full px-4 py-2 text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border rounded-full px-4 py-2 text-black"
                            value={password}
                            onChange={(e) => setEmail(e.target.value)}
                            // required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-800 text-white-800 py-2 rounded-full hover:bg-indigo-600 transition"
                    >
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}

export default LoginPage;