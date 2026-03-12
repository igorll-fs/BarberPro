/* ============================
   BARBERPRO — Perfil da Barbearia
   Gerenciamento de fotos, descrição e localização
   ============================ */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppCard, AppButton, EmptyState } from '../../components';
import { useUser } from '../../store/user';
import type { RootStackParamList } from '../../types/navigation';

interface BarbershopData {
  name: string;
  slug: string;
  address?: string;
  geo?: { lat: number; lng: number };
  photos?: string[];
  phone?: string;
  description?: string;
}

export default function BarbershopProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { shopId, isDemo } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState<BarbershopData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    loadShop();
  }, [shopId]);

  const loadShop = async () => {
    if (!shopId || !db) { setLoading(false); return; }
    try {
      const snap = await getDoc(doc(db, 'barbershops', shopId));
      if (snap.exists()) {
        const data = snap.data() as BarbershopData;
        setShop(data);
        setForm({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
        });
      }
    } catch (e) {
      console.warn('Erro ao carregar barbearia:', e);
    }
    setLoading(false);
  };

  const openMaps = () => {
    if (!shop?.address && !shop?.geo) return;
    
    let url: string;
    if (shop.geo) {
      const { lat, lng } = shop.geo;
      url = Platform.OS === 'ios'
        ? `maps://app?daddr=${lat},${lng}`
        : `google.navigation:q=${lat},${lng}`;
    } else {
      const address = encodeURIComponent(shop.address || '');
      url = Platform.OS === 'ios'
        ? `maps://app?daddr=${address}`
        : `google.navigation:q=${address}`;
    }
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa');
    });
  };

  const pickImage = async () => {
    if (isDemo) {
      Alert.alert('Demo', 'Upload de fotos não disponível no modo demo');
      return;
    }
    
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert('Permissão', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const picker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!picker.canceled && picker.assets) {
      await uploadPhotos(picker.assets.map(a => a.uri));
    }
  };

  const uploadPhotos = async (uris: string[]) => {
    if (!shopId || !storage) return;
    setSaving(true);
    try {
      const currentPhotos = shop?.photos || [];
      const newUrls: string[] = [];

      for (const uri of uris) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `barbershops/${shopId}/photos/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        newUrls.push(url);
      }

      const updatedPhotos = [...currentPhotos, ...newUrls].slice(0, 10); // Máximo 10 fotos
      await updateDoc(doc(db!, 'barbershops', shopId), { photos: updatedPhotos });
      setShop({ ...shop!, photos: updatedPhotos });
      Alert.alert('Sucesso', 'Fotos adicionadas!');
    } catch (e) {
      console.warn('Erro ao fazer upload:', e);
      Alert.alert('Erro', 'Não foi possível fazer upload das fotos');
    }
    setSaving(false);
  };

  const removePhoto = async (index: number) => {
    if (!shopId || !db || !shop) return;
    
    Alert.alert('Remover foto', 'Deseja remover esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const photos = [...(shop.photos || [])];
          photos.splice(index, 1);
          await updateDoc(doc(db!, 'barbershops', shopId), { photos });
          setShop({ ...shop, photos });
        },
      },
    ]);
  };

  const saveDetails = async () => {
    if (!shopId || !db) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barbershops', shopId), {
        name: form.name,
        description: form.description,
        address: form.address,
        phone: form.phone,
      });
      setShop({ ...shop!, ...form });
      setEditing(false);
      Alert.alert('Sucesso', 'Informações salvas!');
    } catch (e) {
      console.warn('Erro ao salvar:', e);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={globalStyles.screen}>
        <Header title="Perfil da Barbearia" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Header 
        title="Perfil da Barbearia" 
        rightIcon={editing ? '✓' : '✏️'}
        onRightPress={editing ? saveDetails : () => setEditing(true)}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Fotos */}
        <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
          📸 Fotos da Barbearia
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          {(shop?.photos || []).map((uri, i) => (
            <TouchableOpacity key={i} onLongPress={() => removePhoto(i)}>
              <Image
                source={{ uri }}
                style={{ width: 150, height: 150, borderRadius: radius.md, marginRight: spacing.sm }}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 150,
              height: 150,
              borderRadius: radius.md,
              backgroundColor: colors.card,
              borderWidth: 2,
              borderColor: colors.borderLight,
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>+</Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Adicionar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Informações */}
        <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '600', marginBottom: spacing.md }}>
          ℹ️ Informações
        </Text>

        <AppCard>
          {editing ? (
            <>
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Nome</Text>
                <TextInput
                  style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, color: colors.text }}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                  placeholder="Nome da barbearia"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Descrição</Text>
                <TextInput
                  style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, color: colors.text, minHeight: 80, textAlignVertical: 'top' }}
                  value={form.description}
                  onChangeText={(t) => setForm({ ...form, description: t })}
                  placeholder="Descreva sua barbearia..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                />
              </View>
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Telefone</Text>
                <TextInput
                  style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, color: colors.text }}
                  value={form.phone}
                  onChangeText={(t) => setForm({ ...form, phone: t })}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Endereço</Text>
                <TextInput
                  style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, color: colors.text }}
                  value={form.address}
                  onChangeText={(t) => setForm({ ...form, address: t })}
                  placeholder="Rua, número, bairro, cidade"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <AppButton title="Salvar" onPress={saveDetails} loading={saving} />
            </>
          ) : (
            <>
              <Text style={{ color: colors.text, fontSize: fontSize['2xl'], fontWeight: '700', marginBottom: spacing.sm }}>
                {shop?.name || 'Minha Barbearia'}
              </Text>
              {shop?.description && (
                <Text style={{ color: colors.textMuted, fontSize: fontSize.md, marginBottom: spacing.md }}>
                  {shop.description}
                </Text>
              )}
              {shop?.phone && (
                <Text style={{ color: colors.primary, fontSize: fontSize.md, marginBottom: spacing.xs }}>
                  📞 {shop.phone}
                </Text>
              )}
              {shop?.address && (
                <TouchableOpacity
                  onPress={openMaps}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}
                >
                  <Text style={{ color: colors.primary, fontSize: fontSize.md }}>
                    📍 {shop.address}
                  </Text>
                  <Text style={{ color: colors.primary, fontSize: fontSize.sm, marginLeft: spacing.sm }}>
                    (abrir no mapa)
                  </Text>
                </TouchableOpacity>
              )}
              {!shop?.address && (
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' }}>
                  Endereço não definido
                </Text>
              )}
            </>
          )}
        </AppCard>

        {/* Botão de editar */}
        {!editing && (
          <AppButton
            title="Editar Informações"
            variant="outline"
            onPress={() => setEditing(true)}
            style={{ marginTop: spacing.lg }}
          />
        )}
      </ScrollView>
    </View>
  );
}