/**
 * Hook personalizado para usar o serviço de IA
 * Facilita a integração com componentes React
 */

import { useCallback, useEffect, useState } from "react";
import aiService, {
  AIMessage,
  AIProvider,
  AIResponse,
  initializeAIFromConfig,
} from "../services/ai";

export interface UseAIOptions {
  /** System prompt padrão para todas as chamadas */
  systemPrompt?: string;
  /** Callback quando houver erro */
  onError?: (error: Error) => void;
  /** Callback quando receber resposta */
  onSuccess?: (response: AIResponse) => void;
}

export interface UseAIReturn {
  /** Envia mensagem para a IA */
  chat: (messages: AIMessage[]) => Promise<AIResponse | null>;
  /** Envia uma pergunta simples */
  ask: (question: string) => Promise<string | null>;
  /** Streaming de resposta */
  streamChat: (
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
  ) => Promise<void>;
  /** Histórico de mensagens */
  history: AIMessage[];
  /** Limpa o histórico */
  clearHistory: () => void;
  /** Estado de carregamento */
  isLoading: boolean;
  /** Último erro */
  error: Error | null;
  /** Última resposta */
  lastResponse: AIResponse | null;
  /** Verifica se o serviço está configurado */
  isConfigured: boolean;
  /** Configura o serviço manualmente */
  configure: (config: {
    provider: AIProvider;
    apiKey: string;
    model?: string;
  }) => void;
}

/**
 * Hook para usar o serviço de IA
 */
export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const { systemPrompt, onError, onSuccess } = options;

  const [history, setHistory] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [isConfigured, setIsConfigured] = useState(aiService.isConfigured());

  // Inicializa o serviço se ainda não estiver configurado
  useEffect(() => {
    if (!aiService.isConfigured()) {
      initializeAIFromConfig();
      setIsConfigured(aiService.isConfigured());
    }
  }, []);

  /**
   * Envia mensagem para a IA
   */
  const chat = useCallback(
    async (messages: AIMessage[]): Promise<AIResponse | null> => {
      if (!aiService.isConfigured()) {
        const err = new Error("Serviço de IA não configurado");
        setError(err);
        onError?.(err);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Adiciona mensagens ao histórico
        setHistory((prev) => [...prev, ...messages]);

        const response = await aiService.chat(messages, systemPrompt);

        // Adiciona resposta ao histórico
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: response.content },
        ]);

        setLastResponse(response);
        onSuccess?.(response);

        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [systemPrompt, onError, onSuccess],
  );

  /**
   * Envia uma pergunta simples
   */
  const ask = useCallback(
    async (question: string): Promise<string | null> => {
      const response = await chat([{ role: "user", content: question }]);
      return response?.content ?? null;
    },
    [chat],
  );

  /**
   * Streaming de resposta
   */
  const streamChat = useCallback(
    async (
      messages: AIMessage[],
      onChunk: (chunk: string) => void,
    ): Promise<void> => {
      if (!aiService.isConfigured()) {
        const err = new Error("Serviço de IA não configurado");
        setError(err);
        onError?.(err);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Adiciona mensagens ao histórico
        setHistory((prev) => [...prev, ...messages]);

        let fullContent = "";
        for await (const chunk of aiService.streamChat(
          messages,
          systemPrompt,
        )) {
          fullContent += chunk;
          onChunk(chunk);
        }

        // Adiciona resposta completa ao histórico
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: fullContent },
        ]);

        setLastResponse({
          content: fullContent,
          model: aiService.getConfig()?.model || "unknown",
          provider: aiService.getConfig()?.provider || "openai",
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [systemPrompt, onError],
  );

  /**
   * Limpa o histórico
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastResponse(null);
    setError(null);
  }, []);

  /**
   * Configura o serviço manualmente
   */
  const configure = useCallback(
    (config: { provider: AIProvider; apiKey: string; model?: string }) => {
      aiService.initialize(config);
      setIsConfigured(true);
    },
    [],
  );

  return {
    chat,
    ask,
    streamChat,
    history,
    clearHistory,
    isLoading,
    error,
    lastResponse,
    isConfigured,
    configure,
  };
}

/**
 * Hook simplificado para chat com IA
 * Mantém o histórico automaticamente
 */
export function useAIChat(systemPrompt?: string) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!aiService.isConfigured()) {
      initializeAIFromConfig();
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string): Promise<string | null> => {
      if (!aiService.isConfigured()) {
        setError(new Error("Serviço de IA não configurado"));
        return null;
      }

      setIsLoading(true);
      setError(null);

      // Adiciona mensagem do usuário
      const userMessage: AIMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await aiService.chat(
          [...messages, userMessage],
          systemPrompt,
        );

        // Adiciona resposta da IA
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.content },
        ]);

        return response.content;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, systemPrompt],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error,
    isConfigured: aiService.isConfigured(),
  };
}

export default useAI;
