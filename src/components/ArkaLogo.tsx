import React from 'react';
import arkaLogoImg from '../assets/images/arka-logo.png';

interface ArkaLogoProps {
  size?: number;
  className?: string;
  goldColor?: string;
}

export const ArkaLogo: React.FC<ArkaLogoProps> = ({
  size = 28,
  className = '',
}) => {
  return (
    <img
      src={arkaLogoImg}
      alt="نشان معمارانه آرکا استیت"
      width={size}
      height={size}
      className={`object-contain select-none drop-shadow-sm transition-transform duration-300 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
    />
  );
};
