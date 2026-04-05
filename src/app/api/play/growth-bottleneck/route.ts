import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    const body = await req.json();
    const { revenue, team_size, industry, primary_challenge } = body;

    if (!revenue || !team_size || !industry || !primary_challenge) {
      return NextResponse.json(
        { error: 'Missing required fields: revenue, team_size, industry, primary_challenge' },
        { status: 400 }
      );
    }

    const prompt = `You are a business growth strategist. Analyze the following business profile and identify their top 3 growth bottlenecks, then provide specific actionable recommendations to overcome each.

Business Profile:
- Annual Revenue: ${revenue}
- Team Size: ${team_size}
- Industry: ${industry}
- Primary Challenge: ${primary_challenge}

Provide your analysis in the following JSON format:
{
  "bottlenecks": [
    {
      "rank": 1,
      "title": "Bottleneck name",
      "description": "Why this is limiting growth",
      "impact": "high|medium|low",
      "recommendations": [
        "Specific actionable step 1",
        "Specific actionable step 2",
        "Specific actionable step 3"
      ],
      "timeline": "Expected time to see results"
    }
  ],
  "priority_action": "The single most important thing to do right now",
  "growth_potential": "Estimated growth potential if bottlenecks are resolved"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      analysis: result,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error('Growth bottleneck analysis error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
