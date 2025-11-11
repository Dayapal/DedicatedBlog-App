import React, { useEffect, useState } from "react";
import axios from "axios";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        console.log("Token:", token);

        const { data } = await axios.get("http://localhost:4001/api/user/my-profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("Fetched Profile:", data);
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-blue-100 to-purple-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-red-100 to-orange-100">
        <p className="text-lg text-gray-700">Profile not found 😔</p>
      </div>
    );
  }

  const profileImage = profile?.photo?.url?.replace("http://", "https://");

  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-80">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={profileImage || "https://via.placeholder.com/300x120"}
            alt="cover"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
            <img
              src={profileImage || "https://via.placeholder.com/100"}
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 py-6 mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">{profile?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>

          <div className="mt-4 text-left space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-800">{profile?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Education:</span>
              <span className="text-gray-800">{profile?.education}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Role:</span>
              <span className="text-indigo-600 font-semibold capitalize">{profile?.role}</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
