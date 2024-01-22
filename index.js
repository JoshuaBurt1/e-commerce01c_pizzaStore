require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require("express");
const cors = require("cors");
const path = require("path");  // Import the path module
const app = express();

// Define the path for serving static files
const staticPath = path.join(__dirname, 'build'); //or '/app/views/'
app.use(express.static(staticPath));

var corsOptions = {
  origin: "https://cult-of-pizza-react.onrender.com"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Define the root route to serve the index.html
app.get('/', function (req, res) {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Define a route to handle the POST request to /checkout
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      })),
      success_url: `https://cult-of-pizza-react.onrender.com/success`, // Adjust the URL if needed
      cancel_url: `https://cult-of-pizza-react.onrender.com`, // Adjust the URL if needed
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "An unexpected error occurred on the server." });
  }
});

// Define a route that will handle all non-API routes and serve the Vue app
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});