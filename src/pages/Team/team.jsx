"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, User, Ticket, Trash2 } from "lucide-react"

function Team() {
  const navigate = useNavigate()
  const [teamId, setTeamId] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // JWT tokenni localStorage'dan olish
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
      console.error("Access token not found in localStorage")
      setLoading(false)
      return
    }

    // JWT tokenni dekod qilish
    const decodeAccessToken = (token) => {
      try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const payload = JSON.parse(atob(base64)) // Base64 ni decode qilish
        return payload
      } catch (error) {
        console.error("Error decoding access token:", error)
        return null
      }
    }

    const payload = decodeAccessToken(accessToken)
    if (payload && payload.in_team) {
      console.log(payload.in_team);
      setTeamId(payload.in_team) // in_team maydonidagi ID ni saqlash
      fetchTeamData(payload.in_team) // Jamoaning ma'lumotlarini olish
    } else {
      setLoading(false) // Yuklash tugadi
    }
  }, [])

  const fetchTeamData = async (id) => {
    try {
      const response = await fetch(`http://10.15.0.133:7676/v1/team/${id}?id=${id}`)
      const data = await response.json()
      setTeamData(data) // Jamoaning ma'lumotlarini saqlash
    } catch (error) {
      console.error("Error fetching team data:", error)
    } finally {
      setLoading(false) // Yuklash tugadi
    }
  }

  const handleJoinTeam = () => {
    navigate("/team/join") // "Join Team" bosilganda /team/join yo'liga o'tish
  }

  const handleCreateTeam = () => {
    navigate("/team/create") // "Create Team" bosilganda /team/create yo'liga o'tish
  }

  if (loading) {
    return <div className="flex justify-center items-center bg-gray-100 min-h-screen">Loading...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {teamId && teamData ? (
        // Team member view - dark theme as shown in the image
        <div className="w-full min-h-screen text-white">
          {/* Header with team name and icons */}
          <div className="bg-gray-900 py-10 border-gray-800 border-b w-full text-center">
            <h1 className="mb-6 font-bold text-4xl">{teamData.name}</h1>
            <div className="flex justify-center space-x-6">
              <Settings className="w-6 h-6 text-white" />
              <User className="w-6 h-6 text-white" />
              <Ticket className="w-6 h-6 text-white" />
              <Trash2 className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Members section */}
          <div className="mx-auto px-4 py-8 max-w-6xl">
            <h2 className="mb-4 font-bold text-black text-2xl">Members</h2>

            {/* Members table */}
            <div className="w-full">
              <div className="flex justify-between py-4 border-gray-700 border-b">
                <div className="font-semibold text-black">User Name</div>
                <div className="font-semibold text-black">Score</div>
              </div>

              {/* Team members list */}
              {(teamData.team_participants || []).map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex justify-between p-4 ${index % 2 === 0 ? "bg-gray-800" : ""}`}
                >
                  <div className="flex items-center">
                    <span className="text-blue-400">{participant.username}</span>
                    {index === 0 && (
                      <span className="bg-blue-500 ml-2 px-2 py-1 rounded-full text-white text-xs">Captain</span>
                    )}
                  </div>
                  <div>0</div>
                </div>
              ))}
            </div>

            {/* No solves yet message */}
            <div className="mt-20 text-gray-400 text-2xl text-center">No solves yet</div>
          </div>
        </div>
      ) : (
        // Non-team member view
        <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center">
          <h1 className="mb-4 font-bold text-2xl">Welcome to Sermikro!</h1>
          <p className="mb-6 text-gray-600">In order to participate, you must either join or create a team.</p>
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full text-white transition duration-300"
              onClick={handleJoinTeam}
            >
              Join Team
            </button>
            <button
              className="hover:bg-blue-50 px-4 py-2 border border-blue-500 rounded w-full text-blue-500 transition duration-300"
              onClick={handleCreateTeam}
            >
              Create Team
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Team

