/**
 * LoginPage — Unified authentication view.
 *
 * TODO: Implement login form with:
 * - Email & password fields (react-hook-form + zod validation)
 * - useLogin() mutation hook
 * - Error toast on failure
 * - Redirect to intended route on success
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8">
        <h1 className="font-display text-headline-md italic text-text-primary">
          Sign In
        </h1>
        <p className="mt-2 font-body text-body-md text-text-secondary">
          Welcome back to SkillSync
        </p>
        {/* TODO: Login form implementation */}
      </div>
    </div>
  );
}
