import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient } from '@/lib/openai';

const InputSchema = z.object({
  businessType: z.string().min(1),
  teamSize: z.string().min(1),
  tools: z.string().min(1),
  bottleneck: z.string().min(1),
});

const OutputSchema = z.object({
  summary: z.string(),
  top_gaps: z.array(z.string()).length(3),
  quick_win: z.string(),
  system_score: z.number().min(1).max(100),
  premium_teaser: z.string(),
});

const SYSTEM_PROMPT = `You are an AI business systems advisor.
Your job is to identify workflow and automation gaps in small and mid-sized businesses.
Be commercially practical, direct, and concise.
Do not use buzzwords.
Do not give generic AI advice.

Return ONLY valid JSON matching this exact shape:
{
  "summary": "short business diagnosis (2-3 sentences)",
  "top_gaps": ["gap 1", "gap 2", "gap 3"],
  "quick_win": "best first automation move (1-2 sentences)",
  "system_score": <number 1-100 where 100 is maximum chaos>,
  "premium_teaser": "one specific premium-only insight that hints at a deeper systemic issue without fully explaining it"
}

Base your answer only on the user's inputs. No generic advice.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = InputSchema.parse(body);

    const userMessage = `Business type: ${input.businessType}
Team size: ${input.teamSize}
Tools used: ${input.tools}
Biggest bottleneck: ${input.bottleneck}`;

    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content from OpenAI');

    const parsed = JSON.parse(content);
    const validated = OutputSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (err) {
    console.error('automation-gaps API error:', err);
    return NextResponse.json(
      { error: 'Failed to generate diagnosis' },
      { status: 500 }
    );
  }
}
