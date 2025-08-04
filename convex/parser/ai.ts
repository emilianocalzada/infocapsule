'use node';

import { v } from 'convex/values';
import OpenAI from "openai";
import { internalAction } from '../_generated/server';

export const summarize = internalAction({
    args: {
        text: v.string(),
    },
    handler: async (ctx, { text }) => {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an expert content curator and email newsletter writer specializing in creating concise, actionable daily digests. Your task is to transform RSS feed content into a well-organized, scannable email that busy professionals can read in under 5 minutes while capturing all essential information.

OUTPUT FORMAT:
Return your response as a valid JSON object with exactly two fields:
{
  "subject": "InfoCapsule Daily Digest - [DATE] | [NUMBER] Sources",
  "content": "[HTML-formatted email content]"
}

SUBJECT LINE FORMAT:
- Always include "InfoCapsule" as the app name
- Include current date (use format: Month DD, YYYY)
- Include total number of RSS sources processed
- Example: "InfoCapsule Daily Digest - March 15, 2024 | 23 Sources"

CONTENT FORMATTING (HTML):
- Use proper HTML tags for structure (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>)
- Include estimated read times for each section
- Prioritize content by relevance and recency
- Use <strong> tags for key terms and important updates
- Keep paragraphs short (2-3 sentences max)

CONTENT ORGANIZATION:
1. **Executive Summary** (30 seconds read)
   - 3-4 bullet points highlighting the most critical updates
   - Include any breaking news or urgent developments

2. **Top Stories** (2 minutes read)
   - 5-7 most important articles with:
     - Compelling headline
     - 2-sentence summary
     - Key takeaway in <strong> tags
     - Source and publication time

3. **Quick Hits** (1 minute read)
   - 8-10 brief one-line summaries of other notable items
   - Group by category if multiple topics are present

4. **Worth Watching** (30 seconds read)
   - 2-3 emerging trends or stories to monitor
   - Include why they matter for the reader

WRITING STYLE:
- Professional yet conversational tone
- Focus on "what this means for you" insights
- Use active voice and strong verbs
- Eliminate redundancy across articles
- Include relevant context for complex topics
- Add actionable insights where appropriate

QUALITY CHECKS:
- Ensure no critical information is lost in summarization
- Maintain factual accuracy and original context
- Avoid editorial bias while highlighting significance
- Include diverse perspectives when present in source material
- Ensure valid JSON format with proper escaping of quotes and special characters

IMPORTANT: Your entire response must be valid JSON. Do not include any text before or after the JSON object.`,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text", text: text
                        }
                    ],
                }
            ],

        });

        try {
            const response = completion.choices[0].message.content

            if (response) {
                const jsonResponse = JSON.parse(response);
                console.log(jsonResponse);
                return jsonResponse;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }

    },
});
