-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: agrihack.party    Database: sakura_try
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checklists` (
  `checklist_id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_text` varchar(255) NOT NULL,
  `checklist_status` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `checklist_phase_id` int(11) NOT NULL,
  `checked_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`checklist_id`),
  KEY `checklist_phase_id` (`checklist_phase_id`),
  KEY `checked_by_id` (`checked_by_id`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`checklist_phase_id`) REFERENCES `phases` (`phase_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `checklists_ibfk_2` FOREIGN KEY (`checked_by_id`) REFERENCES `user_managements` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `functions` (
  `function_id` int(11) NOT NULL AUTO_INCREMENT,
  `function_name` varchar(255) NOT NULL,
  `function_code` varchar(255) NOT NULL,
  `function_start_date` date DEFAULT NULL,
  `function_end_date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `function_module_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`function_id`),
  KEY `function_module_id` (`function_module_id`),
  CONSTRAINT `functions_ibfk_1` FOREIGN KEY (`function_module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` VALUES (1,'Fungsi Username','ML01','2017-08-18','2017-08-24','2017-08-17 18:53:00','2017-08-17 18:53:00',1),(2,'Fungsi Password','ML02','2017-08-24','2017-08-28','2017-08-17 18:53:00','2017-08-17 18:53:00',1),(3,'Fungsi Button','MU01','2017-09-18','2017-09-22','2017-08-17 22:26:00','2017-08-17 22:26:00',2),(4,'Function User 1','FU1',NULL,NULL,'2017-08-21 10:12:51','2017-08-21 10:12:51',3),(5,'Function User 1','FU2',NULL,NULL,'2017-08-21 10:23:39','2017-08-21 10:23:39',3);
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historical_phases`
--

DROP TABLE IF EXISTS `historical_phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historical_phases` (
  `historicalphase_id` int(11) NOT NULL AUTO_INCREMENT,
  `historicalphase_input_date` date NOT NULL,
  `historicalphase_start_date` date NOT NULL,
  `historicalphase_end_date` date NOT NULL,
  `historicalphase_status_date` date DEFAULT NULL,
  `historicalphase_finished_flag` tinyint(1) DEFAULT '0',
  `historicalphase_postponed_flag` tinyint(1) DEFAULT '0',
  `historicalphase_historical_kind` enum('1','2','3','4','5') NOT NULL DEFAULT '5',
  `progress_percentage` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `historicalphase_PIC_id` int(11) DEFAULT NULL,
  `historicalphase_phase_id` int(11) NOT NULL,
  PRIMARY KEY (`historicalphase_id`),
  KEY `historicalphase_PIC_id` (`historicalphase_PIC_id`),
  KEY `historicalphase_phase_id` (`historicalphase_phase_id`),
  CONSTRAINT `historical_phases_ibfk_1` FOREIGN KEY (`historicalphase_PIC_id`) REFERENCES `user_managements` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `historical_phases_ibfk_2` FOREIGN KEY (`historicalphase_phase_id`) REFERENCES `phases` (`phase_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historical_phases`
--

LOCK TABLES `historical_phases` WRITE;
/*!40000 ALTER TABLE `historical_phases` DISABLE KEYS */;
INSERT INTO `historical_phases` VALUES (1,'2017-08-21','2017-08-18','2017-08-19',NULL,0,0,'2',0,'2017-08-17 18:31:00','2017-08-17 18:31:00',2,1);
/*!40000 ALTER TABLE `historical_phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(255) NOT NULL,
  `module_code_name` varchar(255) NOT NULL,
  `module_start_date` date DEFAULT NULL,
  `module_end_date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `module_project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`module_id`),
  KEY `module_project_id` (`module_project_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`module_project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (1,'Module Login','ML','2017-08-18','2017-09-18','2017-08-17 18:31:00','2017-08-17 18:31:00',1),(2,'Module Upload','MU','2017-09-18','2017-10-18','2017-08-17 18:31:00','2017-08-17 18:31:00',1),(3,'Module User','MU',NULL,NULL,'2017-08-21 10:10:30','2017-08-21 10:10:30',1);
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phase_names`
--

DROP TABLE IF EXISTS `phase_names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phase_names` (
  `phasename_id` int(11) NOT NULL AUTO_INCREMENT,
  `phasename_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`phasename_id`),
  UNIQUE KEY `phasename_name` (`phasename_name`),
  UNIQUE KEY `phase_names_phasename_name_unique` (`phasename_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phase_names`
--

LOCK TABLES `phase_names` WRITE;
/*!40000 ALTER TABLE `phase_names` DISABLE KEYS */;
INSERT INTO `phase_names` VALUES (1,'Design','2017-08-17 18:57:00','2017-08-17 18:57:00'),(2,'Coding','2017-08-17 18:57:00','2017-08-17 18:57:00'),(3,'Testing','2017-08-17 18:57:00','2017-08-17 18:57:00');
/*!40000 ALTER TABLE `phase_names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phases`
--

DROP TABLE IF EXISTS `phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phases` (
  `phase_id` int(11) NOT NULL AUTO_INCREMENT,
  `phase_start_date` date NOT NULL,
  `phase_end_date` date NOT NULL,
  `phase_status_date` date DEFAULT NULL,
  `phase_finished_flag` tinyint(1) DEFAULT '0',
  `phase_postponed_flag` tinyint(1) DEFAULT '0',
  `progress_percentage` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `phase_function_id` int(11) DEFAULT NULL,
  `phase_PIC_id` int(11) DEFAULT NULL,
  `phase_phasename_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`phase_id`),
  KEY `phase_function_id` (`phase_function_id`),
  KEY `phase_PIC_id` (`phase_PIC_id`),
  KEY `phase_phasename_id` (`phase_phasename_id`),
  CONSTRAINT `phases_ibfk_1` FOREIGN KEY (`phase_function_id`) REFERENCES `functions` (`function_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `phases_ibfk_2` FOREIGN KEY (`phase_PIC_id`) REFERENCES `user_managements` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `phases_ibfk_3` FOREIGN KEY (`phase_phasename_id`) REFERENCES `phase_names` (`phasename_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phases`
--

LOCK TABLES `phases` WRITE;
/*!40000 ALTER TABLE `phases` DISABLE KEYS */;
INSERT INTO `phases` VALUES (1,'2017-08-18','2017-08-19','2017-08-21',1,0,100,'2017-08-17 18:31:00','2017-08-21 09:44:00',1,2,1),(2,'2017-09-18','2017-09-19',NULL,0,0,0,'2017-08-17 22:26:00','2017-08-17 22:26:00',3,5,1),(3,'2017-08-20','2017-08-23',NULL,0,0,0,'2017-08-17 18:57:00','2017-08-17 18:57:00',1,5,2);
/*!40000 ALTER TABLE `phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) NOT NULL,
  `project_start_date` date DEFAULT NULL,
  `project_end_date` date DEFAULT NULL,
  `project_client_name` varchar(255) NOT NULL,
  `project_client_address` varchar(255) NOT NULL,
  `project_client_phone` varchar(255) NOT NULL,
  `project_client_email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `project_manager_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `project_manager_id` (`project_manager_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`project_manager_id`) REFERENCES `user_managements` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Project Tracker','2017-08-18','2018-08-18','Sakura SS','HDI Hive Menteng','087873766464','sakurass@gmail.com','2017-08-17 18:31:00','2017-08-17 18:31:00',3),(2,'Sistem Informasi Penggajian','2017-08-18','2017-12-18','Sakura SS','HDI Hive Menteng','087873766464','sakurass@gmail.com','2017-08-17 18:31:00','2017-08-17 18:31:00',4);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_managements`
--

DROP TABLE IF EXISTS `user_managements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_managements` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('1','2','3','4') NOT NULL DEFAULT '1',
  `verified_status` enum('accept','waiting','reject') NOT NULL DEFAULT 'waiting',
  `activated_status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `user_managements_username_unique` (`username`),
  UNIQUE KEY `user_managements_employee_id_unique` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_managements`
--

LOCK TABLES `user_managements` WRITE;
/*!40000 ALTER TABLE `user_managements` DISABLE KEYS */;
INSERT INTO `user_managements` VALUES (1,'admin','admin','admin','$2a$10$WHqK1.g5QeHtG3sic3GcUOOgMjHXii7TAOxpKs.Jq6noN1HSdGM2S','4','accept','active','2017-08-17 20:54:19','2017-08-17 20:54:19'),(2,'william','G64140070','William Hanugra','$2a$10$uhzsbOR9ZwCZvf8bzEodO.W7OeEBWdkQLjMMABOacJpYJ7bX9rpdO','2','accept','active','2017-08-17 20:55:55','2017-08-17 20:55:55'),(3,'naufalfm','G64140091','Naufal Farras','$2a$10$egEUispVw2b3fDyj4rB1zu1AznwWc3o4lGxNN1nYaOvdsAh7BRLzq','1','accept','active','2017-08-17 20:55:07','2017-08-17 20:55:07'),(4,'dony_1997','G64140007','Dony Rahmad','$2a$10$CLf3ju.M5US3r8J/.3H.m.UpV5nLfRkCvwzOdD1lq.QIUKV8lksmC','1','accept','active','2017-08-17 20:55:32','2017-08-17 20:55:32'),(5,'yoga','G64140108','Dwi Yoga','$2a$10$6mCj.Tiejt2jBcjJP9eaXOOoavcp3CBm1/GSr/lm28RqKOKmKVfN6','3','accept','active','2017-08-17 20:54:22','2017-08-17 20:54:22');
/*!40000 ALTER TABLE `user_managements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-08-21 21:29:19
