"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Edit, Trash } from "lucide-react"

const Users = ({ user_role }) => { // user_role ni props orqali qabul qilamiz
  const [searchText, setSearchText] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState("user")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    username: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://10.15.0.133:7676/v1/user/list")
        const users = response.data.users.map((user) => ({
          key: user.id,
          user: user.username,
          email: user.email,
          full_name: user.full_name,
          website: "", // You can map additional fields if available
          affiliation: "", // You can map additional fields if available
          country: "", // You can map additional fields if available
        }))
        setData(users)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = data.filter((item) => item.user.toLowerCase().includes(searchText.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleEdit = (user) => {
    setCurrentUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name,
      username: user.user,
    })
    setIsEditModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://10.15.0.133:7676/v1/user/${id}`)
      setData(data.filter((item) => item.key !== id))
      alert("User deleted successfully")
    } catch (err) {
      alert("Failed to delete user")
      console.error("Delete error:", err)
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`http://10.15.0.133:7676/v1/user/${currentUser.key}`, formData)
      setData(
        data.map((item) =>
          item.key === currentUser.key
            ? { ...item, user: formData.username, email: formData.email, full_name: formData.full_name }
            : item
        )
      )
      setIsEditModalVisible(false)
      alert("User updated successfully")
    } catch (err) {
      alert("Failed to update user")
      console.error("Update error:", err)
    }
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 py-10 text-center">
        <h1 className="font-bold text-white text-4xl">Users</h1>
      </div>

      {/* Content */}
      <div className="mx-auto p-4 w-full max-w-7xl">
        {/* Search bar */}
        <div className="flex gap-2 my-4">
          <div className="relative">
            <select className="px-4 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option>Name</option>
            </select>
            <div className="right-0 absolute inset-y-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for matching users"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 px-6 rounded-md w-[180px] text-white">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 border-gray-200 border-t">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className={`grid ${user_role === "admin" ? "grid-cols-5" : "grid-cols-4"} py-3 border-gray-200 border-b`}>
                <div className="font-medium cursor-pointer" onClick={() => handleSort("user")}>
                  User
                </div>
                <div className="font-medium cursor-pointer" onClick={() => handleSort("website")}>
                  Website
                </div>
                <div className="font-medium cursor-pointer" onClick={() => handleSort("affiliation")}>
                  Affiliation
                </div>
                <div className="font-medium cursor-pointer" onClick={() => handleSort("country")}>
                  Country
                </div>
                {user_role === "admin" && <div className="font-medium">Actions</div>}
              </div>

              {/* Table body */}
              {sortedData.map((item, index) => (
                <div
                  key={item.key}
                  className={`grid ${user_role === "admin" ? "grid-cols-5" : "grid-cols-4"} py-3 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="text-blue-500 hover:underline cursor-pointer">{item.user}</div>
                  <div>{item.website}</div>
                  <div>{item.affiliation}</div>
                  <div>{item.country}</div>
                  {user_role === "admin" && (
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.key)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4 font-bold text-xl">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdate()
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Email</label>
                <input
                  type="email"
                  className="px-3 py-2 border rounded-md w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Full Name</label>
                <input
                  type="text"
                  className="px-3 py-2 border rounded-md w-full"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">Username</label>
                <input
                  type="text"
                  className="px-3 py-2 border rounded-md w-full"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsEditModalVisible(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md text-white">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users