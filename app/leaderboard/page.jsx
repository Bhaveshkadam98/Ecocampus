"use client";
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    fetchLeaderboard();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
      
      setLeaders(data.leaders || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { name: 'Seed', emoji: '🌱', min: 0, max: 50, color: 'text-green-400', bgColor: 'from-green-100 to-green-200' },
    { name: 'Sprout', emoji: '🌿', min: 51, max: 150, color: 'text-green-500', bgColor: 'from-green-200 to-green-300' },
    { name: 'Sapling', emoji: '🌳', min: 151, max: 300, color: 'text-green-600', bgColor: 'from-green-300 to-green-400' },
    { name: 'Tree', emoji: '🌲', min: 301, max: 500, color: 'text-green-700', bgColor: 'from-green-400 to-green-500' },
    { name: 'Guardian', emoji: '🏔️', min: 501, max: 1000, color: 'text-emerald-800', bgColor: 'from-emerald-400 to-emerald-500' }
  ];

  const getStageInfo = (points) => {
    return stages.find(stage => points >= stage.min && points <= stage.max) || stages[0];
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 via-yellow-500 to-amber-600';
      case 1: return 'from-gray-300 via-gray-400 to-gray-500';
      case 2: return 'from-amber-400 via-orange-500 to-amber-600';
      default: return 'from-emerald-400 to-green-500';
    }
  };

  // Generate avatar based on name
  const getAvatar = (name) => {
    const avatars = ['👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '👨‍🌾', '👩‍🌾', '👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫'];
    const index = name ? name.charCodeAt(0) % avatars.length : 0;
    return avatars[index];
  };

  const filteredLeaders = filterLevel === 'all' 
    ? leaders 
    : leaders.filter(leader => getStageInfo(leader.greenPoints).name === filterLevel);

  const topStats = [
    {
      label: 'Total Eco Warriors',
      value: leaders.length,
      icon: '👥',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      label: 'Combined Green Points',
      value: leaders.reduce((sum, leader) => sum + (leader.greenPoints || 0), 0).toLocaleString(),
      icon: '⭐',
      color: 'from-green-400 to-emerald-500'
    },
    {
      label: 'Total Badges',
      value: leaders.reduce((sum, leader) => sum + (leader.badges?.length || 0), 0),
      icon: '🏅',
      color: 'from-purple-400 to-violet-500'
    },
    {
      label: 'Guardians Reached',
      value: leaders.filter(l => getStageInfo(l.greenPoints).name === 'Guardian').length,
      icon: '🏔️',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes crown-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-crown-float { animation: crown-float 3s ease-in-out infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .hover-lift { 
          transition: all 0.3s ease; 
        }
        .hover-lift:hover { 
          transform: translateY(-8px) scale(1.02); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
        }
        .glass { 
          backdrop-filter: blur(12px); 
          background: rgba(255,255,255,0.85); 
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        .rank-glow {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        .loading-pulse {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Interactive Cursor Effect */}
      <div 
        className="fixed w-4 h-4 bg-green-400/20 rounded-full pointer-events-none mix-blend-multiply blur-sm transition-all duration-300 z-50"
        style={{ 
          left: mousePosition.x - 8, 
          top: mousePosition.y - 8
        }}
      />

      {/* Header Section */}
      <div className="relative pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-6 border border-green-200/50 shadow-lg hover-lift">
              <span className="text-2xl animate-crown-float">👑</span>
              <span className="text-green-700 font-semibold">Hall of Fame</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent">
                Eco Champions
              </span>
              <br />
              <span className="text-gray-800">Leaderboard</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Celebrating the green warriors who are transforming our campus into a sustainable paradise
            </p>
          </div>

          {/* Stats Overview */}
          {!loading && !error && leaders.length > 0 && (
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}>
              {topStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`glass rounded-2xl p-6 border border-green-200/50 shadow-lg text-center hover-lift animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`text-4xl mb-3 p-3 rounded-full bg-gradient-to-r ${stat.color} w-16 h-16 flex items-center justify-center mx-auto text-white shadow-lg animate-float`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-black text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Level Filters */}
          {!loading && !error && leaders.length > 0 && (
            <div className={`flex flex-wrap justify-center gap-2 mb-8 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => setFilterLevel('all')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                  filterLevel === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : 'glass text-gray-600 border border-green-200/50'
                }`}
              >
                <span>🌟</span>
                <span>All Champions</span>
              </button>
              {stages.reverse().map((stage) => (
                <button
                  key={stage.name}
                  onClick={() => setFilterLevel(stage.name)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                    filterLevel === stage.name
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                      : 'glass text-gray-600 border border-green-200/50'
                  }`}
                >
                  <span className="animate-bounce-gentle">{stage.emoji}</span>
                  <span>{stage.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Leaderboard */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="glass rounded-3xl p-8 border border-green-200/50 shadow-xl">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600 font-medium">Loading eco champions...</span>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-6 p-6 rounded-2xl loading-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-3xl p-8 border border-red-200/50 shadow-xl text-center">
            <div className="text-6xl mb-4 animate-bounce-gentle">😔</div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover-lift transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : leaders.length === 0 ? (
          <div className="glass rounded-3xl p-8 border border-green-200/50 shadow-xl text-center">
            <div className="text-6xl mb-4 animate-bounce-gentle">🌱</div>
            <h3 className="text-xl font-semibold mb-2">No champions yet!</h3>
            <p className="text-gray-600 mb-6">Be the first to make a difference and claim your spot on the leaderboard!</p>
            <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover-lift transition-all shadow-lg">
              Start Your Green Journey
            </button>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 border border-green-200/50 shadow-xl animate-slide-in-up">
            <div className="space-y-4">
              {filteredLeaders.map((leader, index) => {
                const stageInfo = getStageInfo(leader.greenPoints || 0);
                const isTopThree = index < 3;
                
                return (
                  <div
                    key={leader._id}
                    className={`relative flex items-center gap-6 p-6 rounded-2xl border transition-all duration-300 hover-lift animate-slide-in-left ${
                      isTopThree 
                        ? 'bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-amber-200 rank-glow' 
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Rank Number */}
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-full font-black text-xl text-white shadow-lg bg-gradient-to-r ${getRankColor(index)}`}>
                      {isTopThree && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-crown-float">
                          {getRankIcon(index)}
                        </div>
                      )}
                      #{index + 1}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="text-4xl p-2 bg-white rounded-full shadow-md animate-bounce-gentle">
                          {getAvatar(leader.name)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 text-lg animate-float`}>
                          {stageInfo.emoji}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{leader.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${stageInfo.bgColor} text-white`}>
                            {stageInfo.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <span>⭐</span> {leader.greenPoints || 0} points
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🏅</span> {leader.badges?.length || 0} badges
                          </span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1">
                          {(leader.badges || []).slice(0, 3).map((badge, badgeIndex) => (
                            <span
                              key={badgeIndex}
                              className={`px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium animate-scale-in`}
                              style={{ animationDelay: `${index * 0.1 + badgeIndex * 0.05}s` }}
                            >
                              {badge}
                            </span>
                          ))}
                          {(leader.badges?.length || 0) > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              +{leader.badges.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Points Display */}
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-600 mb-1">
                        {leader.greenPoints || 0}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Green Points
                      </div>
                    </div>

                    {/* Special Effects for Top 3 */}
                    {isTopThree && (
                      <div className="absolute inset-0 rounded-2xl shimmer pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredLeaders.length === 0 && filterLevel !== 'all' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce-gentle">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No champions found</h3>
                <p className="text-gray-600">No eco-warriors match the selected level filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Motivational Footer */}
        {!loading && !error && leaders.length > 0 && (
          <div className="text-center mt-12 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="glass rounded-2xl p-8 border border-green-200/50 shadow-lg max-w-2xl mx-auto">
              <div className="text-4xl mb-4 animate-bounce-gentle">🏆</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Ready to Join the Champions?
              </h3>
              <p className="text-gray-600 mb-6">
                Every small action counts towards a greener future. Start your eco-journey today!
              </p>
              <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold hover-lift transition-all shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  Start Your Green Journey
                  <span className="text-xl animate-bounce-gentle">🚀</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;