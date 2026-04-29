import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import type { ClassificationResult, WasteCategory } from '../types';

const VALID_CATEGORIES: WasteCategory[] = ['wet', 'dry', 'recyclable', 'hazardous', 'ewaste']
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    category: {
      type: SchemaType.STRING,
      description: "One of: wet, dry, recyclable, hazardous, ewaste",
    },
    label: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    explanation: { type: SchemaType.STRING },
    tip: { type: SchemaType.STRING },
  },
  required: ["category", "label", "confidence", "explanation", "tip"],
};

const CLASSIFICATION_PROMPT = `You are a waste classification assistant for an Indian municipal waste segregation app.
Analyze the image and classify the waste item into exactly one of these five categories:
- wet: food waste, organic matter, garden waste
- dry: non-recyclable dry waste, dirty packaging
- recyclable: clean plastics, glass, metals, paper/cardboard
- hazardous: batteries, chemicals, paint, medical waste
- ewaste: electronics, cables, devices, circuit boards`;

export async function classifyWaste(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'
): Promise<ClassificationResult | null> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      console.error('[gemini] Missing API Key')
      return null
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    })

    const result = await model.generateContent([
      CLASSIFICATION_PROMPT,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ])

    const text = result.response.text()
    return JSON.parse(text) as ClassificationResult

  } catch (err: any) {
    if (err.message?.includes('429')) {
      console.error('[gemini] Quota exceeded. Lite models still have limits on the free tier!');
    } else {
      console.error('[gemini] Classification failed:', err);
    }
    return null
  }
}