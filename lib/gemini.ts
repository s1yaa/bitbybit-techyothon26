import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ClassificationResult, WasteCategory } from '../types'

const VALID_CATEGORIES: WasteCategory[] = ['wet', 'dry', 'recyclable', 'hazardous', 'ewaste']

const CLASSIFICATION_PROMPT = `You are a waste classification assistant for an Indian municipal waste segregation app.
Analyze the image and classify the waste item into exactly one of these five categories:
- wet: food waste, organic matter, garden waste
- dry: non-recyclable dry waste, dirty packaging
- recyclable: clean plastics, glass, metals, paper/cardboard
- hazardous: batteries, chemicals, paint, medical waste
- ewaste: electronics, cables, devices, circuit boards

Respond ONLY with valid JSON — no markdown, no code fences, no extra text — matching this exact shape:
{
  "category": "<one of: wet | dry | recyclable | hazardous | ewaste>",
  "label": "<specific item name, e.g. Plastic bottle (PET)>",
  "confidence": <float between 0 and 1>,
  "explanation": "<1–2 sentences about why this classification was chosen>",
  "tip": "<one actionable disposal tip>"
}`

export async function classifyWaste(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'
): Promise<ClassificationResult | null> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      console.error('[gemini] Missing EXPO_PUBLIC_GEMINI_API_KEY')
      return null
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      CLASSIFICATION_PROMPT,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ])

    const text = result.response.text().trim()

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean) as Partial<ClassificationResult>

    if (
      !parsed.category ||
      !VALID_CATEGORIES.includes(parsed.category) ||
      typeof parsed.confidence !== 'number' ||
      !parsed.label ||
      !parsed.explanation ||
      !parsed.tip
    ) {
      console.error('[gemini] Invalid response shape:', parsed)
      return null
    }

    return {
      category: parsed.category,
      label: parsed.label,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      explanation: parsed.explanation,
      tip: parsed.tip,
    }
  } catch (err) {
    console.error('[gemini] Classification failed:', err)
    return null
  }
}