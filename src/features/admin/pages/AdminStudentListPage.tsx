import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAllStudents, useUpdateUserStatus } from "../hooks/useAdmin";
import type { AdminStudentListResponse } from "../api/admin.api";
import { Badge, Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";
import { useI18n } from "@/i18n/i18n";

export default function AdminStudentListPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(0);
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);
  const { data, isLoading } = useAllStudents(page);
  const updateStatus = useUpdateUserStatus();

  function changeStatus(student: AdminStudentListResponse, status: "APPROVED" | "BLOCKED") {
    setProcessingUserId(student.userId);
    updateStatus.mutate(
      { userId: student.userId, payload: { status } },
      {
        onSuccess: () => {
          toast.success(
            status === "BLOCKED"
              ? t("admin.users.blockedSuccess")
              : t("admin.users.activatedSuccess"),
          );
        },
        onError: (error: any) => {
          toast.error(error?.message || t("admin.users.updateFailed"));
        },
        onSettled: () => setProcessingUserId(null),
      },
    );
  }

  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
        {t("student.allStudents")}
      </h1>
      <p className="mt-2 font-body text-body-lg text-text-secondary">
        {t("student.viewAllStudents")}
      </p>

      <div className="mt-8">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                <SkeletonLine className="flex-1" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!data?.items || data.items.length === 0) && (
          <Card className="p-8 text-center">
            <p className="font-body text-body-lg text-text-secondary">{t("student.noStudentsFound")}</p>
          </Card>
        )}

        {data?.items && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("student.nameEmail")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.users.status")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.sessions")}</th>
                    <th className="px-4 py-3 text-right font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((student) => {
                    const isProcessing = processingUserId === student.userId;
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-container-low"
                      >
                        <td className="px-4 py-3">
                          <Link to={`/admin/students/${student.id}`} className="block">
                            <div className="font-medium text-text-primary">{student.displayName}</div>
                            <div className="text-code-sm text-text-secondary">{student.email}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={student.isBlocked ? "error" : "success"}>
                            {student.isBlocked ? t("admin.users.blocked") : t("admin.users.active")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-body text-body-md text-text-primary">{student.totalSessions}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isProcessing || student.isBlocked}
                              onClick={() => changeStatus(student, "BLOCKED")}
                            >
                              <ShieldOff className="h-4 w-4" />
                              {t("admin.users.block")}
                            </Button>
                            <Button
                              size="sm"
                              disabled={isProcessing || !student.isBlocked}
                              onClick={() => changeStatus(student, "APPROVED")}
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
