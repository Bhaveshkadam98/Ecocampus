// my-app/models/BadgeDefinition.js
import mongoose from 'mongoose';

const BadgeDefinitionSchema = new mongoose.Schema({
  name: String,
  description: String,
  criteria: String,
});

export default mongoose.models.BadgeDefinition || mongoose.model('BadgeDefinition', BadgeDefinitionSchema);