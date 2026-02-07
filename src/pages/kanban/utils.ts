import { nanoid } from "nanoid";
import type { KanbanCard, KanbanList } from "./model";

const taskNames = [
  "Set up development environment",
  "Review opened issues",
  "Implement Kanban feature",
  "Fix critical bugs",
  "Refactor authentication module",
  "Add unit tests for API",
  "Update documentation",
  "Optimize database queries",
  "Design new dashboard",
  "Integrate payment system",
  "Setup CI/CD pipeline",
  "Create user onboarding flow",
  "Implement dark mode",
  "Add notification system",
  "Setup error tracking",
  "Migrate to new database",
  "Add search functionality",
  "Improve performance metrics",
  "Create admin dashboard",
  "Setup monitoring alerts",
  "Add multi-language support",
  "Implement caching strategy",
  "Create API documentation",
  "Setup automated backups",
  "Add two-factor authentication",
  "Optimize images and assets",
  "Create mobile app mockups",
  "Setup analytics tracking",
  "Implement feature flags",
  "Add batch processing",
  "Create deployment scripts",
  "Setup security audit",
  "Add data validation layer",
  "Implement webhooks",
  "Create rate limiting",
  "Add email notifications",
  "Setup log aggregation",
  "Implement retry logic",
  "Create recovery procedures",
  "Add accessibility features",
  "Setup A/B testing",
  "Implement pagination",
  "Create user roles system",
  "Add data encryption",
  "Setup CDN integration",
  "Implement real-time updates",
  "Create backup strategies",
  "Add compression support",
  "Setup load balancing",
];

function randomTaskName(): string {
  return taskNames[Math.floor(Math.random() * taskNames.length)];
}

function createRandomTaskList(amount: number): KanbanCard[] {
  return Array.from({ length: amount }, (_, index) => ({
    id: nanoid(),
    title: randomTaskName(),
    sort_order: (index + 1) * 1000,
  }));
}

export const mockBoard: KanbanList[] = [
  {
    id: nanoid(),
    title: "To Do",
    cards: createRandomTaskList(10),
    sort_order: 1000,
  },
  {
    id: nanoid(),
    title: "In Progress",
    cards: createRandomTaskList(15),
    sort_order: 2000,
  },
  {
    id: nanoid(),
    title: "Done",
    cards: createRandomTaskList(30),
    sort_order: 3000,
  },
];