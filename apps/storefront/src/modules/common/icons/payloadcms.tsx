import React from 'react';
import { IconProps } from 'types/icon';

const PayloadCMS: React.FC<IconProps> = ({
  size = '18',
  color = '#9CA3AF',
  ...attributes
}) => {
  return (
    <svg
      role="img"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      id="Payloadcms--Streamline-Simple-Icons"
      height="18"
      width="18"
    >
      <desc>Payloadcms Streamline Icon: https://streamlinehq.com</desc>
      <title>Payload CMS</title>
      <path
        d="M8.301 0 16.56 4.96875v9.42975L10.340250000000001 18V8.57025L2.07675 3.606 8.301 0ZM1.44 13.7265l6.2325 -3.609v7.359l-6.2325 -3.75Z"
        fill={color}
        strokeWidth="0.75"
      ></path>
    </svg>
  );
};

export default PayloadCMS;
