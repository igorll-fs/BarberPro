/**
 * GlobalFeedScreen - Feed global de fotos de cortes (Instagram-like)
 * Disponível para todos, mas apenas donos/funcionários podem postar
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, Avatar } from '../../components';
import { useUser } from '../../store/user';
import { useNavigation } from '@react-navigation/native';
import type { GlobalFeedPost, FeedComment } from '../../types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GlobalFeedScreen() {
  const { uid, name, photoUrl, role, shopId } = useUser();
  const navigation = useNavigation();
  const [posts, setPosts] = useState<GlobalFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');

  // Carregar posts do feed
  useEffect(() => {
    const postsQuery = query(
      collection(db, 'globalFeed', 'posts', 'all'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsList: GlobalFeedPost[] = [];
      snapshot.forEach((doc) => {
        postsList.push({ id: doc.id, ...doc.data() } as GlobalFeedPost);
      });
      setPosts(postsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId: string) => {
    if (!uid) {
      Alert.alert('Login necessário', 'Faça login para curtir posts');
      return;
    }

    const postRef = doc(db, 'globalFeed', 'posts', 'all', postId);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;

    const hasLiked = post.likedBy?.includes(uid);

    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(uid),
        });
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const handleSave = async (post: GlobalFeedPost) => {
    if (!uid) {
      Alert.alert('Login necessário', 'Faça login para salvar posts');
      return;
    }

    try {
      // Salvar na coleção do usuário
      await addDoc(collection(db, 'users', uid, 'savedPosts'), {
        postId: post.id,
        postData: post,
        savedAt: serverTimestamp(),
      });

      // Incrementar contador de saves
      await updateDoc(doc(db, 'globalFeed', 'posts', 'all', post.id), {
        saves: increment(1),
      });

      Alert.alert('✅ Salvo!', 'Post adicionado à sua coleção');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o post');
    }
  };

  const handleFollowBarber = async (barberUid: string, barberName: string) => {
    if (!uid || role === 'cliente') {
      Alert.alert('Acesso restrito', 'Apenas donos e funcionários podem seguir outros barbeiros');
      return;
    }

    try {
      await addDoc(collection(db, 'social', 'follows', 'relationships'), {
        followerUid: uid,
        followerName: name,
        followerPhoto: photoUrl,
        followingUid: barberUid,
        followingName: barberName,
        createdAt: serverTimestamp(),
      });

      Alert.alert('✅ Seguindo!', `Você está seguindo ${barberName}`);
    } catch (error) {
      console.error('Erro ao seguir:', error);
      Alert.alert('Erro', 'Não foi possível seguir este barbeiro');
    }
  };

  const renderPost = ({ item }: { item: GlobalFeedPost }) => {
    const isLiked = item.likedBy?.includes(uid || '');
    const isVideo = item.type === 'video';
    const isGallery = item.type === 'gallery';

    return (
      <View
        style={{
          backgroundColor: colors.cardBg,
          marginBottom: spacing.md,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        {/* Header do Post */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.md,
          }}
        >
          <Avatar uri={item.authorPhoto} name={item.authorName} size="md" />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text }}>
              {item.authorName}
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              ✂️ {item.authorShopName} • {item.authorRole === 'dono' ? '👑 Dono' : 'Barbeiro'}
            </Text>
          </View>
          {role !== 'cliente' && item.authorUid !== uid && (
            <TouchableOpacity
              onPress={() => handleFollowBarber(item.authorUid, item.authorName)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                backgroundColor: colors.primary,
                borderRadius: radius.md,
              }}
            >
              <Text style={{ fontSize: fontSize.sm, color: colors.white, fontWeight: '600' }}>
                Seguir
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mídia */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.mediaUrls[0] }}
            style={{
              width: SCREEN_WIDTH - 32,
              height: SCREEN_WIDTH - 32,
              resizeMode: 'cover',
            }}
          />
          {isVideo && (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -25 }, { translateY: -25 }],
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24 }}>▶️</Text>
            </View>
          )}
          {isGallery && item.mediaUrls.length > 1 && (
            <View
              style={{
                position: 'absolute',
                top: spacing.sm,
                right: spacing.sm,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: radius.md,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              }}
            >
              <Text style={{ color: colors.white, fontSize: fontSize.sm }}>
                1/{item.mediaUrls.length}
              </Text>
            </View>
          )}
        </View>

        {/* Ações */}
        <View
          style={{
            flexDirection: 'row',
            padding: spacing.md,
            paddingBottom: spacing.sm,
          }}
        >
          <TouchableOpacity onPress={() => handleLike(item.id)} style={{ marginRight: spacing.md }}>
            <Text style={{ fontSize: 28 }}>{isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: spacing.md }}>
            <Text style={{ fontSize: 28 }}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: spacing.md }}>
            <Text style={{ fontSize: 28 }}>📤</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => handleSave(item)}>
            <Text style={{ fontSize: 28 }}>🔖</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas */}
        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xs }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.text, fontWeight: '600' }}>
            {item.likes} curtidas • {item.comments} comentários • {item.saves} salvos
          </Text>
        </View>

        {/* Legenda */}
        {item.caption && (
          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
            <Text style={{ fontSize: fontSize.md, color: colors.text }}>
              <Text style={{ fontWeight: '600' }}>{item.authorName} </Text>
              {item.caption}
            </Text>
            {item.hashtags && item.hashtags.length > 0 && (
              <Text style={{ fontSize: fontSize.sm, color: colors.primary, marginTop: 2 }}>
                {item.hashtags.map(tag => `#${tag}`).join(' ')}
              </Text>
            )}
          </View>
        )}

        {/* Localização */}
        {item.location && (
          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              📍 {item.location}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Header
        title="Feed Global"
        subtitle="Inspire-se com os melhores cortes"
        rightIcon="➕"
        onRightPress={() => {
          if (role === 'dono' || role === 'funcionario') {
            // Navegar para tela de criar post
            Alert.alert('Nova Publicação', 'Funcionalidade em desenvolvimento');
          } else {
            Alert.alert('Acesso restrito', 'Apenas donos e funcionários podem publicar');
          }
        }}
      />

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.cardBg,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('feed')}
          style={{
            flex: 1,
            paddingVertical: spacing.md,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'feed' ? colors.primary : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: activeTab === 'feed' ? '600' : '400',
              color: activeTab === 'feed' ? colors.primary : colors.textSecondary,
            }}
          >
            📰 Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('saved')}
          style={{
            flex: 1,
            paddingVertical: spacing.md,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'saved' ? colors.primary : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: activeTab === 'saved' ? '600' : '400',
              color: activeTab === 'saved' ? colors.primary : colors.textSecondary,
            }}
          >
            🔖 Salvos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: spacing.xxl }}>
            <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📷</Text>
            <Text style={{ fontSize: fontSize.lg, color: colors.text, textAlign: 'center' }}>
              Nenhum post ainda
            </Text>
            <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
              Seja o primeiro a compartilhar seu trabalho!
            </Text>
          </View>
        }
      />
    </View>
  );
}
