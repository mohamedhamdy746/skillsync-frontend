import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAllMentors, useUpdateUserStatus } from "../hooks/useAdmin";
import type { AdminMentorListResponse } from "../api/admin.api";
import { Badge, Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";
import { useI18n } from "@/i18n/i18n";

export default function AdminMentorListPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(0);
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);
  const { data, isLoading } = useAllMentors(page);
  const updateStatus = useUpdateUserStatus();

function changeStatus(mentor: AdminMentorListResponse, status: "APPROVED" | "BLOCKED") {
    setProcessingUserId(mentor.userId);
    updateStatus.mutate(
      { userId: mentor.userId, payload: { status } },
      {
        onSuccess: () => {
          toast.success(
            status === "BLOCKED"
              ? t("admin.users.blockedSuccess")
              : t("admin.users.activatedSuccess"),
          );
        },
        onError: (error: unknown) => {
          const message = error && typeof error === "object" && "message" in error
            ? (error as { message?: unknown }).message
            : null;
          toast.error(typeof message === "string" ? message : t("admin.users.updateFailed"));
        },
        onSettled: () => setProcessingUserId(null),
      },
    );
  }

  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
        {t("admin.allMentors")}
      </h1>
      <p className="mt-2 font-body text-body-lg text-text-secondary">
        {t("admin.viewAllMentors")}
      </p>

      <div className="mt-8">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                <SkeletonLine className="flex-1" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!data?.items || data.items.length === 0) && (
          <Card className="p-8 text-center">
            <p className="font-body text-body-lg text-text-secondary">{t("mentor.noMentorsFound")}</p>
          </Card>
        )}

        {data?.items && data.items.length > 0 && (
          <>
            <div className="rounded-xl border border-border">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[28%]" />
                  <col className="w-[24%]" />
                  <col className="w-[14%]" />
                  <col className="w-[16%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    <th className="px-3 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("student.nameEmail")}</th>
                    <th className="px-3 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("mentor.titleLabel")}</th>
                    <th className="px-3 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.sessions")}</th>
                    <th className="px-3 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.users.status")}</th>
                    <th className="px-3 py-3 text-right font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((mentor) => {
                    const isProcessing = processingUserId === mentor.userId;
                    return (
                      <tr
                        key={mentor.id}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-container-low"
                      >
                        <td className="px-3 py-3 align-top">
                          <Link to={`/admin/mentors/${mentor.id}`} className="block">
                            <div className="font-medium text-text-primary">{mentor.displayName}</div>
                            <div className="break-words text-code-sm text-text-secondary">{mentor.email}</div>
                          </Link>
                        </td>
                        <td className="px-3 py-3 align-top font-body text-body-md">
                          <div className="text-text-primary">{mentor.stackName}</div>
                          <div className="mt-1 text-text-secondary">{mentor.title}</div>
                        </td>
                        <td className="px-3 py-3 align-top font-body text-body-md text-text-primary">
                          <div>{mentor.totalSessions}</div>
                          <div className="mt-1 text-text-secondary">
                            {mentor.rating != null ? mentor.rating.toFixed(1) : "—"} {t("mentor.rating")}
                          </div>
                          <div className="mt-1 text-text-secondary">
                            {t("mentor.hourlyRate").replace("{rate}", String(mentor.hourlyRate))}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-col items-start gap-2">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-caps uppercase tracking-wider ${mentor.available ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                              {mentor.available ? t("mentor.available") : t("mentor.unavailable")}
                            </span>
                            <Badge variant={mentor.isBlocked ? "error" : "success"}>
                              {mentor.isBlocked ? t("admin.users.blocked") : t("admin.users.active")}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isProcessing || mentor.isBlocked}
                              onClick={() => changeStatus(mentor, "BLOCKED")}
                            >
                              <ShieldOff className="h-4 w-4" />
                              {t("admin.users.block")}
                            </Button>
                            <Button
                              size="sm"
                              disabled={isProcessing || !mentor.isBlocked}
                              onClick={() => changeStatus(mentor, "APPROVED")}
                            >
                              <ShieldCheck className="h-4 w-4" />
                              {isProcessing ? t("common.loading") : t("admin.users.activate")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  className="rounded-lg border border-border px-4 py-2 font-body text-body-md text-text-secondary hover:bg-surface-container-low disabled:opacity-40"
                  disabled={page <= 0}
                  onClick={() => setPage(page - 1)}
                >
                  {t("mentor.previous")}
                </button>
                <span className="font-body text-code-sm text-text-secondary">
                  {t("mentor.pageOfTotal")
                    .replace("{page}", String(page + 1))
                    .replace("{totalPages}", String(data.totalPages))
                    .replace("{total}", String(data.totalElements))}
                </span>
                <button
                  className="rounded-lg border border-border px-4 py-2 font-body text-body-md text-text-secondary hover:bg-surface-container-low disabled:opacity-40"
                  disabled={page >= data.totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  {t("mentor.next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
