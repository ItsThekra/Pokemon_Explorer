#!/usr/bin/env node

import { handler } from './build/handler.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// SvelteKit handler
app.use(handler);

app.listen(port, host, () => {
	console.log(`🚀 Server running on http://${host}:${port}`);
});
