import type { Dispatch, FormEvent, SetStateAction } from "react";

import {
	TASK_STATUSES,
	type TaskFormState,
	type TaskStatus,
} from "@/shared/types";

type TaskFormProps = {
	taskForm: TaskFormState;
	setTaskForm: Dispatch<SetStateAction<TaskFormState>>;
	tasksError: string;
	savingTask: boolean;
	editingTaskId: string | null;
	handleTaskSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	cancelEditing: () => void;
	taskStatusLabels: Record<TaskStatus, string>;
};

export function TaskForm({
	taskForm,
	setTaskForm,
	tasksError,
	savingTask,
	editingTaskId,
	handleTaskSubmit,
	cancelEditing,
	taskStatusLabels,
}: TaskFormProps) {
	return (
		<section className='rounded-2xl border border-slate-800 bg-slate-900 p-5'>
			<form
				className='grid gap-4 md:grid-cols-[1.2fr_1fr_auto]'
				onSubmit={handleTaskSubmit}
			>
				<input
					value={taskForm.title}
					onChange={(event) =>
						setTaskForm((current) => ({
							...current,
							title: event.target.value,
						}))
					}
					className='w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none focus:border-slate-500'
					placeholder='Task title'
				/>
				<input
					value={taskForm.description}
					onChange={(event) =>
						setTaskForm((current) => ({
							...current,
							description: event.target.value,
						}))
					}
					className='w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none focus:border-slate-500'
					placeholder='Description'
				/>
				<div className='flex gap-2'>
					<select
						value={taskForm.status}
						onChange={(event) =>
							setTaskForm((current) => ({
								...current,
								status: event.target.value as TaskStatus,
							}))
						}
						className='min-w-36 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none focus:border-slate-500'
					>
						{TASK_STATUSES.map((status) => (
							<option key={status} value={status}>
								{taskStatusLabels[status]}
							</option>
						))}
					</select>
					<button
						type='submit'
						disabled={savingTask}
						className='rounded-xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60'
					>
						{savingTask ? "Saving..." : editingTaskId ? "Update" : "Add task"}
					</button>
				</div>
			</form>

			{editingTaskId ? (
				<button
					type='button'
					onClick={cancelEditing}
					className='mt-3 text-sm text-slate-400 underline underline-offset-4'
				>
					Cancel edit
				</button>
			) : null}

			{tasksError ? (
				<p className='mt-3 text-sm text-rose-400'>{tasksError}</p>
			) : null}
		</section>
	);
}
