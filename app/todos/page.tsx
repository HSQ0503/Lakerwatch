import type { Metadata } from "next";
import TodoList from "@/components/TodoList";

export const metadata: Metadata = {
  title: "To-Do List",
  description:
    "Manage your school tasks and assignments with the LakerWatch to-do list for Windermere Prep students.",
};

export default function TodosPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text dark:text-dark-text">
        To-Do List
      </h1>
      <TodoList />
    </div>
  );
}
