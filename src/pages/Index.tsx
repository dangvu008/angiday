
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedMealPlansGrid from '@/components/FeaturedMealPlansGrid';
import PopularRecipesGrid from '@/components/PopularRecipesGrid';
import BlogSection from '@/components/BlogSection';
import CallToAction from '@/components/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedMealPlansGrid />
        <PopularRecipesGrid />
        <BlogSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
