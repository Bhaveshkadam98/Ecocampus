// app/api/activities/user/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    // Some Next runtimes provide params as an async proxy — await it first
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectToDatabase();

    let userId = id;

    // If id is 'me', resolve user id from the token
    if (id === 'me') {
      const token = getTokenFromRequest(request);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // verifyToken might be async depending on your auth util — await it
      const decoded = await verifyToken(token);
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      // adjust to whatever your token includes (e.g. userId, id, sub...)
      userId = decoded.userId || decoded.id || decoded.sub;
      if (!userId) {
        return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
      }
    }

    const activities = await Activity.find({ user: userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error('Get user activities error:', error);
    return NextResponse.json({ error: 'Failed to get activities' }, { status: 500 });
  }
}
