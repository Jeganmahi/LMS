const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
});

const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(cors());


// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'LMS',
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// Route to handle form submission and file upload
app.post("/Addcourses", upload.fields([
    { name: "courseMaterial", maxCount: 1 },
    { name: "importantNotes", maxCount: 1 },
]), (req, res) => {
    const { courseName, description, year, semester, duration, videoLink } = req.body;

    // Access uploaded files from `req.files`
    const courseMaterial = req.files['courseMaterial'] ? req.files['courseMaterial'][0] : null;
    const importantNotes = req.files['importantNotes'] ? req.files['importantNotes'][0] : null;

    // Get file paths (you can adjust the folder path where the files are stored)
    const courseMaterialPath = courseMaterial ? 'uploads/' + courseMaterial.filename : null;
    const importantNotesPath = importantNotes ? 'uploads/' + importantNotes.filename : null;

    // Set the status value (if needed, otherwise remove the 'status' column from the query)
    const status = 'pending';  // You can modify this based on your requirements, or skip it if unnecessary

    // Prepare the data for insertion
    const query = `INSERT INTO courses (courseName, description, year, semester, duration, videoLink, courseMaterial, importantNotes, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        courseName,
        description,
        year,
        semester,
        duration,
        videoLink,
        courseMaterialPath,
        importantNotesPath,
        status // Add status if it's a column in your table
    ];

    // Insert data into the database
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting course data:', err);
            return res.status(500).json({ error: 'Failed to insert course data' });
        }

        console.log('Course data inserted successfully:', result);
        res.json({ message: 'Course data received and inserted successfully!' });
    });
});
// for getting
app.get('/getCourses', (req, res) => {
    const query = "SELECT * FROM courses"; // Adjust the query as per your table structure

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching courses:", err);
            return res.status(500).json({ message: "Error fetching courses" });
        }

        res.json(result); // Send the courses data as a response
    });
});
app.get('/getStudentCourses', (req, res) => {
    const query = "SELECT * FROM courses WHERE status = 'approved'"; // Adjust the query to filter by the status

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching courses:", err);
            return res.status(500).json({ message: "Error fetching courses" });
        }

        res.json(result); // Send the courses data as a response
    });
});

// adding important courses
app.get('/getCourseTopics/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
      const query = 'SELECT * FROM important_topics WHERE course_id = ?';
      db.query(query, [courseId], (err, results) => {
        if (err) {
          console.error('Error fetching topics:', err);
          return res.status(500).json({ error: 'Error fetching topics' });
        }
        
        res.status(200).json(results);
      });
    } catch (err) {
      console.error('Error processing request:', err);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  });
  

// The POST route for adding important topics
app.post('/addImportantTopics', upload.array('material'), async (req, res) => {
    try {
      // Extract the course ID from the body
      const courseId = req.body.courseId;
  
      // Get the list of topics from the request body
      const topics = [];
      for (let i = 0; i < req.files.length; i++) {
        const topicName = req.body[`topics[${i}].name`];
        const materialPath = req.files[i].path; // Path of the uploaded file
  
        // Prepare the topic data for insertion into the database
        topics.push({
          course_id: courseId,
          topic_name: topicName,
          material: materialPath,
        });
      }
  
      // Insert each topic into the database
      for (const topic of topics) {
        const query = `
          INSERT INTO important_topics (course_id, topic_name, material)
          VALUES (?, ?, ?)
        `;
        
        // Execute the query
        db.query(query, [topic.course_id, topic.topic_name, topic.material], (err, result) => {
          if (err) {
            console.error('Error inserting topic:', err);
            return res.status(500).json({ error: 'An error occurred while saving the topic' });
          }
        });
      }
  
      // Send success response after all topics are inserted
      res.status(200).json({ message: 'Topics added successfully' });
    } catch (err) {
      console.error('Error processing request:', err);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  });
  
app.put('/ActionCourses/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status value
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const query = 'UPDATE courses SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating course status:', err);
            return res.status(500).json({ error: 'Failed to update course status' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course status updated successfully' });
    });
});


// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
