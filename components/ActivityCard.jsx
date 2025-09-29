import Link from 'next/link';

export default function ActivityCard({ activity }) {
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{activity.type}</h3>
          <p className="text-gray-600 mt-1">{activity.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(activity.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm ${statusColor[activity.status]}`}>
            {activity.status}
          </span>
          {activity.points && (
            <p className="mt-2 font-semibold text-green-600">+{activity.points} pts</p>
          )}
        </div>
      </div>
      <Link href={`/activities/${activity._id}`} className="text-green-600 hover:underline text-sm mt-2 inline-block">
        View Details →
      </Link>
    </div>
  );
}