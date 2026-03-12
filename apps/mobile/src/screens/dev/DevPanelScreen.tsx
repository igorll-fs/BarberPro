/* ============================
   BARBERPRO — Painel do Desenvolvedor
   Acesso total: todas barbearias, dados e finanças
   ============================ */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppCard, AppButton, EmptyState } from '../../components';
import { useUser } from '../../store/user';
import type { RootStackParamList } from '../../types/navigation';

interface BarbershopData {
  id: string;
  name: string;
  slug: string;
  ownerUid: string;
  createdAt?: any;
  subscription?: {
    status: string;
    mode?: string;
    updatedAt?: any;
  };
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
}

interface StatsData {
  totalBarbershops: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  totalUsers: number;
  totalAppointments: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export default function DevPanelScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthorizedDev, isDevMode, enableDevMode, switchDevRole, disableDevMode, role, originalRole } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'barbershops' | 'users' | 'finances'>('overview');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [barbershops, setBarbershops] = useState<BarbershopData[]>([]);
  const [selectedShop, setSelectedShop] = useState<BarbershopData | null>(null);

  useEffect(() => {
    if (!isAuthorizedDev) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para acessar este painel.');
      navigation.goBack();
      return;
    }
    loadData();
  }, [isAuthorizedDev]);

  const loadData = async () => {
    if (!db) return;
    try {
      // Carregar barbearias
      const shopsSnap = await getDocs(collection(db, 'barbershops'));
      const shops: BarbershopData[] = [];
      let active = 0;
      let inactive = 0;

      shopsSnap.docs.forEach(doc => {
        const data = doc.data();
        shops.push({ id: doc.id, ...data } as BarbershopData);
        if (data.subscription?.status === 'active') active++;
        else inactive++;
      });

      setBarbershops(shops);

      // Carregar usuários
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnap.size;

      // Calcular receita (simulado - em produção viria do Stripe)
      const now = new Date();
      const dailyRevenue = shops.length * 50; // Placeholder
      const weeklyRevenue = dailyRevenue * 7;
      const monthlyRevenue = dailyRevenue * 30;
      const yearlyRevenue = dailyRevenue * 365;

      setStats({
        totalBarbershops: shops.length,
        activeSubscriptions: active,
        inactiveSubscriptions: inactive,
        totalUsers,
        totalAppointments: 0, // Seria calculado com agregação
        revenue: {
          daily: dailyRevenue,
          weekly: weeklyRevenue,
          monthly: monthlyRevenue,
          yearly: yearlyRevenue,
        },
      });
    } catch (e) {
      console.warn('Erro ao carregar dados:', e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleSubscription = async (shop: BarbershopData, activate: boolean) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'barbershops', shop.id), {
        subscription: {
          status: activate ? 'active' : 'inactive',
          updatedAt: new Date(),
          manualOverride: true,
          overriddenBy: 'dev',
        },
      });
      Alert.alert('Sucesso', `Assinatura ${activate ? 'ativada' : 'desativada'} para ${shop.name}`);
      loadData();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar a assinatura');
    }
  };

  const viewShopDetails = (shop: BarbershopData) => {
    setSelectedShop(shop);
  };

  if (loading) {
    return (
      <View style={globalStyles.screen}>
        <Header title="🛠️ Painel Dev" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Header 
        title="🛠️ Painel do Desenvolvedor" 
        rightIcon={isDevMode ? '🔴' : '🟢'}
        onRightPress={() => isDevMode ? disableDevMode() : enableDevMode()}
      />

      {/* Dev Mode Status */}
      <View style={{ backgroundColor: colors.card, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              Modo Dev: {isDevMode ? '✅ Ativo' : '❌ Inativo'}
            </Text>
            {isDevMode && (
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
                Visualizando como: {role} {originalRole !== role && `(Original: ${originalRole})`}
              </Text>
            )}
          </View>
          {isDevMode && (
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {(['cliente', 'dono', 'funcionario'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => switchDevRole(r)}
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.sm,
                    backgroundColor: role === r ? colors.primary : colors.bg,
                  }}
                >
                  <Text style={{ color: role === r ? colors.white : colors.text, fontSize: fontSize.xs }}>
                    {r === 'cliente' ? '👤' : r === 'dono' ? '🏪' : '✂️'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {[
          { key: 'overview', label: '📊 Visão Geral' },
          { key: 'barbershops', label: '🏪 Barbearias' },
          { key: 'users', label: '👥 Usuários' },
          { key: 'finances', label: '💰 Finanças' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab.key ? colors.primary : 'transparent',
            }}
          >
            <Text style={{ 
              color: activeTab === tab.key ? colors.primary : colors.textMuted, 
              fontSize: fontSize.sm,
              fontWeight: activeTab === tab.key ? '600' : '400',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
              📈 Estatísticas Gerais
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <AppCard style={{ width: '48%' }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Total Barbearias</Text>
                <Text style={{ color: colors.text, fontSize: fontSize['2xl'], fontWeight: '700' }}>
                  {stats.totalBarbershops}
                </Text>
              </AppCard>
              <AppCard style={{ width: '48%' }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Assinaturas Ativas</Text>
                <Text style={{ color: colors.success, fontSize: fontSize['2xl'], fontWeight: '700' }}>
                  {stats.activeSubscriptions}
                </Text>
              </AppCard>
              <AppCard style={{ width: '48%' }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Assinaturas Inativas</Text>
                <Text style={{ color: colors.error, fontSize: fontSize['2xl'], fontWeight: '700' }}>
                  {stats.inactiveSubscriptions}
                </Text>
              </AppCard>
              <AppCard style={{ width: '48%' }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Total Usuários</Text>
                <Text style={{ color: colors.text, fontSize: fontSize['2xl'], fontWeight: '700' }}>
                  {stats.totalUsers}
                </Text>
              </AppCard>
            </View>

            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginTop: spacing.xl, marginBottom: spacing.md }}>
              💰 Receita (Estimada)
            </Text>

            <AppCard>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>Diária</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>R$ {stats.revenue.daily.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>Semanal</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>R$ {stats.revenue.weekly.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>Mensal</Text>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>R$ {stats.revenue.monthly.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textMuted }}>Anual</Text>
                <Text style={{ color: colors.success, fontWeight: '700' }}>R$ {stats.revenue.yearly.toFixed(2)}</Text>
              </View>
            </AppCard>
          </>
        )}

        {/* Barbearias Tab */}
        {activeTab === 'barbershops' && (
          <>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
              🏪 Todas as Barbearias ({barbershops.length})
            </Text>

            {barbershops.map((shop) => (
              <AppCard key={shop.id} style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: fontSize.md }}>
                      {shop.name}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
                      Slug: {shop.slug}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
                      Owner: {shop.ownerUid?.slice(0, 12)}...
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                      <View style={{
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 2,
                        borderRadius: radius.sm,
                        backgroundColor: shop.subscription?.status === 'active' ? colors.successBg : colors.errorBg,
                      }}>
                        <Text style={{ 
                          color: shop.subscription?.status === 'active' ? colors.success : colors.error, 
                          fontSize: fontSize.xs,
                          fontWeight: '600',
                        }}>
                          {shop.subscription?.status === 'active' ? '✅ Ativa' : '❌ Inativa'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ gap: spacing.xs }}>
                    <TouchableOpacity
                      onPress={() => toggleSubscription(shop, shop.subscription?.status !== 'active')}
                      style={{
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        borderRadius: radius.sm,
                        backgroundColor: shop.subscription?.status === 'active' ? colors.errorBg : colors.successBg,
                      }}
                    >
                      <Text style={{ color: shop.subscription?.status === 'active' ? colors.error : colors.success, fontSize: fontSize.xs }}>
                        {shop.subscription?.status === 'active' ? 'Desativar' : 'Ativar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AppCard>
            ))}

            {barbershops.length === 0 && (
              <EmptyState icon="🏪" message="Nenhuma barbearia cadastrada" />
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
              👥 Gestão de Usuários
            </Text>

            <AppCard>
              <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
                Funcionalidade em desenvolvimento. Em breve será possível ver todos os usuários, seus roles e dados.
              </Text>
            </AppCard>

            <AppButton
              title="Ver Usuários Bloqueados"
              variant="outline"
              style={{ marginTop: spacing.md }}
              onPress={() => Alert.alert('Em breve', 'Lista de usuários bloqueados')}
            />
          </>
        )}

        {/* Finances Tab */}
        {activeTab === 'finances' && stats && (
          <>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
              💰 Relatório Financeiro
            </Text>

            <AppCard>
              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: spacing.sm }}>
                📊 Receita por Período
              </Text>
              
              <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, borderRadius: radius.md }}>
                <Text style={{ color: colors.textMuted }}>
                  Gráfico de receita será exibido aqui
                </Text>
              </View>
            </AppCard>

            <AppCard style={{ marginTop: spacing.md }}>
              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: spacing.sm }}>
                📈 Métricas
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>Ticket Médio</Text>
                <Text style={{ color: colors.text }}>R$ 45,00</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ color: colors.textMuted }}>LTV Médio</Text>
                <Text style={{ color: colors.text }}>R$ 540,00</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textMuted }}>Churn Rate</Text>
                <Text style={{ color: colors.text }}>5.2%</Text>
              </View>
            </AppCard>

            <AppButton
              title="Exportar Relatório CSV"
              variant="outline"
              style={{ marginTop: spacing.lg }}
              onPress={() => Alert.alert('Em breve', 'Exportação de relatórios')}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}