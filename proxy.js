// CORS Proxy per Claude API
  const CLAUDE_API_KEY = 'sk-ant-api03-B1DASh0Ts5BKUkNq5mxAwM4j9Lsi4HwFD4vN
  CGpHh4-0VvD8YNqyi2zsBA5sFKFNjGs_rFVN9OBekWSToFAvVw-C_D2EgAA';

  async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { prompt } = await request.json();

      const response = await fetch('https://api.anthropic.com/v1/messages',
   {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1800,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
