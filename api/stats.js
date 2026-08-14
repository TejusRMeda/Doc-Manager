import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check - ANALYTICS_SECRET env var required
  const authHeader = req.headers.authorization;
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'ANALYTICS_SECRET not configured' });
  }
  if (authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Fetch all data in parallel
    const [
      totals,
      countries,
      recentEvents,
      totalPagesExported,
      totalTravellers,
      ...dailyData
    ] = await Promise.all([
      redis.hgetall('events:totals'),
      redis.hgetall('countries:totals'),
      redis.lrange('events:recent', 0, 19),
      redis.get('metrics:total_pages_exported'),
      redis.get('metrics:total_travellers'),
      ...dates.flatMap(date => [
        redis.hgetall(`events:${date}`),
        redis.scard(`sessions:${date}`),
        redis.hgetall(`funnel:${date}`),
      ])
    ]);

    // Parse daily data
    const daily = dates.map((date, i) => ({
      date,
      events: dailyData[i * 3] || {},
      sessions: dailyData[i * 3 + 1] || 0,
      funnel: dailyData[i * 3 + 2] || {},
    }));

    // Calculate summary metrics
    const totalEvents = Object.values(totals || {}).reduce((a, b) => a + Number(b), 0);
    const totalExports = Number(totals?.pdf_exported || 0);
    const totalPageViews = Number(totals?.page_view || 0);
    const completionRate = totalPageViews > 0
      ? ((totalExports / totalPageViews) * 100).toFixed(1)
      : 0;

    // Parse recent events
    const recent = (recentEvents || []).map(e => {
      try {
        return typeof e === 'string' ? JSON.parse(e) : e;
      } catch {
        return e;
      }
    });

    return res.status(200).json({
      summary: {
        totalEvents,
        totalPageViews,
        totalExports,
        completionRate: `${completionRate}%`,
        totalPagesExported: Number(totalPagesExported || 0),
        totalTravellers: Number(totalTravellers || 0),
      },
      totals: totals || {},
      countries: countries || {},
      daily,
      recentEvents: recent,
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
