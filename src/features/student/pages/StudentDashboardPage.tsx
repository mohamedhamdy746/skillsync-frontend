import { CalendarX2, Clock3, RefreshCcw, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card, EmptyState, Input, SkeletonCard } from "@/components/ui";
import { useSessions, useUpdateSession } from "@/features/session";
import type { Session } from "@/features/session";
import { useDebounce } from "@/hooks";
import { useI18n } from "@/i18n/i18n";
import type { ComponentProps } from "react";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

function statusVariant(status: string): BadgeVariant {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELED") return "error";
  return "warning";
}

export default function StudentDashboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSessions();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>("");
  const [newStartTime, setNewStartTime] = useState("");
  const [notes, setNotes] = useState("");
  const debouncedStartTime = useDebounce(newStartTime, 350);

  const updateMutation = useUpdateSession(Number(sessionId));

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      await updateMutation.mutateAsync({ status: "CANCELED" });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });

  const rescheduleMutation = useMutation({
    mutationFn: async () => {
      await updateMutation.mutateAsync({ startTime: debouncedStartTime || newStartTime });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });

  const sessions = data ?? [];
  const upcoming = sessions.filter((session) => session.status === "SCHEDULED");
  const completed = sessions.filter((session) => session.status === "COMPLETED");
  const canceled = sessions.filter((session) => session.status === "CANCELED");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Clock3 className="h-6 w-6 text-ember" />
          <h1 className="font-display text-3xl italic text-text-primary">{t("student.dashboard")}</h1>
        </div>
        <p className="max-w-2xl text-sm text-text-secondary">
          {t("student.dashboardSubtitle")}
        </p>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-text-secondary">{t("student.upcoming")}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{upcoming.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary">{t("student.completed")}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{completed.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary">{t("student.canceled")}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{canceled.length}</div>
        </Card>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">{t("student.sessionActions")}</h2>
          <span className="text-sm text-text-secondary">{t("student.selectSessionId")}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label={t("student.sessionId")} value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
          <Input label={t("student.rescheduleStart")} type="datetime-local" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
          <Input label={t("student.notes")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("student.evaluationNotes")} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => cancelMutation.mutate(Number(sessionId))}
            disabled={!sessionId || cancelMutation.isPending}
          >
            <CalendarX2 className="h-4 w-4" />
            {t("student.cancelSession")}
          </Button>
          <Button
            onClick={() => rescheduleMutation.mutate()}
            disabled={!sessionId || !newStartTime || rescheduleMutation.isPending}
          >
            <RefreshCcw className="h-4 w-4" />
            {t("student.reschedule")}
          </Button>
        </div>
      </section>

      <section className="space-y-8">
        <SessionGroup title={t("student.upcoming")} sessions={upcoming} loading={isLoading} />
        <SessionGroup title={t("student.completed")} sessions={completed} loading={isLoading} />
        <SessionGroup title={t("student.canceled")} sessions={canceled} loading={isLoading} />
      </section>
    </div>
  );
}

function SessionGroup({
  title,
  sessions,
  loading,
}: {
  title: string;
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
          icon={<ShieldAlert className="h-8 w-8" />}
          title={t("student.noSessionsTitle").replace("{title}", title.toLowerCase())}
          description={t("student.noSessionsDesc")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <Card key={session.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium text-text-primary">{session.mentorName}</div>
                  <div className="mt-1 text-sm text-text-secondary">{session.description}</div>
                </div>
                <Badge variant={statusVariant(session.status)}>
                  {t("status." + session.status)}
                </Badge>
              </div>
              <div className="mt-4 text-sm text-text-secondary">
                {session.startTime} - {session.endTime}
              </div>
              {session.audit && (
                <div className="mt-4 rounded border border-border bg-surface-container-highest/40 p-3 text-sm">
                  <div className="font-medium text-text-primary">{t("student.audit")}</div>
                  <div className="mt-1 text-text-secondary">
                    {t("audit.status." + session.audit.status)}
                    {session.audit.predictedTag ? ` • ${t("audit.tag." + session.audit.predictedTag)}` : ""}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
