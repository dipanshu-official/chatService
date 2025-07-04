import React, { useEffect, useState } from "react";
import { currentLoginDataSelector } from "../store/globalSelector";
import { useSelector , useDispatch } from "react-redux";
import { loginUser } from "../store/globalAction";

function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loginUser())
  },[])

  const userData = useSelector(currentLoginDataSelector);
  console.log("userData=>", userData);
  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div
          className={`rounded-lg shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Avatar + Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-400" />
            <div>
              <h2 className="text-xl font-semibold">Dipanshu Kumar</h2>
              <p className="text-sm text-gray-400">dipanshu@example.com</p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
              <span>Password</span>
              <button className="text-sm text-blue-500 hover:underline">
                Change
              </button>
            </div>

            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
              <span>Notifications</span>
              <button className="text-sm text-blue-500 hover:underline">
                Manage
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span>Account Privacy</span>
              <button className="text-sm text-blue-500 hover:underline">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
