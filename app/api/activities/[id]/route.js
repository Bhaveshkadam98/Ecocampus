// app/api/activities/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import mongoose from 'mongoose';

const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams; // could be status slug or an ObjectId

    await connectToDatabase();

    // 1) If the param matches a status slug — return activities list
    const slug = String(id || '').toLowerCase();
    if (ALLOWED_STATUSES.includes(slug)) {
      const activities = await Activity.find({ status: slug })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      return NextResponse.json({ activities }, { status: 200 });
    }

    // 2) If it's a valid ObjectId — return single activity
    if (mongoose.Types.ObjectId.isValid(id)) {
      const activity = await Activity.findById(id).populate('user', 'name email');
      if (!activity) {
        return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
      }
      return NextResponse.json({ activity }, { status: 200 });
    }

    // 3) Otherwise invalid param
    return NextResponse.json({ error: 'Invalid parameter' }, { status: 400 });
  } catch (error) {
    console.error('Get activity error:', error);
    return NextResponse.json({ error: 'Failed to get activity' }, { status: 500 });
  }
}
