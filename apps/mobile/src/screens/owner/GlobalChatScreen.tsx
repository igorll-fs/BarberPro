/**
 * GlobalChatScreen - Chat global para donos e funcionários
 * Lobby por país e mundial com tradução automática
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { colors, spacing, fontSize, radius, globalStyles } from '../../theme';
import { Header, AppCard, Avatar } from '../../components';
import { useUser } from '../../store/user';
import type { GlobalChatRoom, GlobalChatMessage } from '../../types/models';

// Lista de países disponíveis
const COUNTRIES = [
  { code: 'WORLDWIDE', name: '🌍 Mundial', flag: '🌍' },
  { code: 'BR', name: '🇧🇷 Brasil', flag: '🇧🇷' },
  { code: 'PT', name: '🇵🇹 Portugal', flag: '🇵🇹' },
  { code: 'US', name: '🇺🇸 Estados Unidos', flag: '🇺🇸' },
  { code: 'ES', name: '🇪🇸 Espanha', flag: '🇪🇸' },
  { code: 'AR', name: '🇦🇷 Argentina', flag: '🇦🇷' },
  { code: 'MX', name: '🇲🇽 México', flag: '🇲🇽' },
  { code: 'CO', name: '🇨🇴 Colômbia', flag: '🇨🇴' },
  { code: 'CL', name: '🇨🇱 Chile', flag: '🇨🇱' },
  { code: 'PE', name: '🇵🇪 Peru', flag: '🇵🇪' },
  { code: 'UY', name: '🇺🇾 Uruguai', flag: '🇺🇾' },
  { code: 'PY', name: '🇵🇾 Paraguai', flag: '🇵🇾' },
];

// Mapeamento de idiomas por país
const COUNTRY_LANGUAGES: Record<string, string> = {
  BR: 'pt',
  PT: 'pt',
  US: 'en',
  ES: 'es',
  AR: 'es',
  MX: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  UY: 'es',
  PY: 'es',
};

export default function GlobalChatScreen() {
  const { uid, name, photoUrl, role, shopId } = useUser();
  const [selectedCountry, setSelectedCountry] = useState('WORLDWIDE');
  const [messages, setMessages] = useState<GlobalChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCountry, setUserCountry] = useState('BR');
  const flatListRef = useRef<FlatList>(null);

  // Verificar se usuário tem permissão (apenas donos e funcionários)
  useEffect(() => {
    if (role === 'cliente') {
      Alert.alert(
        'Acesso Restrito',
        'Esta área é exclusiva para donos e funcionários de barbearias.',
        [{ text: 'OK' }]
      );
    }
  }, [role]);

  // Carregar mensagens do chat
  useEffect(() => {
    if (!uid || role === 'cliente') return;

    const roomId = selectedCountry === 'WORLDWIDE' ? 'worldwide' : `country_${selectedCountry}`;
    
    const messagesQuery = query(
      collection(db, 'globalChat', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: GlobalChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as GlobalChatMessage);
      });
      setMessages(msgs);
      
      // Scroll para a última mensagem
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [uid, selectedCountry, role]);

  // Detectar idioma do usuário
  useEffect(() => {
    // Aqui poderia usar geolocalização ou pegar do device
    setUserCountry('BR'); // Default Brasil
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || !uid || role === 'cliente') return;

    setLoading(true);
    try {
      const roomId = selectedCountry === 'WORLDWIDE' ? 'worldwide' : `country_${selectedCountry}`;
      const messageData: Omit<GlobalChatMessage, 'id'> = {
        roomId,
        fromUid: uid,
        fromName: name || 'Usuário',
        fromPhoto: photoUrl ?? undefined,
        fromCountry: userCountry,
        fromRole: role as 'dono' | 'funcionario',
        text: inputText.trim(),
        textOriginal: inputText.trim(),
        language: COUNTRY_LANGUAGES[userCountry] || 'pt',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'globalChat', roomId, 'messages'), messageData);

      // Atualizar última mensagem da sala
      await updateDoc(doc(db, 'globalChat', 'rooms', roomId), {
        lastMessage: inputText.trim(),
        lastMessageAt: serverTimestamp(),
      });

      setInputText('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedText = (message: GlobalChatMessage): string => {
    const userLang = COUNTRY_LANGUAGES[userCountry] || 'pt';
    
    // Se a mensagem já está no idioma do usuário, retorna original
    if (message.language === userLang) {
      return message.text;
    }
    
    // Se existe tradução para o idioma do usuário, usa ela
    if (message.translations?.[userLang]) {
      return message.translations[userLang];
    }
    
    // Retorna texto original (tradução será feita via Cloud Function)
    return message.text;
  };

  const renderMessage = ({ item }: { item: GlobalChatMessage }) => {
    const isMe = item.fromUid === uid;
    const translatedText = getTranslatedText(item);
    const wasTranslated = translatedText !== item.textOriginal;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          marginVertical: spacing.xs,
          maxWidth: '80%',
        }}
      >
        {!isMe && (
          <Avatar
            uri={item.fromPhoto}
            name={item.fromName}
            size="sm"
            style={{ marginRight: spacing.xs }}
          />
        )}
        
        <View
          style={{
            backgroundColor: isMe ? colors.primary : colors.cardBg,
            borderRadius: radius.lg,
            padding: spacing.md,
            borderBottomLeftRadius: isMe ? radius.lg : spacing.xs,
            borderBottomRightRadius: isMe ? spacing.xs : radius.lg,
          }}
        >
          {!isMe && (
            <Text
              style={{
                fontSize: fontSize.xs,
                color: colors.primary,
                fontWeight: '600',
                marginBottom: 2,
              }}
            >
              {item.fromName} • {COUNTRIES.find(c => c.code === item.fromCountry)?.flag || '🏳️'} {item.fromRole === 'dono' ? '👑 Dono' : '✂️ Barbeiro'}
            </Text>
          )}
          
          <Text
            style={{
              fontSize: fontSize.md,
              color: isMe ? colors.white : colors.text,
            }}
          >
            {translatedText}
          </Text>
          
          {wasTranslated && (
            <Text
              style={{
                fontSize: fontSize.xs,
                color: isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted,
                marginTop: 2,
                fontStyle: 'italic',
              }}
            >
              🌐 Traduzido do {item.language?.toUpperCase()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderCountrySelector = () => (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={COUNTRIES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCountry(item.code)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              marginRight: spacing.sm,
              backgroundColor: selectedCountry === item.code ? colors.primary : colors.bg,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: selectedCountry === item.code ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: selectedCountry === item.code ? '600' : '400',
                color: selectedCountry === item.code ? colors.white : colors.text,
              }}
            >
              {item.flag} {item.name.split(' ')[1]}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (role === 'cliente') {
    return (
      <View style={globalStyles.screen}>
        <Header title="Chat Global" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
          <Text style={{ fontSize: 48, marginBottom: spacing.md }}>🔒</Text>
          <Text style={{ fontSize: fontSize.xl, fontWeight: '600', color: colors.text, textAlign: 'center' }}>
            Acesso Restrito
          </Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
            Esta área é exclusiva para donos e funcionários de barbearias.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header
        title="Chat Global"
        subtitle={COUNTRIES.find(c => c.code === selectedCountry)?.name || 'Chat'}
      />
      
      {renderCountrySelector()}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: spacing.md }}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.cardBg,
        }}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
          style={{
            flex: 1,
            backgroundColor: colors.bg,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            fontSize: fontSize.md,
            color: colors.text,
            maxHeight: 100,
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
          style={{
            marginLeft: spacing.sm,
            padding: spacing.sm,
            backgroundColor: inputText.trim() ? colors.primary : colors.border,
            borderRadius: radius.full,
          }}
        >
          <Text style={{ fontSize: 20 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
