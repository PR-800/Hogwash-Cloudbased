/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `washing_machine`;
CREATE TABLE `washing_machine` (
    `id`     INT(3)  AUTO_INCREMENT,
    `brand`  VARCHAR(30),
    `model`  VARCHAR(30),
    `status` INT(1)  NOT NULL,
    `powder`    INT(3) NOT NULL,
    `softener`  INT(3) NOT NULL,
    `used_by`  INT(10),
    `time`  INT(3) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`used_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `options`;
CREATE TABLE `options` (
    `id`     INT(2)  AUTO_INCREMENT,
    `name`  VARCHAR(20),
    `price`   INT(2)  NOT NULL,
    `time`   INT(3)  NOT NULL,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `id`    INT(2)  AUTO_INCREMENT,
    `name`  VARCHAR(20),
    `path` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id`       INT(10) AUTO_INCREMENT,
    `email`    VARCHAR(50) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `role`      VARCHAR(20) DEFAULT 'customer',
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
    `id`        INT(10) AUTO_INCREMENT,
    `user_id`   INT(10) NOT NULL,
    `token`     varchar(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tokens_UN` (`token`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `queue`;
CREATE TABLE `queue` (
    `id`  INT(3)      AUTO_INCREMENT,
    `wm_id`     INT(3)  NOT NULL,
    `user_id`   INT(10) NOT NULL,
    `booking_time`      timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` INT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`wm_id`) REFERENCES `washing_machine`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
    `id`        INT(3)  AUTO_INCREMENT,
    `date`      timestamp DEFAULT CURRENT_TIMESTAMP,
    `payment_id`   INT(2) NOT NULL,
    `wm_id`     INT(3)  NOT NULL,
    `user_id`   INT(10) NOT NULL,
    `option_id` INT(2)  NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`wm_id`) REFERENCES `washing_machine`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE, 
    FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
    `id`        INT(3)  AUTO_INCREMENT,
    `path`      VARCHAR(200)    NOT NULL,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
    `id`        INT(10) AUTO_INCREMENT,
    `user_id`   INT(10) NOT NULL,
    `title`     varchar(100) NOT NULL,
    `description`     varchar(255) NOT NULL,
    `feedback_date`     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement` (
    `id`        INT(10) AUTO_INCREMENT,
    `user_id`   INT(10) NOT NULL,
    `announce` varchar(100),
    `date`     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);


INSERT INTO `users` (`email`, `password`, `role`) 
VALUES  ('admin@gmail.com', 'Admin1234', 'admin');

INSERT INTO `users` (`email`, `password`) 
VALUES  ('customer@gmail.com', 'Customer1234'),
        ('customer2@gmail.com', 'Customer1234'),
        ('Fluk@gmail.com', 'Customer1234'),
        ('Pear@gmail.com', 'Aa1234');

INSERT INTO `washing_machine` (`id`, `brand`, `model`, `status`, `powder`,`softener`) 
VALUES  (1, 'Panasonic', 'NA-127XB1WMY', 0, 80, 80), 
        (2, 'Panasonic', 'NA-127XB1WMY', 0, 50, 50), 
        (3, 'Panasonic', 'NA-127XB1WMY', 0, 100, 100), 
        (4, 'Panasonic', 'NA-127XB1WMY', 0, 45, 45), 
        (5, 'Panasonic', 'NA-127XB1WMY', 0, 60, 60), 
        (6, 'Panasonic', 'NA-127XB1WMY', 0, 10, 10), 
        (7, 'Panasonic', 'NA-127XB1WMY', 0, 35, 35), 
        (8, 'Panasonic', 'NA-127XB1WMY', 0, 0, 0);

INSERT INTO `options` (`id`, `name`, `price`, `time`) 
VALUES  (1, 'ซักเร็ว', 20, 6), 
        (2, 'ซักธรรมดา', 30, 30), 
        (3, 'ซักนํ้าร้อน', 50, 3000), 
        (4, 'ซักนํ้าเย็น', 50, 3000);

INSERT INTO `payments` (`id`, `name`, `path`) 
VALUES  (1, 'Prompt Pay', '/uploads/payments/promptPay.png'), 
        (2, 'True Money Wallet', '/uploads/payments/trueMoney.png'), 
        (3, 'Shopee Pay', '/uploads/payments/shopeePay.png'), 
        (4, 'Rabbit Line Pay', '/uploads/payments/rabbitLinePay.png');

INSERT INTO `images` (`id`, `path`) 
VALUES  (1, '/uploads/materials/wm.png'), 
        (2, '/uploads/materials/powder.png'), 
        (3, '/uploads/materials/softener.png'),
        (4, '/uploads/contact/line.png'), 
        (5, '/uploads/contact/mail.png'), 
        (6, '/uploads/contact/phone.png');

INSERT INTO `announcement` (`user_id`, `announce`) 
VALUES  (1, '');

INSERT INTO `history` (`date`, `payment_id`, `wm_id`, `user_id`, `option_id`) 
VALUES  ('2023-05-21 16:38:50', 3, 1, 4, 2),
        ('2023-04-18 10:08:55', 1, 3, 3, 1),
        ('2023-05-02 23:38:47', 2, 8, 4, 4),
        ('2023-05-11 20:38:05', 4, 4, 3, 3),
        ('2023-04-27 06:38:00', 3, 2, 2, 2);
        
INSERT INTO `feedback` (`id`, `user_id`, `title`, `description`, `feedback_date`)
VALUES (1, '2', 'แจ้งเครื่องซักผ้าเสีย', 'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis', '2023-04-20 01:58:01'),
      (2, '2', 'พนักงานหิวข้าว', 'description', '2023-04-29 01:58:01'),
      (3, '4', 'พลับขอเส้นหมี่น้ำ', 'ฉันค่อยค่อยกินเส้นหมี่ก่อน
ฉันค่อยค่อยกินถั่วงอกก่อน
ฉันค่อยค่อยกิน
กินน้ำซุปก่อน
แล้วก็รอรอรอ
แล้วฉันก็กินเส้นหมี่หมด
แล้วฉันก็กินถั่วงอกหมด
แล้วฉันก็กิน
จนน้ำซุปหมด
ก็จะเหลือเจ้าลูกกลมกลม
', '2023-05-02 01:58:01'),
      (4, '4', 'ใส่ลูกชิ้นเยอะๆ ชามนึงครับ', 'เธอมองอะไรกัน
คอยจ้องอยู่อย่างนั้น
แต่ละคนไม่น่าไว้ใจ
ลูกชิ้นของฉัน
ลูกชิ้นของฉัน
ลูกชิ้นของฉัน
ท่าทางไม่ปลอดภัย
ของรักของหวง
ของซื้อของขาย
ตะเกียบอย่ายื่นมานะ
ฉันไม่ยอม
อย่ามาแย่งลูกชิ้นฉันเลย
', '2023-05-10 01:58:01'),
      (5, '3', 'ผมมีเรื่องจะปรึกษาคุณครูครับ', 'เหลือลูกกลมกลมชอบสุดสุด
เหลือลูกนิดเดียวแหละชอบสุด
ขอเคี้ยวให้นาน
เลยไว้ท้ายสุด
แล้วจะเคี้ยว
เน้นเน้นทุกคำ
เธอมองอะไรกัน
คอยจ้องอยู่อย่างนั้น
แต่ละคนไม่น่าไว้ใจ
ลูกชิ้นของฉัน
ลูกชิ้นของฉัน
ลูกชิ้นของฉัน
ท่าทางไม่ปลอดภัย
ของรักของหวง
ของซื้อของขาย
ตะเกียบอย่ายื่นมานะ
ฉันไม่ยอม
อย่ามาแย่งลูกชิ้นฉันเลย', '2023-05-20 01:58:01');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;