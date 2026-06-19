import { Search, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  SkeletonCard,
} from "@/components/ui";
import { DEBOUNCE_MS, ITEMS_PER_PAGE } from "@/lib/constants";
import { useDebounce } from "@/hooks";
import { MentorCard } from "../components/MentorCard";
import { useMentors } from "../hooks/useMentors";
import { useStacks } from "../hooks/useStacks";
import { useI18n } from "@/i18n/i18n";
import type { MentorFilters } from "../types";

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "availability", label: "Availability" },
  { value: "rating", label: "Rating" },
  { value: "price", label: "Price" },
] as const;

function parseStackIds(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => !Number.isNaN(id));
}

export default function MentorDiscoveryPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") ?? "");
  const debouncedKeyword = useDebounce(searchInput, DEBOUNCE_MS);

  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
  const sortBy = (searchParams.get("sort_by") as MentorFilters["sortBy"]) || undefined;
  const stackIds = useMemo(
    () => parseStackIds(searchParams.get("stack")),
    [searchParams],
  );

  const filters: MentorFilters = {
    keyword: debouncedKeyword || undefined,
    stackIds: stackIds.length ? stackIds : undefined,
    sortBy,
    page: page - 1,
    size: ITEMS_PER_PAGE,
  };

  const { data: stacks = [], isLoading: stacksLoading } = useStacks();
  const { data, isLoading, isFetching, error } = useMentors(filters);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === "") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") ?? "";
    if (debouncedKeyword !== currentKeyword) {
      updateParams({ keyword: debouncedKeyword || null, page: "1" });
    }
  }, [debouncedKeyword, searchParams, updateParams]);

  const toggleStack = (stackId: number) => {
    const next = stackIds.includes(stackId)
      ? stackIds.filter((id) => id !== stackId)
      : [...stackIds, stackId];

    updateParams({
      stack: next.length ? next.join(",") : null,
      page: "1",
    });
  };

  const mentors = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <header className="mb-8">
        <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
          {t("mentor.discover")}
        </h1>
        <p className="mt-2 font-body text-body-lg text-text-secondary">
          {t("mentor.discoverSubtitle")}
        </p>
      </header>

      <section className="mb-6 space-y-4">
        <Input
          label={t("mentor.searchMentors")}
          placeholder={t("mentor.searchPlaceholder")}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label={t("mentor.searchMentors")}
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {stacksLoading ? (
              <span className="text-sm text-text-secondary">{t("mentor.loadingStacks")}</span>
            ) : (
              stacks.map((stack) => {
                const active = stackIds.includes(stack.id);
                return (
                  <button
                    key={stack.id}
                    type="button"
                    onClick={() => toggleStack(stack.id)}
                    className="rounded-full"
                  >
                    <Badge variant={active ? "ember" : "default"} className="cursor-pointer">
                      {stack.name}
                    </Badge>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="mentor-sort" className="text-sm text-text-secondary">
              {t("mentor.sortBy")}
            </label>
            <select
              id="mentor-sort"
              value={sortBy ?? ""}
              onChange={(event) =>
                updateParams({
                  sort_by: event.target.value || null,
                  page: "1",
                })
              }
              className="rounded border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-ember"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {t("mentor.sort." + option.label.toLowerCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error && (
        <EmptyState
          icon={<Search className="h-10 w-10" />}
          title={t("mentor.unableToLoad")}
          description={t("mentor.tryAgainMoment")}
        />
      )}

      {!error && isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {!error && !isLoading && mentors.length === 0 && (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title={t("mentor.noMentorsFound")}
          description={t("mentor.adjustFilters")}
        />
      )}

      {!error && !isLoading && mentors.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                {t("mentor.previous")}
              </Button>
              <span className="text-sm text-text-secondary">
                {t("mentor.pageOf").replace("{page}", String(page)).replace("{totalPages}", String(totalPages))}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages || isFetching}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                {t("mentor.next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
