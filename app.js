import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './api/routes/customers';
import cardRoutes from './api/routes/cards';
import adminRoutes from './api/routes/admins';
import stationRoutes from './api/routes/stations';
import metroRoutes from './api/routes/metros';
import routeRoutes from './api/routes/routes';
import queryRoutes from './api/routes/queries';
import employeeRoutes from './api/routes/employees';

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