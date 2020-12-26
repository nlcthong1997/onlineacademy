-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2020 at 03:37 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onlineacademy`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `search_name` varchar(300) DEFAULT NULL,
  `img` varchar(260) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `search_name`, `img`) VALUES
(1, 'Lập trình Web', NULL, NULL),
(2, 'Lập trình di động', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `slides_id` int(11) DEFAULT NULL,
  `videos_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `name` varchar(300) NOT NULL,
  `search_name` varchar(300) DEFAULT NULL,
  `teacher` varchar(300) NOT NULL,
  `point_evaluate` int(11) DEFAULT NULL,
  `qty_student_evaluate` int(11) DEFAULT NULL,
  `qty_student_registed` int(11) DEFAULT NULL,
  `img` varchar(260) DEFAULT NULL,
  `img_large` varchar(260) DEFAULT NULL,
  `price` decimal(10,0) NOT NULL,
  `price_promo` decimal(10,0) DEFAULT NULL,
  `sort_desc` varchar(350) DEFAULT NULL,
  `detail_desc` text DEFAULT NULL,
  `status` enum('done','not_done') NOT NULL DEFAULT 'not_done',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `categories_id`, `slides_id`, `videos_id`, `title`, `name`, `search_name`, `teacher`, `point_evaluate`, `qty_student_evaluate`, `qty_student_registed`, `img`, `img_large`, `price`, `price_promo`, `sort_desc`, `detail_desc`, `status`, `created_at`) VALUES
(1, 1, NULL, 1, 'Khóa học lập trinh Web từ cơ bản đến nâng cao', 'Lập trình NodeJS', 'lap trinh node js', 'Nguyễn Văn A', NULL, 16, 5, NULL, NULL, '3400000', NULL, 'Khóa học dành cho người mới bắt đầu', NULL, 'not_done', '2020-12-20 06:57:58'),
(2, 1, NULL, 4, 'Khóa học lập trinh Web từ cơ bản đến nâng cao', 'Lập trình PHP', 'lap trinh php', 'Nguyễn Văn B', NULL, 12, 8, NULL, NULL, '3000000', NULL, 'Khóa học dành cho người mới bắt đầu', NULL, 'not_done', '2020-12-16 06:57:58'),
(3, 2, NULL, 2, 'Khóa học lập trinh di động từ cơ bản đến nâng cao', 'Lập trình Android', 'lap trinh android', 'Nguyễn Văn C', NULL, 12, 6, NULL, NULL, '3750000', NULL, 'Khóa học dành cho người mới bắt đầu', NULL, 'not_done', '2020-12-19 06:57:58'),
(4, 2, NULL, 3, 'Khóa học lập trinh di động từ cơ bản đến nâng cao', 'Lập trình IOS', 'lap trinh ios', 'Nguyễn Văn D', NULL, 7, 3, NULL, NULL, '4100000', NULL, 'Khóa học dành cho người mới bắt đầu', NULL, 'not_done', '2020-12-20 06:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `process_course`
--

CREATE TABLE `process_course` (
  `id` int(11) NOT NULL,
  `status` enum('learing','done','not_started') NOT NULL DEFAULT 'not_started',
  `current_unit_video` varchar(260) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`urls`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `full_name` varchar(500) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `full_name`, `refresh_token`) VALUES
(1, 'chithong', '$2a$10$32tZVPUnC/hDbQZ7bstgnO1sVxHqPoZYf4V7oHIDof8Scf9UM9UWi', 'nguyenlamchi@gmai.co', 'user', 'nguyen lam chi', 'XhPsoX0qCXYVJaRyp06rPs8gzbFNHTAo'),
(6, 'user1', '$2a$10$/lnFNWhkBzw4y7XQiJqkdeQAQFI8doVdnXUlE.vhETnCSC6t1P1li', 'user1mail@gmail.com', 'user', NULL, NULL),
(7, 'user2', '$2a$10$hQBTxhGRTAnQGOUOSR3/eup3XnkPZgfj5x6Ww/N/rhhgWe0C37.PG', 'user2mail@gmail.com', 'user', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_courses`
--

CREATE TABLE `users_courses` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `process_course_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_courses`
--

INSERT INTO `users_courses` (`id`, `users_id`, `courses_id`, `process_course_id`, `created_at`) VALUES
(1, 1, 1, NULL, '2020-12-19 17:47:03'),
(2, 1, 3, NULL, '2020-12-17 17:47:03'),
(3, 6, 1, NULL, '2020-12-15 18:06:19'),
(4, 7, 2, NULL, '2020-12-12 18:06:19');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`urls`)),
  `views` int(30) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `urls`, `views`) VALUES
(1, NULL, 50),
(2, NULL, 30),
(3, NULL, 222),
(4, NULL, 75);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `categories` ADD FULLTEXT KEY `search_name` (`search_name`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `search_name` (`search_name`);

--
-- Indexes for table `process_course`
--
ALTER TABLE `process_course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `users_courses`
--
ALTER TABLE `users_courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `process_course`
--
ALTER TABLE `process_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users_courses`
--
ALTER TABLE `users_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
