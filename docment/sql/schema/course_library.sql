-- 课程库管理数据库表结构
-- 创建时间：2023-04-10
-- 创建者：AI助手

-- 课程表
CREATE TABLE IF NOT EXISTS `course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  `code` varchar(20) NOT NULL COMMENT '课程编码',
  `name` varchar(100) NOT NULL COMMENT '课程名称',
  `english_name` varchar(200) DEFAULT NULL COMMENT '英文名称',
  `credit` decimal(3,1) NOT NULL COMMENT '学分',
  `hours` int(11) NOT NULL COMMENT '学时',
  `department_id` bigint(20) NOT NULL COMMENT '所属院系ID',
  `department_name` varchar(50) NOT NULL COMMENT '所属院系名称',
  `type` varchar(20) NOT NULL COMMENT '课程类型：required-必修课，elective-选修课，practical-实践课，thesis-论文/毕设',
  `status` varchar(20) NOT NULL COMMENT '课程状态：active-有效，draft-草稿，pending-待审核，disabled-已停用',
  `description` text COMMENT '课程描述',
  `objective` text COMMENT '教学目标',
  `prerequisite` varchar(500) DEFAULT NULL COMMENT '先修要求',
  `textbook` varchar(500) DEFAULT NULL COMMENT '教材',
  `assessment` text COMMENT '考核方式',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `updater_name` varchar(50) NOT NULL COMMENT '更新人姓名',
  `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_course_code` (`code`),
  KEY `idx_course_name` (`name`),
  KEY `idx_course_department` (`department_id`),
  KEY `idx_course_type` (`type`),
  KEY `idx_course_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 课程资料表
CREATE TABLE IF NOT EXISTS `course_material` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '资料ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `name` varchar(100) NOT NULL COMMENT '资料名称',
  `type` varchar(20) NOT NULL COMMENT '资料类型',
  `size` bigint(20) NOT NULL COMMENT '文件大小（字节）',
  `path` varchar(500) NOT NULL COMMENT '文件路径',
  `upload_time` datetime NOT NULL COMMENT '上传时间',
  `uploader_id` bigint(20) NOT NULL COMMENT '上传人ID',
  `uploader_name` varchar(50) NOT NULL COMMENT '上传人姓名',
  `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  PRIMARY KEY (`id`),
  KEY `idx_material_course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程资料表';

-- 课程教学安排表
CREATE TABLE IF NOT EXISTS `course_schedule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '安排ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `week` int(11) NOT NULL COMMENT '周次',
  `content` text NOT NULL COMMENT '教学内容',
  `hours` int(11) NOT NULL COMMENT '学时',
  `type` varchar(20) NOT NULL COMMENT '教学类型：讲授、实验、讨论、自学等',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  PRIMARY KEY (`id`),
  KEY `idx_schedule_course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程教学安排表';

-- 课程历史版本表
CREATE TABLE IF NOT EXISTS `course_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `version` varchar(20) NOT NULL COMMENT '版本号',
  `content` text NOT NULL COMMENT '版本内容（JSON格式）',
  `comments` varchar(500) DEFAULT NULL COMMENT '更新说明',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `updater_name` varchar(50) NOT NULL COMMENT '更新人姓名',
  PRIMARY KEY (`id`),
  KEY `idx_history_course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程历史版本表';

-- 课程审核申请表
CREATE TABLE IF NOT EXISTS `course_audit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '审核ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `type` varchar(20) NOT NULL COMMENT '申请类型：create-新建，update-修改，disable-停用，enable-启用',
  `content` text COMMENT '申请内容（JSON格式）',
  `status` varchar(20) NOT NULL COMMENT '审核状态：pending-待审核，approved-已通过，rejected-已驳回',
  `priority` varchar(20) DEFAULT 'normal' COMMENT '紧急程度：normal-普通，urgent-紧急，very_urgent-非常紧急',
  `applicant_id` bigint(20) NOT NULL COMMENT '申请人ID',
  `applicant_name` varchar(50) NOT NULL COMMENT '申请人姓名',
  `apply_time` datetime NOT NULL COMMENT '申请时间',
  `auditor_id` bigint(20) DEFAULT NULL COMMENT '审核人ID',
  `auditor_name` varchar(50) DEFAULT NULL COMMENT '审核人姓名',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_comment` text COMMENT '审核意见',
  `reject_reason` text COMMENT '驳回原因',
  PRIMARY KEY (`id`),
  KEY `idx_audit_course` (`course_id`),
  KEY `idx_audit_status` (`status`),
  KEY `idx_audit_applicant` (`applicant_id`),
  KEY `idx_audit_apply_time` (`apply_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程审核申请表';

-- 课程代码规则表
CREATE TABLE IF NOT EXISTS `course_code_rule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `name` varchar(50) NOT NULL COMMENT '规则名称',
  `prefix` varchar(10) NOT NULL COMMENT '前缀',
  `start_num` int(11) NOT NULL COMMENT '开始编号',
  `current_num` int(11) NOT NULL COMMENT '当前编号',
  `digit_length` int(11) NOT NULL COMMENT '数字位数',
  `discipline` varchar(50) NOT NULL COMMENT '适用学科',
  `description` varchar(500) DEFAULT NULL COMMENT '规则说明',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用（0-禁用 1-启用）',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  `updater_id` bigint(20) NOT NULL COMMENT '更新人ID',
  `updater_name` varchar(50) NOT NULL COMMENT '更新人姓名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_rule_name` (`name`),
  KEY `idx_rule_discipline` (`discipline`),
  KEY `idx_rule_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程代码规则表';

-- 课程关联分析表
CREATE TABLE IF NOT EXISTS `course_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `source_course_id` bigint(20) NOT NULL COMMENT '源课程ID',
  `target_course_id` bigint(20) NOT NULL COMMENT '目标课程ID',
  `relation_type` varchar(20) NOT NULL COMMENT '关联类型：prerequisite-先修，parallel-并行，subsequent-后续',
  `weight` int(11) DEFAULT '1' COMMENT '关联权重',
  `description` varchar(500) DEFAULT NULL COMMENT '关联说明',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `creator_id` bigint(20) NOT NULL COMMENT '创建人ID',
  `creator_name` varchar(50) NOT NULL COMMENT '创建人姓名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_course_relation` (`source_course_id`,`target_course_id`,`relation_type`),
  KEY `idx_relation_source` (`source_course_id`),
  KEY `idx_relation_target` (`target_course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COMMENT='课程关联分析表';

-- 课程类别表
CREATE TABLE IF NOT EXISTS `cl_course_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '类别ID',
  `name` varchar(100) NOT NULL COMMENT '类别名称',
  `code` varchar(50) DEFAULT NULL COMMENT '类别编码',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父类别ID',
  `level` int(11) DEFAULT '1' COMMENT '层级',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程类别表';

-- 课程修改记录表
CREATE TABLE IF NOT EXISTS `cl_course_change` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `change_type` varchar(20) DEFAULT NULL COMMENT '修改类型：新增、修改、删除',
  `change_fields` text COMMENT '修改字段(JSON)',
  `old_values` text COMMENT '原始值(JSON)',
  `new_values` text COMMENT '新值(JSON)',
  `change_reason` varchar(500) DEFAULT NULL COMMENT '修改原因',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态：0-待审核，1-已通过，2-已拒绝',
  `audit_user` varchar(50) DEFAULT NULL COMMENT '审核人',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_opinion` varchar(500) DEFAULT NULL COMMENT '审核意见',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程修改记录表';

-- 课程代码生成规则表
CREATE TABLE IF NOT EXISTS `cl_code_rule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `name` varchar(100) NOT NULL COMMENT '规则名称',
  `pattern` varchar(200) NOT NULL COMMENT '规则模式',
  `category_id` bigint(20) DEFAULT NULL COMMENT '适用课程类别ID',
  `dept_id` bigint(20) DEFAULT NULL COMMENT '适用院系ID',
  `description` varchar(500) DEFAULT NULL COMMENT '规则描述',
  `example` varchar(100) DEFAULT NULL COMMENT '示例',
  `prefix` varchar(50) DEFAULT NULL COMMENT '前缀',
  `suffix` varchar(50) DEFAULT NULL COMMENT '后缀',
  `separator` varchar(10) DEFAULT NULL COMMENT '分隔符',
  `digit_length` int(11) DEFAULT '4' COMMENT '数字位数',
  `increment_step` int(11) DEFAULT '1' COMMENT '递增步长',
  `current_value` int(11) DEFAULT '0' COMMENT '当前值',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程代码生成规则表';

-- 课程教材表
CREATE TABLE IF NOT EXISTS `cl_course_textbook` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `name` varchar(200) NOT NULL COMMENT '教材名称',
  `author` varchar(100) DEFAULT NULL COMMENT '作者',
  `publisher` varchar(100) DEFAULT NULL COMMENT '出版社',
  `publish_date` date DEFAULT NULL COMMENT '出版日期',
  `isbn` varchar(50) DEFAULT NULL COMMENT 'ISBN',
  `type` varchar(20) DEFAULT NULL COMMENT '类型：主教材、参考教材',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `description` text COMMENT '描述',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程教材表';

-- 课程同步记录表
CREATE TABLE IF NOT EXISTS `cl_course_sync` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `system_type` varchar(50) DEFAULT NULL COMMENT '系统类型',
  `sync_type` varchar(20) DEFAULT NULL COMMENT '同步类型：手动、自动',
  `sync_status` tinyint(1) DEFAULT '0' COMMENT '同步状态：0-未同步，1-同步中，2-同步成功，3-同步失败',
  `sync_time` datetime DEFAULT NULL COMMENT '同步时间',
  `sync_user_id` bigint(20) DEFAULT NULL COMMENT '同步用户ID',
  `total_count` int(11) DEFAULT '0' COMMENT '总数量',
  `success_count` int(11) DEFAULT '0' COMMENT '成功数量',
  `fail_count` int(11) DEFAULT '0' COMMENT '失败数量',
  `error_message` text COMMENT '错误信息',
  `sync_data` text COMMENT '同步数据摘要(JSON)',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_sync_time` (`sync_time`),
  KEY `idx_sync_user_id` (`sync_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程同步记录表';

-- 课程使用统计表
CREATE TABLE IF NOT EXISTS `cl_course_usage` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `program_count` int(11) DEFAULT '0' COMMENT '培养方案使用数',
  `major_count` int(11) DEFAULT '0' COMMENT '专业使用数',
  `college_count` int(11) DEFAULT '0' COMMENT '学院使用数',
  `school_count` int(11) DEFAULT '0' COMMENT '学校使用数',
  `student_count` int(11) DEFAULT '0' COMMENT '学生选课数',
  `semester_offered` int(11) DEFAULT '0' COMMENT '开课学期数',
  `last_offered_time` datetime DEFAULT NULL COMMENT '最后开课时间',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_course_id` (`course_id`),
  KEY `idx_program_count` (`program_count`),
  KEY `idx_student_count` (`student_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程使用统计表';

-- 课程知识点表
CREATE TABLE IF NOT EXISTS `cl_course_knowledge` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `name` varchar(100) NOT NULL COMMENT '知识点名称',
  `code` varchar(50) DEFAULT NULL COMMENT '知识点编码',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父知识点ID',
  `level` int(11) DEFAULT '1' COMMENT '层级',
  `description` text COMMENT '描述',
  `importance` int(11) DEFAULT '5' COMMENT '重要程度：1-10',
  `difficulty` int(11) DEFAULT '5' COMMENT '难度：1-10',
  `hours` decimal(10,2) DEFAULT '0.00' COMMENT '建议学时',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程知识点表'; 