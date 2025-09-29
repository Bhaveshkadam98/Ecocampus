import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { estimateCarbon } from '@/lib/carbonEstimator';
import { ACTIVITY_TYPES } from '@/utils/constants';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const type = formData.get('type');
    const description = formData.get('description');
    const location = JSON.parse(formData.get('location') || '{}');
    
    const images = formData.getAll('images');
    const imageUrls = [];
    
    for (const image of images) {
      if (image && image.size > 0) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
        const url = await uploadImage(base64);
        imageUrls.push(url);
      }
    }
    
    await connectToDatabase();
    
    const points = ACTIVITY_TYPES[type]?.points || 10;
    const carbonSaved = estimateCarbon(type, 1); // Basic estimate
    
    const activity = await Activity.create({
      user: decoded.userId,
      type,
      description,
      location,
      images: imageUrls,
      points,
      carbonSavedEstimateKg: carbonSaved,
    });
    
    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    await connectToDatabase();
    
    const query = status ? { status } : {};
    const activities = await Activity.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(20);
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json({ error: 'Failed to get activities' }, { status: 500 });
  }
}