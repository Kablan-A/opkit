import { AuthScreen } from "@/features/auth/AuthScreen";
import { TasksWorkspace } from "@/features/tasks/TasksWorkspace";
import { useAppState } from "@/features/app/useAppState";

function App() {
	const app = useAppState();
	const { auth } = app;

	if (!auth) {
		return <AuthScreen {...app} />;
	}

	return <TasksWorkspace {...app} auth={auth} />;
}

export default App;
