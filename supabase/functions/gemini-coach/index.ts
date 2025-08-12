// Deno Deploy / Supabase Edge Function
// Name: gemini-coach
// Requires secret: GEMINI_API_KEY

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const MODEL = "gemini-1.5-flash";

interface AnalyzeBody {
  mode: "analyze" | "interview_review" | "cover_letter";
  resume?: string;
  job?: string;
  question?: string;
  answer?: string;
  company?: string;
  tone?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY secret");

    const body = (await req.json()) as AnalyzeBody;
    if (!body || !body.mode) throw new Error("Invalid request body");

    const prompt = buildPrompt(body);

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, topK: 40, topP: 0.95, maxOutputTokens: 1200 },
        }),
      }
    );

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Gemini error ${resp.status}: ${t}`);
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

function buildPrompt(b: AnalyzeBody): string {
  switch (b.mode) {
    case "analyze":
      return `You are an expert career coach. Analyze the following resume against the job description. Output sections: Summary, Keyword Match (top keywords found/missing), Skill Gaps, Bullet Improvements (rewrite 3 bullets with measurable impact), ATS Tips.
Resume:\n${b.resume}\n\nJob Description:\n${b.job}`;
    case "interview_review":
      return `You are an interview coach. Review the candidate's answer${b.question ? ` to: ${b.question}` : ""}. Provide: Strengths, Specific Improvements, Suggested Structure (STAR), and a Polished Version.
Answer:\n${b.answer}`;
    case "cover_letter":
      return `Write a concise, tailored cover letter in a ${b.tone ?? "professional"} tone for ${b.company || "the company"}. Base it on the resume and job description. Keep under 350 words. Use clear paragraphs and a strong closing.
Resume:\n${b.resume}\n\nJob Description:\n${b.job}`;
    default:
      return "";
  }
}
