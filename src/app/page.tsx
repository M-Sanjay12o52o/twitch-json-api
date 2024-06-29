"use client"

import { useEffect, useState } from "react"

interface StatusType {
  [key: string]: string
}

export default function Home() {
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

  console.log("userIds: ", userIds)

  let userArr = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]

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
          console.log("userId from fetchStatus: ", userId)

          try {
            const response = await fetch(`/api/getStatus?user_id=${userId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log("getStatusdata: ", data)

            return { [user]: data.data.data.length > 0 ? 'Online' : 'Offline' }
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
        <main className="bg-white bg-opacity-5 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {userArr.map((user, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-300 flex justify-between items-center"
              >
                <p className="text-white text-lg font-semibold">
                  {user}
                </p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status[user] === 'Online' ? 'bg-green-400' : 'bg-red-400'
                  }`}>
                  {status[user]}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}