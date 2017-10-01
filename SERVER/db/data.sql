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
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `custom_dates`
--

LOCK TABLES `custom_dates` WRITE;
/*!40000 ALTER TABLE `custom_dates` DISABLE KEYS */;
INSERT INTO `custom_dates` VALUES (12,'Liburan Stress Proyek','2017-08-01',0,'2017-08-23 03:33:15','2017-08-23 03:33:15'),(13,'Liburan Stress Proyek','2017-08-02',0,'2017-08-23 03:33:15','2017-08-23 03:33:15'),(14,'Liburan Stress Proyek','2017-08-03',0,'2017-08-23 03:33:15','2017-08-23 03:33:15'),(15,'Liburan Stress Proyek','2017-08-04',0,'2017-08-23 03:33:15','2017-08-23 03:33:15'),(16,'Liburan Stress Proyek','2017-08-07',0,'2017-08-23 03:33:15','2017-08-23 03:33:15');
/*!40000 ALTER TABLE `custom_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` VALUES (1,'Fungsi Username','ML01','2017-08-18','2017-08-24','2017-08-17 18:53:00','2017-08-17 18:53:00',1),(2,'Fungsi Password','ML02','2017-08-24','2017-08-28','2017-08-17 18:53:00','2017-08-17 18:53:00',1),(3,'Fungsi Button','MU01','2017-09-18','2017-09-22','2017-08-17 22:26:00','2017-08-17 22:26:00',2),(4,'Function User 1','FU1',NULL,NULL,'2017-08-21 10:12:51','2017-08-21 10:12:51',3),(5,'Function User 1','FU2',NULL,NULL,'2017-08-21 10:23:39','2017-08-21 10:23:39',3);
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `historical_phases`
--

LOCK TABLES `historical_phases` WRITE;
/*!40000 ALTER TABLE `historical_phases` DISABLE KEYS */;
INSERT INTO `historical_phases` VALUES (1,'2017-08-21','2017-08-18','2017-08-19',NULL,0,0,'2',0,'2017-08-17 18:31:00','2017-08-17 18:31:00',2,1);
/*!40000 ALTER TABLE `historical_phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (1,'Module Login','ML','2017-08-18','2017-09-18','2017-08-17 18:31:00','2017-08-17 18:31:00',1),(2,'Module Upload','MU','2017-09-18','2017-10-18','2017-08-17 18:31:00','2017-08-17 18:31:00',1),(3,'Module User','MU',NULL,NULL,'2017-08-21 10:10:30','2017-08-21 10:10:30',1);
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `phase_names`
--

LOCK TABLES `phase_names` WRITE;
/*!40000 ALTER TABLE `phase_names` DISABLE KEYS */;
INSERT INTO `phase_names` VALUES (1,'Design','2017-08-17 18:57:00','2017-08-17 18:57:00'),(2,'Coding','2017-08-17 18:57:00','2017-08-17 18:57:00'),(3,'Testing','2017-08-17 18:57:00','2017-08-17 18:57:00');
/*!40000 ALTER TABLE `phase_names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `phases`
--

LOCK TABLES `phases` WRITE;
/*!40000 ALTER TABLE `phases` DISABLE KEYS */;
INSERT INTO `phases` VALUES (1,'2017-08-18','2017-08-19','2017-08-21',1,0,100,'2017-08-17 18:31:00','2017-08-21 09:44:00',1,2,1),(2,'2017-09-18','2017-09-19',NULL,0,0,0,'2017-08-17 22:26:00','2017-08-17 22:26:00',3,5,1),(3,'2017-08-20','2017-08-23',NULL,0,0,0,'2017-08-17 18:57:00','2017-08-17 18:57:00',1,5,2);
/*!40000 ALTER TABLE `phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Project Tracker','2017-08-18','2018-08-18','Sakura SS','HDI Hive Menteng','087873766464','sakurass@gmail.com','2017-08-17 18:31:00','2017-08-17 18:31:00',3),(2,'Sistem Informasi Penggajian','2017-08-18','2017-12-18','Sakura SS','HDI Hive Menteng','087873766464','sakurass@gmail.com','2017-08-17 18:31:00','2017-08-17 18:31:00',4);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_managements`
--

LOCK TABLES `user_managements` WRITE;
/*!40000 ALTER TABLE `user_managements` DISABLE KEYS */;
INSERT INTO `user_managements` VALUES (1,'admin','admin','admin','$2a$10$sSUfVkAFPr.4WkOsGSuf5.KNAIsb3raa.HvWAH5nCW4rznEmMqZHC','4','accept','active','2017-08-23 02:36:34','2017-08-23 02:36:34'),(2,'william','G64140070','William Hanugra','$2a$10$Am3SgNXca/NXgsA1WiltY.fyGYNcZc.9DaVf4agfURZvrgnwqdPUW','2','accept','active','2017-08-23 02:36:36','2017-08-23 02:36:36'),(3,'naufalfm','G64140091','Naufal Farras','$2a$10$vPMXxvkmQThLFeIs7bykv.efvcDB7K4GrM1EzbmsA89NRTicKHI/e','1','accept','active','2017-08-23 02:37:31','2017-08-23 02:37:31'),(4,'dony_1997','G64140007','Dony Rahmad','$2a$10$t2IsxviHAnba5l.r/iEvUOX6N79O/HCYIibGh0SXhPFWa198BlXsa','1','accept','active','2017-08-23 02:38:06','2017-08-23 02:38:06'),(5,'yoga','G64140108','Dwi Yoga','$2a$10$f2o.NuC4.HltZ64SGAd43ucdIBXUxwtgQ00BGZTljNtfOG5p6pAZa','3','accept','active','2017-08-23 02:38:28','2017-08-23 02:38:28');
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

-- Dump completed on 2017-08-23 13:20:57
