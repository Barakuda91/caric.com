DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role_id` tinyint(2) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date` int(11) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_profile_1` varchar(255) DEFAULT NULL,
  `contact_profile_2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_2` (`email`)
);
INSERT INTO `users` (`id`, `name`, `role_id`, `password`, `email`, `date`, `contact_email`, `contact_phone`, `contact_profile_1`, `contact_profile_2`) VALUES
('', 'Padavan', 10, '$3M16C4djjygQ', 'padavanzp1@gmail.com', 1472070707, 'rtyrty@qwe.we5', '53453453', 'https://vk.com/id=2', 'https://www.drive2.ru/r/mitsubishi/662517/'),
('', 'Barakuda', 10, '$3M16C4djjygQ', 'barakudatm@gmail.com', 1472070707, 'rtyrty@qwe.we5', '53453453', 'https://vk.com/id=1', 'https://www.drive2.ru/r/mitsubishi/662517/');


DROP TABLE IF EXISTS countrys;
CREATE TABLE countrys (
`id` INT (4) AUTO_INCREMENT,
`title` VARCHAR(20) NOT NULL ,
PRIMARY KEY (id),
UNIQUE (`title`)
) COMMENT = 'таблица стран производителей';
INSERT INTO countrys () VALUES('','АНГЛИЯ'),('','ЯПОНИЯ'),('','ГЕРМАНИЯ'),('','США'),('','КИТАЙ'),('','КОРЕЯ'),('','РОССИЯ');

DROP TABLE IF EXISTS manufacture;
CREATE TABLE manufacture (
`id` INT (4) AUTO_INCREMENT,
`title` VARCHAR(20) NOT NULL,
`type` ENUM('car','wheel','tyers') COMMENT 'тип производителя, автомобили, колёса, диски',
`counrty_id` int(4) NULL,
PRIMARY KEY (id),
UNIQUE (`title`, `type`)
) COMMENT = 'список производителей с привязкой к стране производителя';
INSERT INTO manufacture () VALUES('','BMW','car',3),('','AUDI','car',3),('','BBS','wheel',3),('','BORBET','wheel',3);

DROP TABLE IF EXISTS models;
CREATE TABLE models (
`id` INT (11) AUTO_INCREMENT,
`title` VARCHAR(60) NOT NULL,
`manufacture_id` INT(4) NOT NULL,
`type` ENUM('CAR','WHEEL','TYRES','SPACERS'),
`year_start` YEAR NULL,
`year_end` YEAR NULL,
PRIMARY KEY (id)
) COMMENT = 'таблица моделей изделий';

INSERT INTO models () VALUES('','RS',3,'WHEEL','',''),('','A',4,'WHEEL','',''),('','e30',1,'CAR','',''),('','100 Avant',2,'CAR','','');

DROP TABLE IF EXISTS wheels;
CREATE TABLE wheels (
`id` INT (10) AUTO_INCREMENT,
`nn` INT(1) NOT NULL COMMENT 'количество посадочных отверстий',
`pcd` INT(3) NOT NULL COMMENT 'диаметр посадочных отверстий мм',
`et` INT(3) NOT NULL COMMENT 'вылет мм',
`co_dia` INT(3) NOT NULL COMMENT 'диаметр центрального отверстия мм',
`ww` FLOAT NOT NULL COMMENT 'ширина диска дюйм',
`w_dia` INT(3) NOT NULL COMMENT 'диаметр диска',
PRIMARY KEY (id)
) COMMENT = 'таблица диски';

INSERT INTO wheels () VALUES('',4,100,35,40,6.7,17);

DROP TABLE IF EXISTS tires;
CREATE TABLE tires (
`id` INT (10) AUTO_INCREMENT,
`wt` INT(3) COMMENT 'ширина шины в мм',
`ph` INT(3) COMMENT 'высота профиля в процентах',
`t_dia` INT(3) COMMENT 'диаметр шины',
PRIMARY KEY (id)
) COMMENT = 'таблица шины';

DROP TABLE IF EXISTS spacers;
CREATE TABLE spacers (
`id` INT(11) AUTO_INCREMENT,
`nn` INT(1) NOT NULL COMMENT 'количество посадочных отверстий',
`pcd` INT(3) NOT NULL COMMENT 'диаметр посадочных отверстий мм',
`width` INT(3) NULL COMMENT 'ширина мм',
PRIMARY KEY (id)
) COMMENT = 'таблица проставки';

DROP TABLE IF EXISTS advert;
CREATE TABLE advert (
`id` INT (11) AUTO_INCREMENT,
`title` VARCHAR(70) NOT NULL COMMENT 'название',
`description` VARCHAR(4096) NOT NULL COMMENT 'описание',
`model_id` INT(11) NULL,
`manufacture_id` INT(11) NULL,
`wheel_id` INT(11) NULL,
`tires_id` INT(11) NULL,
`spacers_id` INT(11) NULL,
`user_id` INT(11) NOT NULL,
PRIMARY KEY (id)
) COMMENT = 'таблица объявлений';

DROP TABLE IF EXISTS vehicle_association;
CREATE TABLE vehicle_association (
`id` INT(11) AUTO_INCREMENT,
`model_id` INT(11) NOT NULL,
`wheel_id` INT(11) NOT NULL,
`tires_id` INT(11) NOT NULL,
PRIMARY KEY (id)
) COMMENT = '';
INSERT INTO vehicle_association () VALUES('',3,1,2);


SELECT models.id, manufacture.type AS `type`, manufacture.title AS `manufacture`,models.title AS `model`, countrys.title AS `country` FROM models
LEFT JOIN (manufacture, countrys) ON ( models.manufacture_id = manufacture.id
AND manufacture.counrty_id = countrys.id);

