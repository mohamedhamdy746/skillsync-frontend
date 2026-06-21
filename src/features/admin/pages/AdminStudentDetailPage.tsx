import { useParams, Link } from "react-router-dom";
import { useStudentDetail } from "../hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

export default function AdminStudentDetailPage() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const { data: student, isLoading, error } = useStudentDetail(studentId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-gutter py-8">
        <SkeletonLine className="w-48" />
        <Skeleton className="mt-4 h-10 w-64" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="mx-auto max-w-container px-gutter py-8">
        <Link to="/admin/students" className="inline-flex items-center gap-1.5 font-body text-body-md text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("admin.backToStudents")}
        </Link>
        <Card className="mt-6 p-8 text-center">
          <p className="font-body text-body-lg text-text-secondary">{t("student.notFound")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <Link to="/admin/students" className="inline-flex items-center gap-1.5 font-body text-body-md text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t("admin.backToStudents")}
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
            {student.displayName}
          </h1>
          <p className="mt-1 font-body text-body-lg text-text-secondary">{student.email}</p>
        </div>
        <div className="text-right">
          <span className="font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.sessions")}</span>
          <p className="font-display text-headline-md italic text-text-primary">{student.totalSessions}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-headline-md italic text-text-primary">
          {t("admin.sessionHistory")} ({student.sessions.length})
        </h2>
        <div className="mt-4">
          {student.sessions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-body text-body-lg text-text-secondary">{t("admin.noSessionsYet")}</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.mentor")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.date")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("mentor.sortBy")}</th>
                    <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.description")}</th>
                  </tr>
                </thead>
                <tbody>
                  {student.sessions.map((session) => (
                    <tr key={session.id} className="border-b border-border last:border-b-0 hover:bg-surface-container-low">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{session.mentorName}</div>
                      </td>
                      <td className="px-4 py-3 font-body text-body-md text-text-secondary">
                        {new Date(session.startTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-caps uppercase tracking-wider ${
                          session.status === "COMPLETED" ? "bg-success/10 text-success" :
                          session.status === "SCHEDULED" ? "bg-info/10 text-info" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {t("status." + session.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-body-md text-text-secondary max-w-xs truncate">{session.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
