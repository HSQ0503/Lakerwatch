import TodoList from "@/components/TodoList";

export default function TodosPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy">
        To-Do List
      </h1>
      <TodoList />
    </div>
  );
}
