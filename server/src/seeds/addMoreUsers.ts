// server/seeds/addMoreUsers.ts

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user";
import Organization from "../models/organization";
import connectDB from "../config/db";

dotenv.config();

async function addMoreUsers() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Find organization
    let org = await Organization.findOne({ name: "Task Tracker Inc." });
    if (!org) {
      org = await Organization.create({ name: "Task Tracker Inc." });
      console.log("Organization created:", org.name);
    } else {
      console.log("Organization found:", org.name);
    }

    // Password hashing helper
    const hashPassword = async (plain: string) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(plain, salt);
    };

    // Create 20 new members
    const newMembers = [];
    for (let i = 6; i <= 25; i++) {
      const password = await hashPassword(`MemberPass123!`);
      newMembers.push({
        name: `Member ${i}`,
        email: `member${i}@example.com`,
        password,
        organizationId: org._id,
        role: "member",
        isVerified: true,
      });
    }

    await User.insertMany(newMembers);
    console.log("Extra members created:", newMembers.map(m => m.email));

    console.log("Added 20 more users successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error adding more users:", err);
    process.exit(1);
  }
}

void addMoreUsers();
