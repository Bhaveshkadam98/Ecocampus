import { NextResponse } from 'next/server';
import { estimateCarbon, estimateCarbonWithAI, CARBON_FACTORS } from '@/lib/carbonEstimator';

export async function POST(request) {
  try {
    const { activityType, quantity, subType, description, useAI } = await request.json();
    
    let carbonSaved;
    
    if (useAI && description) {
      // Use AI-enhanced estimation
      carbonSaved = await estimateCarbonWithAI(description, activityType);
    } else {
      // Use deterministic calculation
      carbonSaved = estimateCarbon(activityType, quantity || 1, subType);
    }
    
    return NextResponse.json({ 
      carbonSavedKg: carbonSaved,
      calculation: {
        activityType,
        quantity: quantity || 1,
        factor: CARBON_FACTORS[activityType] || null,
        method: useAI ? 'ai-enhanced' : 'deterministic'
      }
    });
  } catch (error) {
    console.error('Carbon estimation error:', error);
    return NextResponse.json({ error: 'Failed to estimate carbon savings' }, { status: 500 });
  }
}