/* ============================
   BARBERPRO — Configurações do App
   Configurações gerais, conta, notificações, etc.
   ============================ */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { resetPassword } from '../services/auth';
import { colors, spacing, fontSize, radius, globalStyles } from '../theme';
import { Header, AppCard, AppButton } from '../components';
import { useUser } from '../store/user';
import type { RootStackParamList } from '../types/navigation';

interface SettingsState {
  notifications: {
    appointments: boolean;
    reminders: boolean;
    promotions: boolean;
    chat: boolean;
  };
  privacy: {
    showProfile: boolean;
    showPhone: boolean;
  };
  app: {
    darkMode: boolean;
    language: string;
  };
}

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { uid, role, name, email, phone, isAuthorizedDev, signOut, isDemo } = useUser();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      appointments: true,
      reminders: true,
      promotions: false,
      chat: true,
    },
    privacy: {
      showProfile: true,
      showPhone: false,
    },
    app: {
      darkMode: false,
      language: 'pt-BR',
    },
  });

  const updateSetting = (category: keyof SettingsState, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Email não encontrado');
      return;
    }
    
    Alert.alert(
      'Resetar Senha',
      'Deseja enviar um email para resetar sua senha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              await resetPassword(email);
              Alert.alert('Sucesso', 'Email de reset enviado! Verifique sua caixa de entrada.');
            } catch (e: any) {
              Alert.alert('Erro', e.message || 'Não foi possível enviar o email');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            signOut();
            if (auth) auth.signOut();
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://barberpro.app/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://barberpro.app/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:suporte@barberpro.app');
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm, textTransform: 'uppercase' }}>
        {title}
      </Text>
      <AppCard>
        {children}
      </AppCard>
    </View>
  );

  const renderToggle = (label: string, description: string, value: boolean, onToggle: (v: boolean) => void) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }}>
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text style={{ color: colors.text, fontSize: fontSize.md }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryBg }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );

  const renderDivider = () => (
    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />
  );

  const renderMenuItem = (icon: string, label: string, onPress: () => void, danger = false) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md }}
    >
      <Text style={{ fontSize: 20, marginRight: spacing.md }}>{icon}</Text>
      <Text style={{ color: danger ? colors.error : colors.text, fontSize: fontSize.md, flex: 1 }}>
        {label}
      </Text>
      <Text style={{ color: colors.textMuted }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.screen}>
      <Header title="⚙️ Configurações" />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Informações da Conta */}
        {renderSection('👤 Sua Conta', (
          <>
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Nome</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md }}>{name || 'Não definido'}</Text>
            </View>
            {renderDivider()}
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Email</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md }}>{email || 'Não definido'}</Text>
            </View>
            {renderDivider()}
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Telefone</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md }}>{phone || 'Não definido'}</Text>
            </View>
            {renderDivider()}
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Tipo de Conta</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md, textTransform: 'capitalize' }}>
                {role === 'dono' ? 'Proprietário' : role === 'funcionario' ? 'Barbeiro' : 'Cliente'}
              </Text>
            </View>
            {!isDemo && (
              <>
                {renderDivider()}
                {renderMenuItem('🔐', 'Alterar Senha', handleResetPassword)}
              </>
            )}
          </>
        ))}

        {/* Notificações */}
        {renderSection('🔔 Notificações', (
          <>
            {renderToggle(
              'Agendamentos',
              'Lembretes de agendamentos',
              settings.notifications.appointments,
              (v) => updateSetting('notifications', 'appointments', v)
            )}
            {renderDivider()}
            {renderToggle(
              'Lembretes',
              'Avisos antes do horário',
              settings.notifications.reminders,
              (v) => updateSetting('notifications', 'reminders', v)
            )}
            {renderDivider()}
            {renderToggle(
              'Promoções',
              'Ofertas e descontos',
              settings.notifications.promotions,
              (v) => updateSetting('notifications', 'promotions', v)
            )}
            {renderDivider()}
            {renderToggle(
              'Chat',
              'Mensagens do chat global',
              settings.notifications.chat,
              (v) => updateSetting('notifications', 'chat', v)
            )}
          </>
        ))}

        {/* Privacidade */}
        {renderSection('🔒 Privacidade', (
          <>
            {renderToggle(
              'Perfil Visível',
              'Outros podem ver seu perfil',
              settings.privacy.showProfile,
              (v) => updateSetting('privacy', 'showProfile', v)
            )}
            {renderDivider()}
            {renderToggle(
              'Mostrar Telefone',
              'Exibir telefone no perfil',
              settings.privacy.showPhone,
              (v) => updateSetting('privacy', 'showPhone', v)
            )}
          </>
        ))}

        {/* App */}
        {renderSection('📱 App', (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }}>
              <View>
                <Text style={{ color: colors.text, fontSize: fontSize.md }}>Idioma</Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Português (Brasil)</Text>
              </View>
              <Text style={{ color: colors.primary }}>Alterar ›</Text>
            </View>
            {renderDivider()}
            {renderToggle(
              'Modo Escuro',
              'Interface escura',
              settings.app.darkMode,
              (v) => updateSetting('app', 'darkMode', v)
            )}
          </>
        ))}

        {/* Dev Mode */}
        {isAuthorizedDev && renderSection('🛠️ Desenvolvedor', (
          <>
            {renderMenuItem('🔧', 'Painel do Desenvolvedor', () => navigation.navigate('DevPanel'))}
            {renderDivider()}
            {renderMenuItem('📊', 'Ver Logs', () => Alert.alert('Logs', 'Funcionalidade em desenvolvimento'))}
          </>
        ))}

        {/* Suporte */}
        {renderSection('❓ Suporte', (
          <>
            {renderMenuItem('📧', 'Contatar Suporte', openSupport)}
            {renderDivider()}
            {renderMenuItem('📜', 'Termos de Uso', openTermsOfService)}
            {renderDivider()}
            {renderMenuItem('🔒', 'Política de Privacidade', openPrivacyPolicy)}
          </>
        ))}

        {/* Sobre */}
        {renderSection('ℹ️ Sobre', (
          <>
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Versão</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md }}>1.0.0</Text>
            </View>
            {renderDivider()}
            <View style={{ paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Build</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md }}>2026.01.03</Text>
            </View>
          </>
        ))}

        {/* Sair */}
        <AppButton
          title="Sair da Conta"
          variant="outline"
          onPress={handleSignOut}
          style={{ marginTop: spacing.lg }}
        />

        {isDemo && (
          <Text style={{ color: colors.warning, textAlign: 'center', marginTop: spacing.md, fontSize: fontSize.sm }}>
            ⚠️ Modo Demo - Dados não são persistidos
          </Text>
        )}
      </ScrollView>
    </View>
  );
}