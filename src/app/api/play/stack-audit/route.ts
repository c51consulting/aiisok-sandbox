import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient } from '@/lib/openai';

const InputSchema = z.object({
  tools: z.string().min(1),
  monthlyCost: z.string().min(1),
  teamSize: z.string().min(1),
  missingOutcomes: z.string().min(1),
});

const OutputSchema = z.object({
  summary: z.string(),
  redundant_tools: z.array(z.string()).min(1).max(5),
  missing_integrations: z.array(z.string()).length(3),
  quick_win: z.string(),
  estimated_monthly_waste: z.string(),
  system_score: z.number().min(1).max(100),
  premium_teaser: z.string(),
  priority_fixes: z.array(z.string()).length(3),
});

const SYSTEM_PROMPT = `You are a SaaS stack auditor for small and mid-sized businesses.
Your job is to identify tool redundancy, missing integrations, and cost waste.
Be direct, specific, and commercially practical.
Do not use buzzwords. No generic advice.

Return ONLY valid JSON matching this exact shape:
{
  "summary": "2-3 sentence diagnosis of the stack",
  "redundant_tools": ["tool that overlaps with another", ...up to 5],
  "missing_integrations": ["missing connection 1", "missing connection 2", "missing connection 3"],
  "quick_win": "the single best thing to do this week to reduce friction or cost",
  "estimated_monthly_waste": "e.g. $200-400/month in overlapping subscriptions",
  "system_score": <number 1-100 where 100 is maximum bloat/dysfunction>,
  "premium_teaser": "one specific premium-only insight about a deeper stack inefficiency",
  "priority_fixes": ["fix 1 with specific tool recommendation", "fix 2", "fix 3"]
}

Base your answer only on the user's inputs.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = InputSchema.parse(body);

    const userMessage = `Tools used: ${input.tools}
Estimated monthly cost: ${input.monthlyCost}
Team size: ${input.teamSize}
Outcomes not being achieved: ${input.missingOutcomes}`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('No response from OpenAI');

    const parsed = OutputSchema.parse(JSON.parse(raw));
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Stack audit play error:', err);
    return NextResponse.json(
      { error: 'Failed to generate result' },
      { status: 500 }
    );
  }
}
