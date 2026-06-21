import { CalendarClock, CheckCircle2, FilePenLine, Hourglass } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, EmptyState, Input, SkeletonCard } from "@/components/ui";
import { useSessions, useUpdateSession } from "@/features/session";
import type { Session } from "@/features/session";
import { AvailabilityEditor } from "../components/AvailabilityEditor";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "@/i18n/i18n";
import type { ComponentProps } from "react";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

function statusVariant(status: string): BadgeVariant {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELED") return "error";
  return "warning";
}

export default function MentorDashboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSessions();
  const { user } = useAuthStore();
  const mentorId = user?.profileId ?? 0;
  const [selectedId, setSelectedId] = useState("");
  const [evaluationNotes, setEvaluationNotes] = useState("");
  const updateMutation = useUpdateSession(Number(selectedId));

  const sessions = data ?? [];
  const upcoming = sessions.filter((session) => session.status === "SCHEDULED");
  const completed = sessions.filter((session) => session.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Hourglass className="h-6 w-6 text-ember" />
          <h1 className="font-display text-3xl italic text-text-primary">{t("mentor.dashboard")}</h1>
        </div>
        <p className="max-w-2xl text-sm text-text-secondary">
          {t("mentor.dashboardSubtitle")}
        </p>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm text-text-secondary">{t("student.upcoming")}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{upcoming.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary">{t("student.completed")}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{completed.length}</div>
        </Card>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ember" />
          <h2 className="text-lg font-semibold text-text-primary">{t("availability.sectionTitle")}</h2>
        </div>
        <AvailabilityEditor mentorId={mentorId} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("mentor.evaluationTools")}</h2>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <Input label={t("student.sessionId")} value={selectedId} onChange={(e) => setSelectedId(e.target.value)} />
          <Input label={t("student.evaluationNotes")} value={evaluationNotes} onChange={(e) => setEvaluationNotes(e.target.value)} placeholder={t("mentor.evaluationPlaceholder")} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => updateMutation.mutate({ evaluationNotes, status: "COMPLETED" })}
            disabled={!selectedId || updateMutation.isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
            {t("mentor.markComplete")}
          </Button>
          <Button
            onClick={() => updateMutation.mutate({ evaluationNotes })}
            disabled={!selectedId || !evaluationNotes || updateMutation.isPending}
          >
            <FilePenLine className="h-4 w-4" />
            {t("mentor.saveNotes")}
          </Button>
        </div>
      </section>

      <section className="space-y-8">
        <SessionGroup title={t("student.upcoming")} rawTitle="Upcoming" sessions={upcoming} loading={isLoading} />
        <SessionGroup title={t("student.completed")} rawTitle="Completed" sessions={completed} loading={isLoading} />
      </section>
    </div>
  );
}

function SessionGroup({
  title,
  rawTitle,
  sessions,
  loading,
}: {
  title: string;
  rawTitle: string;
  sessions: Session[];
  loading: boolean;
}) {
  const { t } = useI18n();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <span className="text-sm text-text-secondary">
          {t("student.sessionsCount").replace("{count}", String(sessions.length))}
        </span>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<Hourglass className="h-8 w-8" />}
          title={t("student.noSessionsTitle").replace("{title}", title.toLowerCase())}
          description={t("mentor.noSessionsDesc")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <Card key={session.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium text-text-primary">{session.studentName}</div>
                  <div className="mt-1 text-sm text-text-secondary">{session.description}</div>
                </div>
                <Badge variant={statusVariant(session.status)}>
                  {t("status." + session.status)}
                </Badge>
              </div>
              <div className="mt-4 text-sm text-text-secondary">
                {session.startTime} - {session.endTime}
              </div>
              <div className="mt-4 rounded border border-border bg-surface-container-highest/40 p-3 text-sm">
                <div className="font-medium text-text-primary">{t("student.audit")}</div>
                <div className="mt-1 text-text-secondary">
                  {t("audit.status." + (session.audit?.status ?? "PENDING"))}
                  {session.audit?.predictedTag ? ` • ${t("audit.tag." + session.audit.predictedTag)}` : ""}
                </div>
                {session.audit?.errorMessage && (
                  <div className="mt-1 text-error">{session.audit.errorMessage}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
