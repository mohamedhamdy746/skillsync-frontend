/**
 * RegisterPage — Onboarding portal with role selection.
 *
 * TODO: Implement registration form with:
 * - Name, email, password fields (react-hook-form + zod)
 * - Role selection (Student / Mentor)
 * - useRegister() mutation hook
 * - Redirect to dashboard on success
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8">
        <h1 className="font-display text-headline-md italic text-text-primary">
          Create Account
        </h1>
        <p className="mt-2 font-body text-body-md text-text-secondary">
          Join SkillSync as a Student or Mentor
        </p>
        {/* TODO: Registration form implementation */}
      </div>
    </div>
  );
}
