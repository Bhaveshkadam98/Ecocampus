// lib/carbonEstimator.js
// Carbon estimation factors (kg CO2 saved)
const CARBON_FACTORS = {
  'tree-planting': {
    perTree: 21.77, // kg CO2 per year per tree
    unit: 'trees'
  },
  'recycling': {
    plastic: 2.5, // kg CO2 saved per kg of plastic recycled
    paper: 3.5, // kg CO2 saved per kg of paper recycled
    metal: 4.0, // kg CO2 saved per kg of metal recycled
    unit: 'kg'
  },
  'cleanup': {
    perBag: 0.5, // kg CO2 saved per bag of waste collected
    unit: 'bags'
  },
  'biking': {
    perKm: 0.16, // kg CO2 saved per km biked instead of driving
    unit: 'km'
  },
  'composting': {
    perKg: 0.8, // kg CO2 saved per kg composted
    unit: 'kg'
  }
};

export function estimateCarbon(activityType, quantity, subType = null) {
  let carbonSaved = 0;

  switch (activityType) {
    case 'tree-planting':
      carbonSaved = quantity * CARBON_FACTORS['tree-planting'].perTree;
      break;
    
    case 'recycling':
      const recyclingType = subType || 'plastic';
      carbonSaved = quantity * (CARBON_FACTORS['recycling'][recyclingType] || 2.5);
      break;
    
    case 'cleanup':
      carbonSaved = quantity * CARBON_FACTORS['cleanup'].perBag;
      break;
    
    case 'biking':
      carbonSaved = quantity * CARBON_FACTORS['biking'].perKm;
      break;
    
    case 'composting':
      carbonSaved = quantity * CARBON_FACTORS['composting'].perKg;
      break;
    
    default:
      // Default estimation for unknown activities
      carbonSaved = quantity * 1.0;
  }

  return Math.round(carbonSaved * 100) / 100; // Round to 2 decimal places
}

// AI-enhanced estimation (placeholder - would integrate with actual AI service)
export async function estimateCarbonWithAI(description, activityType) {
  // In a real implementation, this would call an AI service
  // For now, we'll parse the description for quantities and use our deterministic model
  
  const quantities = description.match(/\d+/g);
  const quantity = quantities ? parseInt(quantities[0]) : 1;
  
  return estimateCarbon(activityType, quantity);
}

export { CARBON_FACTORS };