# Optimized Swim Lanes Kanban Board

This project is a feature-rich Kanban board built with [Next.js](https://nextjs.org) (App Router), supporting drag-and-drop task management, subgoal planning, and flexible grouping by assignee or category.

## Features

- **Kanban Board:** Visualize tasks across customizable columns (e.g., To-Do, Doing, Review, Done).
- **Drag-and-Drop:** Move tasks between columns and groups using react-dnd.
- **Subgoal Planner:** Each task can have its own set of subgoals, managed in a modal with progress tracking.
- **Grouping:** Switch between grouping tasks by assignee (alphabetically sorted) or by category.
- **Dynamic Columns & Assignees:** Add new columns and assignees on the fly.
- **Story Points:** Adjust story points for each task with interactive controls.
- **Persistent State:** Tasks and subgoals are saved in localStorage for session persistence.
- **Responsive UI:** Built with Tailwind CSS for modern, responsive design.
- **Legend & Help:** In-app legend explains task card features and color coding.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the Kanban board.

## Usage

- **Add Tasks:** Click "+ New Task Card" to add a new task.
- **Move Tasks:** Drag and drop tasks between columns or groups.
- **Edit Subgoals:** Click a task card to open its subgoal planner modal.
- **Group By:** Use the "Group By" dropdown to switch between assignee and category.
- **Add Columns/Assignees:** Use the "+" buttons to add new columns or assignees.
- **Legend:** Click "Legend" for a quick guide to task card features.

## Project Structure

- `app/Optimized_Swim_Lanes.tsx` — Main Kanban board component (client component).
- `app/Subgoal_Planner.tsx` — Subgoal planner modal (client component).
- `app/page.tsx` — Renders the Kanban board as the main page.
- `app/Optimized_Swim_Lanes.css`, `app/Subgoal_Planner.css`, `app/index.css`, `app/globals.css` — Stylesheets.

## Dependencies

- [Next.js](https://nextjs.org)
- [React DnD](https://react-dnd.github.io/react-dnd/about)
- [React DnD HTML5 Backend](https://react-dnd.github.io/react-dnd/docs/backends/html5)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind CSS](https://tailwindcss.com)

> **Note:** Components using React hooks are marked with `"use client"` for Next.js App Router compatibility.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React DnD Documentation](https://react-dnd.github.io/react-dnd/about)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
