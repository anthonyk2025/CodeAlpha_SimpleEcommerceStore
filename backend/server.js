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
const usersRoute =require("./routes/userRoutes");
const ordersRoute = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

// --- Path configuration ---
// This setup correctly serves the frontend static files
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

// --- API Routes ---

// A new route to provide the Stripe publishable key to the frontend
app.get('/api/config/stripe', (req, res) => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    return res.status(500).send({ message: 'Stripe publishable key not configured.' });
  }
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);
app.use("/api/orders", ordersRoute);

// --- Fallback for Single-Page Application behavior ---
// This ensures that any route not handled by the API will serve the main HTML file.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));