import type { Task, TaskStatus } from "@/shared/types";

import { TaskCard } from "./TaskCard";

type TaskColumnProps = {
	title: string;
	tasks: Task[];
	loading: boolean;
	taskStatusLabels: Record<TaskStatus, string>;
	onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => Promise<void>;
};

export function TaskColumn({
	title,
	tasks,
	loading,
	taskStatusLabels,
	onStatusChange,
	onEdit,
	onDelete,
}: TaskColumnProps) {
	return (
		<div className='rounded-2xl border border-slate-800 bg-slate-900 p-4'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='font-semibold'>{title}</h2>
				<span className='rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300'>
					{tasks.length}
				</span>
			</div>

			<div className='space-y-3'>
				{loading ? (
					<p className='text-sm text-slate-400'>Loading tasks...</p>
				) : tasks.length ? (
					tasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							taskStatusLabels={taskStatusLabels}
							onStatusChange={onStatusChange}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))
				) : (
					<p className='text-sm text-slate-500'>No tasks yet.</p>
				)}
			</div>
		</div>
	);
}
