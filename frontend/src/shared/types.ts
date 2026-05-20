export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
	TODO: "Todo",
	IN_PROGRESS: "In progress",
	DONE: "Done",
};

export type Task = {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	created_at: string;
	updated_at: string;
};

export type AuthData = {
	id: string;
	email: string;
	accessToken: string;
};

export type AuthCredentials = {
	email: string;
	password: string;
};

export type TaskStatusEvent = {
	id: string;
	status: TaskStatus;
	timestamp: string;
};

export type TaskFormState = {
	title: string;
	description: string;
	status: TaskStatus;
};

export const EMPTY_TASK_FORM: TaskFormState = {
	title: "",
	description: "",
	status: "TODO",
};

export type PaginatedTasks = {
	data: Task[];
};
