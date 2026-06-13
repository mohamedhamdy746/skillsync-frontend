/**
 * MentorDiscoveryPage — Main landing view.
 *
 * TODO: Implement with:
 * - Search bar with useDebounce (500ms)
 * - Tech stack filter chips
 * - Sort dropdown (rating, price, availability)
 * - Paginated mentor card grid
 * - URL-driven pagination (?page=N)
 * - Skeleton loading states
 * - Empty state when no mentors match
 */
export default function MentorDiscoveryPage() {
  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
        Find Your Mentor
      </h1>
      <p className="mt-2 font-body text-body-lg text-text-secondary">
        Browse expert mentors and book code review sessions
      </p>
      {/* TODO: Search + filters + mentor grid */}
    </div>
  );
}
