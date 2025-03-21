"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    // language: "",
    // currentPassword: "",
    // password: "",
    // affiliation: "",
    // website: "",
    // country: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        console.error("Access token not found in localStorage")
        setLoading(false)
        return
      }

      try {
        // Decode JWT token
        const decodeAccessToken = (token) => {
          try {
            const base64Url = token.split(".")[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
            const payload = JSON.parse(atob(base64))
            return payload
          } catch (error) {
            console.error("Error decoding access token:", error)
            return null
          }
        }

        const payload = decodeAccessToken(accessToken)
        if (!payload?.id) {
          throw new Error("No user ID found in token")
        }

        const response = await axios.get(`http://10.15.0.133:7676/v1/user/${payload.id}?id=${payload.id}`)
        setUserData(response.data)
        setFormData((prev) => ({
          ...prev,
          username: response.data.username || "",
          email: response.data.email || "",
          full_name: response.data.full_name || "",
        }))
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Implement form submission logic here
    console.log("Form submitted:", formData)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 py-10 text-center">
        <h1 className="font-bold text-white text-4xl">Settings</h1>
      </div>

      <div className="flex flex-1 mx-auto px-4 py-8 w-full max-w-7xl">
        {/* Sidebar */}
        <div className="flex flex-col space-y-1 w-48">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-left rounded ${
              activeTab === "profile" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("access-tokens")}
            className={`px-4 py-2 text-left rounded ${
              activeTab === "access-tokens" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Access Tokens
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-8">
          {activeTab === "profile" && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label className="block font-medium text-gray-700 text-sm">User Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 text-sm">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              {/* <div>
                <label className="block font-medium text-gray-700 text-sm">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                >
                  <option value="">Select language</option>
                  <option value="en">English</option>
                  <option value="uz">Uzbek</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Affiliation</label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-sm">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="block mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                >
                  <option value="">Select country</option>
                  <option value="uz">Uzbekistan</option>
                  <option value="us">United States</option>
                </select>
              </div> */}

              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {activeTab === "access-tokens" && (
            <div>
              <h2 className="mb-4 font-semibold text-xl">Access Tokens</h2>
              {/* Add access tokens content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

