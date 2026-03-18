// server/seeds/seedUsers.ts

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user";
import Organization from "../models/organization";
import connectDB from "../config/db";

dotenv.config();

async function seedUsers() {
  try {
    await connectDB(); //reuse db connection function
    console.log("Connected to MongoDB");

    // Reset collections
    await User.deleteMany({});
    await Organization.deleteMany({});
    console.log("Cleared users and organizations");

    // Create organization
    const org = await Organization.create({ name: "Task Tracker Inc." });
    console.log("Organization created:", org.name);

    // Password hashing helper
    const hashPassword = async (plain: string) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(plain, salt);
    };

    // Create admin
    const adminPassword = await hashPassword("AdminPass123!");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      organizationId: org._id,
      role: "admin",
      isVerified: true,
    });
    console.log("Admin created:", admin.email);

    // Create 5 members
    const members = [];
    for (let i = 1; i <= 5; i++) {
      const password = await hashPassword(`MemberPass123!`);
      members.push({
        name: `Member ${i}`,
        email: `member${i}@example.com`,
        password,
        organizationId: org._id,
        role: "member",
        isVerified: true,
      });
    }

    await User.insertMany(members);
    console.log("👥 Members created:", members.map(m => m.email));

    console.log("Seeding finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
}

void seedUsers();
