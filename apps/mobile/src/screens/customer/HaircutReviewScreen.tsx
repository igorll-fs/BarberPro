/**
 * HaircutReviewScreen - Avaliação detalhada do corte pelo cliente
 * Cliente avalia o corte, atendimento e barbearia separadamente
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppButton, AppCard } from '../../components';
import { useUser } from '../../store/user';
import type { HaircutReview } from '../../types/models';

interface HaircutReviewScreenProps {
  route: {
    params: {
      appointmentId: string;
      staffUid: string;
      staffName: string;
      staffPhoto?: string;
      shopId: string;
      shopName: string;
      serviceName: string;
    };
  };
}

const RATING_EMOJIS = ['😠', '😞', '😐', '😊', '😍'];
const RATING_LABELS = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

export default function HaircutReviewScreen({ route }: HaircutReviewScreenProps) {
  const { uid, name, photoUrl } = useUser();
  const { appointmentId, staffUid, staffName, staffPhoto, shopId, shopName, serviceName } = route.params;

  // Avaliações separadas
  const [haircutRating, setHaircutRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [barbershopRating, setBarbershopRating] = useState(0);

  // Comentários
  const [haircutComment, setHaircutComment] = useState('');
  const [serviceComment, setServiceComment] = useState('');

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availableTags = ['fade', 'degradê', 'barba', 'moderno', 'clássico', 'kids', 'undercut', 'moicano', 'social', 'criativo'];

  // Fotos
  const [resultPhotos, setResultPhotos] = useState<string[]>([]);
  const [beforePhoto, setBeforePhoto] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      Alert.alert('Limite atingido', 'Você pode selecionar até 5 tags');
    }
  };

  const renderRatingStars = (
    rating: number,
    setRating: (r: number) => void,
    label: string
  ) => (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={{ padding: spacing.sm }}
          >
            <Text style={{ fontSize: 32 }}>
              {star <= rating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <Text style={{ fontSize: fontSize.md, color: colors.primary, textAlign: 'center', fontWeight: '500' }}>
          {RATING_EMOJIS[rating - 1]} {RATING_LABELS[rating - 1]}
        </Text>
      )}
    </View>
  );

  const submitReview = async () => {
    if (!uid) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    if (haircutRating === 0 || serviceRating === 0 || barbershopRating === 0) {
      Alert.alert('Avaliação incompleta', 'Por favor, avalie todos os aspectos');
      return;
    }

    setLoading(true);
    try {
      const reviewData: Omit<HaircutReview, 'id'> = {
        appointmentId,
        customerUid: uid,
        customerName: name || 'Cliente',
        customerPhoto: photoUrl,
        shopId,
        shopName,
        staffUid,
        staffName,
        staffPhoto,
        haircutRating,
        serviceRating,
        barbershopRating,
        haircutComment: haircutComment.trim() || undefined,
        serviceComment: serviceComment.trim() || undefined,
        tags: selectedTags,
        resultPhotos,
        beforePhoto: beforePhoto || undefined,
        likes: 0,
        comments: [],
        shared: false,
        createdAt: serverTimestamp(),
      };

      // Salvar avaliação
      await setDoc(doc(db, 'barbershops', shopId, 'haircutReviews', appointmentId), reviewData);

      // Atualizar rating médio do barbeiro
      await updateDoc(doc(db, 'barbershops', shopId, 'staff', staffUid), {
        totalCuts: increment(1),
      });

      // Atualizar rating da barbearia
      await updateDoc(doc(db, 'barbershops', shopId), {
        reviewCount: increment(1),
      });

      Alert.alert(
        '✅ Avaliação enviada!',
        'Obrigado pelo feedback! Sua avaliação ajuda outros clientes.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível enviar a avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <Header
        title="Avaliar Corte"
        subtitle={`${serviceName} com ${staffName}`}
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Info do Barbeiro */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {staffPhoto ? (
              <Image
                source={{ uri: staffPhoto }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.primaryBg,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 28 }}>✂️</Text>
              </View>
            )}
            <View style={{ marginLeft: spacing.md }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: '600', color: colors.text }}>
                {staffName}
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                {shopName}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Avaliações */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.md }}>
            ⭐ Suas Avaliações
          </Text>

          {renderRatingStars(haircutRating, setHaircutRating, '1. Qualidade do Corte')}
          {renderRatingStars(serviceRating, setServiceRating, '2. Atendimento do Barbeiro')}
          {renderRatingStars(barbershopRating, setBarbershopRating, '3. Barbearia')}
        </AppCard>

        {/* Comentários */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>
            💬 Sobre o Corte
          </Text>
          <TextInput
            value={haircutComment}
            onChangeText={setHaircutComment}
            placeholder="Como ficou o resultado? Conte sua experiência..."
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: colors.bg,
              borderRadius: radius.md,
              padding: spacing.md,
              fontSize: fontSize.md,
              color: colors.text,
              textAlignVertical: 'top',
              minHeight: 80,
            }}
          />

          <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm }}>
            👤 Sobre o Atendimento
          </Text>
          <TextInput
            value={serviceComment}
            onChangeText={setServiceComment}
            placeholder="Como foi atendido pelo barbeiro?"
            multiline
            numberOfLines={2}
            style={{
              backgroundColor: colors.bg,
              borderRadius: radius.md,
              padding: spacing.md,
              fontSize: fontSize.md,
              color: colors.text,
              textAlignVertical: 'top',
              minHeight: 60,
            }}
          />
        </AppCard>

        {/* Tags */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>
            🏷️ Tags do Corte (máx. 5)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  marginRight: spacing.xs,
                  marginBottom: spacing.xs,
                  backgroundColor: selectedTags.includes(tag) ? colors.primary : colors.bg,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  borderColor: selectedTags.includes(tag) ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: selectedTags.includes(tag) ? colors.white : colors.text,
                  }}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </AppCard>

        {/* Compartilhar */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' }}>
            📝 Sua avaliação será pública e ajudará outros clientes a escolherem o melhor barbeiro.
          </Text>
        </AppCard>

        {/* Botão Enviar */}
        <AppButton
          title={loading ? 'Enviando...' : 'Enviar Avaliação ⭐'}
          onPress={submitReview}
          loading={loading}
          size="lg"
        />
      </ScrollView>
    </View>
  );
}
