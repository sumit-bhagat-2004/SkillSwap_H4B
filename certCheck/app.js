const express = require('express');
const dotenv = require('dotenv');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const verifyRoute = require('./routes/verifyRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Clerk Auth Middleware
//app.use(ClerkExpressWithAuth());

app.use(express.json());
app.use('/api/verify', verifyRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
