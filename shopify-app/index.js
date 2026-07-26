require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

async function shopifyAdminFetch(query, variables = {}) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!domain || !token) {
    throw new Error('Shopify Admin credentials missing.');
  }

  const endpoint = `https://${domain}/admin/api/2024-01/graphql.json`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}

// Endpoint to generate customer login URL or proxy Multipass
app.post('/api/customer-url', async (req, res) => {
  try {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const customerUrl = `https://${domain}/account/login`;
    return res.json({ url: customerUrl });
  } catch (error) {
    console.error('Error generating customer URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Shopify App sidecar running on http://localhost:${PORT}`);
});
