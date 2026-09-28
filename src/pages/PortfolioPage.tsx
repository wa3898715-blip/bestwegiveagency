import React from 'react';
import { PortfolioSection } from '../components/home/PortfolioSection';

interface PortfolioPageProps {
  onNavigate?: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <PortfolioSection onNavigate={onNavigate} showAllInitially={true} />
    </div>
  );
};
