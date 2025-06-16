const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor"); // Visitor model
// const authenticate = require("./AdminAuth"); // Authentication middleware


router.post("/track-visitor", async (req, res) => {
  try {
    const today = new Date();
    const date = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const day = today.toLocaleString("en-US", { weekday: "long" }); // Day of the week

    // Update or create the visitor document
    const result = await Visitor.updateOne(
      { date }, // Match today's date
      {
        $setOnInsert: { day }, // Set the day only if creating a new document
        $inc: { visitorCount: 1 }, // Always increment visitor count
      },
      { upsert: true } // Create the document if it doesn't exist
    );

    // Log tracking details
    console.log("Visitor tracked: Anonymous user");

    // Return the updated visitor count after the operation
    const visitor = await Visitor.findOne({ date }); // Fetch the updated visitor data for today
    res.status(200).json({ visitorCount: visitor.visitorCount });
  } catch (error) {
    console.error("Error in /track-visitor route:", error);
    res.status(500).json({ message: "Error tracking visitor", error: error.message });
  }
});


// // Route to track visitors (logged-in users and anonymous visitors)
// router.get("/track-visitor", authenticate, async (req, res) => {
//   try {
//     const today = new Date();
//     const date = today.toISOString().split("T")[0]; // YYYY-MM-DD format
//     const day = today.toLocaleString("en-US", { weekday: "long" }); // Day of the week

//     const isAuthenticated = !!req.user;

//     // Update or create the visitor document
//     await Visitor.updateOne(
//       { date }, // Match today's date
//       {
//         $setOnInsert: { day }, // Set the day only if creating a new document
//         $inc: { visitorCount: 1, ...(isAuthenticated ? { loggedInUserCount: 1 } : {}) },
//       },
//       { upsert: true } // Create the document if it doesn't exist
//     );

//     console.log("Visitor tracked:", isAuthenticated ? req.user.username : "Anonymous user");
//     res.status(200).json({ message: "Visitor tracked successfully" });
//   } catch (error) {
//     console.error("Error in /track-visitor route:", error);
//     res.status(500).json({ message: "Error tracking visitor", error: error.message });
//   }
// });

router.get("/visitor-count", async (req, res) => {
  try {
    const today = new Date(); // Get current date
    const date = today.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

    // Fetch visitor data for the specified date
    const visitorData = await Visitor.findOne({ date });

    // Extract visitor and logged-in user counts or use 0 if data is not found
    const visitorCount = visitorData?.visitorCount || 0;

    console.log("Visitor count fetched:", { date, visitorCount });

    // Send response with the counts
    res.status(200).json({ visitorCount });
  } catch (error) {
    console.error("Error in /visitor-count route:", error);

    // Send error response
    res.status(500).json({
      message: "Error fetching visitor count",
      error: error.message,
    });
  }
});

router.get("/weekly-stats", async (req, res) => {
  try {
    // Get the latest 7 records sorted by date (descending), then reverse to chronological
    const weeklyData = await Visitor.find({})
      .sort({ date: -1 })
      .limit(7)
      .lean();

    // Format for recharts: { name: "Mon", visitors: 120 }
    const formatted = weeklyData
      .map(({ day, visitorCount }) => ({
        name: day.slice(0, 3), // e.g., "Mon", "Tue"
        visitors: visitorCount,
      }))
      .reverse(); // To show from Mon to Sun (or recent 7 days)

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    res.status(500).json({ message: "Failed to get weekly data" });
  }
});


module.exports = router;
