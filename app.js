import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import customerRoutes from './routes/customers.js';
import cardRoutes from './routes/cards.js';
import adminRoutes from './routes/admins.js';
import trainRoutes from './routes/trains.js';
import stationRoutes from './routes/stations.js';
import routeRoutes from './routes/routes.js';
import queryRoutes from './routes/queries.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/trains', trainRoutes);
app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/queries', queryRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Metro APIs"
  });
});

//Connect to Database
mongoose.connect(process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) {
      console.log("Could not connect to the database: " + err.message);
    }
    else {
      console.log("Connected to the database.");
    }
  }
);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("Server running at http://localhost:" + port + "/");
});