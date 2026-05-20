const API_URL = import.meta.env.VITE_API_URL?.trim() ?? "";

export async function apiRequest<T>(
	path: string,
	options: RequestInit = {},
	token?: string,
): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers ?? {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	const rawBody = await response.text();
	const body = rawBody ? JSON.parse(rawBody) : undefined;

	if (!response.ok) {
		const message = body?.message;

		throw new Error(
			Array.isArray(message)
				? message.join(", ")
				: (message ?? "Request failed"),
		);
	}

	return body as T;
}
