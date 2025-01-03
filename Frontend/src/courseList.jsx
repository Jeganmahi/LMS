import React, { useState, useEffect } from "react";
import { Table, Button, Container, Badge, Modal } from "react-bootstrap";
import { FaVideo, FaPlusCircle } from 'react-icons/fa'; // Importing icons for video and add topics button
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // Tooltip for better user experience

function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null); // Track which course the topics are being added to
    const [topics, setTopics] = useState([{ topicName: "", topicMaterial: null }]); // Dynamic topics state

    // Fetch courses data from the backend
    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:3000/getCourses"); // Adjust the endpoint to match your backend
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                alert("Error fetching courses.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("An error occurred while fetching the courses.");
        }
    };

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Handle opening the modal for adding important topics
    const handleAddTopicsClick = (courseId) => {
        setSelectedCourseId(courseId);
        setShowModal(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
        setTopics([{ topicName: "", topicMaterial: null }]); // Reset topics when closing modal
    };

    // Handle input change for topic name and file
    const handleTopicChange = (index, e) => {
        const { name, value, files } = e.target;
        const newTopics = [...topics];
        if (name === "topicName") {
            newTopics[index].topicName = value;
        } else if (name === "topicMaterial") {
            newTopics[index].topicMaterial = files[0];
        }
        setTopics(newTopics);
    };

    // Add a new topic input
    const handleAddTopic = () => {
        setTopics([...topics, { topicName: "", topicMaterial: null }]);
    };

    // Handle form submission for adding topics
    const handleSubmitTopics = async (e) => {
        e.preventDefault();

        // Create FormData instance
        const data = new FormData();
        data.append("courseId", selectedCourseId);

        // Append the topic names as text fields
        topics.forEach((topic, index) => {
            data.append(`topics[${index}].name`, topic.topicName); // Append topic name
            if (topic.topicMaterial) {
                // Append each material (file) under the same key 'material'
                data.append('material', topic.topicMaterial);
            }
        });

        // Log FormData entries to ensure correct data
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch("http://localhost:3000/addImportantTopics", {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                alert("Topics added successfully!");
                handleCloseModal();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting topics:", error);
            alert("An error occurred while submitting the topics.");
        }
    };



    return (
        <div className="container mt-4">
            <h3>Course List</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-hover" style={{ width: "100%", tableLayout: "fixed" }}>
                    <thead className="bg-primary text-white">
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Duration</th>
                            <th>Video</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.id} className="align-middle">
                                    <td>{course.courseName}</td>
                                    <td>{course.description}</td>
                                    <td>{course.year}</td>
                                    <td>{course.semester}</td>
                                    <td>{course.duration}</td>
                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Watch Video</Tooltip>}
                                        >
                                            <a href={course.videoLink} target="_blank" rel="noopener noreferrer">
                                                <FaVideo color="#28a745" size={20} />
                                            </a>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        {course.status === "pending" ? (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Add Topics</Tooltip>}
                                            >
                                                <Button
                                                    variant="info"
                                                    onClick={() => handleAddTopicsClick(course.id)}
                                                    className="d-flex align-items-center"
                                                >
                                                    <FaPlusCircle className="me-2" size={18} />
                                                    Add Topics
                                                </Button>
                                            </OverlayTrigger>
                                        ) : (
                                            <Badge
                                                bg={course.status === "approved" ? "success" : course.status === "rejected" ? "danger" : "secondary"}
                                            >
                                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                            </Badge>
                                        )}
                                    </td>

                                    <td>
                                        {/* Status with colorful badges */}
                                        {course.status === "approved" ? (
                                            <Badge bg="success">
                                                Approved
                                            </Badge>
                                        ) : course.status === "rejected" ? (
                                            <Badge bg="danger">
                                                Rejected
                                            </Badge>
                                        ) : (
                                            <Badge bg="warning">
                                                Pending
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Adding Important Topics */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    aria-labelledby="addTopicsModal"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addTopicsModal">
                                    Add Important Topics
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitTopics}>
                                    {topics.map((topic, index) => (
                                        <div key={index} className="mb-4">
                                            {/* Topic Name */}
                                            <div className="mb-3">
                                                <label htmlFor={`topicName${index}`} className="form-label">
                                                    Topic Name {index + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`topicName${index}`}
                                                    name="topicName"
                                                    value={topic.topicName}
                                                    onChange={(e) => handleTopicChange(index, e)}
                                                    required
                                                    placeholder="Enter topic name"
                                                />
                                            </div>

                                            {/* Topic Material (PDF) */}
                                            <div className="mb-3">
                                                <label htmlFor={`topicMaterial${index}`} className="form-label">
                                                    Topic Material (PDF)
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id={`topicMaterial${index}`}
                                                    name="topicMaterial"
                                                    accept=".pdf"
                                                    onChange={(e) => handleTopicChange(index, e)}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Another Topic Button */}
                                    <div className="text-center mb-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleAddTopic}
                                            style={{ width: "100%", maxWidth: "250px" }}
                                        >
                                            + Add Another Topic
                                        </button>
                                    </div>

                                    {/* Save Topics Button */}
                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            style={{ maxWidth: "250px" }}
                                        >
                                            Save Topics
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}

export default CoursesList;
