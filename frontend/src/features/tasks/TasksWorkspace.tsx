import type { Dispatch, FormEvent, SetStateAction } from "react";

import {
	TASK_STATUSES,
	type Task,
	type TaskFormState,
	type TaskStatus,
} from "@/shared/types";

import { TaskColumn } from "./components/TaskColumn";
import { TaskForm } from "./components/TaskForm";

type TasksWorkspaceProps = {
	auth: { email: string };
	logout: () => void;
	taskForm: TaskFormState;
	setTaskForm: Dispatch<SetStateAction<TaskFormState>>;
	tasksLoading: boolean;
	tasksError: string;
	savingTask: boolean;
	editingTaskId: string | null;
	handleTaskSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	cancelEditing: () => void;
	taskStatusLabels: Record<TaskStatus, string>;
	groupedTasks: Record<TaskStatus, Task[]>;
	changeStatus: (taskId: string, status: TaskStatus) => Promise<void>;
	startEditing: (task: Task) => void;
	deleteTask: (taskId: string) => Promise<void>;
};

export function TasksWorkspace({
	auth,
	logout,
	taskForm,
	setTaskForm,
	tasksLoading,
	tasksError,
	savingTask,
	editingTaskId,
	handleTaskSubmit,
	cancelEditing,
	taskStatusLabels,
	groupedTasks,
	changeStatus,
	startEditing,
	deleteTask,
}: TasksWorkspaceProps) {
	return (
		<main className='min-h-screen bg-slate-950 px-4 py-6 text-slate-50'>
			<div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
				<header className='flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between'>
					<div>
						<p className='text-sm text-slate-400'>Signed in as {auth.email}</p>
						<h1 className='text-2xl font-semibold'>Tasks</h1>
					</div>

					<button
						type='button'
						onClick={logout}
						className='rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800'
					>
						Logout
					</button>
				</header>

				<TaskForm
					taskForm={taskForm}
					setTaskForm={setTaskForm}
					tasksError={tasksError}
					savingTask={savingTask}
					editingTaskId={editingTaskId}
					handleTaskSubmit={handleTaskSubmit}
					cancelEditing={cancelEditing}
					taskStatusLabels={taskStatusLabels}
				/>

				<section className='grid gap-4 lg:grid-cols-3'>
					{TASK_STATUSES.map((status) => (
						<TaskColumn
							key={status}
							title={taskStatusLabels[status]}
							tasks={groupedTasks[status]}
							loading={tasksLoading}
							taskStatusLabels={taskStatusLabels}
							onStatusChange={changeStatus}
							onEdit={startEditing}
							onDelete={deleteTask}
						/>
					))}
				</section>
			</div>
		</main>
	);
}
