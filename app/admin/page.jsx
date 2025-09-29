"use client";
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [approvedActivities, setApprovedActivities] = useState([]);
  const [rejectedActivities, setRejectedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    checkAdminAccess();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Unauthorized');

      const data = await response.json();
      if (data.user.role !== 'admin') {
        // toast.error('Admin access required');
        // router.push('/admin');
        return;
      }

      setUser(data.user);
      await Promise.all([
        fetchPendingActivities(),
        fetchApprovedActivities(),
        fetchRejectedActivities()
      ]);
    } catch (error) {
      console.error('Admin access error:', error);
      // router.push('/login');
    }
  };

  const fetchPendingActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/activities/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to fetch pending activities:', error);
      // toast.error('Failed to fetch pending activities');
    }
  };

  const fetchApprovedActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/activities/approved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApprovedActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch approved activities:', error);
    }
  };

  const fetchRejectedActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/activities/rejected', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRejectedActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch rejected activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (activityId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/activities/${activityId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // toast.success('Activity approved!');
        await Promise.all([
          fetchPendingActivities(),
          fetchApprovedActivities()
        ]);
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      console.error('Failed to approve activity:', error);
      // toast.error('Failed to approve activity');
    }
  };

  const handleReject = async (activityId, comment) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/activities/${activityId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      });

      if (response.ok) {
        // toast.success('Activity rejected');
        await Promise.all([
          fetchPendingActivities(),
          fetchRejectedActivities()
        ]);
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      console.error('Failed to reject activity:', error);
      // toast.error('Failed to reject activity');
    }
  };

  const ACTIVITY_TYPES = {
    'tree-planting': { name: 'Tree Planting', icon: '🌳', color: 'from-emerald-400 to-green-500' },
    'recycling': { name: 'Recycling', icon: '♻️', color: 'from-blue-400 to-cyan-500' },
    'cleanup': { name: 'Campus Cleanup', icon: '🧹', color: 'from-purple-400 to-violet-500' },
    'energy-saving': { name: 'Energy Conservation', icon: '💡', color: 'from-yellow-400 to-orange-500' },
    'water-conservation': { name: 'Water Conservation', icon: '💧', color: 'from-cyan-400 to-blue-500' }
  };

  const getCurrentActivities = () => {
    switch (activeTab) {
      case 'pending': return pendingActivities;
      case 'approved': return approvedActivities;
      case 'rejected': return rejectedActivities;
      default: return [];
    }
  };

  const getTabStats = () => {
    return [
      {
        label: 'Pending Reviews',
        value: pendingActivities.length,
        icon: '⏳',
        color: 'from-orange-400 to-red-500'
      },
      {
        label: 'Approved Activities',
        value: approvedActivities.length,
        icon: '✅',
        color: 'from-green-400 to-emerald-500'
      },
      {
        label: 'Rejected Activities',
        value: rejectedActivities.length,
        icon: '❌',
        color: 'from-red-400 to-pink-500'
      },
      {
        label: 'Total Processed',
        value: approvedActivities.length + rejectedActivities.length,
        icon: '📊',
        color: 'from-blue-400 to-cyan-500'
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        `}</style>
        
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto animate-spin-slow">
              <div className="text-6xl animate-float">🛡️</div>
            </div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-emerald-200 rounded-full mx-auto animate-pulse-glow"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Accessing Admin Portal
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Verifying permissions and loading eco-activities...
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
        @keyframes shield-glow {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.05); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-shield-glow { animation: shield-glow 3s ease-in-out infinite; }
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
        .admin-glow {
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
        }
        .tab-transition { transition: all 0.4s ease; }
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
            <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-6 border border-green-200/50 shadow-lg hover-lift admin-glow">
              <span className="text-2xl animate-shield-glow">🛡️</span>
              <span className="text-green-700 font-semibold">Admin Control Center</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent">
                Green Legacy
              </span>
              <br />
              <span className="text-gray-800">Admin Panel</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Review and manage eco-activities to build our sustainable campus community
            </p>
          </div>

          {/* Stats Overview */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}>
            {getTabStats().map((stat, index) => (
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

          {/* Navigation Tabs */}
          <div className={`flex flex-wrap justify-center gap-2 mb-8 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            {[
              { id: 'pending', label: 'Pending', icon: '⏳', count: pendingActivities.length },
              { id: 'approved', label: 'Approved', icon: '✅', count: approvedActivities.length },
              { id: 'rejected', label: 'Rejected', icon: '❌', count: rejectedActivities.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : 'glass text-gray-600 border border-green-200/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-8 border border-green-200/50 shadow-xl admin-glow animate-slide-in-up tab-transition">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-4xl animate-bounce-gentle">
                {activeTab === 'pending' ? '📋' : activeTab === 'approved' ? '✅' : '❌'}
              </span>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Activities ({getCurrentActivities().length})
            </h2>
            
            {getCurrentActivities().length > 0 && (
              <div className={`px-4 py-2 rounded-full font-semibold border ${
                activeTab === 'pending' ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200' :
                activeTab === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' :
                'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'
              }`}>
                <span className="animate-pulse">●</span> {getCurrentActivities().length} {activeTab}
              </div>
            )}
          </div>
          
          {getCurrentActivities().length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 animate-bounce-gentle">
                {activeTab === 'pending' ? '📭' : activeTab === 'approved' ? '🎉' : '📋'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {activeTab === 'pending' ? 'All caught up!' : 
                 activeTab === 'approved' ? 'No approved activities yet' : 
                 'No rejected activities'}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {activeTab === 'pending' ? 'No pending activities to review at the moment.' :
                 activeTab === 'approved' ? 'Approved activities will appear here once you start reviewing.' :
                 'Rejected activities will be shown here.'}
              </p>
              <div className={`px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 ${
                activeTab === 'pending' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
              }`}>
                <span className="animate-bounce-gentle">
                  {activeTab === 'pending' ? '🎉' : '📊'}
                </span>
                {activeTab === 'pending' ? 'Great job keeping up with reviews!' : 'Check back later for updates'}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {getCurrentActivities().map((activity, index) => {
                const activityType = ACTIVITY_TYPES[activity.type] || { name: activity.type, icon: '🌿', color: 'from-gray-400 to-gray-500' };
                
                return (
                  <div
                    key={activity._id}
                    className={`bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200/50 shadow-lg hover-lift animate-slide-in-left`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Activity Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl p-3 rounded-full bg-gradient-to-r ${activityType.color} text-white shadow-lg animate-float`}>
                          {activityType.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{activityType.name}</h3>
                          <p className="text-sm text-gray-500">Submitted on {new Date(activity.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full font-semibold border ${
                        activity.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200' :
                        activity.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' :
                        'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'
                      }`}>
                        <span className="animate-pulse">
                          {activity.status === 'pending' ? '⏳' : activity.status === 'approved' ? '✅' : '❌'}
                        </span> {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {activity.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{activity.user?.name || 'Unknown User'}</h4>
                          <p className="text-sm text-gray-600">{activity.user?.email || 'No email provided'}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div><strong className="text-gray-700">Description:</strong></div>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{activity.description}</p>
                          {activity.rejectionComment && (
                            <div>
                              <div><strong className="text-red-700">Rejection Reason:</strong></div>
                              <p className="text-red-600 bg-red-50 p-3 rounded-lg">{activity.rejectionComment}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span><strong>Location:</strong> {activity.location?.placeName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>⭐</span>
                            <span><strong>Points:</strong> {activity.points}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🌍</span>
                            <span><strong>Carbon Saved:</strong> {activity.carbonSavedEstimateKg} kg CO₂</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    {activity.images?.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>📸</span> Evidence Photos ({activity.images.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {activity.images.map((image, imageIndex) => (
                            <div 
                              key={imageIndex} 
                              className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover-lift group"
                              onClick={() => setSelectedImage(image)}
                            >
                              <img
                                src={image}
                                alt={`Activity ${imageIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center text-4xl" style={{ display: 'none' }}>
                                📷
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Full
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Only show for pending activities */}
                    {activity.status === 'pending' && (
                      <div className="flex gap-4 pt-4 border-t border-green-200/50">
                        <button
                          onClick={() => handleApprove(activity._id)}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-xl font-bold hover-lift transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <span className="text-xl animate-bounce-gentle">✅</span>
                          Approve Activity
                        </button>
                        <button
                          onClick={() => {
                            const comment = prompt('Rejection reason (optional):');
                            if (comment !== null) {
                              handleReject(activity._id, comment || '');
                            }
                          }}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover-lift transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <span className="text-xl">❌</span>
                          Reject Activity
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Activity Evidence"
              className="max-w-full max-h-full rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-8 rounded-2xl flex items-center justify-center text-6xl" style={{ display: 'none' }}>
              📷
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;