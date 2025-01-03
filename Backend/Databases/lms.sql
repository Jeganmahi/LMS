-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2025 at 09:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `year` int(11) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `videoLink` varchar(255) DEFAULT NULL,
  `courseMaterial` varchar(255) DEFAULT NULL,
  `importantNotes` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `courseName`, `description`, `year`, `semester`, `duration`, `videoLink`, `courseMaterial`, `importantNotes`, `status`, `createdAt`) VALUES
(1, 'dfds', 'adsfasd', 2, 'Semester 6', '1', 'http://localhost/phpmyadmin/index.php?route=/server/databases', '/uploads/1735800801355.pdf', '/uploads/1735800801359.pdf', 'pending', '2025-01-02 06:53:21'),
(2, 'dfds', 'adsfas', 1, 'Semester 5', '1', 'http://localhost/phpmyadmin/index.php?route=/server/databases', '/uploads/1735801002641.pdf', '/uploads/1735801002645.pdf', 'pending', '2025-01-02 06:56:42'),
(3, 'dfds', 'sadfasd', 1, 'Semester 6', '1', 'http://localhost/phpmyadmin/index.php?route=/server/databases', '/uploads/1735802631656.pdf', '/uploads/1735802631660.pdf', 'pending', '2025-01-02 07:23:51'),
(4, 'asdfasd', 'fasdfasd', 2, 'Semester 6', '3', 'http://localhost/phpmyadmin/index.php?route=/server/databases', '/uploads/1735806261539.pdf', '/uploads/1735806261544.pdf', 'pending', '2025-01-02 08:24:21');

-- --------------------------------------------------------

--
-- Table structure for table `important_topics`
--

CREATE TABLE `important_topics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `topic_name` varchar(255) DEFAULT NULL,
  `material` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `important_topics`
--

INSERT INTO `important_topics` (`id`, `course_id`, `topic_name`, `material`) VALUES
(1, 1, 'sdfasdf', 'uploads\\1735803969797.pdf'),
(2, 1, 'sdfasdf', 'uploads\\1735803969800.pdf'),
(3, 4, 'asdfaf', 'uploads\\1735806522670.pdf'),
(4, 4, 'sdfasdf', 'uploads\\1735806522675.pdf');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `important_topics`
--
ALTER TABLE `important_topics`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `important_topics`
--
ALTER TABLE `important_topics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
