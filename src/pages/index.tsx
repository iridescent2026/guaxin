import { MainLayout, PageTitle } from '@/components';
import { Hero, FeatureCards, Introduction, MentalHealthTip } from '@/components/home';

export default function HomePage() {
  return (
    <MainLayout>
      <PageTitle
        title="欢迎来到心易陪伴"
        description="在这里，找到属于你的内心平静"
      />

      <div className="space-y-12">
        <Hero />
        <FeatureCards />
        <Introduction />
        <MentalHealthTip />
      </div>
    </MainLayout>
  );
}
