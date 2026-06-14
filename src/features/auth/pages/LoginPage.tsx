import { AuthBanner, LoginForm } from "../index";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 grid grid-cols-1 lg:grid-cols-2 bg-canvas text-on-surface">
      {/* Left Column: Brand & Identity */}
      <AuthBanner />

      {/* Right Column: Sign In */}
      <div className="flex items-center justify-center px-8 bg-canvas relative z-20">
        <LoginForm />
      </div>
    </div>
  );
}
