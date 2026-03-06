import { GoogleGenAI, Type } from "@google/genai";
import { getActiveGeminiKey } from "./keyService";

/**
 * Helper to get a fresh Gemini client with the latest key.
 * This ensures we use the key from localStorage if it's updated.
 */
const getClient = () => {
  const apiKey = getActiveGeminiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Chat with the RFP document context or generic chat.
 */
export const chatWithRFP = async (
  rfpText: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[], 
  newMessage: string
) => {
  let systemInstruction = '';
  
  if (rfpText && rfpText.trim().length > 0) {
    systemInstruction = `
      You are a helpful assistant for a proposal team. 
      You have access to the following RFP document. 
      Answer the user's questions strictly based on the provided RFP text.
      If the information is not in the RFP, say so clearly.
      
      RFP Context:
      """
      ${rfpText}
      """
    `;
  } else {
    systemInstruction = `
      You are a helpful, professional AI assistant for i-Partners, a digital agency specialized in AX (AI Experience).
      You assist users with web development strategies, creative insights, data analysis, and general consulting.
      Be concise, professional, and helpful. Use Korean language.
    `;
  }

  const chatSession = getClient().chats.create({
    model: "gemini-3-flash-preview", // Flash is faster for chat
    config: {
      systemInstruction: systemInstruction,
    },
    history: history
  });

  const result = await chatSession.sendMessage({ message: newMessage });
  return result.text;
};

/**
 * Generate YouTube channel insight and strategy consulting report.
 */
export const generateYoutubeInsight = async (channelData: any, videosData: any[]) => {
  const systemInstruction = `
    당신은 전문적인 유튜브 채널 컨설턴트입니다.
    제공된 유튜브 채널 정보와 최근 영상 데이터를 바탕으로 심층적인 채널 분석과 향후 운영 전략 컨설팅 리포트를 작성해주세요.
    
    리포트 구조:
    1. 채널 현황 요약 (강점 및 약점)
    2. 콘텐츠 성과 분석 (조회수, 참여도 기반 인기 요인 분석)
    3. 타겟 오디언스 및 해시태그/키워드 분석
    4. 향후 운영 전략 및 개선 제안 (구체적이고 실행 가능한 전략)
    
    전문적이고 분석적인 어조를 사용하며, Markdown 형식으로 가독성 좋게 작성해주세요.
  `;

  const prompt = `
    채널 정보:
    - 채널명: ${channelData.title}
    - 구독자 수: ${channelData.subscriberCount}
    - 총 조회수: ${channelData.viewCount}
    - 영상 수: ${channelData.videoCount}
    - 채널 설명: ${channelData.description}
    
    최근 영상 데이터 (최대 50개 요약):
    ${videosData.map(v => `- 제목: ${v.title} (조회수: ${v.viewCount}, 좋아요: ${v.likeCount}, 댓글: ${v.commentCount}, 쇼츠여부: ${v.isShorts ? 'O' : 'X'})`).join('\n')}
    
    위 데이터를 바탕으로 채널 분석 및 전략 컨설팅 리포트를 작성해 주세요.
  `;

  const response = await getClient().models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return response.text;
};

/**
 * Analyze content (URL or Text) and return structured insights.
 */
export const analyzeContentInsight = async (inputType: 'url' | 'text', content: string) => {
  const client = getClient();
  const prompt = inputType === 'url' 
    ? `다음 URL의 콘텐츠를 심층적으로 분석해주세요: ${content}`
    : `다음 텍스트 콘텐츠를 심층적으로 분석해주세요:\n\n${content}`;

  const tools = inputType === 'url' ? [{ urlContext: {} }] : undefined;

  const response = await client.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      tools: tools,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tldr: { type: Type.STRING, description: "긴 글을 3~4줄로 압축한 핵심 요약 (Executive Summary)" },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "글에서 추출한 주요 핵심 키워드 5~7개" },
          toneAndManner: { type: Type.STRING, description: "글의 톤앤매너 (예: 전문적인, 감성적인, 설득력 있는, 유머러스한 등)" },
          readability: { 
            type: Type.OBJECT, 
            properties: {
              score: { type: Type.INTEGER, description: "가독성 점수 (0~100, 100이 가장 읽기 쉬움)" },
              analysis: { type: Type.STRING, description: "가독성에 대한 상세 분석 (문장 길이, 어휘 난이도, 문단 구조, 전문 용어 사용 빈도 등 구체적인 이유)" }
            },
            required: ["score", "analysis"],
            description: "가독성 평가 및 상세 분석" 
          },
          targetAudience: { type: Type.ARRAY, items: { type: Type.STRING }, description: "이 글이 적합한 주요 타깃 독자층 3~4개" },
          actionableInsights: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "개선 제안 요약 제목" },
                description: { type: Type.STRING, description: "구체적인 개선 방법 및 이유 (어떻게 수정해야 하는지 상세히 설명)" },
                priority: { type: Type.STRING, description: "우선순위 (높음, 중간, 낮음)" }
              },
              required: ["title", "description", "priority"]
            }, 
            description: "콘텐츠 질을 높이기 위해 보완할 점이나 개선 제안 3~5개" 
          }
        },
        required: ["tldr", "keywords", "toneAndManner", "readability", "targetAudience", "actionableInsights"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate content insight.");
  }

  return JSON.parse(response.text);
};
