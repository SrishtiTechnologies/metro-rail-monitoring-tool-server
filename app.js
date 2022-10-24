import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './routes/customers.js';
import cardRoutes from './routes/cards.js';
import adminRoutes from './routes/admins.js';
import stationRoutes from './routes/stations.js';
import metroRoutes from './routes/metros.js';
import routeRoutes from './routes/routes.js';
import queryRoutes from './routes/queries.js';
import employeeRoutes from './routes/employees.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/customers', customerRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/metros', metroRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/employees', employeeRoutes);

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