"use client"

import { useEffect, useState } from "react"
import React from 'react';
import { ExternalLink, Users, Clock } from 'lucide-react';

interface StatusType {
  [key: string]: string
}

interface StreamerData {
  [key: string]: any
}

export default function Home() {
  const [filter, setFilter] = useState("all")
  const [userIds, setUserIds] = useState<any>({})
  const [status, setStatus] = useState<StatusType>({
    ESL_SC2: "Offline",
    OgamingSC2: "Offline",
    cretetion: "Offline",
    freecodecamp: "Offline",
    storbeck: "Offline",
    habathcx: "Offline",
    RobotCaleb: "Offline",
    noobs2ninjas: "Offline"
  })

  const [streamerData, setStreamerData] = useState<StreamerData>({})

  let userArr = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]

  const filteredUsers = userArr.filter(user => {
    if (filter === "all") return true;
    if (filter === "online") return status[user] === "Online";
    if (filter === "offline") return status[user] === "Offline";
  })

  useEffect(() => {
    const fetchUserIds = async () => {
      const userInfoPromises = userArr.map(async (user) => {
        try {
          const response = await fetch(`/api/getUserId?login=${user}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          return { [user]: data.data.data[0]?.id || 'Not found' };
        } catch (error) {
          console.error(`Error fetching Twitch data for ${user}: ${error}`);
          return { [user]: 'Error' };
        }
      })

      const results = await Promise.all(userInfoPromises);
      const combinedResults = Object.assign({}, ...results);
      setUserIds(combinedResults);
    }

    fetchUserIds();
  }, [])

  useEffect(() => {
    if (Object.keys(userIds).length > 0) {
      const fetchStatus = async () => {
        const statusPromises = Object.entries(userIds).map(async ([user, userId]) => {

          try {
            const response = await fetch(`/api/getStatus?user_id=${userId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // return { [user]: data.data.data.length > 0 ? 'Online' : 'Offline' }

            if (data.data.data.length > 0) {
              setStreamerData(prevData => ({
                ...prevData,
                [user]: data.data.data[0]
              }));
              return { [user]: 'Online' };
            } else {
              return { [user]: 'Offline' };
            }
          } catch (error) {
            console.error(`Error fetching Twitch status for ${user}: ${error}`)
            return { [user]: 'Offline' };
          }
        })

        const results = await Promise.all(statusPromises)
        const combinedResults = Object.assign({}, ...results)
        setStatus(combinedResults)
      }

      fetchStatus();
    }
  }, [userIds])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center">
            <img
              src="/twitch.svg"
              alt="Twitch Logo"
              className="mr-4 w-12 h-12 text-purple-400"
            />
            TWITCH STREAMERS
          </h1>
        </header>

        {/* filter options */}
        <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-purple-500 text-white' : 'bg-white bg-opacity-20 text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('online')}
              className={`px-4 py-2 rounded-full ${filter === 'online' ? 'bg-green-500 text-white' : 'bg-white bg-opacity-20 text-white'}`}
            >
              Online
            </button>
            <button
              onClick={() => setFilter('offline')}
              className={`px-4 py-2 rounded-full ${filter === 'offline' ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white'}`}
            >
              Offline
            </button>
          </div>
        </div>

        <main className="bg-white bg-opacity-5 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              status[user] === 'Online' && streamerData[user] ? (
                <OnlineStreamerCard key={index} streamer={streamerData[user]} />
              ) : (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-300 flex justify-between items-center"
                >
                  <p className="text-white text-lg font-semibold">
                    {user}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status[user] === 'Online' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {status[user]}
                  </span>
                </div>
              )
            ))}
          </div>
        </main>
      </div >
    </div >
  );
}

const OnlineStreamerCard = ({ streamer }: { streamer: any }) => {
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-white text-xl font-bold">{streamer.user_name}</h2>
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">LIVE</span>
      </div>
      <p className="text-white text-sm mb-2 line-clamp-2" title={streamer.title}>{streamer.title}</p>
      <p className="text-purple-300 text-sm mb-2">{streamer.game_name}</p>
      <div className="flex items-center text-gray-300 text-xs mb-2">
        <Users size={14} className="mr-1" />
        <span>{streamer.viewer_count} viewers</span>
      </div>
      <div className="flex items-center text-gray-300 text-xs mb-2">
        <Clock size={14} className="mr-1" />
        <span>Started at {formatDate(streamer.started_at)}</span>
      </div>
      <a
        href={`https://twitch.tv/${streamer.user_login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-blue-300 hover:text-blue-100 text-sm"
      >
        <ExternalLink size={14} className="mr-1" />
        Watch Stream
      </a>
    </div>
  );
};