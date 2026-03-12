import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// App mínimo para testar se o React Native está funcionando
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💈 BARBERPRO</Text>
      <Text style={styles.subtext}>React Native Funcionando!</Text>
      <Text style={styles.info}>React 18.2.0 + RN 0.76.6</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#64748b',
  },
});