import { GoogleGenAI, Type } from "@google/genai";
import { ChartConfig, DataModel, ChartType, AggregationType } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are an expert data analyst and UI engineer. 
Your goal is to analyze dataset schemas and suggest meaningful visualizations (Charts or KPIs).
Output must be strictly JSON.
`;

// Schema for the ChartConfig response
const chartSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short title for the chart" },
          description: { type: Type.STRING, description: "Explanation of why this insight is useful" },
          type: { type: Type.STRING, enum: ["BAR", "LINE", "AREA", "PIE", "KPI"] },
          xAxisKey: { type: Type.STRING, description: "The categorical column name for the X Axis (Dimension)" },
          dataKey: { type: Type.STRING, description: "The numeric column name for the data (Metric)" },
          aggregation: { type: Type.STRING, enum: ["SUM", "COUNT", "AVERAGE", "NONE"] },
        },
        required: ["title", "type", "xAxisKey", "dataKey", "aggregation", "description"]
      }
    }
  },
  required: ["suggestions"]
};

export const analyzeDataAndSuggestKPIs = async (model: DataModel): Promise<ChartConfig[]> => {
  const ai = getAI();
  
  // Prepare a context summary
  const context = `
    I have a dataset named "${model.name}".
    The columns are: ${model.columns.join(', ')}.
    Numeric columns: ${model.numericColumns.join(', ')}.
    Categorical columns: ${model.categoricalColumns.join(', ')}.
    
    Here are the first 3 rows of data for context:
    ${JSON.stringify(model.data.slice(0, 3))}

    Please suggest 4 to 6 meaningful Key Performance Indicators (KPIs) and Charts that would make a great executive dashboard.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: chartSchema
      }
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    
    return result.suggestions.map((s: any, index: number) => ({
      ...s,
      id: `suggested-${index}-${Date.now()}`,
      color: '#4f46e5' // Default indigo
    }));

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [];
  }
};

export const generateChartFromPrompt = async (model: DataModel, prompt: string): Promise<ChartConfig | null> => {
  const ai = getAI();

  const context = `
    Dataset Context:
    Columns: ${model.columns.join(', ')}.
    Numeric: ${model.numericColumns.join(', ')}.
    Categorical: ${model.categoricalColumns.join(', ')}.
    
    User Request: "${prompt}"
    
    Create a single chart configuration that best satisfies the user request.
  `;

  // Modified schema for single item return wrapped in object
  const singleChartSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        type: { type: Type.STRING, enum: ["BAR", "LINE", "AREA", "PIE", "KPI"] },
        xAxisKey: { type: Type.STRING },
        dataKey: { type: Type.STRING },
        aggregation: { type: Type.STRING, enum: ["SUM", "COUNT", "AVERAGE", "NONE"] },
    },
    required: ["title", "type", "xAxisKey", "dataKey", "aggregation"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: singleChartSchema
      }
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    
    return {
      ...result,
      id: `custom-${Date.now()}`,
      color: '#10b981' // Emerald
    };

  } catch (error) {
    console.error("Gemini Custom Generation Error:", error);
    return null;
  }
};