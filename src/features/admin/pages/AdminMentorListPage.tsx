import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllMentors } from "../hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";
import { useI18n } from "@/i18n/i18n";

export default function AdminMentorListPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAllMentors(page);

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
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("student.nameEmail")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.stacks.title")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("mentor.titleLabel")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("mentor.sort.rating")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.rate")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("mentor.sortBy")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.sessions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((mentor) => (
                    <tr
                      key={mentor.id}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-container-low"
                    >
                      <td className="px-4 py-3">
                        <Link to={`/admin/mentors/${mentor.id}`} className="block">
                          <div className="font-medium text-text-primary">{mentor.displayName}</div>
                          <div className="text-code-sm text-text-secondary">{mentor.email}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-body text-body-md text-text-primary">{mentor.stackName}</td>
                      <td className="px-4 py-3 font-body text-body-md text-text-secondary max-w-xs truncate">{mentor.title}</td>
                      <td className="px-4 py-3 font-body text-body-md text-text-primary">{mentor.rating != null ? mentor.rating.toFixed(1) : "—"}</td>
                      <td className="px-4 py-3 font-body text-body-md text-text-primary">{t("mentor.hourlyRate").replace("{rate}", String(mentor.hourlyRate))}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-caps uppercase tracking-wider ${mentor.available ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {mentor.available ? t("mentor.available") : t("mentor.unavailable")}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-body-md text-text-primary">{mentor.totalSessions}</td>
                    </tr>
                  ))}
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
