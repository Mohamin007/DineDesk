import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });

const migrateLegacyEnv = (name: string) => {
  const legacyName = `VITE_${name}`;
  if (!process.env[name] && process.env[legacyName]) {
    process.env[name] = process.env[legacyName];
    console.warn(`[env] Migrated ${legacyName} -> ${name}`);
  }
};

["GROQ_API_KEY", "EXA_API_KEY"].forEach(migrateLegacyEnv);

console.log("Groq key exists:", !!process.env.GROQ_API_KEY);
console.log("Exa key exists:", !!process.env.EXA_API_KEY);

const requireServerEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing`);
  }
  return value;
};

// Simple in-memory cache for last successful AI responses per module
const aiCache: Record<string, any> = {};

let groqInstance: any = null;
const getGroq = () => {
  if (!groqInstance) {
    const key = requireServerEnv("GROQ_API_KEY");
    if (!key) {
      console.warn("GROQ_API_KEY is missing - AI primary engine will be disabled");
      throw new Error("GROQ_API_KEY is missing");
    }
    console.log("Configuring Groq Engine...");
    groqInstance = new Groq({ apiKey: key });
  }
  return groqInstance;
};

async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Unified AI Module Endpoint with Unified Context & Groq Power
  app.post("/api/ai/:module", async (req, res) => {
    const { module } = req.params;
    const { context, messages } = req.body;
    
    try {
      let systemPrompt = "";
      let isJson = false;
      let model = "llama-3.3-70b-versatile"; // High-performance default
      let temperature = 0.7;

      // Extract deep context for better prompting
      const biz = context?.restaurant?.name || "Global Partner";
      const owner = context?.owner?.name || "Operator";
      const cuisine = context?.restaurant?.cuisine || "Premium Cuisine";
      const location = context?.restaurant?.location || "the current region";
      
      // Exa Proxy Integration
      let marketIntel = "";
      if (module === "chat" || module === "trends" || module === "insights") {
        const exaKey = process.env.EXA_API_KEY;
        if (exaKey) {
          try {
            const exaRes = await fetch("https://api.exa.ai/search", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json", 
                "x-api-key": exaKey 
              },
              body: JSON.stringify({ 
                query: `Current high-end restaurant pricing and menu trends for ${cuisine} in ${location} 2024 2025`,
                useAutoprompt: true,
                numResults: 3,
                category: "research paper"
              })
            });
            const exaData = await exaRes.json();
            marketIntel = (exaData.results || []).map((r: any) => `- ${r.title}: ${r.url}`).join("\n");
          } catch (e) {
            console.error("Exa research failed - continuing with base OS intelligence");
          }
        }
      }

      switch (module) {
        case "profit-audit":
          const selectedItems = context?.selectedItems || [];
          const itemNames = selectedItems.map((i: any) => i.name).join(", ");
          
          // Enhanced Exa Research for Profit Audit
          let auditMarketData = "";
          if (process.env.EXA_API_KEY && selectedItems.length > 0) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `Specific menu prices and ingredient costs for ${itemNames} in ${location} restaurants 2024 2025`,
                  useAutoprompt: true,
                  numResults: 5,
                  category: "news"
                })
              });
              const exaData = await exaRes.json();
              auditMarketData = (exaData.results || []).map((r: any) => `${r.title}: ${r.text}`).join("\n\n");
            } catch (e) {
              console.error("Audit research failed");
            }
          }

          isJson = true;
          systemPrompt = `You are a Restaurant Strategic Intelligence Engine.
          
          TASK:
          Perform a high-precision Profit Audit on: ${itemNames}
          
          MARKET CONTEXT (EXA):
          ${auditMarketData || "No live data found—use high-confidence regional benchmarks."}
          
          OUTPUT JSON FORMAT (STRICT):
          {
            "overallScore": number (0-100),
            "marketSentiment": "string (Bullish/Bearish/Stable)",
            "items": [
              {
                "name": "string",
                "currentPrice": number,
                "calculatedCost": number,
                "currentMargin": number (percentage),
                "marketAvgPrice": number,
                "marketPremiumPrice": number,
                "priceStatus": "underpriced | overpriced | optimal",
                "profitabilityScore": number (0-100),
                "trendStrength": number (0-100),
                "findings": ["Short impactful finding", "..."],
                "directives": ["Immediate action step", "..."]
              }
            ],
            "globalStrategy": "2-sentence executive summary of what is wrong and how to fix it."
          }
          
          CRITICAL RULES:
          1. Extract REAL prices from the Market Context.
          2. Calculate priceStatus by comparing currentPrice to marketAvgPrice.
          3. Ensure the JSON is valid and concise.`;
          break;

        case "combo-suggestions":
          // Exa Research for trending pairings/combos
          let comboMarketData = "";
          if (process.env.EXA_API_KEY) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `Trending restaurant menu combos, drink pairings, and upsell bundles for ${cuisine} in ${location} 2024 2025`,
                  useAutoprompt: true,
                  numResults: 5
                })
              });
              const exaData = await exaRes.json();
              comboMarketData = (exaData.results || []).map((r: any) => `${r.title}: ${r.text}`).join("\n\n");
            } catch (e) {
              console.error("Combo research failed");
            }
          }

          isJson = true;
          systemPrompt = `You are a Revenue Optimization Engine for ${biz}.
          
          TASK:
          Generate high-AOV (Average Order Value) combo suggestions and upsell bundles.
          
          CONTEXT:
          - FULL MENU: ${JSON.stringify(context?.menu?.inventory_items || [])}
          - CUISINE: ${cuisine}
          - LOCATION: ${location}
          - MARKET TRENDS (EXA): ${comboMarketData || "Use internal high-end dining trend intelligence."}
          
          REQUIREMENTS:
          1. Identify "Top Combo Opportunities" using existing menu items.
          2. Identify "New Item Opportunities" (items NOT on menu but trending/profitable).
          3. Provide "Market Trend Insights" regarding customer behavior (Gen Z, Premium).
          4. Include profitability/confidence indicators.
          
          OUTPUT JSON FORMAT (STRICT):
          {
            "combos": [
              {
                "title": "string (e.g. The Signature Pairing)",
                "items": ["Item A", "Item B"],
                "strategy": "string (1-sentence why this works)",
                "estimatedAOVIncrease": "string (e.g. +$12.50)",
                "confidence": 0.0-1.0,
                "type": "food-drink | food-side | bundle"
              }
            ],
            "newOpportunities": [
              {
                "item": "string",
                "reason": "string (why add this now)",
                "trendSource": "string (market logic)"
              }
            ],
            "marketInsights": ["Insight 1", "..."]
          }
          
          Tone: High-end, strategic, and revenue-obsessed.`;
          break;

        case "chat": {
          systemPrompt = `You are the DineDesk AI Business Copilot, a high-end restaurant operations strategist and executive advisor for ${biz}.
          
          IDENTITY:
          - Speak to ${owner} with a professional, strategic, and polished tone.
          - You are not just a chatbot; you are a partner in ${biz}'s growth.
          - Your knowledge is grounded in ${cuisine} traditions and modern high-performance operations.

          RESPONSE ARCHITECTURE:
          - AVOID raw markdown tables. Organize data into natural, beautiful sections.
          - STRUCTURE your advice into these specific sections:
            ### Menu Highlights
            (Focus on real items from the menu, explaining their performance, margins, and popularity).
            ### Operational Insights
            (Connect menu items to inventory status and operational metrics).
            ### Strategic Recommendations
            (Provide 2-3 high-leverage actions based on data relationships).

          DATA INTELLIGENCE:
          You have REAL-TIME access to:
          - FULL MENU: ${JSON.stringify(context?.menu?.inventory_items || [])}
          - LIVE INVENTORY: ${JSON.stringify(context?.inventory || [])}
          - PERFORMANCE: Revenue $${context?.operations?.dailyRevenue || '0'}, Orders ${context?.operations?.dailyOrders || '0'}, Occupancy ${context?.operations?.occupancy || '0%'}

          ADVISORY GUIDELINES:
          1. Use actual data relationships (e.g., "The Wagyu Burger is your best-seller but has high ingredient costs—recommend monitoring Wagyu Beef stock which is currently Healthy at 45 units").
          2. Never say "I am an AI". Act as the Executive Copilot.
          3. Conclude with a single "Executive Action" line at the end.
          4. Use high-end business terminology (Velocity, Integrity, Architecture, Leverage).`;
          break;
        }

        case "insights":
          isJson = true;
          model = "llama-3.1-8b-instant"; // Faster for logic snippets
          temperature = 0.2; // Low variance for data extraction
          systemPrompt = `You are the Neural Analytics Engine for ${biz}.
          Task: Process current metrics and generate 3-4 high-impact operational insights.
          Context: ${JSON.stringify(context)}
          
          Insight Guidelines:
          - Focus on revenue-driving signals.
          - Identify inventory risks (Low/Critical status).
          - Suggest "Neural Optimizations" based on popularity vs margin.
          
          Required Output Format (STRICT JSON):
          { 
            "insights": [
              { 
                "id": "insight-unique-id", 
                "type": "prediction|optimization|alert|trend", 
                "title": "Executive Directive Title", 
                "description": "Sophisticated, 2-sentence impact analysis.", 
                "impact": "high|medium|low", 
                "confidence": 0.0-1.0 
              }
            ] 
          }`;
          break;

        case "trends":
          isJson = true;
          model = "llama-3.3-70b-versatile";
          
          // Enhanced Exa Research for Market Intelligence
          let trendsMarketData = "";
          if (process.env.EXA_API_KEY) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `2024-2025 trending restaurant cuisines, Gen Z dining habits, social media food content strategies, and restaurant digital transformation for ${cuisine} in ${location}`,
                  useAutoprompt: true,
                  numResults: 6,
                  category: "news"
                })
              });
              const exaData = await exaRes.json();
              trendsMarketData = (exaData.results || []).map((r: any) => `${r.title}: ${r.text}`).join("\n\n");
            } catch (e) {
              console.error("Trends research failed");
            }
          }

          systemPrompt = `You are a Global Market Intelligence Engine and High-End Restaurant Strategist.
          Analyze market volatility and opportunities for ${biz} (Cuisine: ${cuisine}, Location: ${location}).
          
          MARKET INTELLIGENCE (LIVE EXA DATA):
          ${trendsMarketData || "Using internal neural trend data for premium dining."}
          
          TASK:
          Synthesize the market data into a futuristic, multi-dimensional intelligence report.
          
          REQUIRED SECTIONS:
          1. FOOD + MENU TRENDS: Trending ingredients, viral concepts, seasonal movements.
          2. SOCIAL MEDIA + DIGITAL GROWTH: Instagram/TikTok trends, content strategies, engagement tactics.
          3. DIGITAL EXPERIENCE: Website features, online ordering trends, UI/UX expectations.
          4. CUSTOMER PSYCHOLOGY: Gen Z behavior, aesthetic preferences, experiential dining demand.
          5. MARKET POSITIONING: Brand gaps, premium opportunities, competitor pricing shifts.
          6. STRATEGIC ACTIONS: High-impact growth strategies (Growth, Branding, Operations).

          REQUIRED OUTPUT FORMAT (STRICT JSON):
          { 
            "neuralHighlights": ["Key insight 1", "..."],
            "foodTrends": [
              { "title": "Trend Name", "description": "Brief analysis", "momentum": "high|medium|low" }
            ],
            "digitalIntelligence": [
              { "title": "Strategy Name", "platform": "Platform", "insight": "Executive summary" }
            ],
            "digitalExperience": [
              { "feature": "Digital Asset/Feature", "impact": "Analysis of why it matters", "recommendation": "Executive directive" }
            ],
            "customerPsychology": [
              { "title": "Behavior Shift", "description": "Analysis of segment", "segment": "e.g. Gen Z / Millennial" }
            ],
            "marketPositioning": [
              { "title": "Opportunity", "description": "Strategic driver" }
            ],
            "strategicActions": [
              { "action": "Directive", "impact": "High/Medium/Low", "target": "Revenue/Branding/Retention" }
            ],
            "confidenceScore": number (0-100)
          }

          TONE: Authoritative, strategic, and futuristic.`;
          break;

        case "report":
          isJson = true;
          model = "llama-3.3-70b-versatile";
          const reportType = req.body.type || "executive";
          
          let reportData = "";
          if (reportType === "market") {
            // Market report needs Exa research
            if (process.env.EXA_API_KEY) {
              try {
                const exaRes = await fetch("https://api.exa.ai/search", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                  body: JSON.stringify({ 
                    query: `2024-2025 deep market trends for ${cuisine} restaurants in ${location}, competitor strategies, and Gen Z dining shifts`,
                    useAutoprompt: true,
                    numResults: 5
                  })
                });
                const exaData = await exaRes.json();
                reportData = (exaData.results || []).map((r: any) => `${r.title}: ${r.text}`).join("\n\n");
              } catch (e) {
                console.error("Market report research failed");
              }
            }
          }

          const prompts: Record<string, string> = {
            executive: `Generate an EXECUTIVE BUSINESS SUMMARY for ${biz}.
              Include: performance overview, operational health, AI business score, strengths, weaknesses, growth opportunities, and strategic recommendations.
              Tone: Tier-1 Consulting (McKinsey/BCG level).`,
            menu: `Generate a MENU PERFORMANCE REPORT for ${biz}.
              Analyze: best-selling items, weak-performing items, margin analysis, pricing efficiency, and category performance.
              Data: ${JSON.stringify(context?.menu?.inventory_items || [])}.`,
            inventory: `Generate an INVENTORY INTELLIGENCE REPORT for ${biz}.
              Analyze: stock efficiency, low-stock risks, waste-risk indicators, ingredient dependency, and slow-moving inventory.
              Data: ${JSON.stringify(context?.inventory || [])}.`,
            market: `Generate a MARKET TRENDS REPORT for ${biz} based on:
              ${reportData || "Internal trend intelligence."}
              Analyze: industry trends, customer behavior shifts, digital branding opportunities, and competitor positioning.`,
            revenue: `Generate a REVENUE OPTIMIZATION REPORT for ${biz}.
              Analyze: combo opportunities, pricing leverage, upsell potential, and AOV optimization strategies.`,
            strategic: `Generate an AI STRATEGIC ACTION PLAN for ${biz}.
              Identify: 5 short-term and 5 long-term actionable growth tasks, branding strategies, and operational improvements.`
          };

          systemPrompt = `You are an Executive Strategic Consultant for ${biz}.
          Report Type Requested: ${reportType.toUpperCase()}
          
          TASK:
          ${prompts[reportType] || prompts.executive}
          
          FORMAT:
          Return a deep, structured JSON report.
          {
            "reportId": "uuid",
            "type": "${reportType}",
            "timestamp": "ISO-8601",
            "title": "Professional Report Title",
            "summary": "2-3 paragraphs of high-stakes executive narrative.",
            "scores": {
              "health": number (0-100),
              "velocity": number (0-100),
              "integrity": number (0-100),
              "potential": number (0-100)
            },
            "sections": [
              { "title": "Section Title", "content": "Detailed analysis text", "insights": ["Insight 1", "..."] }
            ],
            "recommendations": [
              { "task": "Directive", "impact": "High/Med/Low", "timeline": "Short/Long-term" }
            ],
            "confidenceScore": number (0-100)
          }

          Tone: Authoritative, visionary, and strictly professional.`;
          break;

        case "alerts": {
          isJson = true;
          model = "llama-3.3-70b-versatile";
          
          let alertMarketIntel = "";
          if (process.env.EXA_API_KEY) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `emerging 2025 dining trends, viral food items, and consumer behavior shifts affecting ${cuisine} in ${location}`,
                  useAutoprompt: true,
                  numResults: 3
                })
              });
              const exaData = await exaRes.json();
              alertMarketIntel = (exaData.results || []).map((r: any) => r.text).join("\n");
            } catch (e) {
              console.error("Exa market intel for alerts failed");
            }
          }

          systemPrompt = `You are a Predictive Intelligence Engine for ${biz}.
          
          CONTENT CONTEXT:
          - Inventory: ${JSON.stringify((context?.inventory || []).slice(0, 10))}
          - Menu Items: ${JSON.stringify((context?.menu?.inventory_items || []).slice(0, 5))}
          - Market Intel: ${alertMarketIntel}

          TASK:
          Generate 5-7 HIGH-STAKES PREDICTIVE ALERTS based on the data.
          Alerts must cover: Inventory forecasting, Revenue momentum, Market trends, and Operational risks.

          FORMAT:
          Return a JSON array of Alert objects.
          [
            {
              "id": "uuid",
              "type": "inventory" | "market" | "revenue" | "strategic",
              "severity": "critical" | "warning" | "opportunity",
              "title": "Short, punchy title",
              "description": "2 sentences explaining the prediction and why it matters.",
              "confidence": number (70-98),
              "actionText": "Call to action button text",
              "impact": "High" | "Medium" | "Low"
            }
          ]

          TONE: Proactive, observant, and executive-grade. No fluff.`;
          break;
        }

        case "futureProof": {
          isJson = true;
          model = "llama-3.3-70b-versatile";
          
          let futureMarketIntel = "";
          if (process.env.EXA_API_KEY) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `futuristic dining trends 2025-2027, gen z food preferences ${cuisine}, digital-first restaurant innovation, ${cuisine} market evolution in ${location}`,
                  useAutoprompt: true,
                  numResults: 5
                })
              });
              const exaData = await exaRes.json();
              futureMarketIntel = (exaData.results || []).map((r: any) => r.text).join("\n");
            } catch (e) {
              console.error("Exa market intel for future proofing failed");
            }
          }

          systemPrompt = `You are the Neural Future Readiness Engine for ${biz}.
          
          UNIVERSE CONTEXT:
          - Business: ${biz} (${cuisine} at ${location})
          - Identity: ${context?.onboarding?.identity || "Elite Restaurant Operating System"}
          - Menu: ${JSON.stringify(context?.menu?.inventory_items || [])}
          - Market Trends: ${futureMarketIntel}

          TASK:
          Perform a deep Future-Readiness Audit. 
          Determine if this business is aligned with the next 3 years of market evolution.
          
          SCORING LOGIC:
          - Future-Proof Score: Overall readiness.
          - Innovation Score: Rate of menu/workflow evolution.
          - Digital Readiness Score: Web/Social/Tech footprint.
          - Market Alignment Score: How well it meets current regional demand.
          - Gen Z Compatibility Score: Appeal to younger audiences.
          - Growth Potential Score: Expansion/Scale capability.

          FORMAT:
          Return a structured JSON object:
          {
            "overallScore": number (0-100),
            "scores": {
              "innovation": number,
              "digital": number,
              "alignment": number,
              "genZ": number,
              "growth": number
            },
            "verdict": "2-3 sentence executive assessment of survivability and growth potential.",
            "pillars": [
              {
                "title": "Strategy Pillar Name",
                "status": "Ready" | "Evolving" | "Behind",
                "analysis": "Detailed futuristic assessment.",
                "opportunities": ["Opportunity 1", "Opportunity 2"]
              }
            ],
            "actionPlan": [
              { "title": "Priority Action", "impact": "Exponential" | "High", "timeframe": "Q1" | "Q2" | "Q3" }
            ]
          }

          TONE: Futuristic, cinematic, high-stakes, and elite strategist.`;
          break;
        }

        case "standaloneAudit": {
          isJson = true;
          model = "llama-3.3-70b-versatile";
          
          const auditData = context?.auditData || {};
          let auditMarketIntel = "";
          if (process.env.EXA_API_KEY) {
            try {
              const exaRes = await fetch("https://api.exa.ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.EXA_API_KEY },
                body: JSON.stringify({ 
                  query: `market trends for ${auditData.cuisine} in ${auditData.location}, ${auditData.cuisine} restaurant competition, customer dining behavior 2026 ${auditData.location}`,
                  useAutoprompt: true,
                  numResults: 5
                })
              });
              const exaData = await exaRes.json();
              auditMarketIntel = (exaData.results || []).map((r: any) => r.text).join("\n");
            } catch (e) {
              console.error("Exa market intel for standalone audit failed");
            }
          }

          systemPrompt = `You are the Standalone Business Intelligence Architect for DineDesk.
          
          USER INPUT CONTEXT:
          ${JSON.stringify(auditData)}
          
          MARKET CONTEXT (LIVE):
          ${auditMarketIntel}

          TASK:
          Perform a deep strategic analysis of the provided restaurant/business profile. 
          Determine its market positioning, digital readiness, Gen Z compatibility, and future-readiness.

          RETURN FORMAT (JSON MANDATORY):
          {
            "overallScore": number (0-100),
            "scores": {
              "digital": number,
              "alignment": number,
              "genZ": number,
              "growth": number
            },
            "verdict": "2-3 sentence executive assessment.",
            "positioning": {
              "analysis": "Analysis of market positioning.",
              "strengths": ["string"],
              "weaknesses": ["string"]
            },
            "digitalAudit": {
              "status": "Ready" | "Evolving" | "Behind",
              "analysis": "Analysis of social/web presence.",
              "recommendations": ["string"]
            },
            "futureReadiness": {
              "score": number,
              "analysis": "Future-proofing assessment.",
              "modernizationSteps": ["string"]
            },
            "genZAnalysis": {
              "score": number,
              "analysis": "Appeal to younger audiences.",
              "compatibilityLevel": "High" | "Medium" | "Low"
            },
            "strategy": [
              { "title": "Strategy Name", "description": "Details", "impact": "Exponential" | "High" }
            ]
          }

          TONE: Futuristic, authoritative, and visionary. Avoid generic advice. Use live data cues.`;
          break;
        }

        default:
          throw new Error("Invalid module");
      }

      // Execute with Groq
      const groq = getGroq();
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []).map((m: any) => ({ role: m.role, content: m.content }))
        ],
        model: model,
        temperature: temperature,
        response_format: isJson ? { type: "json_object" } : undefined,
      });

      const responseContent = completion.choices[0]?.message?.content || "";
      let parsedResult = isJson ? JSON.parse(responseContent) : { message: responseContent };

      // Defensive defaults
      if (module === 'insights' && !parsedResult.insights) parsedResult.insights = [];
      if (module === 'trends' && !parsedResult.trends) parsedResult.trends = [];

      // Cache last successful result for this module
      try { aiCache[module] = parsedResult; } catch (e) { /* noop */ }

      res.json(parsedResult);

    } catch (error: any) {
      console.error(`AI ${module} Error:`, error);

      // Determine retry-after if provided by Groq response headers
      let retryAfterSeconds: number | null = null;
      try {
        if (error?.headers) {
          // groq-sdk error.headers may be a Headers-like object or plain object
          if (typeof error.headers.get === 'function') {
            const ra = error.headers.get('retry-after');
            retryAfterSeconds = ra ? parseInt(ra, 10) : null;
          } else if (error.headers['retry-after']) {
            retryAfterSeconds = parseInt(error.headers['retry-after'], 10) || null;
          }
        }
      } catch (e) { /* ignore parsing issues */ }

      // If we have a cached response for this module, return it as a friendly fallback
      const cached = aiCache[module] || null;
      if (cached) {
        console.warn(`[ai] Returning cached response for module=${module}`);
        return res.json({
          ...cached,
          _meta: {
            warning: 'Primary AI engine unavailable; returning cached results.',
            retryAfterSeconds: retryAfterSeconds
          }
        });
      }

      // No cached result: return graceful service-unavailable response
      return res.status(503).json({
        error: 'AI engine temporarily busy',
        message: 'AI engine temporarily busy. Please retry in a few seconds.',
        retryAfterSeconds: retryAfterSeconds,
        cached: null
      });
    }
  });

  // Keep legacy endpoint but update it to use Groq for consistency
  app.post("/api/analyze", async (req, res) => {
    try {
      const { restaurantData } = req.body;
      const groq = getGroq();
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a specialized restaurant analyst. Provide a detailed JSON report." 
          },
          { 
            role: "user", 
            content: `Analyze this restaurant data: ${JSON.stringify(restaurantData)}. 
            Must return JSON: { efficiencyScore, wasteRiskScore, retentionScore, growthPotentialScore, keyInsights: [], revenueOpportunities: [], menuSuggestions: [], demandForecast: "", competitorAnalysis: "" }`
          }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });
      
      res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
    } catch (error: any) {
      console.error("Analysis Error:", error);

      // Determine retry-after if provided by Groq response headers
      let retryAfterSeconds: number | null = null;
      try {
        if (error?.headers) {
          if (typeof error.headers.get === 'function') {
            const ra = error.headers.get('retry-after');
            retryAfterSeconds = ra ? parseInt(ra, 10) : null;
          } else if (error.headers['retry-after']) {
            retryAfterSeconds = parseInt(error.headers['retry-after'], 10) || null;
          }
        }
      } catch (e) { }

      const cached = aiCache['analyze'] || null;
      if (cached) {
        console.warn('[ai] Returning cached analysis fallback');
        return res.json({
          ...cached,
          _meta: { warning: 'Primary AI engine unavailable; returning cached results.', retryAfterSeconds }
        });
      }

      return res.status(503).json({
        error: 'AI engine temporarily busy',
        message: 'Analysis service temporarily busy. Please retry in a few seconds.',
        retryAfterSeconds,
        cached: null
      });
    }
  });

  // Exa Generic Search Proxy
  app.post("/api/exa/search", async (req, res) => {
    try {
      const { query, category } = req.body;
      const apiKey = process.env.EXA_API_KEY;
      if (!apiKey) return res.status(401).json({ error: "EXA_API_KEY Missing" });

      // Use an AbortController to bound Exa requests so they can't hang the server
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch("https://api.exa.ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey },
          body: JSON.stringify({ 
            query, 
            useAutoprompt: true, 
            numResults: 5,
            category: category || "company"
          }),
          signal: controller.signal
        });

        const text = await response.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

        if (!response.ok) {
          console.error('[exa] upstream error', { status: response.status, body: data });
          return res.status(502).json({ error: 'Exa upstream error', status: response.status, body: data });
        }

        // Return structured data and include upstream meta for debugging
        return res.json({ ...(data || {}), _meta: { upstreamStatus: response.status } });
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      res.status(500).json({ error: "Exa Proxy Error" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

let appInstancePromise: Promise<express.Express> | null = null;

const getAppInstance = () => {
  if (!appInstancePromise) {
    appInstancePromise = createApp();
  }
  return appInstancePromise;
};

// Vercel serverless entrypoint
export default async function handler(req: any, res: any) {
  const app = await getAppInstance();
  return (app as any)(req, res);
}

// Local development/runtime entrypoint
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);
  getAppInstance()
    .then((app) => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`DineDesk Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start DineDesk server", error);
      process.exit(1);
    });
}
