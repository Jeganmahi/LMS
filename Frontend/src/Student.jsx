import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { FaVideo, FaFileDownload, FaBook } from 'react-icons/fa';  // Font Awesome icons
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';  // Font Awesome download icon

const Student = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");  // State for selected year filter
    const [selectedSemester, setSelectedSemester] = useState("");  // State for selected semester filter

    useEffect(() => {
        // Fetch courses data from the API
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:3000/getStudentCourses"); // Adjust the endpoint to match your backend
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
                setFilteredCourses(data); // Initially, show all courses
            } else {
                alert("Error fetching courses.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("An error occurred while fetching the courses.");
        }
    };

    // Filter courses based on selected year and semester
    const handleFilterChange = () => {
        let filtered = courses;
        console.log(courses);
        console.log(selectedYear);
        console.log(selectedSemester)
        if (selectedYear) {
            filtered = filtered.filter(course => course.year == selectedYear);
        }

        if (selectedSemester) {
            filtered = filtered.filter(course => course.semester == selectedSemester);
        }

        setFilteredCourses(filtered);
        console.log(filteredCourses) // Update filtered courses
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(null); // Clear the selected course
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

    return (
        <Container>
            <h2 className="my-4">Student Course Management</h2>

            {/* Filters Section - Placed in Top Right */}
            <div className="d-flex justify-content-end mb-4 align-items-center">
                <Form inline className="d-flex gap-3">
                    {/* Year Filter */}
                    <Form.Group controlId="yearFilter" className="mb-0">
                        <Form.Label className="visually-hidden">Select Year</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="form-select form-select-lg border-0 rounded-3 shadow-sm"
                        >
                            <option value="">All Years</option>
                            <option value="1">Year 1</option>
                            <option value="2">Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Semester Filter */}
                    <Form.Group controlId="semesterFilter" className="mb-0">
                        <Form.Label className="visually-hidden">Select Semester</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="form-select form-select-lg border-0 rounded-3 shadow-sm"
                        >
                            <option value="">All Semesters</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                            <option value="5">Semester 5</option>
                            <option value="6">Semester 6</option>
                            <option value="7">Semester 7</option>
                            <option value="8">Semester 8</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Apply Filters Button */}
                    <Button
                        variant="primary"
                        onClick={handleFilterChange}
                        className="ms-2 px-4 py-2 rounded-3 shadow-lg hover-shadow-lg transition-all"
                    >
                        <i className="bi bi-funnel-fill me-2"></i> Apply Filters
                    </Button>
                </Form>
            </div>


            {/* Courses Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Duration</th>
                        <th>Video Link</th>
                        <th>Materials</th>
                        <th>Topics</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.courseName}</td>
                            <td>{course.year}</td>
                            <td>{course.semester}</td>
                            <td>{course.duration}</td>
                            <td>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="video-tooltip">Watch Video</Tooltip>}
                                >
                                    <a href={course.videoLink} target="_blank" rel="noopener noreferrer">
                                        <FaVideo color="#007bff" size={24} />
                                    </a>
                                </OverlayTrigger>
                            </td>
                            <td>
                                <ul>
                                    <li>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="material-tooltip">Download Course Material</Tooltip>}
                                        >
                                            <a href={`http://localhost:3000/${course.courseMaterial}`} target="_blank" rel="noopener noreferrer">
                                                <FaFileDownload color="#28a745" size={24} />
                                            </a>
                                        </OverlayTrigger>
                                    </li>
                                    {course.importantNotes && (
                                        <li>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="notes-tooltip">Download Important Notes</Tooltip>}
                                            >
                                                <a href={`http://localhost:3000/${course.importantNotes}`} target="_blank" rel="noopener noreferrer">
                                                    <FaBook color="#ffc107" size={24} />
                                                </a>
                                            </OverlayTrigger>
                                        </li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    onClick={() => handleViewTopicsClick(course.id)}
                                    className="ms-2"
                                >
                                    <FaBook size={16} /> View Topics
                                </Button>
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
                            <Table striped bordered hover responsive className="shadow-sm">
                                <thead className="bg-primary text-white">
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
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-${topic.id}`}>Click to download material</Tooltip>}
                                                >
                                                    <a href={`http://localhost:3000/${topic.material}`} target="_blank" rel="noopener noreferrer">
                                                        <FaDownload color="#28a745" size={20} /> <span className="ms-2">Download</span>
                                                    </a>
                                                </OverlayTrigger>
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

export default Student;
