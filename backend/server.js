// backend/server.js

// --- THIS IS THE FIX ---
// This line MUST be at the very top, before any other require/import statements.
require("dotenv").config();
// -----------------------

const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const productsRoute = require("./routes/productRoutes");
const usersRoute = require("./routes/userRoutes");
const ordersRoute = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/api/config/stripe', (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// API routes
app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);
app.use("/api/orders", ordersRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));