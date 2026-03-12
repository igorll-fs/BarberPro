import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Teste simples sem Zustand para isolar o problema
export default function App() {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simular inicialização
    const timer = setTimeout(() => {
      setReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>💈 BARBERPRO</Text>
            <Text style={styles.loading}>Carregando...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>💈 BARBERPRO</Text>
            <Text style={styles.subtitle}>Versão de Teste - React 19</Text>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ App Funcionando!</Text>
              <Text style={styles.cardText}>
                Se você está vendo esta tela, o Expo Go está funcionando corretamente com React 19.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧪 Teste de Estado</Text>
              <Text style={styles.cardText}>Contador: {count}</Text>
              <View style={styles.buttonContainer}>
                <Button title="➕ Incrementar" onPress={() => setCount(count + 1)} color="#22c55e" />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="🔔 Alert" onPress={() => Alert.alert('Teste', 'Botão funcionando!')} color="#3b82f6" />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 Status do Sistema</Text>
              <Text style={styles.statusItem}>✅ React: 19.1.0</Text>
              <Text style={styles.statusItem}>✅ React Native: 0.81.5</Text>
              <Text style={styles.statusItem}>✅ Expo SDK: 54</Text>
              <Text style={styles.statusItem}>✅ Zustand: Desativado (teste)</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎯 Próximos Passos</Text>
              <Text style={styles.cardText}>
                1. Confirme que esta tela aparece{'\n'}
                2. Teste o botão de incrementar{'\n'}
                3. Teste o botão de Alert{'\n'}
                4. Se funcionar, ativaremos Zustand + Firebase
              </Text>
            </View>

            <Text style={styles.footer}>
              Versão Simplificada para Debug{'\n'}
              React 19 + RN 0.81.5{'\n'}
              Build: {new Date().toLocaleString('pt-BR')}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
  },
  loading: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 10,
  },
  statusItem: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  buttonContainer: {
    marginTop: 10,
  },
  footer: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
});
