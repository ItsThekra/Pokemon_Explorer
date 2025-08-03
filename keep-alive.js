#!/usr/bin/env node

// Keep-alive service to prevent Render cold starts
// This script pings the app every 14 minutes to keep it warm

const APP_URL = 'https://pokemon-explorer-pq7f.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

async function pingApp() {
  try {
    console.log(`[${new Date().toISOString()}] Pinging ${APP_URL}...`);
    
    const response = await fetch(APP_URL, {
      method: 'HEAD',
      timeout: 10000
    });
    
    if (response.ok) {
      console.log(`✅ App is alive (${response.status})`);
    } else {
      console.log(`⚠️ App responded with ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Ping failed:`, error.message);
  }
}

// Ping immediately on start
pingApp();

// Then ping every 14 minutes
setInterval(pingApp, PING_INTERVAL);

console.log(`🔄 Keep-alive service started. Pinging every ${PING_INTERVAL / 60000} minutes.`);
console.log(`📱 Target: ${APP_URL}`);
console.log(`⏰ Started at: ${new Date().toISOString()}`);

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-alive service stopped');
  process.exit(0);
});
