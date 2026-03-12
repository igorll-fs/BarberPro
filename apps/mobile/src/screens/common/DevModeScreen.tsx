/* ============================
   BARBERPRO — Modo Desenvolvedor
   Permite alternar entre roles para teste
   ============================ */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, globalStyles } from '../../theme';
import { Header, AppCard, AppButton } from '../../components';
import { useUser } from '../../store/user';
import type { UserRole } from '../../types/models';

const ROLES: { id: UserRole; label: string; icon: string; color: string; description: string }[] = [
  {
    id: 'cliente',
    label: 'Cliente',
    icon: '👤',
    color: '#3B82F6',
    description: 'Visualização como cliente - buscar barbearias, agendar, histórico',
  },
  {
    id: 'dono',
    label: 'Proprietário',
    icon: '👑',
    color: '#F59E0B',
    description: 'Dashboard completo - agenda, relatórios, equipe, finanças',
  },
  {
    id: 'funcionario',
    label: 'Barbeiro',
    icon: '✂️',
    color: '#10B981',
    description: 'Área do barbeiro - agenda pessoal, clientes, disponibilidade',
  },
];

export default function DevModeScreen() {
  const navigation = useNavigation();
  const { 
    isDevMode, 
    devRoleView, 
    originalRole, 
    role, 
    email,
    switchDevRole, 
    disableDevMode 
  } = useUser();

  // Security check
  if (!isDevMode || role !== 'dev') {
    return (
      <SafeAreaView style={globalStyles.screen}>
        <Header title="Acesso Negado" showBackButton />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>🚫</Text>
          <Text style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm }}>
            Acesso Restrito
          </Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textMuted, textAlign: 'center' }}>
            Esta área é exclusiva para desenvolvedores autorizados.
          </Text>
          <AppButton
            title="Voltar"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    if (devRoleView === newRole) return;
    
    Alert.alert(
      'Alternar Perfil',
      `Deseja visualizar como ${newRole}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            switchDevRole(newRole);
            Alert.alert('Sucesso', `Agora visualizando como: ${newRole}`);
          }
        },
      ]
    );
  };

  const handleDisableDevMode = () => {
    Alert.alert(
      'Sair do Modo Dev',
      'Você voltará ao seu perfil original. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            disableDevMode();
            navigation.navigate('SettingsOwner' as never);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.screen}>
      <Header title="🛠️ Modo Dev" showBackButton />
      
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Dev Info Card */}
        <AppCard style={{ 
          backgroundColor: colors.primaryBg,
          borderColor: colors.primary,
          marginBottom: spacing.lg,
        }}>
          <Text style={{ 
            fontSize: fontSize.lg, 
            fontWeight: 'bold', 
            color: colors.primary,
            marginBottom: spacing.xs,
          }}>
            Modo Desenvolvedor Ativo
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            Email: {email}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            Role Original: {originalRole}
          </Text>
        </AppCard>

        {/* Current View */}
        <Text style={{ 
          fontSize: fontSize.md, 
          fontWeight: '600', 
          color: colors.text,
          marginBottom: spacing.sm,
        }}>
          Visualização Atual
        </Text>
        
        <AppCard style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          marginBottom: spacing.lg,
          backgroundColor: colors.bgTertiary,
        }}>
          <Text style={{ fontSize: 32, marginRight: spacing.md }}>
            {ROLES.find(r => r.id === devRoleView)?.icon}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: fontSize.lg, 
              fontWeight: 'bold', 
              color: ROLES.find(r => r.id === devRoleView)?.color || colors.text,
            }}>
              {ROLES.find(r => r.id === devRoleView)?.label}
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
              {ROLES.find(r => r.id === devRoleView)?.description}
            </Text>
          </View>
          <View style={{
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: 4,
          }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}>ATIVO</Text>
          </View>
        </AppCard>

        {/* Role Switcher */}
        <Text style={{ 
          fontSize: fontSize.md, 
          fontWeight: '600', 
          color: colors.text,
          marginBottom: spacing.sm,
        }}>
          Alternar Perfil
        </Text>

        {ROLES.map((roleItem) => (
          <TouchableOpacity
            key={roleItem.id}
            onPress={() => handleRoleSwitch(roleItem.id)}
            disabled={devRoleView === roleItem.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing.md,
              backgroundColor: devRoleView === roleItem.id ? roleItem.color + '20' : colors.card,
              borderRadius: 12,
              marginBottom: spacing.sm,
              borderWidth: 2,
              borderColor: devRoleView === roleItem.id ? roleItem.color : colors.border,
              opacity: devRoleView === roleItem.id ? 1 : 0.9,
            }}
          >
            <Text style={{ fontSize: 28, marginRight: spacing.md }}>{roleItem.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: fontSize.lg, 
                fontWeight: '600',
                color: devRoleView === roleItem.id ? roleItem.color : colors.text,
              }}>
                {roleItem.label}
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 }}>
                {roleItem.description}
              </Text>
            </View>
            {devRoleView === roleItem.id && (
              <Text style={{ fontSize: 20 }}>✓</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Debug Actions */}
        <Text style={{ 
          fontSize: fontSize.md, 
          fontWeight: '600', 
          color: colors.text,
          marginTop: spacing.lg,
          marginBottom: spacing.sm,
        }}>
          Ações de Debug
        </Text>

        <AppButton
          title="🧹 Limpar AsyncStorage"
          variant="secondary"
          size="sm"
          onPress={() => {
            Alert.alert('Limpar Storage', 'Isso apagará todos os dados locais. Continuar?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Limpar', style: 'destructive', onPress: () => {
                // AsyncStorage.clear(); // Descomentar se necessário
                Alert.alert('Concluído', 'Storage limpo!');
              }},
            ]);
          }}
          style={{ marginBottom: spacing.sm }}
        />

        <AppButton
          title="🔔 Testar Notificação Local"
          variant="secondary"
          size="sm"
          onPress={() => {
            // Notifications.scheduleNotificationAsync({...}); // Implementar se necessário
            Alert.alert('Notificação', 'Função de teste de notificação');
          }}
          style={{ marginBottom: spacing.sm }}
        />

        <AppButton
          title="📊 Ver Logs do Sistema"
          variant="secondary"
          size="sm"
          onPress={() => {
            console.log('=== DEV MODE LOGS ===');
            console.log('Current Role:', role);
            console.log('Dev Role View:', devRoleView);
            console.log('Original Role:', originalRole);
            console.log('Is Dev Mode:', isDevMode);
            Alert.alert('Logs', 'Verifique o console do Metro');
          }}
          style={{ marginBottom: spacing.lg }}
        />

        {/* Disable Dev Mode */}
        <AppButton
          title="Sair do Modo Desenvolvedor"
          variant="danger"
          onPress={handleDisableDevMode}
          style={{ marginTop: spacing.xl }}
        />
        
        <Text style={{ 
          textAlign: 'center', 
          fontSize: fontSize.sm, 
          color: colors.textMuted,
          marginTop: spacing.sm,
        }}>
          Você voltará ao perfil: {originalRole}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
