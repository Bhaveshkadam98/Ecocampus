export default function LeaderboardTable({ leaders }) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Rank</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Points</th>
            <th className="px-6 py-3 text-left">Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && index + 1}
              </td>
              <td className="px-6 py-4 font-medium">{leader.name}</td>
              <td className="px-6 py-4 text-green-600 font-semibold">{leader.greenPoints}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {leader.badges?.map((badge, i) => (
                    <span key={i} className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {badge}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}