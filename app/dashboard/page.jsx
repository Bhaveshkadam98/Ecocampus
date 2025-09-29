'use client';

import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    type: 'tree-planting',
    description: '',
    location: { placeName: '' },
    images: [],
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom toast notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Custom router simulation (for demo purposes)
  const navigateToLogin = () => {
    showNotification('Please login to continue', 'error');
    // In a real app, this would redirect to login
  };

  const ACTIVITY_TYPES = {
    'tree-planting': { name: 'Tree Planting', icon: '🌳', points: 50, color: 'from-emerald-400 to-green-500' },
    'recycling': { name: 'Recycling', icon: '♻️', points: 30, color: 'from-blue-400 to-cyan-500' },
    'cleanup': { name: 'Campus Cleanup', icon: '🧹', points: 25, color: 'from-purple-400 to-violet-500' },
    'energy-saving': { name: 'Energy Conservation', icon: '💡', points: 35, color: 'from-yellow-400 to-orange-500' },
    'water-conservation': { name: 'Water Conservation', icon: '💧', points: 40, color: 'from-cyan-400 to-blue-500' }
  };

  const stages = [
    { name: 'Seed', emoji: '🌱', min: 0, max: 50, color: 'text-green-400' },
    { name: 'Sprout', emoji: '🌿', min: 51, max: 150, color: 'text-green-500' },
    { name: 'Sapling', emoji: '🌳', min: 151, max: 300, color: 'text-green-600' },
    { name: 'Tree', emoji: '🌲', min: 301, max: 500, color: 'text-green-700' },
    { name: 'Guardian', emoji: '🏔️', min: 501, max: 1000, color: 'text-emerald-800' }
  ];

  useEffect(() => {
    fetchUserData();
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchUserData = async () => {
    const token = localStorage?.getItem('token');
    if (!token) {
      navigateToLogin();
      return;
    }

    try {
      const [userResponse, activitiesResponse] = await Promise.all([
        fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/activities/user/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!userResponse.ok || !activitiesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const userData = await userResponse.json();
      const activitiesData = await activitiesResponse.json();

      setUser(userData.user);
      setActivities(activitiesData.activities);
    } catch (error) {
      showNotification('Failed to load data', 'error');
      navigateToLogin();
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStage = () => {
    const userPoints = user?.greenPoints || 0;
    return stages.find(stage => userPoints >= stage.min && userPoints <= stage.max) || stages[0];
  };

  const getProgressPercentage = () => {
    const userPoints = user?.greenPoints || 0;
    const currentStage = getCurrentStage();
    const progress = ((userPoints - currentStage.min) / (currentStage.max - currentStage.min)) * 100;
    return Math.min(progress, 100);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage?.getItem('token');
    if (!token) {
      showNotification('Authentication required', 'error');
      navigateToLogin();
      setSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', JSON.stringify(formData.location));
    
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        showNotification('Activity submitted for approval!', 'success');
        setFormData({
          type: 'tree-planting',
          description: '',
          location: { placeName: '' },
          images: [],
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        await fetchUserData(); // Refresh data
        setActiveTab('activities'); // Switch to activities tab
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit activity');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to submit activity', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { label: 'Green Points', value: user?.greenPoints || 0, icon: '🌟', color: 'from-emerald-400 to-green-500' },
    { label: 'Activities', value: activities?.length || 0, icon: '📊', color: 'from-blue-400 to-cyan-500' },
    { label: 'Level', value: getCurrentStage().name, icon: '🎯', color: 'from-purple-400 to-violet-500' },
    { label: 'Badges', value: user?.badges?.length || 0, icon: '🏆', color: 'from-yellow-400 to-orange-500' }
  ];

  const achievements = [
    { name: 'First Steps', desc: 'Submit your first activity', icon: '🌱', unlocked: activities?.length > 0 },
    { name: 'Tree Hugger', desc: 'Plant your first tree', icon: '🌳', unlocked: activities?.some(a => a.type === 'tree-planting') },
    { name: 'Recycling Hero', desc: 'Complete recycling activity', icon: '♻️', unlocked: activities?.some(a => a.type === 'recycling') },
    { name: 'Clean Sweep', desc: 'Complete campus cleanup', icon: '🧹', unlocked: activities?.some(a => a.type === 'cleanup') },
    { name: 'Energy Saver', desc: 'Complete energy saving activity', icon: '⚡', unlocked: activities?.some(a => a.type === 'energy-saving') },
    { name: 'Water Guardian', desc: 'Complete water conservation activity', icon: '💧', unlocked: activities?.some(a => a.type === 'water-conservation') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your eco journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in-up ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: var(--progress-width); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-progress-bar { animation: progress-bar 1s ease-out 0.5s both; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .glass { backdrop-filter: blur(12px); background: rgba(255,255,255,0.8); }
        .tab-transition { transition: all 0.4s ease; }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
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
      <div className="relative pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-4 border border-green-200/50 shadow-lg hover-lift">
              <span className="text-2xl animate-bounce-gentle">{getCurrentStage().emoji}</span>
              <span className="text-green-700 font-semibold">Level: {getCurrentStage().name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{user?.name || 'Eco Warrior'}</span>
            </h1>
            <p className="text-lg text-gray-600">Continue building your green legacy on campus</p>
          </div>

          {/* Progress Bar */}
          <div className={`max-w-2xl mx-auto glass rounded-2xl p-6 border border-green-200/50 shadow-lg mb-8 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">Progress to {stages[stages.findIndex(s => s.name === getCurrentStage().name) + 1]?.name || 'Max Level'}</span>
              <span className="text-sm font-bold text-emerald-600">{user?.greenPoints || 0} / {getCurrentStage().max} pts</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-progress-bar"
                style={{ '--progress-width': `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'activities', label: 'My Activities', icon: '🌱' },
            { id: 'submit', label: 'New Activity', icon: '➕' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'glass text-gray-600 hover:bg-white/90 border border-green-200/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-transition">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in-up">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
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

              {/* Recent Activities & User Info */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <div className="glass rounded-2xl p-6 border border-green-200/50 shadow-lg animate-slide-in-left">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>📈</span> Recent Activities
                  </h3>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((activity, index) => (
                      <div key={activity._id} className={`flex items-center gap-3 p-3 bg-green-50/50 rounded-xl hover-lift animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="text-2xl animate-bounce-gentle">{ACTIVITY_TYPES[activity.type]?.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{ACTIVITY_TYPES[activity.type]?.name}</div>
                          <div className="text-sm text-gray-600">{activity.location.placeName}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          activity.status === 'approved' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {activity.status}
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <div className="text-center py-6">
                        <div className="text-4xl mb-2 animate-bounce-gentle">🌱</div>
                        <p className="text-gray-500">No activities yet!</p>
                        <button
                          onClick={() => setActiveTab('submit')}
                          className="mt-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Submit your first activity →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Level Progress & Badges */}
                <div className="space-y-6 animate-slide-in-right">
                  {/* Level Stages */}
                  <div className="glass rounded-2xl p-6 border border-green-200/50 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>🎯</span> Evolution Path
                    </h3>
                    <div className="space-y-2">
                      {stages.map((stage, index) => (
                        <div key={stage.name} className={`flex items-center gap-3 p-2 rounded-lg transition-all hover-lift ${
                          (user?.greenPoints || 0) >= stage.min ? 'bg-green-100 text-green-700' : 'text-gray-500'
                        }`}>
                          <span className="text-xl animate-bounce-gentle" style={{ animationDelay: `${index * 0.2}s` }}>{stage.emoji}</span>
                          <span className="font-medium">{stage.name}</span>
                          <span className="text-xs ml-auto">{stage.min}-{stage.max} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="glass rounded-2xl p-6 border border-green-200/50 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>🏅</span> Badges Earned
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.badges?.length > 0 ? (
                        user.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-3 py-2 rounded-full text-sm font-semibold border border-emerald-200 hover-lift animate-scale-in`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {badge}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No badges earned yet. Complete activities to unlock badges!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="animate-fade-in-up space-y-6">
              <div className="glass rounded-2xl p-6 border border-green-200/50 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>🌱</span> My Green Activities
                </h2>
                {activities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-bounce-gentle">🌱</div>
                    <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
                    <p className="text-gray-600 mb-4">Start your green journey by submitting your first eco-friendly activity!</p>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover-lift transition-all"
                    >
                      Submit Activity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div
                        key={activity._id}
                        className={`bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 shadow-md hover-lift animate-fade-in-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-3xl p-3 rounded-full bg-gradient-to-r ${ACTIVITY_TYPES[activity.type]?.color || 'from-gray-400 to-gray-500'} text-white shadow-lg animate-float`}>
                            {ACTIVITY_TYPES[activity.type]?.icon || '🌿'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {ACTIVITY_TYPES[activity.type]?.name || 'Unknown Activity'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                activity.status === 'approved' 
                                  ? 'bg-green-200 text-green-700' 
                                  : activity.status === 'pending'
                                  ? 'bg-yellow-200 text-yellow-700'
                                  : 'bg-red-200 text-red-700'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <span>📍</span> {activity.location.placeName}
                              </span>
                              <span className="flex items-center gap-1">
                                <span>📅</span> {new Date(activity.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <span>⭐</span> +{activity.greenPoints} points
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Activity Tab */}
          {activeTab === 'submit' && (
            <div className="animate-fade-in-up">
              <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-green-200/50 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>➕</span> Submit New Activity
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Activity Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(ACTIVITY_TYPES).map(([key, type]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: key })}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left hover-lift ${
                            formData.type === key
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-2xl animate-bounce-gentle">{type.icon}</span>
                          <div>
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-xs text-gray-500">+{type.points} points</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your eco-friendly activity in detail..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                      value={formData.location.placeName}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, placeName: e.target.value }
                      })}
                      placeholder="Where did this activity take place?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Upload Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                      <div className="text-4xl mb-2 animate-bounce-gentle">📸</div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-2">Upload photos to verify your activity</p>
                      {formData.images.length > 0 && (
                        <p className="text-sm text-emerald-600 mt-1">{formData.images.length} file(s) selected</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover-lift disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Submit Activity
                        <span className="text-xl animate-bounce-gentle">🚀</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="animate-fade-in-up">
              <div className="glass rounded-2xl p-8 border border-green-200/50 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>🏆</span> Achievements
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement.name}
                      className={`p-6 rounded-2xl border-2 transition-all hover-lift animate-scale-in ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`text-4xl mb-3 animate-bounce-gentle ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-bold text-lg mb-2 ${
                        achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {achievement.desc}
                      </p>
                      {achievement.unlocked && (
                        <div className="mt-3 inline-flex items-center gap-1 bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold animate-scale-in">
                          <span>✓</span> Unlocked
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;