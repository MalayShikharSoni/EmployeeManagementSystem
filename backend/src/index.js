// src/index.js
   const express = require('express');
   const cors = require('cors');
   const helmet = require('helmet');
   const rateLimit = require('express-rate-limit');
   const authRoutes = require('./routes/auth');
   require('dotenv').config();
   
   const app = express();
   
   // Security middleware
   app.use(helmet());
   app.use(cors());
   app.use(express.json());
   
   // Rate limiting
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use(limiter);
   
   // Routes
   app.use('/api/auth', authRoutes);
   
   // Health check
   app.get('/health', (req, res) => {
     res.json({ status: 'OK' });
   });
   
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`🚀 Server running on port ${PORT}`);
   });