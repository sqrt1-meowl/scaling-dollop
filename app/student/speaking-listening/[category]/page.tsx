import { notFound } from "next/navigation";
import { BackLink, PageHeader, PageShell, TopNav } from "@/components/IdeaSpeakUI";
import { ScenarioList } from "@/components/ScenarioList";
import { categories, getCategory } from "@/lib/ideaSpeakData";

type ScenarioListPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function ScenarioListPage({ params }: ScenarioListPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <PageShell>
      <TopNav />
      <BackLink href="/student/speaking-listening" />
      <PageHeader title={category.title} text={category.description} />
      <ScenarioList basePath={`/student/speaking-listening/${category.slug}`} scenarios={category.scenarios} />
    </PageShell>
  );
}
