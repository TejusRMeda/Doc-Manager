import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event, properties } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Event name required' });
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const hourKey = now.getUTCHours();

    // Store event count by type and date
    await redis.hincrby(`events:${dateKey}`, event, 1);

    // Store total event count
    await redis.hincrby('events:totals', event, 1);

    // Track daily active sessions (using referrer as pseudo-session)
    const sessionId = properties?.sessionId || 'unknown';
    await redis.sadd(`sessions:${dateKey}`, sessionId);

    // Track country usage if provided
    if (properties?.country) {
      await redis.hincrby('countries:totals', properties.country, 1);
    }

    // Track hourly distribution for today
    await redis.hincrby(`hourly:${dateKey}`, hourKey, 1);

    // Store recent events for debugging (keep last 50)
    const eventData = {
      event,
      properties,
      timestamp: now.toISOString(),
    };
    await redis.lpush('events:recent', JSON.stringify(eventData));
    await redis.ltrim('events:recent', 0, 49);

    // Track funnel metrics
    if (event === 'page_view') {
      await redis.hincrby(`funnel:${dateKey}`, 'views', 1);
    } else if (event === 'document_uploaded') {
      await redis.hincrby(`funnel:${dateKey}`, 'uploads', 1);
    } else if (event === 'pdf_previewed') {
      await redis.hincrby(`funnel:${dateKey}`, 'previews', 1);
    } else if (event === 'pdf_exported') {
      await redis.hincrby(`funnel:${dateKey}`, 'exports', 1);
      // Track export details
      if (properties?.pages) {
        await redis.incrby('metrics:total_pages_exported', properties.pages);
      }
      if (properties?.travellers) {
        await redis.incrby('metrics:total_travellers', properties.travellers);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to track event' });
  }
}
