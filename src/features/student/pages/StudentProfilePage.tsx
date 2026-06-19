import { useState } from "react";
import { User, Mail, Calendar, Edit2, Check, X } from "lucide-react";
import { Button, Card, Input, SkeletonLine, Skeleton } from "@/components/ui";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "@/i18n/i18n";
import { useUpdateProfile } from "@/features/auth/hooks/useAuth";

export default function StudentProfilePage() {
  const { t } = useI18n();
  const { user, setUser } = useAuthStore();
  const updateMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-gutter py-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <Card className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <SkeletonLine />
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setName(user.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updateMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleCancel = () => {
    setName(user.name);
    setIsEditing(false);
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <div className="mx-auto max-w-4xl px-gutter py-8">
      <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
        {t("profile.title")}
      </h1>
      <p className="mt-2 font-body text-body-lg text-text-secondary">
        {t("profile.subtitle")}
      </p>

      <Card accentBar className="mt-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-headline-md italic text-text-primary">
                {user.name}
              </h2>
              {!isEditing && (
                <button onClick={handleEdit}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary hover:border-ember hover:text-ember transition-colors duration-200 shrink-0"
                >
                  <Edit2 className="h-4 w-4" />
                  {t("common.edit")}
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="h-5 w-5 text-ember shrink-0" />
                <span className="font-body text-body-md">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <User className="h-5 w-5 text-ember shrink-0" />
                <span className="font-body text-body-md">{t("auth.student")}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="h-5 w-5 text-ember shrink-0" />
                <span className="font-body text-body-md">
                  {t("student.memberSince").replace("{date}", memberSince)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-display text-headline-sm italic text-text-primary mb-4">
              {t("student.editProfile")}
            </h3>
            <div className="max-w-md space-y-4">
              <Input
                label={t("auth.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("auth.fullName")}
              />
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!name.trim() || updateMutation.isPending}
                  isLoading={updateMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
