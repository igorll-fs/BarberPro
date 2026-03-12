/* ============================
   BARBERPRO — Busca de Barbearias Próximas
   Busca por nome, localização e filtros
   ============================ */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppCard, AppButton, EmptyState } from '../../components';
import type { RootStackParamList } from '../../types/navigation';

interface Barbershop {
  id: string;
  name: string;
  slug: string;
  address?: string;
  geo?: { lat: number; lng: number };
  phone?: string;
  photos?: string[];
  rating?: number;
  reviewCount?: number;
  distance?: number; // em km
}

export default function SearchBarbershopsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Barbershop[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredShops(barbershops);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredShops(
        barbershops.filter(
          shop => 
            shop.name.toLowerCase().includes(query) ||
            shop.address?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, barbershops]);

  useEffect(() => {
    sortBarbershops();
  }, [sortBy, filteredShops]);

  const loadUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permissão de localização negada');
        loadBarbershops(null);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      loadBarbershops({ lat: latitude, lng: longitude });
    } catch (e) {
      console.warn('Erro ao obter localização:', e);
      setLocationError('Não foi possível obter sua localização');
      loadBarbershops(null);
    }
  };

  const loadBarbershops = async (location: { lat: number; lng: number } | null) => {
    if (!db) { setLoading(false); return; }
    
    try {
      const snap = await getDocs(collection(db, 'barbershops'));
      const shops: Barbershop[] = [];

      snap.docs.forEach(doc => {
        const data = doc.data();
        const shop: Barbershop = {
          id: doc.id,
          name: data.name || 'Sem nome',
          slug: data.slug || doc.id,
          address: data.address,
          geo: data.geo,
          phone: data.phone,
          photos: data.photos,
          rating: data.rating,
          reviewCount: data.reviewCount,
        };

        // Calcular distância se tiver localização
        if (location && data.geo) {
          shop.distance = calculateDistance(
            location.lat,
            location.lng,
            data.geo.lat,
            data.geo.lng
          );
        }

        shops.push(shop);
      });

      setBarbershops(shops);
      setFilteredShops(shops);
    } catch (e) {
      console.warn('Erro ao carregar barbearias:', e);
    }
    setLoading(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortBarbershops = () => {
    const sorted = [...filteredShops].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    setFilteredShops(sorted);
  };

  const openMaps = (shop: Barbershop) => {
    if (!shop.address && !shop.geo) return;
    
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

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i <= rating ? colors.warning : colors.border, fontSize: 14 }}>
          ★
        </Text>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={globalStyles.screen}>
        <Header title="🔍 Buscar Barbearias" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
            Obtendo sua localização...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Header title="🔍 Buscar Barbearias" />

      {/* Barra de busca */}
      <View style={{ padding: spacing.md, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: radius.md, paddingHorizontal: spacing.md }}>
          <Text style={{ marginRight: spacing.sm }}>🔍</Text>
          <TextInput
            style={{ flex: 1, paddingVertical: spacing.md, color: colors.text }}
            placeholder="Buscar por nome ou endereço..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de ordenação */}
        <View style={{ flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm }}>
          {[
            { key: 'distance', label: '📍 Distância' },
            { key: 'rating', label: '⭐ Avaliação' },
            { key: 'name', label: '🔤 Nome' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSortBy(filter.key as any)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: radius.full,
                backgroundColor: sortBy === filter.key ? colors.primary : colors.bg,
                borderWidth: 1,
                borderColor: sortBy === filter.key ? colors.primary : colors.border,
              }}
            >
              <Text style={{ 
                color: sortBy === filter.key ? colors.white : colors.text, 
                fontSize: fontSize.xs,
              }}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status de localização */}
        {locationError && (
          <Text style={{ color: colors.warning, fontSize: fontSize.xs, marginTop: spacing.sm }}>
            ⚠️ {locationError}
          </Text>
        )}
        {userLocation && (
          <Text style={{ color: colors.success, fontSize: fontSize.xs, marginTop: spacing.sm }}>
            ✅ Localização obtida
          </Text>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        {/* Resultados */}
        <Text style={{ color: colors.textMuted, marginBottom: spacing.md }}>
          {filteredShops.length} barbearia{filteredShops.length !== 1 ? 's' : ''} encontrada{filteredShops.length !== 1 ? 's' : ''}
        </Text>

        {filteredShops.map((shop) => (
          <AppCard key={shop.id} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row' }}>
              {/* Foto */}
              {shop.photos?.[0] ? (
                <Image
                  source={{ uri: shop.photos[0] }}
                  style={{ width: 80, height: 80, borderRadius: radius.md }}
                />
              ) : (
                <View style={{ width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 32 }}>🏪</Text>
                </View>
              )}

              {/* Info */}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: fontSize.md }}>
                  {shop.name}
                </Text>
                
                {/* Rating */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  {renderStars(shop.rating)}
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginLeft: spacing.xs }}>
                    ({shop.reviewCount || 0})
                  </Text>
                </View>

                {/* Distância */}
                {shop.distance !== undefined && (
                  <Text style={{ color: colors.primary, fontSize: fontSize.sm, marginTop: 4 }}>
                    📍 {shop.distance.toFixed(1)} km de você
                  </Text>
                )}

                {/* Endereço */}
                {shop.address && (
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                    {shop.address}
                  </Text>
                )}
              </View>
            </View>

            {/* Ações */}
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              <AppButton
                title="Agendar"
                onPress={() => navigation.navigate('BarbershopPublic', { slug: shop.slug })}
                style={{ flex: 1 }}
              />
              <AppButton
                title="📍 Mapa"
                variant="outline"
                onPress={() => openMaps(shop)}
                style={{ flex: 1 }}
              />
            </View>
          </AppCard>
        ))}

        {filteredShops.length === 0 && (
          <EmptyState 
            icon="🔍" 
            message={searchQuery ? `Nenhuma barbearia encontrada para "${searchQuery}"` : 'Nenhuma barbearia cadastrada'} 
          />
        )}
      </ScrollView>
    </View>
  );
}