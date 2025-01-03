import React, { useState, useEffect } from "react";
import { Table, Button, Container, Badge, Modal } from "react-bootstrap";
import axios from "axios";
import { FaPlay, FaFileDownload, FaEye, FaCheck, FaTimes } from 'react-icons/fa'; // Import FontAwesome icons
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // Tooltips f

const AdminPage = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        // Fetch courses data from the API
        fetchCourses();
    }, []);

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

    const handleStatusChange = async (courseId, status) => {
        try {
            const response = await axios.put(`http://localhost:3000/ActionCourses/${courseId}`, { status });
            if (response.status === 200) {
                // Update the course status in the UI
                setCourses(courses.map((course) =>
                    course.id === courseId ? { ...course, status } : course
                ));
            } else {
                alert("Error updating course status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("An error occurred while updating the status.");
        }
    };

    const handleViewTopicsClick = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/getCourseTopics/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSelectedCourse(data); // Set the topics data into state
                setShowModal(true); // Show the modal
            } else {
                alert("Error fetching topics and notes.");
            }
        } catch (error) {
            console.error("Error fetching topics and notes:", error);
            alert("An error occurred while fetching the topics and notes.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(null); // Clear the selected course
    };

    return (
        <Container>
            <h2 className="my-4">Admin Course Management</h2>
            <Table striped bordered hover responsive className="shadow-sm">
    <thead className="bg-primary text-white">
        <tr>
            <th>Course Name</th>
            <th>Year</th>
            <th>Semester</th>
            <th>Duration</th>
            <th>Video</th>
            <th>Materials</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {courses.map((course) => (
            <tr key={course.id}>
                <td>{course.courseName}</td>
                <td>{course.year}</td>
                <td>{course.semester}</td>
                <td>{course.duration}</td>
                <td>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Watch Course Video</Tooltip>}
                    >
                        <a href={course.videoLink} target="_blank" rel="noopener noreferrer">
                            <FaPlay color="#007bff" size={20} />
                        </a>
                    </OverlayTrigger>
                </td>
                <td>
                    <ul className="list-unstyled">
                        <li>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Download Course Material</Tooltip>}
                            >
                                <a href={`http://localhost:3000/${course.courseMaterial}`} target="_blank" rel="noopener noreferrer">
                                    <FaFileDownload color="#28a745" size={20} />
                                </a>
                            </OverlayTrigger>
                        </li>
                        {course.importantNotes && (
                            <li>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Download Important Notes</Tooltip>}
                                >
                                    <a href={`http://localhost:3000/${course.importantNotes}`} target="_blank" rel="noopener noreferrer">
                                        <FaFileDownload color="#ffc107" size={20} />
                                    </a>
                                </OverlayTrigger>
                            </li>
                        )}
                    </ul>
                </td>
                <td>
                    {/* Status Badge */}
                    {course.status === "approved" ? (
                        <Badge bg="success">
                            <FaCheck /> Approved
                        </Badge>
                    ) : course.status === "rejected" ? (
                        <Badge bg="danger">
                            <FaTimes /> Rejected
                        </Badge>
                    ) : (
                        <Badge bg="warning">
                            <FaEye /> Pending
                        </Badge>
                    )}
                </td>
                <td>
                    {course.status === "pending" ? (
                        <>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Approve Course</Tooltip>}
                            >
                                <Button
                                    variant="success"
                                    onClick={() => handleStatusChange(course.id, "approved")}
                                    disabled={course.status === "approved"}
                                    className="ms-2"
                                >
                                    <FaCheck /> Approve
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Reject Course</Tooltip>}
                            >
                                <Button
                                    variant="danger"
                                    onClick={() => handleStatusChange(course.id, "rejected")}
                                    disabled={course.status === "rejected"}
                                    className="ms-2"
                                >
                                    <FaTimes /> Reject
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>View Course Topics</Tooltip>}
                            >
                                <Button
                                    variant="info"
                                    onClick={() => handleViewTopicsClick(course.id)}
                                    className="ms-2"
                                >
                                    <FaEye /> View Topics
                                </Button>
                            </OverlayTrigger>
                        </>
                    ) : (
                        <Badge>{course.status}</Badge> // Display the status if not "pending"
                    )}
                </td>
            </tr>
        ))}
    </tbody>
</Table>

            {/* Modal for Viewing Topics */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Important Topics for {selectedCourse?.courseName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourse ? (
                        <>
                            {/* Topics Table */}
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Topic Name</th>
                                        <th>Material</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCourse.map((topic) => (
                                        <tr key={topic.id}>
                                            <td>{topic.topic_name}</td>
                                            <td>
                                                <a href={`http://localhost:3000/${topic.material}`} target="_blank" rel="noopener noreferrer">
                                                    Download Material
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Optionally, render any important notes if available */}
                            {selectedCourse?.notes?.length > 0 && (
                                <>
                                    <h5>Important Notes:</h5>
                                    <ul>
                                        {selectedCourse.notes.map((note, index) => (
                                            <li key={index}>{note}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    ) : (
                        <p>Loading topics and notes...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminPage;
