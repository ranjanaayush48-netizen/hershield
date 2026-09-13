import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import dns from 'node:dns';
import { createServer as createViteServer } from 'vite';

// Configure DNS resolution to prioritize IPv4 in cloud container environments
dns.setDefaultResultOrder('ipv4first');

import contactRoutes from './server/routes/contactRoutes';
import sosRoutes from './server/routes/sosRoutes';
import locationRoutes from './server/routes/locationRoutes';
import placesRoutes from './server/routes/placesRoutes';
import reportRoutes from './server/routes/reportRoutes';
import profileRoutes from './server/routes/profileRoutes';
import { isSupabaseConfigured } from './server/config/supabase';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health and System Readiness Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabaseConfigured: isSupabaseConfigured,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Mount API Routers
  app.use('/api/contacts', contactRoutes);
  app.use('/api/sos', sosRoutes);
  app.use('/api/location', locationRoutes);
  app.use('/api/places', placesRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/profile', profileRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HerShield] Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[HerShield] Server failed to start:', err);
  process.exit(1);
});
