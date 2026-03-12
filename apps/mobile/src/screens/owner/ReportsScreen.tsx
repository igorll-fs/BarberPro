/* ============================
   BARBERPRO — Relatórios Financeiros (Dono)
   Com filtros por semana, mês, ano e busca por data
   ============================ */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppCard, StatCard, EmptyState, AppButton } from '../../components';
import { useUser } from '../../store/user';

type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

interface DateRange {
  start: Date;
  end: Date;
}

export default function ReportsScreen() {
  const shopId = useUser((s) => s.shopId);
  const [stats, setStats] = useState({ revenue: 0, total: 0, completed: 0, cancelled: 0, noShow: 0 });
  const [topServices, setTopServices] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const getDateRange = (p: PeriodFilter): { start: Date; end: Date } => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let start: Date;

    switch (p) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        break;
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      case 'custom':
        if (dateRange) {
          return { 
            start: new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), dateRange.start.getDate(), 0, 0, 0, 0),
            end: new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), dateRange.end.getDate(), 23, 59, 59, 999)
          };
        }
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    return { start, end };
  };

  const loadReport = async () => {
    if (!shopId || !db) { setLoading(false); return; }
    setLoading(true);
    try {
      const { start, end } = getDateRange(period);

      const apptRef = collection(db, 'barbershops', shopId, 'appointments');
      const snap = await getDocs(apptRef);
      const appts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      // Filtrar por período
      const filtered = appts.filter((a) => {
        const s = a.start?.toDate ? a.start.toDate() : new Date(a.start);
        return s >= start && s <= end;
      });

      const revenue = filtered
        .filter((a) => a.status === 'completed')
        .reduce((sum, a) => sum + (a.priceCents || 0), 0);

      const completed = filtered.filter((a) => a.status === 'completed').length;
      const cancelled = filtered.filter((a) => a.status === 'cancelled').length;
      const noShow = filtered.filter((a) => a.status === 'no-show').length;

      setStats({ revenue, total: filtered.length, completed, cancelled, noShow });

      // Top services
      const svcCount: Record<string, { name: string; count: number; revenue: number }> = {};
      filtered.forEach((a) => {
        const key = a.serviceId || 'unknown';
        if (!svcCount[key]) svcCount[key] = { name: a.serviceName || key, count: 0, revenue: 0 };
        svcCount[key].count++;
        if (a.status === 'completed') svcCount[key].revenue += a.priceCents || 0;
      });
      setTopServices(Object.values(svcCount).sort((a, b) => b.revenue - a.revenue).slice(0, 10));
    } catch (e) {
      console.warn('Erro ao gerar relatório:', e);
    }
    setLoading(false);
  };

  useEffect(() => { loadReport(); }, [shopId, period, dateRange]);

  const periodLabels: Record<PeriodFilter, string> = {
    today: 'Hoje',
    week: 'Semana',
    month: 'Mês',
    year: 'Ano',
    custom: 'Personalizado',
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const handleCustomDate = () => {
    if (customStartDate && customEndDate) {
      setDateRange({ start: customStartDate, end: customEndDate });
      setPeriod('custom');
      setCustomModalVisible(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <Header title="Relatórios" subtitle={period === 'custom' && dateRange ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}` : periodLabels[period]} />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadReport} tintColor={colors.primary} />}
      >
        {/* Period tabs */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg, gap: spacing.sm }}>
          {(['today', 'week', 'month', 'year', 'custom'] as PeriodFilter[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => p === 'custom' ? setCustomModalVisible(true) : setPeriod(p)}
              style={{
                backgroundColor: period === p ? colors.primary : colors.card,
                borderRadius: radius.md,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                minWidth: 60,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: period === p ? colors.primary : colors.borderLight,
              }}
            >
              <Text style={{ color: period === p ? colors.white : colors.textMuted, fontWeight: '600', fontSize: fontSize.sm }}>
                {periodLabels[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
          <StatCard icon="💰" label="Receita" value={`R$ ${(stats.revenue / 100).toFixed(0)}`} trend="up" />
          <StatCard icon="📅" label="Agendamentos" value={stats.total} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
          <StatCard icon="✅" label="Concluídos" value={stats.completed} trend="up" />
          <StatCard icon="❌" label="Cancelados" value={stats.cancelled} trend={stats.cancelled > 0 ? 'down' : 'neutral'} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: spacing.xxl }}>
          <StatCard icon="🚫" label="No-show" value={stats.noShow} trend={stats.noShow > 0 ? 'down' : 'neutral'} />
          <StatCard icon="📊" label="Taxa Conclusão" value={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'} trend="neutral" />
        </View>

        {/* Top services */}
        <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
          Serviços mais lucrativos
        </Text>
        {topServices.length === 0 ? (
          <EmptyState icon="📊" title="Sem dados" message="Agendamentos concluídos aparecerão aqui" />
        ) : (
          topServices.map((svc, i) => (
            <AppCard key={i}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '600' }}>
                    #{i + 1} {svc.name}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{svc.count} agendamentos</Text>
                </View>
                <Text style={{ color: colors.primary, fontSize: fontSize.lg, fontWeight: '700' }}>
                  R$ {(svc.revenue / 100).toFixed(0)}
                </Text>
              </View>
            </AppCard>
          ))
        )}

        {/* Dica */}
        <View style={{ marginTop: spacing.xxl, padding: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderLight }}>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' }}>
            💡 Dica: Use o filtro "Personalizado" para buscar qualquer período desde o primeiro registro.
          </Text>
        </View>
      </ScrollView>

      {/* Modal de data personalizada */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.bg, borderRadius: radius.xl, padding: spacing.lg, width: '90%', maxWidth: 400 }}>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.lg, textAlign: 'center' }}>
              Selecionar Período
            </Text>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Data Inicial</Text>
              <TouchableOpacity
                style={{ backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight }}
              >
                <Text style={{ color: colors.text }}>
                  {formatDate(customStartDate)}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs }}>
                (Toque para alterar - use o calendário)
              </Text>
            </View>

            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Data Final</Text>
              <TouchableOpacity
                style={{ backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight }}
              >
                <Text style={{ color: colors.text }}>
                  {formatDate(customEndDate)}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs }}>
                (Toque para alterar - use o calendário)
              </Text>
            </View>

            {/* Quick date presets */}
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm }}>Períodos rápidos:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg }}>
              {[
                { label: 'Últimos 7 dias', start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() },
                { label: 'Últimos 30 dias', start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
                { label: 'Este mês', start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() },
                { label: 'Mês passado', start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), end: new Date(new Date().getFullYear(), new Date().getMonth(), 0) },
              ].map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  onPress={() => {
                    setCustomStartDate(preset.start);
                    setCustomEndDate(preset.end);
                  }}
                  style={{ backgroundColor: colors.card, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.borderLight }}
                >
                  <Text style={{ color: colors.text, fontSize: fontSize.xs }}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppButton title="Cancelar" variant="outline" onPress={() => setCustomModalVisible(false)} style={{ flex: 1 }} />
              <AppButton title="Aplicar" onPress={handleCustomDate} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}