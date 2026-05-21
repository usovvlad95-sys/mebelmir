import React from 'react';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import PopularProducts from './PopularProducts';
import WhyUsSection from './WhyUsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <PopularProducts />
      <WhyUsSection />
    </div>
  );
};

export default HomePage