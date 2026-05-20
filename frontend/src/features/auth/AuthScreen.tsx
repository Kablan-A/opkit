import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { AuthCredentials } from "@/shared/types";

type AuthScreenProps = {
	authMode: "login" | "register";
	setAuthMode: (mode: "login" | "register") => void;
	authForm: AuthCredentials;
	setAuthForm: Dispatch<SetStateAction<AuthCredentials>>;
	authError: string;
	authLoading: boolean;
	handleAuthSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function AuthScreen({
	authMode,
	setAuthMode,
	authForm,
	setAuthForm,
	authError,
	authLoading,
	handleAuthSubmit,
}: AuthScreenProps) {
	return (
		<main className='min-h-screen bg-slate-950 px-4 py-10 text-slate-50'>
			<div className='mx-auto flex w-full max-w-md flex-col gap-6'>
				<div>
					<p className='text-sm text-slate-400'>OpKit mini CRM</p>
					<h1 className='text-3xl font-semibold'>
						{authMode === "register" ? "Create account" : "Sign in"}
					</h1>
					<p className='mt-2 text-sm text-slate-400'>
						Use the same account in two browsers to see live task updates.
					</p>
				</div>

				<div className='rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20'>
					<div className='mb-5 flex gap-2 rounded-xl bg-slate-800 p-1'>
						<button
							type='button'
							onClick={() => setAuthMode("login")}
							className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${authMode === "login" ? "bg-white text-slate-950" : "text-slate-300"}`}
						>
							Login
						</button>
						<button
							type='button'
							onClick={() => setAuthMode("register")}
							className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${authMode === "register" ? "bg-white text-slate-950" : "text-slate-300"}`}
						>
							Register
						</button>
					</div>

					<form className='space-y-4' onSubmit={handleAuthSubmit}>
						<label className='block space-y-2 text-sm'>
							<span className='text-slate-300'>Email</span>
							<input
								value={authForm.email}
								onChange={(event) =>
									setAuthForm((current) => ({
										...current,
										email: event.target.value,
									}))
								}
								type='email'
								className='w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-500'
								placeholder='you@example.com'
								required
							/>
						</label>

						<label className='block space-y-2 text-sm'>
							<span className='text-slate-300'>Password</span>
							<input
								value={authForm.password}
								onChange={(event) =>
									setAuthForm((current) => ({
										...current,
										password: event.target.value,
									}))
								}
								type='password'
								className='w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-500'
								placeholder='••••••••'
								required
							/>
						</label>

						{authError ? (
							<p className='text-sm text-rose-400'>{authError}</p>
						) : null}

						<button
							type='submit'
							disabled={authLoading}
							className='inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60'
						>
							{authLoading
								? "Working..."
								: authMode === "register"
									? "Create account"
									: "Login"}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
