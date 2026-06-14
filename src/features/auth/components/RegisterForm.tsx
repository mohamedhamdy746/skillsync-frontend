import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { useI18n } from "@/i18n/i18n";
import { Input, Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// Base Object Schema for strict Type Inference
const registerBaseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  role: z.enum(["STUDENT", "MENTOR"]),
  title: z.string().optional(),
  hourlyRate: z.number().min(0, "Hourly rate cannot be negative").optional(),
  bio: z.string().optional(),
});

// Refined schema for conditional logic validation
const registerSchema = registerBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "MENTOR") {
        return !!data.title && data.title.trim().length > 0;
      }
      return true;
    },
    {
      message: "Specialty title is required for mentors",
      path: ["title"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "MENTOR") {
        return data.hourlyRate !== undefined && data.hourlyRate > 0;
      }
      return true;
    },
    {
      message: "Hourly rate is required for mentors",
      path: ["hourlyRate"],
    }
  );

type RegisterFormValues = z.infer<typeof registerBaseSchema>;

export function RegisterForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "MENTOR">("STUDENT");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      role: "STUDENT",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      title: "",
      hourlyRate: 150,
      bio: "",
    },
  });

  const passwordVal = watch("password") || "";

  const handleRoleChange = (role: "STUDENT" | "MENTOR") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      ...(data.role === "MENTOR"
        ? { title: data.title, hourlyRate: data.hourlyRate, bio: data.bio }
        : {}),
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("auth.createAccountSuccess") || "Account created successfully!");
        navigate("/login");
      },
      onError: (err: any) => {
        toast.error(err.message || "Registration failed. Email might already be taken.");
      },
    });
  };

  // Simple Password Strength calculation
  const getPasswordStrength = () => {
    if (!passwordVal) return 0;
    let score = 1;
    if (passwordVal.length > 5) score = 2;
    if (passwordVal.length > 8 && /[0-9]/.test(passwordVal) && /[^A-Za-z0-9]/.test(passwordVal)) {
      score = 3;
    }
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="w-full max-w-[500px]">
      {/* Logo & Headline for Mobile */}
      <div className="text-center lg:hidden mb-8">
        <Link to="/" className="font-display text-display-lg-mobile italic text-primary">
          SkillSync
        </Link>
        <h1 className="font-display text-[32px] leading-[1.2] italic text-text-primary mt-2">
          Elevate your craft.
        </h1>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-[500px] rounded-xl border border-border p-8 lg:p-10 bg-surface/80 shadow-2xl backdrop-blur-sm">
        <h2 className="font-display text-[24px] font-semibold text-text-primary mb-6">
          Join Scholar's Night
        </h2>

        {/* Role Selector Segmented Control */}
        <div className="flex rounded-lg bg-surface-container-high p-1 mb-8" role="tablist">
          <button
            type="button"
            onClick={() => handleRoleChange("STUDENT")}
            className={`flex-1 py-2 px-4 rounded font-body text-label-caps tracking-widest text-[11px] transition-all uppercase ${
              selectedRole === "STUDENT"
                ? "bg-surface text-primary border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
            role="tab"
            aria-selected={selectedRole === "STUDENT"}
          >
            I'M A STUDENT
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("MENTOR")}
            className={`flex-1 py-2 px-4 rounded font-body text-label-caps tracking-widest text-[11px] transition-all uppercase ${
              selectedRole === "MENTOR"
                ? "bg-surface text-primary border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
            role="tab"
            aria-selected={selectedRole === "MENTOR"}
          >
            I'M A MENTOR
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Ada Lovelace"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="ada@analytical-engine.org"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              {/* Password Strength Indicator */}
              {passwordVal && (
                <div className="flex gap-1 h-1 w-full mt-1.5">
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strength >= 1
                        ? strength === 1
                          ? "bg-error"
                          : strength === 2
                          ? "bg-outline"
                          : "bg-primary-container"
                        : "bg-surface-container-high"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strength >= 2
                        ? strength === 2
                          ? "bg-outline"
                          : "bg-primary-container"
                        : "bg-surface-container-high"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-colors ${
                      strength >= 3 ? "bg-primary-container" : "bg-surface-container-high"
                    }`}
                  />
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          {/* Mentor-Specific Fields (Visible when selectedRole === MENTOR) */}
          {selectedRole === "MENTOR" && (
            <div className="pt-4 border-t border-border space-y-4 transition-all duration-300">
              <Input
                label="Title / Specialty"
                placeholder="Senior Distributed Systems Engineer"
                error={errors.title?.message}
                {...register("title")}
              />

              <div className="space-y-1.5">
                <label className="font-body text-label-caps uppercase tracking-widest text-text-secondary">
                  Tech Stack Mastery
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded bg-[#2a2826] text-[#a3a19f] font-body text-label-caps text-[10px] tracking-wider border border-[#2a2826] cursor-pointer hover:border-primary-container transition-colors">
                    RUST
                  </span>
                  <span className="px-3 py-1 rounded bg-surface border border-primary-container text-primary font-body text-label-caps text-[10px] tracking-wider cursor-pointer">
                    TYPESCRIPT
                  </span>
                  <span className="px-3 py-1 rounded bg-[#2a2826] text-[#a3a19f] font-body text-label-caps text-[10px] tracking-wider border border-[#2a2826] cursor-pointer hover:border-primary-container transition-colors">
                    GO
                  </span>
                  <span className="px-3 py-1 rounded bg-[#2a2826] text-[#a3a19f] font-body text-label-caps text-[10px] tracking-wider border border-[#2a2826] cursor-pointer hover:border-primary-container transition-colors">
                    PYTHON
                  </span>
                  <span className="px-3 py-1 rounded bg-surface border border-primary-container text-primary font-body text-label-caps text-[10px] tracking-wider cursor-pointer">
                    REACT
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <Input
                    label="Hourly Rate ($)"
                    type="number"
                    placeholder="150"
                    error={errors.hourlyRate?.message}
                    {...register("hourlyRate", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="bio"
                  className="font-body text-label-caps uppercase tracking-widest text-text-secondary"
                >
                  Academic Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Detail your experience in guiding complex technical discourse..."
                  rows={3}
                  className="w-full rounded bg-surface px-4 py-3 font-body text-body-md text-text-primary border-b-2 border-text-secondary/30 outline-none transition-all duration-200 focus:border-ember focus:-translate-y-px"
                  {...register("bio")}
                />
                {errors.bio?.message && (
                  <span className="font-body text-code-sm text-error">
                    {errors.bio.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Legal Checklist Option */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              type="checkbox"
              required
              className="w-4 h-4 rounded border-border bg-surface text-primary-container focus:ring-primary-container focus:ring-offset-background cursor-pointer mt-0.5"
            />
            <label
              htmlFor="terms"
              className="font-body text-body-md text-[14px] text-text-secondary leading-snug cursor-pointer select-none"
            >
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline underline-offset-2">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline underline-offset-2">
                Ethical Code
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={registerMutation.isPending}
            className="h-12 w-full bg-primary-container text-background font-body text-label-caps uppercase tracking-widest text-[12px] rounded flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all ember-glow mt-6"
          >
            <span>CREATE ACCOUNT</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Redirection Link */}
      <p className="text-center mt-8 font-body text-body-md text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
