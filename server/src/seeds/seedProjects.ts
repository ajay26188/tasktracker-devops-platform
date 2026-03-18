// server/seeds/seedProjects.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/project";
import connectDB from "../config/db";

dotenv.config();

async function seedProjects() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Delete existing projects
    await Project.deleteMany({});
    console.log("Cleared existing projects");

    const organizationId = new mongoose.Types.ObjectId("68c91a9e295edf76211dc621");
    const createdBy = new mongoose.Types.ObjectId("68c91a9f295edf76211dc624");

    const projectTemplates = [
      { name: "Website Redesign", description: "Redesign the corporate website to improve UX and SEO." },
      { name: "Mobile App Launch", description: "Develop a cross-platform mobile app for customer engagement." },
      { name: "API Integration", description: "Integrate Stripe and PayPal payment gateways with backend API." },
      { name: "Marketing Dashboard", description: "Build a dashboard to monitor marketing KPIs and campaigns." },
      { name: "Internal Tool Automation", description: "Automate repetitive internal processes for efficiency." },
      { name: "Bug Tracking System", description: "Implement a bug tracking system for the dev team." },
      { name: "CRM Enhancement", description: "Add new features to the CRM for better customer tracking." },
      { name: "Analytics Pipeline", description: "Build a data pipeline for analytics and reporting." },
      { name: "Social Media Integration", description: "Connect app with Facebook, Instagram, and Twitter APIs." },
      { name: "Payment Reconciliation", description: "Automate reconciliation of payments and invoices." },
      { name: "Onboarding Flow", description: "Improve user onboarding flow to reduce churn." },
      { name: "Notification System", description: "Build push/email notifications for critical events." },
      { name: "Performance Monitoring", description: "Set up system monitoring and alerting for production." },
      { name: "Search Optimization", description: "Optimize search functionality for faster results." },
      { name: "Feature Flag System", description: "Implement feature flags for safe releases." },
      { name: "Team Collaboration Tool", description: "Build a chat and collaboration tool for internal teams." },
      { name: "Data Migration", description: "Migrate legacy database to new system without downtime." },
      { name: "Security Audit", description: "Conduct a security audit and patch vulnerabilities." },
      { name: "Customer Feedback App", description: "Develop an app to collect and analyze customer feedback." },
      { name: "Inventory Management", description: "Build a system to manage product inventory efficiently." },
      { name: "Billing System", description: "Develop automated billing and invoicing system." },
      { name: "Project Tracker", description: "Create a project management tool with kanban boards." },
      { name: "Email Marketing Campaign", description: "Automate email marketing campaigns for users." },
      { name: "Helpdesk System", description: "Build a ticketing system for customer support." },
      { name: "AI Chatbot Integration", description: "Integrate AI chatbot to handle common queries." },
      { name: "User Analytics Dashboard", description: "Track user behavior and generate reports." },
    ];

    const projects = projectTemplates.map((proj) => {
      const startOffset = Math.floor(Math.random() * 90); // up to 90 days ago
      const duration = 15 + Math.floor(Math.random() * 45); // 15–60 days duration
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - startOffset);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration);

      return {
        ...proj,
        organizationId,
        createdBy,
        startDate,
        endDate,
      };
    });

    await Project.insertMany(projects);
    console.log(`${projects.length} projects seeded successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding projects:", err);
    process.exit(1);
  }
}

void seedProjects();
