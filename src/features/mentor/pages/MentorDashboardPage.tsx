import { CalendarClock, CheckCircle2, FilePenLine, Hourglass } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge, Button, Card, EmptyState, SkeletonCard } from "@/components/ui";
import { useSessions, useUpdateSessionById } from "@/features/session";
import type { Session } from "@/features/session";
import { AvailabilityEditor } from "../components/AvailabilityEditor";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "@/i18n/i18n";
import { formatSessionRange } from "@/lib/utils";
import type { ComponentProps } from "react";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

function statusVariant(status: string): BadgeVariant {
  if (status === "COMPLETED") return "success";
  if (status === "CANCELED") return "error";
  return "warning";
}

function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
}

function auditTagLabel(t: (key: string) => string, tag: string | null | undefined) {
  if (!tag) return t("audit.topicPending");

  const key = "audit.tag." + tag;
  const translated = t(key);
  if (translated !== key) return translated;

  return tag
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function MentorDashboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSessions();
  const { user } = useAuthStore();
  const mentorId = user?.profileId ?? 0;
  const [notesBySessionId, setNotesBySessionId] = useState<Record<number, string>>({});
  const updateMutation = useUpdateSessionById();

  const sessions = data ?? [];
  const upcoming = sessions.filter((session) => session.status === "SCHEDULED");
  const completed = sessions.filter((session) => session.status === "COMPLETED");

  const noteFor = (session: Session) =>
    notesBySessionId[session.id] ?? session.evaluationNotes ?? "";

  const setSessionNote = (sessionId: number, value: string) => {
    setNotesBySessionId((current) => ({ ...current, [sessionId]: value }));
  };

  const saveNotes = (session: Session) => {
    updateMutation.mutate(
      {
        sessionId: session.id,
        payload: { evaluationNotes: noteFor(session) },
      },
      {
        onSuccess: () => toast.success(t("mentor.notesSaved")),
        onError: (error: unknown) => toast.error(errorMessage(error, t("mentor.notesSaveFailed"))),
      },
    );
  };

  const completeSession = (session: Session) => {
    updateMutation.mutate(
      {
        sessionId: session.id,
        payload: { evaluationNotes: noteFor(session), status: "COMPLETED" },
      },
      {
        onSuccess: () => toast.success(t("mentor.sessionCompleted")),
        onError: (error: unknown) => toast.error(errorMessage(error, t("mentor.sessionCompleteFailed"))),
      },
    );
  };

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

      <section className="space-y-8">
        <SessionGroup
          title={t("student.upcoming")}
          sessions={upcoming}
          loading={isLoading}
          noteFor={noteFor}
          onNoteChange={setSessionNote}
          onSaveNotes={saveNotes}
          onComplete={completeSession}
          pendingSessionId={updateMutation.variables?.sessionId}
          isPending={updateMutation.isPending}
        />
        <SessionGroup
          title={t("student.completed")}
          sessions={completed}
          loading={isLoading}
          noteFor={noteFor}
          onNoteChange={setSessionNote}
          onSaveNotes={saveNotes}
          onComplete={completeSession}
          pendingSessionId={updateMutation.variables?.sessionId}
          isPending={updateMutation.isPending}
        />
      </section>
    </div>
  );
}

function SessionGroup({
  title,
  sessions,
  loading,
  noteFor,
  onNoteChange,
  onSaveNotes,
  onComplete,
  pendingSessionId,
  isPending,
}: {
  title: string;
  sessions: Session[];
  loading: boolean;
  noteFor: (session: Session) => string;
  onNoteChange: (sessionId: number, value: string) => void;
  onSaveNotes: (session: Session) => void;
  onComplete: (session: Session) => void;
  pendingSessionId?: number;
  isPending: boolean;
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
                {formatSessionRange(session.startTime, session.endTime)}
              </div>
              <div className="mt-4 space-y-3">
                <label
                  htmlFor={`evaluation-notes-${session.id}`}
                  className="font-body text-label-caps uppercase tracking-widest text-text-secondary"
                >
                  {t("student.evaluationNotes")}
                </label>
                <textarea
                  id={`evaluation-notes-${session.id}`}
                  value={noteFor(session)}
                  onChange={(event) => onNoteChange(session.id, event.target.value)}
                  placeholder={t("mentor.evaluationPlaceholder")}
                  rows={3}
                  className="w-full rounded bg-surface px-4 py-3 font-body text-body-md text-text-primary border-b-2 border-text-secondary/30 outline-none transition-all duration-200 placeholder:text-text-secondary/50 focus:border-ember"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => onSaveNotes(session)}
                    disabled={isPending && pendingSessionId === session.id}
                  >
                    <FilePenLine className="h-4 w-4" />
                    {t("mentor.saveNotes")}
                  </Button>
                  {session.status === "SCHEDULED" && (
                    <Button
                      onClick={() => onComplete(session)}
                      disabled={isPending && pendingSessionId === session.id}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t("mentor.markComplete")}
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 rounded border border-border bg-surface-container-highest/40 p-3 text-sm">
                <div className="font-medium text-text-primary">{t("audit.topic")}</div>
                <div className="mt-1 text-text-secondary">
                  {session.audit?.status === "FAILED"
                    ? t("audit.topicUnavailable")
                    : auditTagLabel(t, session.audit?.predictedTag)}
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
