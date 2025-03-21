"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Search, Plus, Edit, Trash, UserPlus } from "lucide-react"

const Teams = ({ role }) => {
  const [searchText, setSearchText] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState("team")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false)
  const [currentTeam, setCurrentTeam] = useState(null)
  const [formData, setFormData] = useState({ key: "", name: "" })
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState("")

  useEffect(() => {
    fetchTeams()
    if (role === "admin") {
      fetchUsers()
    }
  }, [role])

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://10.15.0.133:7676/v1/team/list")
      const teams = response.data.users.map((team) => ({
        key: team.id,
        team: team.name,
        website: "",
        affiliation: "",
        country: "",
        participants: team.participants,
      }))
      setData(teams)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://10.15.0.133:7676/v1/user/list")
      setUsers(response.data.users)
    } catch (err) {
      console.error("Failed to fetch users:", err)
    }
  }

  const filteredData = data.filter((item) => item.team.toLowerCase().includes(searchText.toLowerCase()))

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

  const handleCreateOrUpdateTeam = async () => {
    try {
      if (currentTeam) {
        await axios.put(`http://10.15.0.133:7676/v1/team/${currentTeam.key}`, formData)
      } else {
        await axios.post("http://10.15.0.133:7676/v1/team", formData)
      }
      fetchTeams()
      setIsModalVisible(false)
      setFormData({ key: "", name: "" })
      setCurrentTeam(null)
      alert(`Team ${currentTeam ? "updated" : "created"} successfully`)
    } catch (err) {
      alert(`Failed to ${currentTeam ? "update" : "create"} team`)
      console.error("Error:", err)
    }
  }

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`http://10.15.0.133:7676/v1/team/${id}`)
      fetchTeams()
      alert("Team deleted successfully")
    } catch (err) {
      alert("Failed to delete team")
      console.error("Delete error:", err)
    }
  }

  const handleAddUserToTeam = async () => {
    try {
      if (!formData.key) {
        alert("Key kiritilmadi!")
        return
      }
      await axios.put("http://10.15.0.133:7676/v1/team/add/user", {
        key: formData.key,
        team_id: selectedTeamId,
        user_id: selectedUserId,
      })
      fetchTeams()
      setIsAddUserModalVisible(false)
      alert("User added to team successfully")
    } catch (err) {
      alert("Failed to add user to team")
      console.error("Add user error:", err)
    }
  }

  const validateForm = () => {
    const { key, name } = formData
    if (key.length < 3 || key.length > 25 || name.length < 3 || name.length > 25) {
      alert("Key and Name must be between 3 and 25 characters")
      return false
    }
    return true
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 py-10 text-center">
        <h1 className="font-bold text-white text-4xl">Teams</h1>
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
              placeholder="Search for matching teams"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {role === "admin" && (
            <button
              className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 px-6 rounded-md w-[180px] text-white"
              onClick={() => setIsModalVisible(true)}
            >
              <Plus className="w-5 h-5" />
              Create Team
            </button>
          )}
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
              <div className={`grid ${role === "admin" ? "grid-cols-6" : "grid-cols-5"} py-3 border-gray-200 border-b`}>
                <div className="font-medium cursor-pointer" onClick={() => handleSort("team")}>
                  Team
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
                <div className="font-medium cursor-pointer" onClick={() => handleSort("participants")}>
                  Participants
                </div>
                {role === "admin" && <div className="font-medium">Actions</div>}
              </div>

              {/* Table body */}
              {sortedData.map((item, index) => (
                <div key={item.key}>
                  <div
                    className={`grid ${role === "admin" ? "grid-cols-6" : "grid-cols-5"} py-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                  >
                    <Link to={`/teams/${item.key}`} className="text-blue-500 hover:underline">
                      {item.team}
                    </Link>
                    <div>{item.website}</div>
                    <div>{item.affiliation}</div>
                    <div>{item.country}</div>
                    <div>{item.participants}</div>
                    {role === "admin" && (
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            setCurrentTeam(item)
                            setFormData({ key: item.key, name: item.team })
                            setIsModalVisible(true)
                          }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTeam(item.key)}
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => {
                            setSelectedTeamId(item.key)
                            setIsAddUserModalVisible(true)
                          }}
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Create/Edit Team Modal (Faqat admin uchun) */}
              {role === "admin" && isModalVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 font-bold text-xl">{currentTeam ? "Edit Team" : "Create Team"}</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (validateForm()) handleCreateOrUpdateTeam()
                      }}
                    >
                      <div className="mb-4">
                        <label className="block mb-1 font-medium text-sm">Key</label>
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-md w-full"
                          value={formData.key}
                          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium text-sm">Name</label>
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-md w-full"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="bg-gray-300 px-4 py-2 rounded-md"
                          onClick={() => {
                            setIsModalVisible(false)
                            setFormData({ key: "", name: "" })
                            setCurrentTeam(null)
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md text-white">
                          {currentTeam ? "Update" : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Add User to Team Modal (Faqat admin uchun) */}
              {role === "admin" && isAddUserModalVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 font-bold text-xl">Add User to Team</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddUserToTeam();
                      }}
                    >
                      <div className="mb-4">
                        <label className="block mb-1 font-medium text-sm">Select User</label>
                        <select
                          className="px-3 py-2 border rounded-md w-full"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                          <option value="">Select a user</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium text-sm">Key</label>
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-md w-full"
                          value={formData.key}
                          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="bg-gray-300 px-4 py-2 rounded-md"
                          onClick={() => setIsAddUserModalVisible(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md text-white">
                          Add User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teams