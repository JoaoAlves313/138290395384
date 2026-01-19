
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) return "Adicione uma descrição incrível para seu produto!";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma descrição curta, vendedora e atraente no estilo Shopee para o produto: "${productName}". Use emojis e destaque benefícios. Máximo 150 caracteres.`,
    });
    
    return response.text || "Descrição não gerada.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Erro ao gerar descrição. Tente novamente.";
  }
};
