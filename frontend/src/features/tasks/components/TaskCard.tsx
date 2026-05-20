import { TASK_STATUSES, type Task, type TaskStatus } from "@/shared/types";

function formatDate(value: string) {
	return new Date(value).toLocaleString();
}

type TaskCardProps = {
	task: Task;
	taskStatusLabels: Record<TaskStatus, string>;
	onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => Promise<void>;
};

export function TaskCard({
	task,
	taskStatusLabels,
	onStatusChange,
	onEdit,
	onDelete,
}: TaskCardProps) {
	return (
		<article className='rounded-xl border border-slate-800 bg-slate-950 p-4'>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h3 className='font-medium text-slate-50'>{task.title}</h3>
					{task.description ? (
						<p className='mt-1 text-sm text-slate-400'>{task.description}</p>
					) : null}
				</div>
				<span className='rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-300'>
					{taskStatusLabels[task.status]}
				</span>
			</div>

			<p className='mt-3 text-xs text-slate-500'>
				Updated {formatDate(task.updated_at)}
			</p>

			<div className='mt-4 flex flex-wrap gap-2'>
				{TASK_STATUSES.map((nextStatus) => (
					<button
						key={nextStatus}
						type='button'
						onClick={() => onStatusChange(task.id, nextStatus)}
						disabled={task.status === nextStatus}
						className={`rounded-lg px-3 py-2 text-xs font-medium transition ${task.status === nextStatus ? "cursor-not-allowed bg-slate-800 text-slate-500" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
					>
						{taskStatusLabels[nextStatus]}
					</button>
				))}
			</div>

			<div className='mt-4 flex gap-2'>
				<button
					type='button'
					onClick={() => onEdit(task)}
					className='rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800'
				>
					Edit
				</button>
				<button
					type='button'
					onClick={() => onDelete(task.id)}
					className='rounded-lg border border-rose-900/60 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-950/60'
				>
					Delete
				</button>
			</div>
		</article>
	);
}
