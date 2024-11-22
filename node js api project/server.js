const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require("dotenv").config();

// MongoDB connection setup
const uri = 'mongodb://localhost:27017'; // MongoDB URI
const dbName = 'eventDB'; // Database name
let db;

// MongoDB connection
(async () => {
const client = new MongoClient(uri);
try {
await client.connect();
console.log("Connected to MongoDB");
db = client.db(dbName);
} catch (error) {
console.error("MongoDB connection failed:", error);
process.exit(1);
}
})();

const app = express();
const upload = multer(); // Middleware used for handling file uploads
const port = process.env.PORT ||3000;


// Middleware 
app.use(bodyParser.json());


// all api  Endpoints



// Get api of event by unique if
app.get('/api/v3/app/events', async (req, res) => {
const { id } = req.query;

try {
if (!id) {
return res.status(400).send({ error: "Event ID is required" });
}

const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
if (!event) return res.status(404).send({ error: "Event not found" });
res.send(event);
} catch (error) {
console.error("Error fetching event by ID:", error);
res.status(500).send({ error: "Internal Server Error" });
}
});

// 2. Get api of latest events with pagination
app.get('/api/v3/app/events/latest', async (req, res) => {
const { limit = 5, page = 1 } = req.query;

try {
const events = await db
.collection('events')
.find({})
.sort({ schedule: -1 }) 
.skip((page - 1) * limit)
.limit(parseInt(limit))
.toArray();

res.send(events);
} catch (error) {
console.error("Error fetching latest events:", error);
res.status(500).send({ error: "Internal Server Error" });
}
});

// Create api of event by id
app.post('/api/v3/app/events', upload.single('files[image]'), async (req, res) => {
try {
const event = {
...req.body,
attendees: [], // Default empty attendees list
schedule: new Date(req.body.schedule), // Ensure schedule is stored as a Date object
};

const result = await db.collection('events').insertOne(event);
res.status(201).send({ id: result.insertedId });
} catch (error) {
console.error("Error creating event:", error);
res.status(500).send({ error: "Internal Server Error" });
}
});



// Update api of event by id
app.put('/api/v3/app/events/:id', async (req, res) => {
const { id } = req.params;

try {
const updatedEvent = {
...req.body,
schedule: req.body.schedule ? new Date(req.body.schedule) : undefined,
};

const result = await db.collection('events').updateOne(
{ _id: new ObjectId(id) },
{ $set: updatedEvent }
);

if (result.matchedCount === 0) {
return res.status(404).send({ error: "Event not found" });
}

res.send({ message: "Event updated successfully" });
} catch (error) {
console.error("Error updating event:", error);
res.status(500).send({ error: "Internal Server Error" });
}
});



//  Delete api of event by id
app.delete('/api/v3/app/events/:id', async (req, res) => {
const { id } = req.params;

try {
const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

if (result.deletedCount === 0) {
return res.status(404).send({ error: "Event not found" });
}

res.send({ message: "Event deleted successfully" });
} catch (error) {
console.error("Error deleting event:", error);
res.status(500).send({ error: "Internal Server Error" });
}
});

// server listen
app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});