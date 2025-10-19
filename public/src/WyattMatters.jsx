import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Award, Bell, Settings, CheckCircle, Circle, MessageCircle, TrendingUp, Users, Syringe, AlertCircle, Droplets, Camera } from 'lucide-react';

const WyattMatters = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  
  const [feedingData, setFeedingData] = useState(() => {
    const saved = localStorage.getItem('wyattFeedingData');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('wyattUsers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Dorys', color: '#3b82f6', image: 'https://i.imgur.com/8kLmHXJ.png' },
      { id: 2, name: 'Jesse', color: '#ff6b35', image: 'https://i.imgur.com/N5zQqXM.png' }
    ];
  });
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('wyattSettings');
    return saved ? JSON.parse(saved) : {
      breakfastTime: '08:00',
      dinnerTime: '18:00',
      notificationsEnabled: true,
      wyattImage: 'https://i.imgur.com/oE7VJ5m.jpeg'
    };
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('wyattBadges');
    return saved ? JSON.parse(saved) : [];
  });

  const [vaccines, setVaccines] = useState(() => {
    const saved = localStorage.getItem('wyattVaccines');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Nobivac 3 Year Rabies Vaccine', dueDate: '2028-03-24', completed: true, completedDate: '2025-03-24', provider: 'Ashley Hanks, D.V.M.' },
      { id: 2, name: 'DHLPP Vaccine', dueDate: '2026-03-24', completed: true, completedDate: '2025-03-24', provider: 'Ashley Hanks, D.V.M.' },
      { id: 3, name: 'Bordetella', dueDate: '2025-09-24', completed: false, completedDate: null, provider: 'Ashley Hanks, D.V.M.' },
      { id: 4, name: 'Influenza Vaccine', dueDate: '2026-03-24', completed: false, completedDate: null, provider: 'Ashley Hanks, D.V.M.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('wyattFeedingData', JSON.stringify(feedingData));
  }, [feedingData]);

  useEffect(() => {
    localStorage.setItem('wyattSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('wyattUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('wyattBadges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('wyattVaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  const getDateKey = (date = new Date()) => {
    return date.toISOString().split('T')[0];
  };

  const getTodayData = () => {
    const today = getDateKey();
    return feedingData[today] || { fed: null, ate: null, med: null, water: null, notes: '', photo: null };
  };

  const checkAndAwardBadges = () => {
    const allDates = Object.keys(feedingData).sort();
    const newBadges = [...badges];
    
    let currentStreak = 0;
    for (let i = allDates.length - 1; i >= 0; i--) {
      if (feedingData[allDates[i]].fed) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (currentStreak >= 7 && !badges.find(b => b.id === 'reliable-feeder')) {
      newBadges.push({
        id: 'reliable-feeder',
        name: 'Reliable Feeder',
        description: '7 consecutive days feeding',
        icon: '🌟',
        earnedDate: new Date().toISOString()
      });
    }

    if (currentStreak >= 30 && !badges.find(b => b.id === 'feeding-champion')) {
      newBadges.push({
        id: 'feeding-champion',
        name: 'Feeding Champion',
        description: '30 consecutive days',
        icon: '🏆',
        earnedDate: new Date().toISOString()
      });
    }

    currentStreak = 0;
    for (let i = allDates.length - 1; i >= 0; i--) {
      if (feedingData[allDates[i]].ate) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (currentStreak >= 7 && !badges.find(b => b.id === 'clean-plate')) {
      newBadges.push({
        id: 'clean-plate',
        name: 'Clean Plate Club',
        description: 'Wyatt ate 7 days in a row',
        icon: '🍽️',
        earnedDate: new Date().toISOString()
      });
    }

    if (newBadges.length > badges.length) {
      setBadges(newBadges);
      return newBadges[newBadges.length - 1];
    }
    return null;
  };

  const markFed = () => {
    const today = getDateKey();
    const todayData = getTodayData();
    
    if (todayData.fed) {
      const newData = {
        ...feedingData,
        [today]: {
          ...todayData,
          fed: null
        }
      };
      setFeedingData(newData);
      return;
    }
    
    const newData = {
      ...feedingData,
      [today]: {
        ...todayData,
        fed: {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: new Date().toISOString()
        }
      }
    };
    setFeedingData(newData);
    
    setTimeout(() => {
      if (settings.notificationsEnabled) {
        alert('⏰ Check-in: Did Wyatt eat his food?');
      }
    }, 3000);
  };

  const markAte = () => {
    const today = getDateKey();
    const todayData = getTodayData();
    
    if (todayData.ate) {
      const newData = {
        ...feedingData,
        [today]: {
          ...todayData,
          ate: null
        }
      };
      setFeedingData(newData);
      return;
    }
    
    const newData = {
      ...feedingData,
      [today]: {
        ...todayData,
        ate: {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: new Date().toISOString()
        }
      }
    };
    setFeedingData(newData);
    
    const newBadge = checkAndAwardBadges();
    if (newBadge) {
      setTimeout(() => {
        alert(`🎉 New Badge Earned: ${newBadge.name}!\n${newBadge.description}`);
      }, 500);
    }
  };

  const markMed = () => {
    const today = getDateKey();
    const todayData = getTodayData();
    
    if (todayData.med) {
      const newData = {
        ...feedingData,
        [today]: {
          ...todayData,
          med: null
        }
      };
      setFeedingData(newData);
      return;
    }
    
    const newData = {
      ...feedingData,
      [today]: {
        ...todayData,
        med: {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: new Date().toISOString()
        }
      }
    };
    setFeedingData(newData);
  };

  const markWater = () => {
    const today = getDateKey();
    const todayData = getTodayData();
    
    if (todayData.water) {
      const newData = {
        ...feedingData,
        [today]: {
          ...todayData,
          water: null
        }
      };
      setFeedingData(newData);
      return;
    }
    
    const newData = {
      ...feedingData,
      [today]: {
        ...todayData,
        water: {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: new Date().toISOString()
        }
      }
    };
    setFeedingData(newData);
  };

  const sendNudge = () => {
    alert('📱 Nudge sent to household members!');
  };

  const updateUserImage = (userId, newImageUrl) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, image: newImageUrl } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('wyattUsers', JSON.stringify(updatedUsers));
  };

  const updateWyattImage = (newImageUrl) => {
    const updatedSettings = { ...settings, wyattImage: newImageUrl };
    setSettings(updatedSettings);
    localStorage.setItem('wyattSettings', JSON.stringify(updatedSettings));
  };

  const AuthScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-blue-200">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 p-2 shadow-xl">
            <img 
              src={settings.wyattImage} 
              alt="Wyatt"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Wyatt Matters
          </h1>
          <p className="text-gray-600 font-medium">Track your pup's daily care</p>
        </div>
        
        <div className="space-y-4">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                setCurrentUser(user);
                setShowAuth(false);
              }}
              className="w-full p-5 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-4"
              style={{ 
                borderColor: user.color, 
                backgroundColor: user.color + '15',
                borderWidth: '3px',
                borderStyle: 'solid'
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                style={{ backgroundColor: user.color }}
              >
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-gray-700">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Dashboard = () => {
    const todayData = getTodayData();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-3xl p-6 text-white shadow-2xl border-4 border-gray-900">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
              <img 
                src={settings.wyattImage} 
                alt="Wyatt"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Wyatt's Day</h2>
              <p className="text-gray-200 text-sm">{dateStr}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div 
            className={`rounded-2xl p-5 shadow-lg transition-all ${
              todayData.fed ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-3 border-green-400' : 'bg-white border-3 border-gray-300'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid' }}
          >
            <div className="flex flex-col items-center text-center">
              {todayData.fed ? (
                <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
              ) : (
                <Circle className="w-12 h-12 text-gray-400 mb-2" />
              )}
              <h3 className="font-bold text-base mb-1">🍽️ Fed</h3>
              {todayData.fed ? (
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{todayData.fed.userName}</p>
                  <p>{new Date(todayData.fed.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-medium">Not yet</p>
              )}
            </div>
          </div>

          <div 
            className={`rounded-2xl p-5 shadow-lg transition-all ${
              todayData.ate ? 'bg-gradient-to-br from-pink-50 to-rose-100' : 'bg-white'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.ate ? '#f9a8d4' : '#d1d5db' }}
          >
            <div className="flex flex-col items-center text-center">
              {todayData.ate ? (
                <CheckCircle className="w-12 h-12 text-pink-600 mb-2" />
              ) : (
                <Circle className="w-12 h-12 text-gray-400 mb-2" />
              )}
              <h3 className="font-bold text-base mb-1">✨ Ate</h3>
              {todayData.ate ? (
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{todayData.ate.userName}</p>
                  <p>{new Date(todayData.ate.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-medium">Not yet</p>
              )}
            </div>
          </div>

          <div 
            className={`rounded-2xl p-5 shadow-lg transition-all ${
              todayData.med ? 'bg-gradient-to-br from-purple-50 to-violet-100' : 'bg-white'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.med ? '#c084fc' : '#d1d5db' }}
          >
            <div className="flex flex-col items-center text-center">
              {todayData.med ? (
                <CheckCircle className="w-12 h-12 text-purple-600 mb-2" />
              ) : (
                <Circle className="w-12 h-12 text-gray-400 mb-2" />
              )}
              <h3 className="font-bold text-base mb-1">💊 Med</h3>
              {todayData.med ? (
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{todayData.med.userName}</p>
                  <p>{new Date(todayData.med.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-medium">Not yet</p>
              )}
            </div>
          </div>

          <div 
            className={`rounded-2xl p-5 shadow-lg transition-all ${
              todayData.water ? 'bg-gradient-to-br from-cyan-50 to-blue-100' : 'bg-white'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.water ? '#67e8f9' : '#d1d5db' }}
          >
            <div className="flex flex-col items-center text-center">
              {todayData.water ? (
                <CheckCircle className="w-12 h-12 text-cyan-600 mb-2" />
              ) : (
                <Circle className="w-12 h-12 text-gray-400 mb-2" />
              )}
              <h3 className="font-bold text-base mb-1">💧 Water</h3>
              {todayData.water ? (
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{todayData.water.userName}</p>
                  <p>{new Date(todayData.water.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-medium">Not yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={markFed}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              todayData.fed
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.fed ? '#86efac' : '#1d4ed8' }}
          >
            {todayData.fed ? '✓ Fed Today (tap to undo)' : '🍽️ Mark as Fed'}
          </button>

          <button
            onClick={markAte}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              todayData.ate
                ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 active:scale-95'
            }`}
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.ate ? '#f9a8d4' : '#be185d' }}
          >
            {todayData.ate ? '✓ Ate Today (tap to undo)' : '✨ Mark as Ate'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={markMed}
              className={`py-4 rounded-2xl font-bold text-base transition-all shadow-lg ${
                todayData.med
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 active:scale-95'
              }`}
              style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.med ? '#d8b4fe' : '#7e22ce' }}
            >
              {todayData.med ? '✓ Med (undo)' : '💊 Allergy Med'}
            </button>

            <button
              onClick={markWater}
              className={`py-4 rounded-2xl font-bold text-base transition-all shadow-lg ${
                todayData.water
                  ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 active:scale-95'
              }`}
              style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: todayData.water ? '#a5f3fc' : '#0891b2' }}
            >
              {todayData.water ? '✓ Water (undo)' : '💧 Refill Water'}
            </button>
          </div>

          <button
            onClick={sendNudge}
            className="w-full py-3 rounded-2xl font-semibold text-base transition-all bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 hover:from-orange-200 hover:to-amber-200 active:scale-95 shadow-lg"
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#fb923c' }}
          >
            <Bell className="inline w-5 h-5 mr-2" />
            Send Nudge to Family
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#e5e7eb' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            This Week's Stats
          </h3>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(feedingData).filter(d => {
                  const date = new Date(d);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo && feedingData[d].fed;
                }).length}
              </div>
              <div className="text-xs text-gray-600 font-semibold">Fed</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-3 border-2 border-pink-200">
              <div className="text-2xl font-bold text-pink-600">
                {Object.keys(feedingData).filter(d => {
                  const date = new Date(d);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo && feedingData[d].ate;
                }).length}
              </div>
              <div className="text-xs text-gray-600 font-semibold">Ate</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(feedingData).filter(d => {
                  const date = new Date(d);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo && feedingData[d].med;
                }).length}
              </div>
              <div className="text-xs text-gray-600 font-semibold">Meds</div>
            </div>
            <div className="bg-cyan-50 rounded-xl p-3 border-2 border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">
                {Object.keys(feedingData).filter(d => {
                  const date = new Date(d);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo && feedingData[d].water;
                }).length}
              </div>
              <div className="text-xs text-gray-600 font-semibold">Water</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{badges.length}</div>
              <div className="text-xs text-gray-600 font-semibold">Badges</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const History = () => {
    const sortedDates = Object.keys(feedingData).sort().reverse();

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Feeding History
        </h2>

        {sortedDates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No feeding history yet</p>
            <p className="text-sm">Start tracking Wyatt's meals!</p>
          </div>
        ) : (
          sortedDates.map(date => {
            const data = feedingData[date];
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });

            return (
              <div key={date} className="bg-white rounded-2xl p-5 shadow-md">
                <div className="font-bold text-gray-700 mb-3">{dateStr}</div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {data.fed ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <span className="font-medium">Fed by {data.fed.userName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(data.fed.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-400">Not fed</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {data.ate ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <span className="font-medium">Ate (confirmed by {data.ate.userName})</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(data.ate.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-400">Eating not confirmed</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {data.med ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <span className="font-medium">Allergy med given by {data.med.userName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(data.med.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-400">Med not given</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {data.water ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <span className="font-medium">Water refilled by {data.water.userName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(data.water.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-400">Water not refilled</span>
                      </>
                    )}
                  </div>

                  {data.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      {data.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const Badges = () => {
    const allBadges = [
      { id: 'reliable-feeder', name: 'Reliable Feeder', description: '7 consecutive days feeding', icon: '🌟', requirement: 7 },
      { id: 'feeding-champion', name: 'Feeding Champion', description: '30 consecutive days', icon: '🏆', requirement: 30 },
      { id: 'clean-plate', name: 'Clean Plate Club', description: 'Wyatt ate 7 days in a row', icon: '🍽️', requirement: 7 },
      { id: 'early-bird', name: 'Early Bird', description: 'Fed before 8 AM for 7 days', icon: '🌅', requirement: 7 },
      { id: 'never-forget', name: 'Never Forget', description: '100 feedings logged', icon: '💯', requirement: 100 },
      { id: 'team-player', name: 'Team Player', description: 'Shared feeding duties equally', icon: '🤝', requirement: 20 }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Badge Collection
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {allBadges.map(badge => {
            const earned = badges.find(b => b.id === badge.id);
            
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                  {earned ? (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Earned {new Date(earned.earnedDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Not yet earned</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">🎯 Keep Going!</h3>
          <p className="text-sm opacity-90">
            You've earned {badges.length} out of {allBadges.length} badges. 
            Stay consistent to unlock them all!
          </p>
        </div>
      </div>
    );
  };

  const Vaccines = () => {
    const today = new Date();
    const upcomingVaccines = vaccines.filter(v => !v.completed).sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );
    const completedVaccines = vaccines.filter(v => v.completed).sort((a, b) => 
      new Date(b.completedDate) - new Date(a.completedDate)
    );

    const getDaysUntil = (dateStr) => {
      const due = new Date(dateStr);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getStatusColor = (daysUntil) => {
      if (daysUntil < 0) return 'text-red-600 bg-red-50 border-red-300';
      if (daysUntil <= 30) return 'text-orange-600 bg-orange-50 border-orange-300';
      if (daysUntil <= 90) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      return 'text-blue-600 bg-blue-50 border-blue-300';
    };

    const getStatusText = (daysUntil) => {
      if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
      if (daysUntil === 0) return 'Due today!';
      if (daysUntil === 1) return 'Due tomorrow';
      if (daysUntil <= 7) return `Due in ${daysUntil} days`;
      if (daysUntil <= 30) return `Due in ${Math.ceil(daysUntil / 7)} weeks`;
      return `Due in ${Math.ceil(daysUntil / 30)} months`;
    };

    const toggleVaccineComplete = (vaccineId) => {
      setVaccines(vaccines.map(v => {
        if (v.id === vaccineId) {
          return {
            ...v,
            completed: !v.completed,
            completedDate: !v.completed ? new Date().toISOString().split('T')[0] : null
          };
        }
        return v;
      }));
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Syringe className="w-6 h-6" />
          Vaccine Schedule
        </h2>

        {upcomingVaccines.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Upcoming & Due
            </h3>
            <div className="space-y-3">
              {upcomingVaccines.map(vaccine => {
                const daysUntil = getDaysUntil(vaccine.dueDate);
                const statusColor = getStatusColor(daysUntil);
                
                return (
                  <div key={vaccine.id} className={`bg-white rounded-2xl p-5 shadow-md border-2 ${statusColor}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{vaccine.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{vaccine.provider}</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {new Date(vaccine.dueDate).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleVaccineComplete(vaccine.id)}
                        className="ml-3 px-4 py-2 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-all active:scale-95"
                      >
                        Mark Done
                      </button>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${statusColor}`}>
                      {getStatusText(daysUntil)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedVaccines.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Completed
            </h3>
            <div className="space-y-3">
              {completedVaccines.map(vaccine => (
                <div key={vaccine.id} className="bg-green-50 rounded-2xl p-5 shadow-md border-2 border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h4 className="font-bold text-gray-800">{vaccine.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{vaccine.provider}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-700">
                          <span className="font-medium">Completed:</span>
                          <span>
                            {new Date(vaccine.completedDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Next due:</span>
                          <span>
                            {new Date(vaccine.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleVaccineComplete(vaccine.id)}
                      className="ml-3 px-3 py-1 text-gray-500 text-sm hover:text-gray-700 transition-all"
                    >
                      Undo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">📋 Vaccine Status</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
              <div className="text-3xl font-bold">{completedVaccines.length}</div>
              <div className="text-sm opacity-90">Up to date</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
              <div className="text-3xl font-bold">{upcomingVaccines.length}</div>
              <div className="text-sm opacity-90">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [editingWyatt, setEditingWyatt] = useState(false);
    const [newWyattUrl, setNewWyattUrl] = useState('');

    const handleUpdateUserImage = (userId) => {
      if (newImageUrl.trim()) {
        updateUserImage(userId, newImageUrl);
        setNewImageUrl('');
        setEditingUser(null);
        alert('✅ Profile picture updated!');
      }
    };

    const handleUpdateWyattImage = () => {
      if (newWyattUrl.trim()) {
        updateWyattImage(newWyattUrl);
        setNewWyattUrl('');
        setEditingWyatt(false);
        alert('✅ Wyatt\'s photo updated!');
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h2>

        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-700" />
            Wyatt's Photo
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 p-1 shadow-lg">
              <img 
                src={settings.wyattImage} 
                alt="Wyatt"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://i.imgur.com/oE7VJ5m.jpeg';
                }}
              />
            </div>
            <button
              onClick={() => setEditingWyatt(!editingWyatt)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all active:scale-95"
            >
              {editingWyatt ? 'Cancel' : 'Change Photo'}
            </button>
          </div>
          
          {editingWyatt && (
            <div className="space-y-3 mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://i.imgur.com/example.jpg"
                value={newWyattUrl}
                onChange={(e) => setNewWyattUrl(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleUpdateWyattImage}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all active:scale-95"
              >
                💾 Save Photo
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Feeding Schedule</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breakfast Time
              </label>
              <input
                type="time"
                value={settings.breakfastTime}
                onChange={(e) => setSettings({...settings, breakfastTime: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dinner Time
              </label>
              <input
                type="time"
                value={settings.dinnerTime}
                onChange={(e) => setSettings({...settings, dinnerTime: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-gray-700">Notifications</span>
              <button
                onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                  settings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Household Members
          </h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shadow-md"
                    style={{ backgroundColor: user.color }}
                  >
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = user.id === 1 ? 'https://i.imgur.com/8kLmHXJ.png' : 'https://i.imgur.com/N5zQqXM.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 text-lg">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (editingUser === user.id) {
                        setEditingUser(null);
                        setNewImageUrl('');
                      } else {
                        setEditingUser(user.id);
                        setNewImageUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-all active:scale-95"
                  >
                    {editingUser === user.id ? 'Cancel' : '✏️ Edit'}
                  </button>
                </div>
                
                {editingUser === user.id && (
                  <div className="space-y-3 mt-3 p-4 bg-white rounded-xl border-2 border-blue-200">
                    <label className="block text-sm font-medium text-gray-700">
                      New Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://i.imgur.com/example.png"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateUserImage(user.id)}
                      className="w-full py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all active:scale-95"
                    >
                      💾 Save Image
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setShowAuth(true);
            setCurrentUser(null);
          }}
          className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold border-2 border-red-200 hover:bg-red-100 transition-all"
        >
          🔄 Switch User
        </button>
      </div>
    );
  };

  if (showAuth) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 p-1">
              <img 
                src={settings.wyattImage} 
                alt="Wyatt"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">Wyatt Matters</h1>
              <p className="text-xs text-gray-600">Logged in as {currentUser?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-24">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'history' && <History />}
        {currentView === 'badges' && <Badges />}
        {currentView === 'vaccines' && <Vaccines />}
        {currentView === 'settings' && <SettingsView />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-2xl mx-auto px-2 py-3 flex justify-around">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'dashboard' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Heart className="w-6 h-6" fill={currentView === 'dashboard' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'history' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setCurrentView('vaccines')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'vaccines' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Syringe className="w-6 h-6" />
            <span className="text-xs font-medium">Vaccines</span>
          </button>

          <button
            onClick={() => setCurrentView('badges')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'badges' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Award className="w-6 h-6" />
            <span className="text-xs font-medium">Badges</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'settings' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WyattMatters;
