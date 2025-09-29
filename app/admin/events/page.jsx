"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Custom notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        showNotification(`Event ${newStatus} successfully`, 'success');
        fetchEvents();
      } else {
        showNotification('Failed to update event status', 'error');
      }
    } catch (error) {
      console.error('Status update error:', error);
      showNotification('Failed to update event status', 'error');
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showNotification('Event deleted successfully', 'success');
        fetchEvents();
      } else {
        const data = await response.json();
        showNotification(data.error || 'Failed to delete event', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete event', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || colors.draft;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'tree-planting': 'bg-emerald-100 text-emerald-800',
      'cleanup': 'bg-blue-100 text-blue-800',
      'workshop': 'bg-purple-100 text-purple-800',
      'collection-drive': 'bg-orange-100 text-orange-800',
      'competition': 'bg-red-100 text-red-800',
      'awareness': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <motion.div 
          className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Custom Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-100/80 border-green-300 text-green-800' 
                : 'bg-red-100/80 border-red-300 text-red-800'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {notification.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <motion.h1 
                className="text-4xl font-black text-gray-900 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Event <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Management</span>
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create and manage campus eco-events
              </motion.p>
            </div>
            <motion.button
              onClick={() => setShowForm(true)}
              className="group relative px-6 py-3 font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-lg hover:shadow-emerald-500/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">+</span>
                Create Event
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <motion.div 
            className="flex flex-wrap gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-emerald-200/30 w-fit shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {['all', 'draft', 'published', 'cancelled', 'completed'].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                  filter === status
                    ? 'bg-white text-emerald-700 shadow-md border border-emerald-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-7xl mb-6">📅</div>
            <motion.h3 
              className="mt-4 text-xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No events found
            </motion.h3>
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Get started by creating your first event.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onStatusChange={handleStatusChange}
                  onEdit={(event) => {
                    setSelectedEvent(event);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onViewRegistrations={(event) => {
                    setSelectedEvent(event);
                    setShowRegistrations(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Event Form Modal */}
        <AnimatePresence>
          {showForm && (
            <EventFormModal
              event={selectedEvent}
              onClose={() => {
                setShowForm(false);
                setSelectedEvent(null);
              }}
              onSave={() => {
                fetchEvents();
                setShowForm(false);
                setSelectedEvent(null);
              }}
              showNotification={showNotification}
            />
          )}
        </AnimatePresence>

        {/* Registrations Modal */}
        <AnimatePresence>
          {showRegistrations && selectedEvent && (
            <RegistrationsModal
              event={selectedEvent}
              onClose={() => {
                setShowRegistrations(false);
                setSelectedEvent(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, onStatusChange, onEdit, onDelete, onViewRegistrations, getStatusColor, getCategoryColor }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Event Image */}
      {event.images && event.images[0] && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6">
        {/* Status and Category Badges */}
        <div className="flex justify-between items-start mb-4">
          <motion.span 
            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}
            whileHover={{ scale: 1.05 }}
          >
            {event.status}
          </motion.span>
          <motion.span 
            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(event.category)}`}
            whileHover={{ scale: 1.05 }}
          >
            {event.category.replace('-', ' ')}
          </motion.span>
        </div>

        {/* Title and Description */}
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {event.title}
        </motion.h3>
        <motion.p 
          className="text-gray-700 text-sm mb-5 line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {event.description}
        </motion.p>

        {/* Event Details */}
        <motion.div 
          className="space-y-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3 text-emerald-600">📅</span>
            {formatDate(event.date)}
          </div>
          {event.location?.placeName && (
            <div className="flex items-center text-sm text-gray-700">
              <span className="mr-3 text-emerald-600">📍</span>
              <span className="truncate max-w-[200px]">{event.location.placeName}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3 text-emerald-600">👥</span>
            {event.registrationCount || 0} / {event.maxParticipants} registered
          </div>
          {event.pointsReward > 0 && (
            <div className="flex items-center text-sm text-gray-700">
              <span className="mr-3 text-emerald-600">🏆</span>
              {event.pointsReward} points
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-between items-center pt-4 border-t border-gray-200/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onEdit(event)}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit Event"
            >
              ✏️
            </motion.button>
            <motion.button
              onClick={() => onViewRegistrations(event)}
              className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full hover:bg-emerald-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="View Registrations"
            >
              👁️
            </motion.button>
            <motion.button
              onClick={() => onDelete(event._id)}
              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete Event"
            >
              🗑️
            </motion.button>
          </div>

          {/* Status Change Buttons */}
          <div className="flex space-x-2">
            {event.status === 'draft' && (
              <motion.button
                onClick={() => onStatusChange(event._id, 'published')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Publish
              </motion.button>
            )}
            {event.status === 'published' && (
              <>
                <motion.button
                  onClick={() => onStatusChange(event._id, 'completed')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete
                </motion.button>
                <motion.button
                  onClick={() => onStatusChange(event._id, 'cancelled')}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Event Form Modal Component
const EventFormModal = ({ event, onClose, onSave, showNotification }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: {
      placeName: '',
      address: '',
    },
    maxParticipants: 50,
    registrationDeadline: '',
    pointsReward: 0,
    carbonSavedEstimateKg: 0,
    category: 'other',
    status: 'draft',
    autoApproveRegistrations: true,
    requirements: '',
    whatToBring: '',
    contactInfo: {
      email: '',
      phone: '',
    },
    tags: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        registrationDeadline: event.registrationDeadline 
          ? new Date(event.registrationDeadline).toISOString().slice(0, 16) 
          : '',
        tags: event.tags?.join(', ') || '',
        location: event.location || { placeName: '', address: '' },
        contactInfo: event.contactInfo || { email: '', phone: '' },
      });
    } else {
      // Reset form when creating new
      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        date: formData.date ? new Date(formData.date).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        registrationDeadline: formData.registrationDeadline 
          ? new Date(formData.registrationDeadline).toISOString() 
          : null,
      };

      const url = event ? `/api/events/${event._id}` : '/api/events';
      const method = event ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        showNotification(event ? 'Event updated successfully' : 'Event created successfully', 'success');
        onSave();
      } else {
        const data = await response.json();
        showNotification(data.error || 'Failed to save event', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showNotification('Failed to save event', 'error');
    } finally {
      setSaving(false);
    }
  };

  // common input class for consistent text color and placeholder
  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <motion.h2 
              className="text-2xl font-black"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {event ? 'Edit Event' : 'Create New Event'}
            </motion.h2>
            <motion.button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                spellCheck={false}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={inputClass + " resize-vertical"}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={formData.location.placeName}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, placeName: e.target.value}
                })}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, address: e.target.value}
                })}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Max Participants *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Points Reward
              </label>
              <input
                type="number"
                min="0"
                value={formData.pointsReward}
                onChange={(e) => setFormData({...formData, pointsReward: parseInt(e.target.value) || 0})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Carbon Saved Estimate (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.carbonSavedEstimateKg}
                onChange={(e) => setFormData({...formData, carbonSavedEstimateKg: parseFloat(e.target.value) || 0})}
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={inputClass + " appearance-none"}
              >
                <option value="tree-planting">Tree Planting</option>
                <option value="cleanup">Cleanup</option>
                <option value="workshop">Workshop</option>
                <option value="collection-drive">Collection Drive</option>
                <option value="competition">Competition</option>
                <option value="awareness">Awareness</option>
                <option value="other">Other</option>
              </select>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={inputClass + " appearance-none"}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </motion.div>

            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="eco-friendly, sustainability, campus"
                className={inputClass}
              />
            </motion.div>

            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.autoApproveRegistrations}
                  onChange={(e) => setFormData({...formData, autoApproveRegistrations: e.target.checked})}
                  className="mr-3 h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-bold text-gray-700">Auto-approve registrations</span>
              </label>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex justify-end space-x-4 pt-8 border-t border-gray-200/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 font-bold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">
                {saving ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Registrations Modal Component
const RegistrationsModal = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${event._id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/30 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <motion.h2 
            className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Event Registrations
          </motion.h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="p-6">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-xl text-gray-900">{event.title}</h3>
            <p className="text-gray-600">
              {registrations.length} / {event.maxParticipants} registered
            </p>
          </motion.div>

          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 mx-auto"></div>
            </motion.div>
          ) : registrations.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-5xl mb-4">👥</div>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No registrations yet
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {registrations.map((registration, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200/30 hover:shadow-md transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="font-bold text-gray-900">{registration.user?.name || 'Anonymous User'}</p>
                      <p className="text-sm text-gray-600">{registration.user?.email}</p>
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {new Date(registration.registeredAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminEventsPage;