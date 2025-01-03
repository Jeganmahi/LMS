import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CoursesList from "./courseList";
import { Table, Button, Container, Badge, Modal } from "react-bootstrap";

function AddCourse() {
    const [showModal, setShowModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");
    const [semesters, setSemesters] = useState([]);
    const [formData, setFormData] = useState({
        courseName: "",
        description: "",
        year: "",
        semester: "",
        courseMaterial: null,
        importantNotes: null,
        videoLink: "",
        duration: "",
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

   
    

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Create FormData instance
    // Create FormData instance
const data = new FormData();
data.append("courseName", formData.courseName);
data.append("description", formData.description);
data.append("year", formData.year);
data.append("semester", formData.semester);
data.append("duration", formData.duration);
data.append("videoLink", formData.videoLink);

if (formData.courseMaterial) {
    data.append("courseMaterial", formData.courseMaterial);
}
if (formData.importantNotes) {
    data.append("importantNotes", formData.importantNotes);
}

// Log FormData contents
for (let [key, value] of data.entries()) {
    console.log(`${key}: ${value}`);
}


        try {
            const response = await fetch("http://localhost:3000/Addcourses", {
                method: "POST",
                body: data,
            });
    
            if (response.ok) {
                alert("Course created successfully!");
                setShowModal(false); // Close the modal (adjust based on your modal logic)

                // Reset the form data to initial values
                setFormData({
                    courseName: "",
                    description: "",
                    year: "",
                    semester: "",
                    duration: "",
                    videoLink: "",
                    courseMaterial: null,
                    importantNotes: null,
                });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h3>Courses</h3>
                <button className="btn btn-success" onClick={toggleModal}>
                    + Create Course
                </button>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    aria-labelledby="createCourseModal"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createCourseModal">
                                    Create a New Course
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={toggleModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                            <form  encType="multipart/form-data">
                                    <div className="mb-3">
                                        <label htmlFor="courseName" className="form-label">
                                            Course Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="courseName"
                                            name="courseName"
                                            placeholder="Enter course name"
                                            value={formData.courseName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Course Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            placeholder="Enter course description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="year" className="form-label">
                                            Year
                                        </label>
                                        <select
                                            className="form-select"
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Year
                                            </option>
                                            <option value="1">First Year</option>
                                            <option value="2">Second Year</option>
                                            <option value="3">Third Year</option>
                                            <option value="4">Fourth Year</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="semester" className="form-label">
                                            Semester
                                        </label>
                                        <select
                                            className="form-select"
                                            id="semester"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Semester
                                            </option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                            <option value="8">Semester 8</option>
                                        </select>
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="duration" className="form-label">
                                            Duration (weeks)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="duration"
                                            name="duration"
                                            placeholder="Enter duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="courseMaterial" className="form-label">
                                            Course Material (PDF)
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="courseMaterial"
                                            name="courseMaterial"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="importantNotes" className="form-label">
                                            Important Notes (PDF)
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="importantNotes"
                                            name="importantNotes"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="videoLink" className="form-label">
                                            YouTube Video Link
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="videoLink"
                                            name="videoLink"
                                            placeholder="Enter YouTube video link"
                                            value={formData.videoLink}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <button type="submit" onClick={handleSubmit} className="btn btn-primary w-100">
                                        Create Course
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <CoursesList/>
        </div>
    );
}

export default AddCourse;
