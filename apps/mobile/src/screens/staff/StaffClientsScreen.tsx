/* ============================
   BARBERPRO — Lista de Clientes do Staff
   Com sistema de bloqueio manual
   ============================ */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../services/firebase';
import { colors, spacing, fontSize, globalStyles, radius } from '../../theme';
import { Header, AppCard, Avatar, AppButton, Badge, EmptyState } from '../../components';
import { useUser } from '../../store/user';

interface ClientInfo {
  uid: string;
  name?: string;
  phone?: string;
  visitCount: number;
  lastVisit?: Date;
  blocked?: boolean;
  blockedReason?: string;
  blockedUntil?: Date;
  blockedBy?: string;
}

const BLOCK_DURATIONS = [
  { label: '1 dia', value: 1, unit: 'days' },
  { label: '3 dias', value: 3, unit: 'days' },
  { label: '7 dias', value: 7, unit: 'days' },
  { label: '15 dias', value: 15, unit: 'days' },
  { label: '1 mês', value: 30, unit: 'days' },
  { label: '3 meses', value: 90, unit: 'days' },
  { label: 'Permanente', value: -1, unit: 'permanent' },
];

export default function StaffClientsScreen() {
  const shopId = useUser((s) => s.shopId);
  const userRole = useUser((s) => s.role);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockDuration, setBlockDuration] = useState<number>(7);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    if (!shopId || !db) { setLoading(false); return; }
    loadClients();
  }, [shopId]);

  const loadClients = async () => {
    if (!shopId || !db) return;
    setLoading(true);
    try {
      const apptSnap = await getDocs(collection(db, 'barbershops', shopId, 'appointments'));
      const clientMap: Record<string, ClientInfo> = {};
      apptSnap.docs.forEach((d) => {
        const data = d.data() as any;
        const cuid = data.customerUid;
        if (!cuid) return;
        if (!clientMap[cuid]) {
          clientMap[cuid] = { uid: cuid, name: data.customerName, visitCount: 0 };
        }
        clientMap[cuid].visitCount++;
        const start = data.start?.toDate ? data.start.toDate() : new Date(data.start);
        if (!clientMap[cuid].lastVisit || start > clientMap[cuid].lastVisit!) {
          clientMap[cuid].lastVisit = start;
        }
      });

      // Buscar status de bloqueio
      const userIds = Object.keys(clientMap);
      for (const uid of userIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Verificar se está bloqueado e se o bloqueio expirou
            if (userData.blocked) {
              const blockedUntil = userData.blockedUntil?.toDate ? userData.blockedUntil.toDate() : null;
              if (blockedUntil && blockedUntil < new Date()) {
                // Bloqueio expirou - desbloquear automaticamente
                await updateDoc(doc(db, 'users', uid), {
                  blocked: false,
                  blockedReason: null,
                  blockedUntil: null,
                  autoUnblocked: true,
                  autoUnblockedAt: new Date(),
                });
                clientMap[uid].blocked = false;
              } else {
                clientMap[uid].blocked = true;
                clientMap[uid].blockedReason = userData.blockedReason;
                clientMap[uid].blockedUntil = blockedUntil;
              }
            }
          }
        } catch (e) {
          console.warn('Erro ao buscar status de bloqueio:', e);
        }
      }

      setClients(Object.values(clientMap).sort((a, b) => b.visitCount - a.visitCount));
    } catch (e) {
      console.warn('Erro:', e);
    }
    setLoading(false);
  };

  const openBlockModal = (client: ClientInfo) => {
    setSelectedClient(client);
    setBlockReason(client.blockedReason || '');
    setBlockDuration(7);
    setBlockModalVisible(true);
  };

  const handleBlock = async () => {
    if (!selectedClient || !db) return;
    
    if (!blockReason.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o motivo do bloqueio');
      return;
    }

    setBlocking(true);
    try {
      const selectedDuration = BLOCK_DURATIONS.find(d => d.value === blockDuration);
      let blockedUntil: Date | null = null;
      
      if (blockDuration !== -1) {
        blockedUntil = new Date();
        blockedUntil.setDate(blockedUntil.getDate() + blockDuration);
      }

      // Atualizar no Firestore
      const updateData: any = {
        blocked: true,
        blockedReason: blockReason.trim(),
        blockedBy: shopId, // Marcar que foi bloqueado pela barbearia
        blockedAt: new Date(),
        blockedUntil: blockedUntil,
      };

      await updateDoc(doc(db, 'users', selectedClient.uid), updateData);

      // Atualizar lista local
      setClients(prev => prev.map(c => 
        c.uid === selectedClient.uid 
          ? { ...c, blocked: true, blockedReason: blockReason.trim(), blockedUntil: blockedUntil ?? undefined }
          : c
      ));

      Alert.alert(
        'Cliente bloqueado',
        blockedUntil 
          ? `Bloqueado até ${blockedUntil.toLocaleDateString('pt-BR')}`
          : 'Bloqueado permanentemente'
      );
      setBlockModalVisible(false);
    } catch (e: any) {
      console.warn('Erro ao bloquear:', e);
      Alert.alert('Erro', e.message || 'Não foi possível bloquear');
    }
    setBlocking(false);
  };

  const handleUnblock = async (client: ClientInfo) => {
    if (!db) return;

    Alert.alert(
      'Desbloquear cliente',
      `Deseja desbloquear ${client.name || client.uid}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', client.uid), {
                blocked: false,
                blockedReason: null,
                blockedUntil: null,
                unblockedBy: shopId,
                unblockedAt: new Date(),
              });

              setClients(prev => prev.map(c => 
                c.uid === client.uid 
                  ? { ...c, blocked: false, blockedReason: undefined, blockedUntil: undefined }
                  : c
              ));

              Alert.alert('Sucesso', 'Cliente desbloqueado');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível desbloquear');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return date.toLocaleDateString('pt-BR');
  };

  const renderClient = ({ item }: { item: ClientInfo }) => (
    <AppCard>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar name={item.name || 'Cliente'} size={40} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '600' }}>
              {item.name || item.uid}
            </Text>
            {item.blocked && (
              <Badge text="Bloqueado" variant="danger" />
            )}
          </View>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
            {item.visitCount} visitas · Última: {formatDate(item.lastVisit)}
          </Text>
          {item.blocked && item.blockedReason && (
            <Text style={{ color: colors.danger, fontSize: fontSize.xs, marginTop: spacing.xs }}>
              Motivo: {item.blockedReason}
            </Text>
          )}
          {item.blocked && item.blockedUntil && (
            <Text style={{ color: colors.warning, fontSize: fontSize.xs }}>
              Até: {formatDate(item.blockedUntil)}
            </Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm, gap: spacing.sm }}>
        {item.blocked ? (
          <AppButton 
            title="Desbloquear" 
            variant="outline" 
            size="sm" 
            onPress={() => handleUnblock(item)} 
          />
        ) : (
          <AppButton 
            title="Bloquear" 
            variant="ghost" 
            size="sm" 
            onPress={() => openBlockModal(item)} 
          />
        )}
      </View>
    </AppCard>
  );

  return (
    <View style={globalStyles.screen}>
      <Header title="Clientes" subtitle={`${clients.length} cliente(s)`} />
      <FlatList
        data={clients}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        renderItem={renderClient}
        ListEmptyComponent={<EmptyState icon="👤" title="Nenhum cliente" message="Clientes aparecerão após agendamentos" />}
        onRefresh={loadClients}
        refreshing={loading}
      />

      {/* Modal de Bloqueio */}
      <Modal
        visible={blockModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg }}>
            <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.md }}>
              Bloquear Cliente
            </Text>
            
            {selectedClient && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <Avatar name={selectedClient.name || 'Cliente'} size={40} />
                <Text style={{ color: colors.text, fontSize: fontSize.md, marginLeft: spacing.sm }}>
                  {selectedClient.name || selectedClient.uid}
                </Text>
              </View>
            )}

            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm }}>
              Motivo do bloqueio *
            </Text>
            <TextInput
              style={{ 
                backgroundColor: colors.card, 
                borderRadius: radius.md, 
                padding: spacing.md, 
                color: colors.text, 
                minHeight: 80,
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: colors.borderLight,
                marginBottom: spacing.md,
              }}
              placeholder="Ex: Cliente faltou 3 vezes seguidas sem aviso..."
              placeholderTextColor={colors.textMuted}
              multiline
              value={blockReason}
              onChangeText={setBlockReason}
            />

            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm }}>
              Duração do bloqueio
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
              {BLOCK_DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => setBlockDuration(d.value)}
                  style={{
                    backgroundColor: blockDuration === d.value ? colors.primary : colors.card,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    marginRight: spacing.sm,
                    borderWidth: 1,
                    borderColor: blockDuration === d.value ? colors.primary : colors.borderLight,
                  }}
                >
                  <Text style={{ 
                    color: blockDuration === d.value ? colors.white : colors.text, 
                    fontSize: fontSize.sm,
                    fontWeight: '500',
                  }}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.lg }}>
              ℹ️ O cliente será notificado sobre o bloqueio e o motivo. Após o período, o bloqueio será removido automaticamente.
            </Text>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppButton
                title="Cancelar"
                variant="outline"
                onPress={() => setBlockModalVisible(false)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Bloquear"
                onPress={handleBlock}
                loading={blocking}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}