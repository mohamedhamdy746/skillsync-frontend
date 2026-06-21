import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { useI18n } from "@/i18n/i18n";
import type { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const { t } = useI18n();
  return (
    <Link to={`/mentors/${mentor.id}`} className="block h-full">
      <Card className="flex h-full flex-col transition-colors hover:border-ember/40">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg italic text-text-primary">{mentor.name}</h3>
            <p className="mt-1 text-sm text-text-secondary">{mentor.title}</p>
          </div>
          <div className="flex items-center gap-1 text-ember">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">{mentor.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-sm text-text-secondary">{mentor.bio}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {mentor.stacks.map((stack) => (
            <Badge key={stack.id} variant="ember">
              {stack.name}
            </Badge>
          ))}
          {mentor.available && <Badge variant="success">{t("mentor.available")}</Badge>}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-text-secondary">
            {t("student.sessionsCount").replace("{count}", String(mentor.totalSessions))}
          </span>
          <span className="font-semibold text-text-primary">
            {t("mentor.hourlyRate").replace("{rate}", String(mentor.hourlyRate))}
          </span>
        </div>
      </Card>
    </Link>
  );
}
