-- 课程性质表
CREATE TABLE IF NOT EXISTS `t_course_nature` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` varchar(10) NOT NULL COMMENT '性质代码',
  `name` varchar(50) NOT NULL COMMENT '性质名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1-正常，0-禁用',
  `sort` int(11) NOT NULL DEFAULT '1' COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程性质表';

-- 课程类别表
CREATE TABLE IF NOT EXISTS `t_course_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` varchar(10) NOT NULL COMMENT '类别代码',
  `name` varchar(50) NOT NULL COMMENT '类别名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1-正常，0-禁用',
  `sort` int(11) NOT NULL DEFAULT '1' COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程类别表';

-- 考试形式表
CREATE TABLE IF NOT EXISTS `t_course_exam_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` varchar(10) NOT NULL COMMENT '形式代码',
  `name` varchar(50) NOT NULL COMMENT '形式名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1-正常，0-禁用',
  `sort` int(11) NOT NULL DEFAULT '1' COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考试形式表';

-- 初始数据
INSERT INTO `t_course_nature` (`code`, `name`, `status`, `sort`) VALUES
('BX', '必修', 1, 1),
('XX', '选修', 1, 2),
('XB', '限必', 1, 3),
('TX', '通选', 1, 4),
('ZX', '专选', 0, 5);

INSERT INTO `t_course_category` (`code`, `name`, `status`, `sort`) VALUES
('GC', '公共基础课', 1, 1),
('ZJ', '专业基础课', 1, 2),
('ZY', '专业课', 1, 3),
('SJ', '实践教学', 1, 4),
('TX', '通识选修课', 1, 5),
('JX', '集中实践', 0, 6);

INSERT INTO `t_course_exam_type` (`code`, `name`, `status`, `sort`) VALUES
('KS', '考试', 1, 1),
('KC', '考查', 1, 2),
('LW', '论文', 1, 3),
('SJ', '设计', 1, 4),
('CZ', '操作', 0, 5); 