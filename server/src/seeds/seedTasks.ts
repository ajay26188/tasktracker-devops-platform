// backend/seeds/seedTasks.ts
import { Types } from "mongoose";
import dotenv from "dotenv";
import Task from "../models/task";
import connectDB from "../config/db";
import { Status, Priority } from "../types/task";
import Project from "../models/project";

dotenv.config();

const PROJECT_IDS = [
  "68c923867ba5cc593f0b53f9",
  "68c923867ba5cc593f0b53fa",
  "68c923867ba5cc593f0b53fb",
  "68c923867ba5cc593f0b53fc",
  "68c923867ba5cc593f0b53fd",
  "68c923867ba5cc593f0b53fe",
  "68c923867ba5cc593f0b53ff",
  "68c923867ba5cc593f0b5400",
  "68c923867ba5cc593f0b5401",
  "68c923867ba5cc593f0b5402",
  "68c923867ba5cc593f0b5403",
  "68c923867ba5cc593f0b5404",
  "68c923867ba5cc593f0b5405",
  "68c923867ba5cc593f0b5406",
  "68c923867ba5cc593f0b5407",
  "68c923867ba5cc593f0b5408",
  "68c923867ba5cc593f0b5409",
  "68c923867ba5cc593f0b540a",
  "68c923867ba5cc593f0b540b",
  "68c923867ba5cc593f0b540c",
  "68c923867ba5cc593f0b540d",
  "68c923867ba5cc593f0b540e",
  "68c923867ba5cc593f0b540f",
  "68c923867ba5cc593f0b5410",
  "68c923867ba5cc593f0b5411",
  "68c923867ba5cc593f0b5412",
];

const CREATED_BY = new Types.ObjectId("68c91a9f295edf76211dc624");


const MEMBER_IDS = [
  new Types.ObjectId("68c91a9f295edf76211dc626"),
  new Types.ObjectId("68c91a9f295edf76211dc627"),
  new Types.ObjectId("68c91a9f295edf76211dc628"),
  new Types.ObjectId("68c91a9f295edf76211dc629"),
  new Types.ObjectId("68c91a9f295edf76211dc62a"),
  new Types.ObjectId("68c92cc73f8e823e19f77a2e"),
  new Types.ObjectId("68c92cc73f8e823e19f77a2f"),
  new Types.ObjectId("68c92cc73f8e823e19f77a30"),
  new Types.ObjectId("68c92cc73f8e823e19f77a31"),
  new Types.ObjectId("68c92cc73f8e823e19f77a32"),
  new Types.ObjectId("68c92cc73f8e823e19f77a33"),
  new Types.ObjectId("68c92cc73f8e823e19f77a34"),
  new Types.ObjectId("68c92cc73f8e823e19f77a35"),
  new Types.ObjectId("68c92cc73f8e823e19f77a36"),
  new Types.ObjectId("68c92cc73f8e823e19f77a37"),
  new Types.ObjectId("68c92cc73f8e823e19f77a38"),
  new Types.ObjectId("68c92cc73f8e823e19f77a39"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3a"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3b"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3c"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3d"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3e"),
  new Types.ObjectId("68c92cc73f8e823e19f77a3f"),
  new Types.ObjectId("68c92cc73f8e823e19f77a40"),
  new Types.ObjectId("68c92cc73f8e823e19f77a41"),
];

// Task title templates
const TASK_TITLES = [
  "Setup frontend module",
  "Write unit tests",
  "Fix login bug",
  "Design database schema",
  "Implement API endpoints",
  "Integrate payment gateway",
  "Optimize queries",
  "Setup CI/CD pipeline",
  "Refactor legacy code",
  "Design dashboard UI",
  "Write documentation",
  "Implement authentication",
  "Configure environment variables",
  "Code review",
  "Deploy to production",
];

// Task descriptions
const TASK_DESCRIPTIONS = [
  "Ensure all functionalities work as expected",
  "Follow best coding practices and patterns",
  "Collaborate with team for smooth integration",
  "Check for edge cases and errors",
  "Test across multiple browsers and devices",
  "Optimize for performance and scalability",
  "Maintain consistent code style and linting",
  "Write clear and concise commit messages",
  "Document all APIs and workflows",
  "Setup monitoring and alerts",
];

// Helper functions
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomItems = <T>(arr: T[], minItems: number, maxItems: number) => {
  const count = getRandomInt(minItems, maxItems);
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function seedTasks() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Delete existing tasks
    await Task.deleteMany({});
    console.log("Cleared tasks collection");

    const tasksToInsert = [];

    for (const projectIdStr of PROJECT_IDS) {
      const projectId = new Types.ObjectId(projectIdStr);

      const numTasks = getRandomInt(10, 15);

      for (let i = 0; i < numTasks; i++) {
        const title = TASK_TITLES[getRandomInt(0, TASK_TITLES.length - 1)];
        const description =
          TASK_DESCRIPTIONS[getRandomInt(0, TASK_DESCRIPTIONS.length - 1)];

        const statusValues = Object.values(Status);
        const priorityValues = Object.values(Priority);

        const status = statusValues[getRandomInt(0, statusValues.length - 1)];
        const priority = priorityValues[getRandomInt(0, priorityValues.length - 1)];

        const assignedTo = getRandomItems(MEMBER_IDS, 1, 3);

        const dueDate = getRandomDate(
            new Date(),
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // due within next 90 days
          );
          

        tasksToInsert.push({
          title,
          description,
          projectId,
          organizationId: new Types.ObjectId("68c91a9e295edf76211dc621"),
          createdBy: CREATED_BY,
          assignedTo,
          status,
          priority,
          dueDate,
        });
      }
    }

    const insertedTasks = await Task.insertMany(tasksToInsert);

    // Update each project's tasks array
    for (const projectIdStr of PROJECT_IDS) {
    const projectId = new Types.ObjectId(projectIdStr);

    const projectTasks = insertedTasks
        .filter(t => t.projectId.toString() === projectId.toString())
        .map(t => t._id);

    await Project.findByIdAndUpdate(projectId, { tasks: projectTasks });
    }

    console.log("Updated all projects with their task IDs");

    console.log(`Seeded ${tasksToInsert.length} tasks across ${PROJECT_IDS.length} projects`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding tasks:", err);
    process.exit(1);
  }
}

void seedTasks();
