require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes   = require('./routes/auth.routes');
const coachRoutes  = require('./routes/coach.routes');
const adminRoutes  = require('./routes/admin.routes');
const metricRoutes = require('./routes/metrics.routes');
const playerRoutes = require('./routes/player.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');

app.use('/api/auth', authRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/player', playerRoutes);
app.use(errorHandler);

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection failed:', err));


sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => console.log(`🚀 Listening on port ${process.env.PORT}`));
});