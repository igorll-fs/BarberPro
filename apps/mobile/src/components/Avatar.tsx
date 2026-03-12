import React from 'react';
import { View, Text } from 'react-native';
import { colors, fontSize } from '../theme';

interface Props {
  name?: string;
  photoUrl?: string;
  uri?: string;
  size?: number | 'sm' | 'md' | 'lg';
  style?: any;
}

const sizeMap: Record<string, number> = {
  sm: 32,
  md: 44,
  lg: 56,
};

export default function Avatar({ name, photoUrl, uri, size = 44, style }: Props) {
  const actualSize = typeof size === 'string' ? sizeMap[size] || 44 : size;
  const photoSource = photoUrl || uri;
  
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (photoSource) {
    const { Image } = require('react-native');
    return (
      <Image
        source={{ uri: photoSource }}
        style={[
          {
            width: actualSize,
            height: actualSize,
            borderRadius: actualSize / 2,
            borderWidth: 2,
            borderColor: colors.primary,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: actualSize,
          height: actualSize,
          borderRadius: actualSize / 2,
          backgroundColor: colors.primaryBg,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      <Text style={{ color: colors.primary, fontSize: actualSize * 0.38, fontWeight: '700' }}>
        {initials}
      </Text>
    </View>
  );
}
