function EmployeeDashboard() {
    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow">
                    My Tasks
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    My Profile
                </div>
            </div>
            <button
                onClick={() => {
                    localStorage.removeItem("role");
                    window.location.href = "/login";
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}

export default EmployeeDashboard;