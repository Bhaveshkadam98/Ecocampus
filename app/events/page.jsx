"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Award, Leaf, Search, Filter } from 'lucide-react';
import Link from 'next/link';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, categoryFilter]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true');
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

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.tags && event.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      time: date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'tree-planting': 'bg-green-500',
      'cleanup': 'bg-blue-500',
      'workshop': 'bg-purple-500',
      'collection-drive': 'bg-orange-500',
      'competition': 'bg-red-500',
      'awareness': 'bg-yellow-500',
      'other': 'bg-gray-500',
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Eco Events
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-green-100">
              Participate in campus sustainability initiatives, earn green points, 
              and make a positive impact on our environment.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-green-200">Active Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-green-200">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500kg</div>
                <div className="text-green-200">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Categories</option>
                <option value="tree-planting">Tree Planting</option>
                <option value="cleanup">Cleanup</option>
                <option value="workshop">Workshop</option>
                <option value="collection-drive">Collection Drive</option>
                <option value="competition">Competition</option>
                <option value="awareness">Awareness</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {events.length === 0 ? 'No events available' : 'No events match your search'}
            </h3>
            <p className="text-gray-500">
              {events.length === 0 
                ? 'Check back later for upcoming eco-events!' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} formatDate={formatDate} getCategoryColor={getCategoryColor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, formatDate, getCategoryColor }) => {
  const dateInfo = formatDate(event.date);
  const isRegistrationOpen = new Date() < new Date(event.registrationDeadline || event.date);
  const approvedCount = event.approvedRegistrationCount || 0;
  const isFull = approvedCount >= event.maxParticipants;

  return (
    <Link href={`/events/${event._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group">
        {/* Event Image */}
        {event.images && event.images[0] ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <Leaf className="h-16 w-16 text-white opacity-70" />
          </div>
        )}

        <div className="p-6">
          {/* Date Badge */}
          <div className="flex justify-between items-start mb-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 min-w-[70px] text-center">
              <div className="text-2xl font-bold text-green-700">{dateInfo.day}</div>
              <div className="text-xs font-medium text-green-600 uppercase">{dateInfo.month}</div>
            </div>
            
            {/* Category Badge */}
            <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(event.category)}`}>
              {event.category.replace('-', ' ').toUpperCase()}
            </div>
          </div>

          {/* Event Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Event Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2 text-gray-400" />
              {dateInfo.time}
            </div>
            
            {event.location?.placeName && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2 text-gray-400" />
                {event.location.placeName}
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-2 text-gray-400" />
              {approvedCount} / {event.maxParticipants} participants
              {isFull && <span className="ml-2 text-red-500 font-medium">FULL</span>}
            </div>

            {event.pointsReward > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <Award size={16} className="mr-2 text-gray-400" />
                {event.pointsReward} Green Points
              </div>
            )}

            {event.carbonSavedEstimateKg > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <Leaf size={16} className="mr-2 text-gray-400" />
                ~{event.carbonSavedEstimateKg}kg CO₂ saved
              </div>
            )}
          </div>

          {/* Registration Status */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {!isRegistrationOpen ? (
              <span className="text-red-500 text-sm font-medium">Registration Closed</span>
            ) : isFull ? (
              <span className="text-red-500 text-sm font-medium">Event Full</span>
            ) : (
              <span className="text-green-600 text-sm font-medium">Registration Open</span>
            )}

            <div className="text-right">
              <div className="text-xs text-gray-400">
                {event.registrationDeadline && (
                  <>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar for Capacity */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((approvedCount / event.maxParticipants) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventsPage;