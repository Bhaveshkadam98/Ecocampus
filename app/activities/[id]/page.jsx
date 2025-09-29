'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ActivityDetail() {
  const params = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${params.id}`);
      const data = await response.json();
      setActivity(data.activity);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[80vh]">Loading...</div>;
  }

  if (!activity) {
    return <div className="text-center py-8">Activity not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{activity.type}</h1>
        
        <div className="mb-4">
          <p className="text-gray-600">Submitted by: {activity.user?.name}</p>
          <p className="text-gray-600">Date: {new Date(activity.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
          activity.status === 'approved' ? 'bg-green-100 text-green-800' :
          activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
        </div>

        <p className="mb-4">{activity.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Location:</p>
            <p>{activity.location?.placeName || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Points Awarded:</p>
            <p>{activity.points || 'Pending'}</p>
          </div>
          <div>
            <p className="font-semibold">Carbon Saved:</p>
            <p>{activity.carbonSavedEstimateKg} kg CO2</p>
          </div>
        </div>

        {activity.images?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {activity.images.map((image, index) => (
                <div key={index} className="relative h-64">
                  <Image
                    src={image}
                    alt={`Activity image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activity.adminComment && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-semibold">Admin Comment:</p>
            <p>{activity.adminComment}</p>
          </div>
        )}
      </div>
    </div>
  );
}