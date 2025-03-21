import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Trash, Plus } from 'lucide-react';
import { message } from 'antd'; // message ni import qilish

const TeamDetail = ({ role }) => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [key, setKey] = useState(''); // Qo'shilish uchun kalit so'z

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await axios.get(`http://10.15.0.133:7676/v1/team/${id}?id=${id}`);
                setTeam(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamDetails();
    }, [id]);

    const removeUserFromTeam = async (userId) => {
        try {
            await axios.put('http://10.15.0.133:7676/v1/team/remove/user', {
                team_id: id,
                user_id: userId
            });
            // Foydalanuvchi o'chirilgandan so'ng jamoani yangilash
            const response = await axios.get(`http://10.15.0.133:7676/v1/team/${id}?id=${id}`);
            setTeam(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const addUserToTeam = async () => {
        try {
            // LocalStorage'dan accessToken ni olish
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Access token not found');
            }
    
            // Tokenning payload qismini ajratish
            const tokenParts = accessToken.split('.');
            if (tokenParts.length !== 3) {
                throw new Error('Invalid token format');
            }
    
            // Base64 ni decode qilish va JSON parse qilish
            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload?.id;
            if (!userId) {
                throw new Error('User ID not found in token');
            }
    
            // Foydalanuvchini jamoaga qo'shish
            await axios.put('http://10.15.0.133:7676/v1/team/add/user', {
                key: key, // Kalit so'z
                team_id: id, // Jamoaning ID si
                user_id: userId // Foydalanuvchi ID si
            });
    
            // Jamoani yangilash
            const response = await axios.get(`http://10.15.0.133:7676/v1/team/${id}?id=${id}`);
            setTeam(response.data);
            message.success('User added to team successfully'); // message ni ishlatish
            setKey(''); // Kalit so'zni tozalash
        } catch (err) {
            message.error('Failed to add user to team'); // message ni ishlatish
            console.error('Add user error:', err);
        }
    };
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }

    // Agar team_participants null yoki undefined bo'lsa, bo'sh massiv bilan almashtirish
    const participants = team.team_participants || [];

    const filteredParticipants = participants.filter((participant) =>
        participant.full_name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-gray-900 py-10 text-center">
                <h1 className="font-bold text-white text-4xl">Team Members</h1>
            </div>

            {/* Content */}
            <div className="mx-auto p-4 w-full max-w-7xl">
                {/* Search and Filter Section */}
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
                            placeholder="Search for matching members"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Qo'shilish tugmasi va kalit so'z kiritish */}
                {role === 'user' && (
                    <div className="flex gap-2 my-4">
                        <input
                            type="text"
                            placeholder="Enter key to join"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <button
                            onClick={addUserToTeam}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white"
                        >
                            <Plus className="w-5 h-5" />
                            Qo'shilish
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="mt-4 border-gray-200 border-t">
                    <div>
                        {/* Table Header */}
                        <div className={`grid ${role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'} py-3 border-gray-200 border-b`}>
                            <div className="font-medium cursor-pointer">Full Name</div>
                            <div className="font-medium cursor-pointer">Email</div>
                            <div className="font-medium cursor-pointer">Username</div>
                            {role === 'admin' && <div className="font-medium cursor-pointer">Actions</div>}
                        </div>

                        {/* Table Body */}
                        {filteredParticipants.length > 0 ? (
                            filteredParticipants.map((participant, index) => (
                                <div
                                    key={participant.id}
                                    className={`grid ${role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'} py-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <div className="px-4 py-2">{participant.full_name}</div>
                                    <div className="px-4 py-2">{participant.email}</div>
                                    <div className="px-4 py-2">{participant.username}</div>
                                    {role === 'admin' && (
                                        <div className="px-4 py-2">
                                            <button
                                                onClick={() => removeUserFromTeam(participant.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-gray-500 text-center">No participants found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;