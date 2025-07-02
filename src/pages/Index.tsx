
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedMealPlans from '@/components/FeaturedMealPlans';
import PopularRecipes from '@/components/PopularRecipes';
import BlogSection from '@/components/BlogSection';
import CallToAction from '@/components/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedMealPlans />
        <PopularRecipes />
        <BlogSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
