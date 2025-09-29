// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { hashPassword } from "../lib/auth.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import BadgeDefinition from "../models/BadgeDefinition.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "eco-campus-tracker",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Activity.deleteMany({});
    await BadgeDefinition.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@ecocampus.com",
      passwordHash: adminPassword,
      role: "admin",
      greenPoints: 0,
      badges: [],
    });
    console.log("👑 Created admin user (email: admin@ecocampus.com, password: admin123)");

    // Create regular users
    const userPassword = await hashPassword("password123");
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        passwordHash: userPassword,
        greenPoints: 150,
        badges: ["Eco Starter", "Green Advocate"],
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        passwordHash: userPassword,
        greenPoints: 75,
        badges: ["Eco Starter"],
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        passwordHash: userPassword,
        greenPoints: 220,
        badges: ["Eco Starter", "Green Advocate", "Eco Warrior"],
      },
    ]);
    console.log("👥 Created 3 test users (password: password123)");

    // Create sample activities
    const sampleActivities = [
      {
        user: users[0]._id,
        type: "tree-planting",
        description: "Planted 10 trees in the campus garden",
        location: { placeName: "Campus Garden" },
        points: 50,
        carbonSavedEstimateKg: 217.7,
        status: "approved",
        approvedAt: new Date(),
        images: [],
      },
      {
        user: users[1]._id,
        type: "recycling",
        description: "Recycled 5kg of plastic bottles",
        location: { placeName: "Student Center" },
        points: 20,
        carbonSavedEstimateKg: 12.5,
        status: "approved",
        approvedAt: new Date(),
        images: [],
      },
      {
        user: users[2]._id,
        type: "cleanup",
        description: "Participated in campus cleanup, collected 10 bags of waste",
        location: { placeName: "Main Campus" },
        points: 30,
        carbonSavedEstimateKg: 5.0,
        status: "approved",
        approvedAt: new Date(),
        images: [],
      },
      {
        user: users[0]._id,
        type: "biking",
        description: "Biked to campus for the entire week (25km total)",
        location: { placeName: "Campus Entrance" },
        points: 15,
        carbonSavedEstimateKg: 4.0,
        status: "pending",
        images: [],
      },
    ];

    await Activity.create(sampleActivities);
    console.log("🏃 Created sample activities");

    // Create badge definitions
    const badges = [
      {
        name: "Eco Starter",
        description: "Earned your first 50 green points",
        criteria: "50 points",
      },
      {
        name: "Green Advocate",
        description: "Reached 100 green points",
        criteria: "100 points",
      },
      {
        name: "Eco Warrior",
        description: "Achieved 200 green points",
        criteria: "200 points",
      },
      {
        name: "Sustainability Champion",
        description: "Reached 500 green points",
        criteria: "500 points",
      },
    ];

    await BadgeDefinition.create(badges);
    console.log("🏅 Created badge definitions");

    // Final messages
    console.log(`\n✅ Seed completed successfully!`);
    console.log(`\n👉 You can log in with:`);
    console.log(`   Admin: admin@ecocampus.com / admin123`);
    console.log(`   User: john@example.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();
