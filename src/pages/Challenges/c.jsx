"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const Challenges = ({ role }) => {
  const [challenges, setChallenges] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState(null)
  const [formData, setFormData] = useState({ name: "", status: false })
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false)
  const [answer, setAnswer] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    fetchChallenges()
  }, [])

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchChallenges = async () => {
    try {
      const response = await axios.get("http://10.15.0.133:7676/v1/challenges/list")
      setChallenges(response.data.challenges)
    } catch (error) {
      showNotification("Failed to fetch challenges", "error")
      console.error("Fetch error:", error)
    }
  }

  const fetchQuestions = async (challengeId) => {
    try {
      const response = await axios.get(`http://10.15.0.133:7676/v1/questions/list?challenge_id=${challengeId}`)
      setQuestions(response.data.questions)
      setIsQuizModalVisible(true)
      setCurrentQuestionIndex(0)
    } catch (error) {
      showNotification("Failed to fetch questions", "error")
      console.error("Fetch error:", error)
    }
  }

  const handleSaveChallenge = async (e) => {
    e.preventDefault()
    try {
      if (editingChallenge) {
        await axios.put(
          `http://10.15.0.133:7676/v1/challenges/${editingChallenge.id}?id=${editingChallenge.id}`,
          formData,
        )
        showNotification("Challenge updated successfully", "success")
      } else {
        await axios.post("http://10.15.0.133:7676/v1/challenges", formData)
        showNotification("Challenge created successfully", "success")
      }
      fetchChallenges()
      setIsModalVisible(false)
      setFormData({ name: "", status: false })
      setEditingChallenge(null)
    } catch (error) {
      showNotification("Failed to save challenge", "error")
      console.error("Save error:", error)
    }
  }

  const handleDeleteChallenge = async (id, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`http://10.15.0.133:7676/v1/challenges/${id}?id=${id}`)
      showNotification("Challenge deleted successfully", "success")
      fetchChallenges()
    } catch (error) {
      showNotification("Failed to delete challenge", "error")
      console.error("Delete error:", error)
    }
  }

  const showModal = (challenge = null, e) => {
    if (e) e.stopPropagation()
    setEditingChallenge(challenge)
    setFormData(challenge || { name: "", status: false })
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setFormData({ name: "", status: false })
    setEditingChallenge(null)
  }

  const handleQuizCancel = () => {
    setIsQuizModalVisible(false)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswer("")
  }

  const handleAnswerSubmit = (e) => {
    e.preventDefault()
    const currentQuestion = questions[currentQuestionIndex]
    if (answer === currentQuestion.answer) {
      showNotification("Correct answer!", "success")
    } else {
      showNotification("Incorrect answer!", "error")
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setAnswer("")
    } else {
      showNotification("You have completed the quiz!", "success")
      setIsQuizModalVisible(false)
    }
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 min-h-screen text-white">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {role === "admin" && (
          <button
            onClick={() => showModal()}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 mb-8 px-6 py-2 rounded-lg font-medium text-white transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Challenge
          </button>
        )}

        <h1 className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 font-bold text-transparent text-3xl">
          Challenges
        </h1>

        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => fetchQuestions(challenge.id)}
              className="bg-gray-800 hover:bg-gray-700 shadow-lg border border-gray-700 rounded-xl overflow-hidden transition-all hover:-translate-y-1 duration-300 cursor-pointer transform"
            >
              <div className="p-6">
                <h2 className="mb-2 font-bold text-xl">{challenge.name}</h2>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm">Status:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      challenge.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {challenge.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {role === "admin" && (
                <div className="flex border-gray-700 border-t">
                  <button
                    onClick={(e) => showModal(challenge, e)}
                    className="flex-1 hover:bg-gray-700 py-3 text-indigo-400 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteChallenge(challenge.id, e)}
                    className="flex-1 hover:bg-gray-700 py-3 text-red-400 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Modal */}
      {isModalVisible && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 shadow-xl mx-4 rounded-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-gray-700 border-b">
              <h3 className="font-medium text-xl">{editingChallenge ? "Edit Challenge" : "Create Challenge"}</h3>
            </div>

            <form onSubmit={handleSaveChallenge} className="p-6">
              <div className="mb-4">
                <label className="block mb-2 font-medium text-sm">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
              </div>

              <div className="flex items-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors duration-200 ${formData.status ? "bg-indigo-600" : "bg-gray-600"}`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform ${formData.status ? "translate-x-4" : ""}`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm">Status</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="hover:bg-gray-700 px-4 py-2 border border-gray-600 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {editingChallenge ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {isQuizModalVisible && questions.length > 0 && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80">
          <div className="bg-[#0e1116] shadow-xl mx-4 border border-gray-800 rounded-lg w-full max-w-2xl overflow-hidden animate-fade-in">
            <div className="flex items-center px-6 py-4">
              <div className="flex items-center mr-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-white text-xl">{questions[currentQuestionIndex].text}</h3>
            </div>

            <form onSubmit={handleAnswerSubmit} className="px-6 pb-6">
              <div className="relative">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Submit your answer here..."
                  className="bg-[#1a1d21] px-4 py-3 border-0 rounded focus:outline-none focus:ring-1 focus:ring-gray-600 w-full text-white"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Challenges

