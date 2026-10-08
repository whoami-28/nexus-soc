// src/components/SvgIcons.tsx
import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
}

export const BellIcon: React.FC<IconProps> = ({ size = 18, color = colors.textSecondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ size = 17, color = colors.textSecondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <Line x1="8" y1="9" x2="16" y2="9" />
    <Line x1="8" y1="13" x2="13" y2="13" />
  </Svg>
);

export const BackArrowIcon: React.FC<IconProps> = ({ size = 20, color = colors.textWhite }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 16, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

export const RepostIcon: React.FC<IconProps> = ({ size = 15, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="17 1 21 5 17 9" />
    <Path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <Polyline points="7 23 3 19 7 15" />
    <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 16, color = colors.textMuted, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L14.8 4.5L18.5 4.2L19.5 7.8L22.5 10L21.2 13.5L22.5 17L19.5 19.2L18.5 22.8L14.8 22.5L12 25L9.2 22.5L5.5 22.8L4.5 19.2L1.5 17L2.8 13.5L1.5 10L4.5 7.8L5.5 4.2L9.2 4.5L12 2Z" fill={colors.mint} />
    <Path d="M8.5 12.5L10.8 14.8L15.5 9.8" stroke="#062016" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowUpVoteIcon: React.FC<IconProps> = ({ size = 14, color = colors.mint }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="19" x2="12" y2="5" />
    <Polyline points="5 12 12 5 19 12" />
  </Svg>
);

export const ArrowDownVoteIcon: React.FC<IconProps> = ({ size = 14, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Polyline points="19 12 12 19 5 12" />
  </Svg>
);

export const ThumbsUpIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 14, color = colors.mint, filled = true }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </Svg>
);

export const ThumbsDownIcon: React.FC<IconProps> = ({ size = 14, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </Svg>
);

export const EditPencilIcon: React.FC<IconProps> = ({ size = 13, color = colors.mint }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
);

export const SettingsGearIcon: React.FC<IconProps> = ({ size = 17, color = colors.textSecondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 14, color = colors.mint }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </Svg>
);

export const MoreDotsIcon: React.FC<IconProps & { horizontal?: boolean }> = ({ size = 16, color = colors.textMuted, horizontal = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {horizontal ? (
      <>
        <Circle cx="5" cy="12" r="2" />
        <Circle cx="12" cy="12" r="2" />
        <Circle cx="19" cy="12" r="2" />
      </>
    ) : (
      <>
        <Circle cx="12" cy="5" r="2" />
        <Circle cx="12" cy="12" r="2" />
        <Circle cx="12" cy="19" r="2" />
      </>
    )}
  </Svg>
);

export const PaperPlaneIcon: React.FC<IconProps> = ({ size = 16, color = colors.mintTextDark }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </Svg>
);

export const CodeBracketsIcon: React.FC<IconProps> = ({ size = 15, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="16 18 22 12 16 6" />
    <Polyline points="8 6 2 12 8 18" />
  </Svg>
);

export const ImageIcon: React.FC<IconProps> = ({ size = 15, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" />
    <Polyline points="21 15 16 10 5 21" />
  </Svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ size = 15, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="20" x2="18" y2="10" />
    <Line x1="12" y1="20" x2="12" y2="4" />
    <Line x1="6" y1="20" x2="6" y2="14" />
  </Svg>
);

export const SmileIcon: React.FC<IconProps> = ({ size = 17, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <Line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={3} />
    <Line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={3} />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 14, color = colors.textMuted }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Svg>
);

export const FeedLayersIcon: React.FC<IconProps & { active?: boolean }> = ({ size = 22, active = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? colors.mint : colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="7" y="3" width="12" height="14" rx="2" />
    <Path d="M4 7v11a2 2 0 0 0 2 2h10" />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = colors.mintTextDark }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const LatencyCurveSvg: React.FC<{ width?: number; height?: number }> = ({ width = 290, height = 55 }) => (
  <Svg width={width} height={height} viewBox="0 0 300 70">
    <Defs>
      <LinearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={colors.mint} stopOpacity="0.25" />
        <Stop offset="1" stopColor={colors.mint} stopOpacity="0.0" />
      </LinearGradient>
    </Defs>
    <Path
      d="M 0,55 C 25,54 45,58 75,54 C 105,50 125,49 145,45 C 165,40 175,20 192,20 C 209,20 222,55 240,56 C 256,57 264,5 275,5 C 284,5 291,26 296,26 L 296,70 L 0,70 Z"
      fill="url(#mintGrad)"
    />
    <Path
      d="M 0,55 C 25,54 45,58 75,54 C 105,50 125,49 145,45 C 165,40 175,20 192,20 C 209,20 222,55 240,56 C 256,57 264,5 275,5 C 284,5 291,26 296,26"
      fill="none"
      stroke={colors.mint}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <Circle cx={296} cy={26} r={3.8} fill={colors.mint} />
  </Svg>
);
