import { CategoryCard, PageHeader, PageShell, TopNav, gridStyle } from "@/components/IdeaSpeakUI";
import { categories } from "@/lib/ideaSpeakData";

export default function SpeakingListeningPage() {
  return (
    <PageShell>
      <TopNav />
      <PageHeader title="Speaking & Listening" text="Choose a real situation to practice." />
      <section style={gridStyle}>
        {categories.map((category) => (
          <CategoryCard category={category} key={category.slug} />
        ))}
      </section>
    </PageShell>
  );
}
