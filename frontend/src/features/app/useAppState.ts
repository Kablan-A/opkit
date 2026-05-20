import { useEffect, useMemo, useState, type FormEvent } from "react";
import { io, type Socket } from "socket.io-client";

import { apiRequest } from "@/shared/api/client";
import { clearAuth, loadAuth, saveAuth } from "@/shared/auth/storage";
import {
	EMPTY_TASK_FORM,
	TASK_STATUS_LABELS,
	TASK_STATUSES,
	type AuthCredentials,
	type AuthData,
	type PaginatedTasks,
	type Task,
	type TaskFormState,
	type TaskStatus,
	type TaskStatusEvent,
} from "@/shared/types";

const API_URL = import.meta.env.VITE_API_URL?.trim() ?? "";

export function useAppState() {
	const [auth, setAuth] = useState<AuthData | null>(() => loadAuth());
	const [authMode, setAuthMode] = useState<"login" | "register">("login");
	const [authForm, setAuthForm] = useState<AuthCredentials>({
		email: "",
		password: "",
	});
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);

	const [tasks, setTasks] = useState<Task[]>([]);
	const [tasksLoading, setTasksLoading] = useState(false);
	const [tasksError, setTasksError] = useState("");

	const [taskForm, setTaskForm] = useState<TaskFormState>(EMPTY_TASK_FORM);
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
	const [savingTask, setSavingTask] = useState(false);

	useEffect(() => {
		if (auth) {
			saveAuth(auth);
			return;
		}

		clearAuth();
	}, [auth]);

	useEffect(() => {
		if (!auth) {
			return;
		}

		const accessToken = auth.accessToken;

		let active = true;

		async function loadTasks() {
			setTasksLoading(true);
			setTasksError("");

			try {
				const response = await apiRequest<PaginatedTasks>(
					"/tasks?limit=1000",
					{},
					accessToken,
				);

				if (active) {
					setTasks(response.data ?? []);
				}
			} catch (error) {
				if (active) {
					setTasksError(
						error instanceof Error ? error.message : "Failed to load tasks",
					);
				}
			} finally {
				if (active) {
					setTasksLoading(false);
				}
			}
		}

		void loadTasks();

		return () => {
			active = false;
		};
	}, [auth]);

	useEffect(() => {
		if (!auth) {
			return;
		}

		const socket: Socket = io(API_URL || undefined, {
			path: "/socket.io",
			transports: ["websocket"],
		});

		socket.on("task.statusChanged", (event: TaskStatusEvent) => {
			setTasks((currentTasks) =>
				currentTasks.map((task) =>
					task.id === event.id
						? { ...task, status: event.status, updated_at: event.timestamp }
						: task,
				),
			);
		});

		return () => {
			socket.disconnect();
		};
	}, [auth]);

	const groupedTasks = useMemo(
		() =>
			TASK_STATUSES.reduce(
				(accumulator, status) => {
					accumulator[status] = tasks.filter((task) => task.status === status);
					return accumulator;
				},
				{} as Record<TaskStatus, Task[]>,
			),
		[tasks],
	);

	async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setAuthError("");
		setAuthLoading(true);

		try {
			const endpoint =
				authMode === "register" ? "/auth/register" : "/auth/login";
			const response = await apiRequest<AuthData>(endpoint, {
				method: "POST",
				body: JSON.stringify({
					email: authForm.email.trim(),
					password: authForm.password,
				}),
			});

			setAuth(response);
			setAuthForm({ email: "", password: "" });
		} catch (error) {
			setAuthError(
				error instanceof Error ? error.message : "Authentication failed",
			);
		} finally {
			setAuthLoading(false);
		}
	}

	async function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const title = taskForm.title.trim();

		if (!title) {
			setTasksError("Title is required");
			return;
		}

		if (!auth) {
			return;
		}

		setTasksError("");
		setSavingTask(true);

		try {
			const payload = {
				title,
				description: taskForm.description.trim() || undefined,
				status: taskForm.status,
			};

			if (editingTaskId) {
				const updatedTask = await apiRequest<Task>(
					`/tasks/${editingTaskId}`,
					{
						method: "PATCH",
						body: JSON.stringify(payload),
					},
					auth.accessToken,
				);

				setTasks((currentTasks) =>
					currentTasks.map((task) =>
						task.id === updatedTask.id ? updatedTask : task,
					),
				);
			} else {
				const createdTask = await apiRequest<Task>(
					"/tasks",
					{
						method: "POST",
						body: JSON.stringify(payload),
					},
					auth.accessToken,
				);

				setTasks((currentTasks) => [createdTask, ...currentTasks]);
			}

			setTaskForm(EMPTY_TASK_FORM);
			setEditingTaskId(null);
		} catch (error) {
			setTasksError(
				error instanceof Error ? error.message : "Could not save task",
			);
		} finally {
			setSavingTask(false);
		}
	}

	async function changeStatus(taskId: string, status: TaskStatus) {
		if (!auth) {
			return;
		}

		try {
			const updatedTask = await apiRequest<Task>(
				`/tasks/${taskId}/status`,
				{
					method: "PATCH",
					body: JSON.stringify({ status }),
				},
				auth.accessToken,
			);

			setTasks((currentTasks) =>
				currentTasks.map((task) =>
					task.id === updatedTask.id ? updatedTask : task,
				),
			);
		} catch (error) {
			setTasksError(
				error instanceof Error ? error.message : "Could not update status",
			);
		}
	}

	async function deleteTask(taskId: string) {
		if (!auth) {
			return;
		}

		try {
			await apiRequest<void>(
				`/tasks/${taskId}`,
				{ method: "DELETE" },
				auth.accessToken,
			);

			setTasks((currentTasks) =>
				currentTasks.filter((task) => task.id !== taskId),
			);

			if (editingTaskId === taskId) {
				setEditingTaskId(null);
				setTaskForm(EMPTY_TASK_FORM);
			}
		} catch (error) {
			setTasksError(
				error instanceof Error ? error.message : "Could not delete task",
			);
		}
	}

	function startEditing(task: Task) {
		setEditingTaskId(task.id);
		setTaskForm({
			title: task.title,
			description: task.description ?? "",
			status: task.status,
		});
	}

	function cancelEditing() {
		setEditingTaskId(null);
		setTaskForm(EMPTY_TASK_FORM);
	}

	function logout() {
		clearAuth();
		setAuth(null);
		setTasks([]);
		setTaskForm(EMPTY_TASK_FORM);
		setEditingTaskId(null);
		setAuthForm({ email: "", password: "" });
		setTasksError("");
		setAuthError("");
	}

	return {
		auth,
		authMode,
		setAuthMode,
		authForm,
		setAuthForm,
		authError,
		authLoading,
		handleAuthSubmit,
		groupedTasks,
		tasksLoading,
		tasksError,
		taskForm,
		setTaskForm,
		editingTaskId,
		savingTask,
		handleTaskSubmit,
		changeStatus,
		deleteTask,
		startEditing,
		cancelEditing,
		logout,
		taskStatusLabels: TASK_STATUS_LABELS,
	};
}
