import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useI18n } from "@/i18n/i18n";
import { Input, Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect target after login
  const from = (location.state as any)?.from?.pathname || "/";

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(t("auth.signInSuccess") || "Logged in successfully!");

        // Dynamic navigation according to user role
        if (from !== "/") {
          navigate(from, { replace: true });
        } else {
          if (response.user.role === "STUDENT") {
            navigate("/dashboard", { replace: true });
          } else if (response.user.role === "MENTOR") {
            navigate("/mentor/dashboard", { replace: true });
          } else if (response.user.role === "ADMIN") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Invalid email or password");
      },
    });
  };

  return (
    <div className="w-full max-w-[500px]">
      {/* Logo & Headline for Mobile */}
      <div className="text-center lg:hidden mb-8">
        <Link
          to="/"
          className="font-display text-display-lg-mobile italic text-primary"
        >
          SkillSync
        </Link>
        <h1 className="font-display text-[32px] leading-[1.2] italic text-text-primary mt-2">
          {t("auth.elevateYourCraft")}
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[500px] rounded-xl border border-border p-8 lg:p-10 bg-surface/80 shadow-2xl backdrop-blur-sm">
        <h2 className="font-display text-[26px] font-semibold text-text-primary mb-2">
          {t("auth.welcomeBack")}
        </h2>
        <p className="font-body text-body-md text-text-secondary mb-8">
          {t("auth.signInWorkspace")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <Input
              label={t("auth.emailAddress")}
              type="email"
              placeholder="ada@analytical-engine.org"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label={t("auth.password")}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            className="h-12 w-full bg-primary-container text-background font-body text-label-caps uppercase tracking-widest text-[12px] rounded flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all ember-glow mt-6"
          >
            <span>{t("auth.signInButton")}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Redirection Link */}
      <p className="text-center mt-8 font-body text-body-md text-text-secondary">
        {t("auth.newToCommunity")}{" "}
        <Link
          to="/register"
          className="text-primary hover:underline underline-offset-4"
        >
          {t("auth.createAccount")}
        </Link>
      </p>
    </div>
  );
}
