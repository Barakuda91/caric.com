CREATE TABLE countrys (
`id` INT (4) AUTO_INCREMENT,
`title` VARCHAR(20) NOT NULL ,
PRIMARY KEY (id),
UNIQUE (`title`)
) COMMENT = 'таблица стран производителей';

INSERT INTO countrys () VALUES('','АНГЛИЯ'),('','ЯПОНИЯ'),('','ГЕРМАНИЯ'),('','США'),('','КИТАЙ'),('','КОРЕЯ'),('','РОССИЯ');

CREATE TABLE manufacture (
`id` INT (4) AUTO_INCREMENT,
`title` VARCHAR(20) NOT NULL,
`type` SET('car','wheel','tyers') COMMENT 'тип производителя, автомобили, колёса, диски',
`counrty_id` int(4) NOT NULL,
PRIMARY KEY (id),
UNIQUE (`title`, `type`)
) COMMENT = 'список производителей с привязкой к стране производителя';

INSERT INTO manufacture () VALUES('','BMW','car',3),('','AUDI','car',3),('','BBS','wheel',3),('','BORBET','wheel',3);

CREATE TABLE models (
`id` INT (4) AUTO_INCREMENT,
`title` VARCHAR(20) NOT NULL,
`manufacture_id` INT(4) NOT NULL,
`type` SET('CAR','WHEEL','TYRES','SPACERS'),
`year_start` INT(4) NULL,
`year_end` INT(4) NULL,
PRIMARY KEY (id)
) COMMENT = 'таблица моделей изделий';

INSERT INTO models () VALUES('','RS',3,'WHEEL','',''),('','A',4,'WHEEL','','');

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

INSERT INTO wheels () VALUES('',5,108,25,40,6.7,17);

CREATE TABLE tyers (
`id` INT (10) AUTO_INCREMENT,
`wt` INT(3) COMMENT 'ширина шины в мм',
`ph` INT(3) COMMENT 'высота профиля в процентах',
`t_dia` INT(3) COMMENT 'диаметр шины',
PRIMARY KEY (id)
) COMMENT = 'таблица шины';

CREATE TABLE spacers (
`id` INT (10) AUTO_INCREMENT,
`nn` INT(1) NOT NULL COMMENT 'количество посадочных отверстий',
`pcd` INT(3) NOT NULL COMMENT 'диаметр посадочных отверстий мм',
`width` INT(3) NULL COMMENT 'ширина мм',
PRIMARY KEY (id)
) COMMENT = 'таблица проставки';

SELECT models.id, manufacture.type AS `type`, manufacture.title AS `manufacture`,models.title AS `model`, countrys.title AS `country` FROM models
LEFT JOIN (manufacture, countrys) ON ( models.manufacture_id = manufacture.id
AND manufacture.counrty_id = countrys.id);

