/**
 * Serviço de IA para integração com APIs de agentes/IA
 * Suporta OpenAI, Google Gemini, e outros provedores
 */

import Constants from "expo-constants";

// Tipos para a API de IA
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProvider;
}

export type AIProvider = "openai" | "gemini" | "anthropic" | "custom";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

// Configuração padrão
const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-1.5-flash",
  anthropic: "claude-3-haiku-20240307",
  custom: "default",
};

class AIService {
  private config: AIConfig | null = null;

  /**
   * Inicializa o serviço de IA com configuração
   */
  initialize(config: AIConfig): void {
    this.config = {
      ...config,
      model: config.model || DEFAULT_MODELS[config.provider],
      maxTokens: config.maxTokens || 1024,
      temperature: config.temperature ?? 0.7,
    };
  }

  /**
   * Obtém a configuração atual
   */
  getConfig(): AIConfig | null {
    return this.config;
  }

  /**
   * Verifica se o serviço está configurado
   */
  isConfigured(): boolean {
    return this.config !== null && this.config.apiKey.length > 0;
  }

  /**
   * Envia mensagem para a API de IA
   */
  async chat(
    messages: AIMessage[],
    systemPrompt?: string,
  ): Promise<AIResponse> {
    if (!this.config) {
      throw new Error(
        "AI Service não configurado. Chame initialize() primeiro.",
      );
    }

    const { provider, apiKey, model, baseUrl, maxTokens, temperature } =
      this.config;

    // Adiciona system prompt se fornecido
    const allMessages = systemPrompt
      ? [{ role: "system" as const, content: systemPrompt }, ...messages]
      : messages;

    switch (provider) {
      case "openai":
        return this.callOpenAI(
          apiKey,
          model!,
          allMessages,
          maxTokens!,
          temperature!,
        );
      case "gemini":
        return this.callGemini(
          apiKey,
          model!,
          allMessages,
          maxTokens!,
          temperature!,
        );
      case "anthropic":
        return this.callAnthropic(
          apiKey,
          model!,
          allMessages,
          maxTokens!,
          temperature!,
        );
      case "custom":
        return this.callCustom(
          baseUrl!,
          apiKey,
          model!,
          allMessages,
          maxTokens!,
          temperature!,
        );
      default:
        throw new Error(`Provedor não suportado: ${provider}`);
    }
  }

  /**
   * Chamada para OpenAI API
   */
  private async callOpenAI(
    apiKey: string,
    model: string,
    messages: AIMessage[],
    maxTokens: number,
    temperature: number,
  ): Promise<AIResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI Error: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: data.model,
      provider: "openai",
    };
  }

  /**
   * Chamada para Google Gemini API
   */
  private async callGemini(
    apiKey: string,
    model: string,
    messages: AIMessage[],
    maxTokens: number,
    temperature: number,
  ): Promise<AIResponse> {
    // Converter mensagens para formato do Gemini
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find(
      (m) => m.role === "system",
    )?.content;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini Error: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      content: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      model,
      provider: "gemini",
    };
  }

  /**
   * Chamada para Anthropic API
   */
  private async callAnthropic(
    apiKey: string,
    model: string,
    messages: AIMessage[],
    maxTokens: number,
    temperature: number,
  ): Promise<AIResponse> {
    const systemPrompt = messages.find((m) => m.role === "system")?.content;
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages: nonSystemMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        system: systemPrompt,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Anthropic Error: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens:
          (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      model: data.model,
      provider: "anthropic",
    };
  }

  /**
   * Chamada para API customizada
   */
  private async callCustom(
    baseUrl: string,
    apiKey: string,
    model: string,
    messages: AIMessage[],
    maxTokens: number,
    temperature: number,
  ): Promise<AIResponse> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Custom API Error: ${error.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      content:
        data.choices?.[0]?.message?.content || data.response || data.content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
      model,
      provider: "custom",
    };
  }

  /**
   * Atalho para chat simples com uma única mensagem
   */
  async ask(question: string, systemPrompt?: string): Promise<string> {
    const response = await this.chat(
      [{ role: "user", content: question }],
      systemPrompt,
    );
    return response.content;
  }

  /**
   * Streaming de resposta (para APIs que suportam)
   * Nota: Retorna um AsyncGenerator para processar chunks
   */
  async *streamChat(
    messages: AIMessage[],
    systemPrompt?: string,
  ): AsyncGenerator<string> {
    if (!this.config) {
      throw new Error(
        "AI Service não configurado. Chame initialize() primeiro.",
      );
    }

    const { provider, apiKey, model, maxTokens, temperature } = this.config;

    // Por enquanto, apenas OpenAI suporta streaming nesta implementação
    if (provider !== "openai") {
      const response = await this.chat(messages, systemPrompt);
      yield response.content;
      return;
    }

    const allMessages = systemPrompt
      ? [{ role: "system" as const, content: systemPrompt }, ...messages]
      : messages;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI Error: ${error.error?.message || response.statusText}`,
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Não foi possível obter o stream de resposta");
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk
        .split("\n")
        .filter((line) => line.startsWith("data: "));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Ignora erros de parsing em chunks parciais
        }
      }
    }
  }
}

// Instância singleton do serviço
export const aiService = new AIService();

/**
 * Inicializa o serviço de IA com configurações do app
 */
export function initializeAIFromConfig(): void {
  const extra = Constants.expoConfig?.extra;

  // Tenta carregar configuração do app.json
  const provider = (extra?.AI_PROVIDER as AIProvider) || "openai";
  const apiKey = extra?.AI_API_KEY || "";
  const model = extra?.AI_MODEL;
  const baseUrl = extra?.AI_BASE_URL;
  const maxTokens = extra?.AI_MAX_TOKENS
    ? parseInt(extra.AI_MAX_TOKENS as string, 10)
    : 1024;
  const temperature = extra?.AI_TEMPERATURE
    ? parseFloat(extra.AI_TEMPERATURE as string)
    : 0.7;

  if (apiKey) {
    aiService.initialize({
      provider,
      apiKey,
      model,
      baseUrl,
      maxTokens,
      temperature,
    });
    console.log(`[AI] Serviço inicializado com provedor: ${provider}`);
  } else {
    console.warn(
      "[AI] API Key não configurada. Configure AI_API_KEY no app.json",
    );
  }
}

export default aiService;
