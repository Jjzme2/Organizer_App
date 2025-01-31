const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');

async function getRefreshToken() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.settings.basic'
  ];

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  // Open browser for auth
  console.log('Opening browser for authentication...');
  open(authorizeUrl);

  // Handle the OAuth2 callback
  const server = http
    .createServer(async (req, res) => {
      try {
        const queryParams = url.parse(req.url, true).query;
  if (queryParams.code) {
                  const { tokens } = await oauth2Client.getToken(queryParams.code);
          console.log('\nRefresh Token:', tokens.refresh_token);
          console.log('\nAdd this refresh token to your .env file');
  res.end('Authentication suc          cessful! You can close this window.');
          server.destroy();
          process.exit(0);
        }
      } catch (error) {
        console.error('Error getting tokens:', error);
        res.end('Authentication failed! Please check the console.');
        server.destroy();
        process.exit(1);
      }
    })
    .listen(3001, () => {
      console.log('\nWaiting for authentication...');
    });

  destroyer(server);
}

getRefreshToken();