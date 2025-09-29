"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Award, Leaf, Mail, Phone } from "lucide-react";

const EventDetailPage = ({ params }) => {
  const { eventId } = params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetchEvent();
    checkRegistration();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
      }
    } catch (err) {
      console.error("Failed to fetch event:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const res = await fetch(`/api/user/registrations?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setIsRegistered(data.isRegistered);
      }
    } catch (err) {
      console.error("Failed to check registration:", err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      if (res.ok) {
        setIsRegistered(true);
        setShowRegistrationForm(false);
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Event not found
      </div>
    );
  }

  const approvedCount = event.approvedRegistrationCount || 0;
  const isFull = approvedCount >= event.maxParticipants;
  const isRegistrationOpen =
    new Date() < new Date(event.registrationDeadline || event.date);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Event Image */}
        {event.images && event.images[0] && (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">{event.description}</p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-3 text-green-600" size={20} />
              {formatDate(event.date)}
            </div>
            {event.location?.placeName && (
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-3 text-green-600" size={20} />
                {event.location.placeName}
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Users className="mr-3 text-green-600" size={20} />
              {approvedCount} / {event.maxParticipants} participants
              {isFull && (
                <span className="ml-2 text-red-500 font-medium">FULL</span>
              )}
            </div>
            {event.pointsReward > 0 && (
              <div className="flex items-center text-gray-600">
                <Award className="mr-3 text-green-600" size={20} />
                {event.pointsReward} Green Points
              </div>
            )}
            {event.carbonSavedEstimateKg > 0 && (
              <div className="flex items-center text-gray-600">
                <Leaf className="mr-3 text-green-600" size={20} />
                ~{event.carbonSavedEstimateKg}kg CO₂ saved
              </div>
            )}
          </div>

          {/* Registration */}
          <div className="mb-8">
            {!isRegistrationOpen ? (
              <span className="text-red-500 text-sm font-medium">
                Registration Closed
              </span>
            ) : isFull ? (
              <span className="text-red-500 text-sm font-medium">
                Event Full
              </span>
            ) : isRegistered ? (
              <span className="text-green-600 text-sm font-medium">
                You are registered for this event
              </span>
            ) : (
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Register Now
              </button>
            )}
            {event.registrationDeadline && (
              <div className="text-sm text-gray-500 mt-2">
                Registration Deadline:{" "}
                {new Date(event.registrationDeadline).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {event.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Bring */}
            {event.whatToBring && event.whatToBring.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">What to Bring</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {event.whatToBring.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact */}
            {(event.contactEmail || event.contactPhone) && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                <div className="space-y-2 text-gray-600">
                  {event.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="mr-2 text-green-600" size={18} />
                      {event.contactEmail}
                    </div>
                  )}
                  {event.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="mr-2 text-green-600" size={18} />
                      {event.contactPhone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Form Modal */}
          {showRegistrationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Register for {event.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  Confirm your registration for this event.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
