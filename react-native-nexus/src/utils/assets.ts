// src/utils/assets.ts
import { ImageSourcePropType } from 'react-native';

const AVATAR_MAP: Record<string, ImageSourcePropType> = {
  user: require('../../assets/avatar-user.png'),
  elena: require('../../assets/avatar-elena-large.png'),
  kira: require('../../assets/avatar-kira.png'),
  kira_thread: require('../../assets/avatar-kira-thread.png'),
  zeno: require('../../assets/avatar-zeno.png'),
  marx: require('../../assets/avatar-marx.png'),
  nova: require('../../assets/avatar-nova.png'),
};

const MEDIA_MAP: Record<string, ImageSourcePropType> = {
  nexus_preview: require('../../assets/nexus-preview.png'),
  glsl_preview: require('../../assets/glsl-preview.png'),
  logo: require('../../assets/logo.png'),
};

export function getAvatarSource(key?: string): ImageSourcePropType {
  if (!key || !AVATAR_MAP[key]) {
    return AVATAR_MAP.user;
  }
  return AVATAR_MAP[key];
}

export function getMediaSource(key?: string): ImageSourcePropType | null {
  if (!key || !MEDIA_MAP[key]) {
    return null;
  }
  return MEDIA_MAP[key];
}
