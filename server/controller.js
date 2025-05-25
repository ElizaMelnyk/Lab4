const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const clientId = '9ce1856341e62cb363f9';
const clientSecret = 'fe3f65e28f26639aa946a41dc7184327ffe56cdd';
const redirectUri = 'https://localhost:3000/auth/casdoor/callback';
const casdoorTokenUrl = 'https://localhost:8443/api/login/oauth/access_token';

router.get('/casdoor/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing "code" in query parameters');
  }

  try {
    const response = await axios.post(
      casdoorTokenUrl,
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;


    if (data.access_token) {
      res.cookie('token', data.access_token, {
        httpOnly: false,
        secure: false, 
        sameSite: 'lax',
      });

      res.redirect('https://localhost:3001/callback');
    } else {
      res.status(400).send('Token exchange failed');
    }

  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.get('/casdoor/profile', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const { name, displayName, email, avatar, isAdmin } = decoded;
    return res.json({ name, displayName, email, avatar, isAdmin });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to decode token' });
  }
});

module.exports = router;