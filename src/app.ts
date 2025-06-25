import express from 'express';
import cors from 'cors';
import sequelize from './database/db';
import agentRoutes from './routes/agentRoutes';
import userRoutes from './routes/user';
import walletRoutes from './routes/wallet';
import adminRoutes from './routes/admin';
import withdrawalRoutes from './routes/withdrawal';
import './models/index';
import referralRoutes from './routes/referralRoutes';
import courseRoutes from './routes/course';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//sync database
sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connected.. ');
  })
  .catch((error) => {
    console.log(' Error connecting to database:', error);
  });
// Default route for testing
app.get('/', (_req, res) => {
  res.send('RBN API IS LIVE!');
});
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/withdrawal', withdrawalRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/', referralRoutes);

export default app;
