import { CalendarX2, Clock3, RefreshCcw, ShieldAlert } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge, Button, Card, EmptyState, Skeleton, SkeletonCard } from "@/components/ui";
import { useAvailableSlots } from "@/features/mentor/hooks/useAvailability";
import type { AvailableSlot } from "@/features/mentor/types";
import { useSessions, useUpdateSessionById } from "@/features/session";
import type { Session } from "@/features/session";
import { useI18n } from "@/i18n/i18n";
import { cn, formatSessionRange, formatTime } from "@/lib/utils";
import type { ComponentProps } from "react";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

const todayISO = () => new Date().toISOString().slice(0, 10);

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

function initialRescheduleDate(session: Session) {
  const sessionDate = session.startTime.slice(0, 10);
  const today = todayISO();
  return sessionDate >= today ? sessionDate : today;
}

export default function StudentDashboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSessions();
  const [rescheduleBySessionId, setRescheduleBySessionId] = useState<Record<number, string>>({});
  const updateMutation = useUpdateSessionById();

  const sessions = data ?? [];
  const upcoming = sessions.filter((session) => session.status === "SCHEDULED");
  const completed = sessions.filter((session) => session.status === "COMPLETED");
  const canceled = sessions.filter((session) => session.status === "CANCELED");

  const rescheduleValueFor = (session: Session) => rescheduleBySessionId[session.id] ?? "";

  const setRescheduleValue = (sessionId: number, value: string) => {
    setRescheduleBySessionId((current) => ({ ...current, [sessionId]: value }));
  };

  const cancelSession = (session: Session) => {
    updateMutation.mutate(
      {
        sessionId: session.id,
        payload: { status: "CANCELED" },
      },
      {
        onSuccess: () => toast.success(t("student.sessionCanceled")),
        onError: (error: unknown) => toast.error(errorMessage(error, t("student.sessionCancelFailed"))),
      },
    );
  };

  const rescheduleSession = (session: Session) => {
    const startTime = rescheduleValueFor(session);
    if (!startTime) return;

    updateMutation.mutate(
      {
        sessionId: session.id,
        payload: { startTime },
      },
      {
        onSuccess: () => {
          toast.success(t("student.sessionRescheduled"));
          setRescheduleValue(session.id, "");
        },
        onError: (error: unknown) => toast.error(errorMessage(error, t("student.sessionRescheduleFailed"))),
      },
    );
  };

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

      <section className="space-y-8">
        <SessionGroup
          title={t("student.upcoming")}
          sessions={upcoming}
          loading={isLoading}
          rescheduleValueFor={rescheduleValueFor}
          onRescheduleChange={setRescheduleValue}
          onReschedule={rescheduleSession}
          onCancel={cancelSession}
          pendingSessionId={updateMutation.variables?.sessionId}
          isPending={updateMutation.isPending}
        />
        <SessionGroup
          title={t("student.completed")}
          sessions={completed}
          loading={isLoading}
          rescheduleValueFor={rescheduleValueFor}
          onRescheduleChange={setRescheduleValue}
          onReschedule={rescheduleSession}
          onCancel={cancelSession}
          pendingSessionId={updateMutation.variables?.sessionId}
          isPending={updateMutation.isPending}
        />
        <SessionGroup
          title={t("student.canceled")}
          sessions={canceled}
          loading={isLoading}
          rescheduleValueFor={rescheduleValueFor}
          onRescheduleChange={setRescheduleValue}
          onReschedule={rescheduleSession}
          onCancel={cancelSession}
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
  rescheduleValueFor,
  onRescheduleChange,
  onReschedule,
  onCancel,
  pendingSessionId,
  isPending,
}: {
  title: string;
  sessions: Session[];
  loading: boolean;
  rescheduleValueFor: (session: Session) => string;
  onRescheduleChange: (sessionId: number, value: string) => void;
  onReschedule: (session: Session) => void;
  onCancel: (session: Session) => void;
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
                {formatSessionRange(session.startTime, session.endTime)}
              </div>
              {session.status === "SCHEDULED" && (
                <div className="mt-4 space-y-4 rounded border border-border bg-surface-container-highest/40 p-3">
                  <RescheduleSlotPicker
                    session={session}
                    selectedStartTime={rescheduleValueFor(session)}
                    onSelect={(slot) => onRescheduleChange(session.id, slot.startTime)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => onCancel(session)}
                      disabled={isPending && pendingSessionId === session.id}
                    >
                      <CalendarX2 className="h-4 w-4" />
                      {t("student.cancelSession")}
                    </Button>
                    <Button
                      onClick={() => onReschedule(session)}
                      disabled={!rescheduleValueFor(session) || (isPending && pendingSessionId === session.id)}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      {t("student.reschedule")}
                    </Button>
                  </div>
                </div>
              )}
              {session.evaluationNotes && (
                <div className="mt-4 rounded border border-border bg-surface-container-highest/40 p-3 text-sm">
                  <div className="font-medium text-text-primary">{t("student.mentorFeedback")}</div>
                  <p className="mt-1 whitespace-pre-wrap text-text-secondary">{session.evaluationNotes}</p>
                </div>
              )}
              {session.audit && (
                <div className="mt-4 rounded border border-border bg-surface-container-highest/40 p-3 text-sm">
                  <div className="font-medium text-text-primary">{t("audit.topic")}</div>
                  <div className="mt-1 text-text-secondary">
                    {session.audit.status === "FAILED"
                      ? t("audit.topicUnavailable")
                      : auditTagLabel(t, session.audit.predictedTag)}
                  </div>
                  {session.audit.errorMessage && (
                    <div className="mt-1 text-error">{session.audit.errorMessage}</div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RescheduleSlotPicker({
  session,
  selectedStartTime,
  onSelect,
}: {
  session: Session;
  selectedStartTime: string;
  onSelect: (slot: AvailableSlot) => void;
}) {
  const { t } = useI18n();
  const [date, setDate] = useState(() => initialRescheduleDate(session));
  const { data, isLoading, isError } = useAvailableSlots(session.mentorId, date);
  const slots = data?.availableSlots ?? [];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor={`reschedule-date-${session.id}`}
          className="text-sm text-text-secondary"
        >
          {t("booking.pickDate")}
        </label>
        <input
          id={`reschedule-date-${session.id}`}
          type="date"
          value={date}
          min={todayISO()}
          onChange={(event) => setDate(event.target.value)}
          className="rounded bg-surface px-3 py-2 text-body-md text-text-primary border-b-2 border-text-secondary/30 outline-none focus:border-ember"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-error">{t("booking.loadErrorDesc")}</p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("booking.noSlotsDesc")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => {
            const active = selectedStartTime === slot.startTime;
            return (
              <button
                key={slot.startTime}
                type="button"
                onClick={() => onSelect(slot)}
                className={cn(
                  "rounded border px-3 py-2 text-sm font-body transition-colors",
                  active
                    ? "border-ember bg-ember text-canvas"
                    : "border-text-secondary/30 text-text-primary hover:border-ember hover:text-ember",
                )}
              >
                {formatTime(slot.startTime)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
