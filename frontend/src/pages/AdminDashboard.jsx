import { useState } from "react";

function AdminDashboard() {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-100">

            {/* 🔹 LEFT SIDEBAR */}
            <div className="w-1/4 bg-indigo-200 p-6 flex flex-col justify-between">

                <div>
                    {/* Profile */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Admin Name</h2>
                        <p className="text-sm text-gray-700">Company XYZ</p>
                        <p className="text-sm text-gray-600">Role: Admin</p>
                    </div>

                    {/* Ask Query */}
                    <button className="w-full bg-indigo-500 text-white py-2 rounded-lg mb-4">
                        Ask Query
                    </button>

                    {/* History Dropdown */}
                    <div>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full bg-white py-2 rounded-lg shadow"
                        >
                            History
                        </button>

                        {showHistory && (
                            <div className="mt-2 bg-white p-2 rounded shadow">
                                <p className="text-sm">Query 1</p>
                                <p className="text-sm">Query 2</p>
                                <p className="text-sm">Query 3</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* logout button  */}
                <div className=" py-4 border-t" >
                    <button
                        onClick={() => {
                            localStorage.removeItem("role");
                            window.location.href = "/login";
                        }}
                        className="bg-red-400 text-white w-full py-2 rounded-full"
                    >
                        Logout
                    </button>
                    <p className="py-2 text-xs text-gray-600">Admin Panel</p>
                </div>
            </div>



            {/* 🔹 RIGHT SIDE */}
            <div className="flex-1 p-6">

                {/* Upload Section */}
                <div className="bg-white p-8 rounded-2xl shadow mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
                        <p className="text-lg font-medium mb-2">
                            Drag & Drop Documents Here
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            or upload files/folders
                        </p>

                        <input type="file" className="hidden" id="fileUpload" multiple />

                        <label
                            htmlFor="fileUpload"
                            className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition cursor-pointer "
                        >
                            Upload Files
                        </label>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-6">

                    {/* Employees Count */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-lg font-semibold">Employees Joined</h3>
                        <p className="text-3xl font-bold mt-2">120</p>
                    </div>

                    {/* Documents Count */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-lg font-semibold">Documents Uploaded</h3>
                        <p className="text-3xl font-bold mt-2">45</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;