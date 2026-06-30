import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/i18n";
import { Button, Card, Badge } from "@/components/ui";
import {
  Code,
  Users,
  Star,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Terminal,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";
  const [activeStack, setActiveStack] = useState<string>("Rust");
  const [cliCommand, setCliCommand] = useState<string>("skillsync --help");
  const [cliOutput, setCliOutput] = useState<string>("");

  const techStacks = [
    { name: "Rust", desc: "Systems programming, safety, concurrency", color: "from-orange-600 to-amber-700" },
    { name: "React", desc: "Interactive client-side interfaces", color: "from-blue-600 to-indigo-700" },
    { name: "Spring Boot", desc: "Enterprise JVM microservices", color: "from-green-600 to-emerald-700" },
    { name: "Go", desc: "Cloud-native services & concurrency", color: "from-sky-500 to-blue-600" },
    { name: "PostgreSQL", desc: "Relational database design & optimization", color: "from-cyan-600 to-teal-700" },
    { name: "Docker", desc: "Containerization & deployment pipelines", color: "from-blue-500 to-cyan-600" },
  ];

  const handleRunCli = () => {
    if (cliCommand.trim() === "skillsync --help") {
      setCliOutput(
        t("landing.terminal.runText") +
          "\n\nUsage: skillsync <command> [options]\n\nCommands:\n  discover     Search for available mentors\n  book <id>    Schedule review session\n  audit <id>   Verify code quality analysis\n  sync         Upload local changes for review"
      );
    } else {
      setCliOutput(`$ ${cliCommand}\nCommand not found. Try 'skillsync --help'`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-canvas text-text-primary">
      {/* Background Decorative Auras */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-ember/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-ember/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-container px-gutter pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Content */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-ember">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-body tracking-wider uppercase">{t("auth.elevateYourCraft")}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight tracking-tight text-text-primary italic">
              {t("landing.hero.title")}
            </h1>
            
            <p className="max-w-xl font-body text-body-lg text-text-secondary">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/discover">
                <Button variant="primary" size="lg" className="shadow-ember hover:shadow-ember-md">
                  {t("landing.hero.findMentor")}
                  {isRtl ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  {t("landing.hero.becomeMentor")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual Block: Interactive Code Review Mockup */}
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-ember/30 to-primary/30 opacity-75 blur-md" />
            <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-2xl">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-border bg-canvas/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="font-code text-xs text-text-secondary flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-ember" />
                  <span>{t("landing.codeSim.header")}</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Code Editor Body */}
              <div className="p-5 font-code text-xs md:text-sm leading-relaxed overflow-x-auto text-left" dir="ltr">
                <pre className="text-text-secondary">
                  <span className="text-ember">pub struct</span> ConnectionPool &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;connections: Vec&lt;Connection&gt;,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;max_size: usize,<br />
                  &#125;<br /><br />
                  <span className="text-ember">impl</span> ConnectionPool &#123;<br />
                  <span className="bg-ember/10 border-l-2 border-ember block w-full px-2">
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary">pub fn</span> get(&amp;<span className="text-ember">mut</span> self) -&gt; Option&lt;&amp;Connection&gt; &#123;
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.connections.pop() // TODO: check pool bounds<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
                  &#125;
                </pre>

                {/* Simulated Review Comment */}
                <div className="mt-4 rounded border border-border bg-canvas/90 p-4 space-y-2 relative shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-ember to-amber-500 flex items-center justify-center font-bold text-[10px] text-canvas">
                        ER
                      </div>
                      <span className="font-body font-bold text-xs text-text-primary">
                        {t("landing.codeSim.approver")}
                      </span>
                    </div>
                    <Badge variant="ember" className="text-[9px] uppercase tracking-widest px-2 py-0.5">
                      {t("landing.hero.liveReview")}
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-text-secondary">
                    {t("landing.codeSim.comment")}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-text-secondary pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3 text-ember" /> 12</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 2 Replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-surface-dim">
        <div className="mx-auto max-w-container px-gutter py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
            <div className="text-center md:border-r md:border-border/50 last:border-0 px-4">
              <div className="flex justify-center mb-2"><Users className="h-6 w-6 text-ember" /></div>
              <div className="font-display text-3xl font-bold text-text-primary italic">{t("landing.stats.mentorsVal")}</div>
              <div className="mt-1 font-body text-sm text-text-secondary">{t("landing.stats.mentors")}</div>
            </div>
            <div className="text-center md:border-r md:border-border/50 last:border-0 px-4">
              <div className="flex justify-center mb-2"><BookOpen className="h-6 w-6 text-ember" /></div>
              <div className="font-display text-3xl font-bold text-text-primary italic">{t("landing.stats.sessionsVal")}</div>
              <div className="mt-1 font-body text-sm text-text-secondary">{t("landing.stats.sessions")}</div>
            </div>
            <div className="text-center md:border-r md:border-border/50 last:border-0 px-4">
              <div className="flex justify-center mb-2"><Star className="h-6 w-6 text-ember" /></div>
              <div className="font-display text-3xl font-bold text-text-primary italic">{t("landing.stats.ratingVal")}</div>
              <div className="mt-1 font-body text-sm text-text-secondary">{t("landing.stats.rating")}</div>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center mb-2"><Clock className="h-6 w-6 text-ember" /></div>
              <div className="font-display text-3xl font-bold text-text-primary italic">{t("landing.stats.turnaroundVal")}</div>
              <div className="mt-1 font-body text-sm text-text-secondary">{t("landing.stats.turnaround")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Methodology Pillars */}
      <section className="mx-auto max-w-container px-gutter py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary italic">
            {t("landing.pillars.title")}
          </h2>
          <p className="font-body text-body-md text-text-secondary">
            {t("landing.pillars.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="hover:border-ember transition-all duration-300 group" accentBar>
            <div className="h-10 w-10 rounded bg-canvas flex items-center justify-center border border-border group-hover:border-ember/30 group-hover:shadow-ember transition-all mb-6">
              <Users className="h-5 w-5 text-ember" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3 italic group-hover:text-ember transition-colors">
              {t("landing.pillars.discourse.title")}
            </h3>
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              {t("landing.pillars.discourse.desc")}
            </p>
          </Card>

          <Card className="hover:border-ember transition-all duration-300 group" accentBar>
            <div className="h-10 w-10 rounded bg-canvas flex items-center justify-center border border-border group-hover:border-ember/30 group-hover:shadow-ember transition-all mb-6">
              <Code className="h-5 w-5 text-ember" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3 italic group-hover:text-ember transition-colors">
              {t("landing.pillars.audits.title")}
            </h3>
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              {t("landing.pillars.audits.desc")}
            </p>
          </Card>

          <Card className="hover:border-ember transition-all duration-300 group" accentBar>
            <div className="h-10 w-10 rounded bg-canvas flex items-center justify-center border border-border group-hover:border-ember/30 group-hover:shadow-ember transition-all mb-6">
              <Calendar className="h-5 w-5 text-ember" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3 italic group-hover:text-ember transition-colors">
              {t("landing.pillars.scheduling.title")}
            </h3>
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              {t("landing.pillars.scheduling.desc")}
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack Interactive Selector */}
      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-container px-gutter py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-5">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary italic leading-tight">
                {t("landing.stacks.title")}
              </h2>
              <p className="font-body text-body-md text-text-secondary">
                {t("landing.stacks.subtitle")}
              </p>

              {/* Stack Badges Selection Grid */}
              <div className="flex flex-wrap gap-2 pt-2">
                {techStacks.map((st) => (
                  <button
                    key={st.name}
                    onClick={() => setActiveStack(st.name)}
                    className="focus:outline-none"
                  >
                    <Badge
                      variant={activeStack === st.name ? "ember" : "default"}
                      className="cursor-pointer text-xs py-1.5 px-4 rounded-full transition-transform hover:scale-105 active:scale-95"
                    >
                      {st.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Card Panel */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-surface p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-ember/5 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
                  <div>
                    <h3 className="font-display text-2xl font-bold italic text-text-primary">
                      {activeStack}
                    </h3>
                    <p className="font-body text-sm text-text-secondary mt-1">
                      {techStacks.find((s) => s.name === activeStack)?.desc}
                    </p>
                  </div>
                  <Link to={`/discover?stack=${activeStack}`}>
                    <Button variant="primary" size="sm">
                      {t("mentor.discover")}
                    </Button>
                  </Link>
                </div>

                {/* Stack Mini Simulation */}
                <div className="pt-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">
                    <Terminal className="h-3.5 w-3.5 text-ember" />
                    <span>Audit Sandbox</span>
                  </div>
                  <div className="rounded border border-border bg-canvas p-4 font-code text-xs md:text-sm text-left" dir="ltr">
                    <span className="text-text-secondary">$ skillsync verify --stack {activeStack.toLowerCase()}</span>
                    <br />
                    <span className="text-green-500">✔ Statically validated type references</span>
                    <br />
                    <span className="text-green-500">✔ Scanned repository memory ownership</span>
                    <br />
                    <span className="text-ember">✦ High concurrency benchmark recommendation uploaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-auto max-w-container px-gutter py-24 border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary italic">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="font-body text-body-md text-text-secondary">
            {t("landing.howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/4 left-10 right-10 h-0.5 border-t border-dashed border-border -z-10" />

          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xl font-bold italic text-ember shadow-sm relative">
              1
              <div className="absolute inset-0 rounded-full border border-ember/20 animate-ping opacity-10" />
            </div>
            <h3 className="font-display text-lg font-semibold italic">{t("landing.howItWorks.step1.title")}</h3>
            <p className="font-body text-xs text-text-secondary leading-relaxed max-w-[200px] mx-auto">
              {t("landing.howItWorks.step1.desc")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xl font-bold italic text-ember shadow-sm">
              2
            </div>
            <h3 className="font-display text-lg font-semibold italic">{t("landing.howItWorks.step2.title")}</h3>
            <p className="font-body text-xs text-text-secondary leading-relaxed max-w-[200px] mx-auto">
              {t("landing.howItWorks.step2.desc")}
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xl font-bold italic text-ember shadow-sm">
              3
            </div>
            <h3 className="font-display text-lg font-semibold italic">{t("landing.howItWorks.step3.title")}</h3>
            <p className="font-body text-xs text-text-secondary leading-relaxed max-w-[200px] mx-auto">
              {t("landing.howItWorks.step3.desc")}
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xl font-bold italic text-ember shadow-sm">
              4
            </div>
            <h3 className="font-display text-lg font-semibold italic">{t("landing.howItWorks.step4.title")}</h3>
            <p className="font-body text-xs text-text-secondary leading-relaxed max-w-[200px] mx-auto">
              {t("landing.howItWorks.step4.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-surface-dim border-t border-border py-24">
        <div className="mx-auto max-w-container px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary italic">
              {t("landing.testimonials.title")}
            </h2>
            <p className="font-body text-body-md text-text-secondary">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="flex flex-col justify-between bg-surface" accentBar>
              <p className="font-body text-sm leading-relaxed text-text-secondary italic">
                "{t("landing.testimonials.user1.quote")}"
              </p>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border/60">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-ember/80 to-primary/80 flex items-center justify-center text-canvas font-bold">
                  AM
                </div>
                <div>
                  <h4 className="font-display font-semibold italic text-text-primary text-sm">
                    {t("landing.testimonials.user1.author")}
                  </h4>
                  <p className="font-body text-xs text-text-secondary">
                    {t("landing.testimonials.user1.role")}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-between bg-surface" accentBar>
              <p className="font-body text-sm leading-relaxed text-text-secondary italic">
                "{t("landing.testimonials.user2.quote")}"
              </p>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border/60">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/80 to-ember/80 flex items-center justify-center text-canvas font-bold">
                  SJ
                </div>
                <div>
                  <h4 className="font-display font-semibold italic text-text-primary text-sm">
                    {t("landing.testimonials.user2.author")}
                  </h4>
                  <p className="font-body text-xs text-text-secondary">
                    {t("landing.testimonials.user2.role")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Terminal / Call-to-Action Footer Section */}
      <section className="mx-auto max-w-container px-gutter py-24 border-t border-border">
        <div className="relative rounded-2xl border border-border bg-surface overflow-hidden p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-ember/5 blur-3xl pointer-events-none" />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Text description */}
            <div className="space-y-6 lg:col-span-6">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary italic leading-tight">
                {t("auth.joinScholarsNight")}
              </h2>
              <p className="font-body text-sm md:text-base leading-relaxed text-text-secondary">
                {t("banner.tagline")}
              </p>
              
              <div className="border-l-2 border-ember pl-4 py-1 italic font-display text-text-primary text-sm">
                "{t("banner.quote")}"
                <span className="block font-body text-xs text-text-secondary font-semibold uppercase tracking-wider mt-1">
                  — {t("banner.quoteAuthor")}, {t("banner.quoteRole")}
                </span>
              </div>

              <div className="pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-ember">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Simulated Interactive CLI Terminal */}
            <div className="lg:col-span-6 space-y-2">
              <div className="rounded-t-lg bg-canvas border border-border px-4 py-2 flex items-center justify-between text-xs text-text-secondary font-code border-b-0">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-ember" />
                  <span>{t("landing.terminal.title")}</span>
                </div>
                <div className="text-[10px] text-text-secondary">{t("banner.cliVersion")}</div>
              </div>
              <div className="rounded-b-lg border border-border bg-canvas p-6 font-code text-xs md:text-sm text-left" dir="ltr">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-ember">$</span>
                  <input
                    type="text"
                    value={cliCommand}
                    onChange={(e) => setCliCommand(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRunCli()}
                    className="flex-1 bg-transparent text-text-primary outline-none border-none focus:ring-0 p-0 m-0"
                    placeholder="Enter command..."
                  />
                  <button
                    onClick={handleRunCli}
                    className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-text-secondary hover:text-ember hover:border-ember transition-colors"
                  >
                    Run
                  </button>
                </div>
                {cliOutput && (
                  <pre className="text-text-secondary whitespace-pre-wrap leading-relaxed mt-2 border-t border-border/40 pt-2">
                    {cliOutput}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
