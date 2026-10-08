// src/components/SvgWeb.tsx
import React from 'react';

export const Svg = ({ children, width, height, viewBox, style, fill = 'none', ...props }: any) => {
  return React.createElement(
    'svg',
    {
      width,
      height,
      viewBox,
      fill,
      style: { display: 'block', ...style },
      ...props,
    },
    children
  );
};

export const Path = (props: any) => React.createElement('path', props);
export const Circle = (props: any) => React.createElement('circle', props);
export const Rect = (props: any) => React.createElement('rect', props);
export const Polyline = (props: any) => React.createElement('polyline', props);
export const Line = (props: any) => React.createElement('line', props);
export const Polygon = (props: any) => React.createElement('polygon', props);
export const Defs = (props: any) => React.createElement('defs', props);
export const LinearGradient = (props: any) => React.createElement('linearGradient', props);
export const Stop = (props: any) => React.createElement('stop', props);

export default Svg;
