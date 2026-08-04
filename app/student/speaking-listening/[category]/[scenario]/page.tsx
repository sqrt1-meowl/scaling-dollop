import { notFound } from "next/navigation";
import { BackLink, PageHeader, PageShell, TopNav } from "@/components/IdeaSpeakUI";
import { PracticeLesson } from "@/components/PracticeLesson";
import { categories, getCategory, getScenario } from "@/lib/ideaSpeakData";

type ScenarioPracticePageProps = {
  params: Promise<{
    category: string;
    scenario: string;
  }>;
};

export function generateStaticParams() {
  return categories.flatMap((category) =>
    category.scenarios.map((scenario) => ({
      category: category.slug,
      scenario: scenario.slug
    }))
  );
}

export default async function ScenarioPracticePage({ params }: ScenarioPracticePageProps) {
  const { category: categorySlug, scenario: scenarioSlug } = await params;
  const category = getCategory(categorySlug);
  const scenario = getScenario(categorySlug, scenarioSlug);

  if (!category || !scenario) {
    notFound();
  }

  return (
    <PageShell>
      <TopNav />
      <BackLink href={`/student/speaking-listening/${category.slug}`} />
      <PageHeader title={scenario.title} text={scenario.description} />
      <PracticeLesson backHref={`/student/speaking-listening/${category.slug}`} categorySlug={category.slug} scenario={scenario} />
    </PageShell>
  );
}
