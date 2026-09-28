import React from 'react';
import { ReviewsSection } from '../components/home/ReviewsSection';

interface ReviewsPageProps {
  onNavigate?: (path: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <ReviewsSection onNavigate={onNavigate} />
    </div>
  );
};
