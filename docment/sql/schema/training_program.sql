-- 培养方案管理数据库表结构
-- 创建时间：2023-04-10
-- 创建者：AI助手

-- 培养方案表
CREATE TABLE IF NOT EXISTS `tp_program` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '方案ID',
  `code` varchar(50) NOT NULL COMMENT '方案编码',
  `name` varchar(100) NOT NULL COMMENT '方案名称',
  `school_id` bigint(20) DEFAULT NULL COMMENT '学校ID',
  `college_id` bigint(20) DEFAULT NULL COMMENT '学院ID',
  `major_id` bigint(20) DEFAULT NULL COMMENT '专业ID',
  `version` varchar(20) DEFAULT NULL COMMENT '版本号',
  `year` int(11) DEFAULT NULL COMMENT '年份',
  `description` text COMMENT '方案描述',
  `cultivation_goals` text COMMENT '培养目标',
  `graduation_requirements` text COMMENT '毕业要求',
  `standard_credits` int(11) DEFAULT NULL COMMENT '标准学分',
  `min_credits` int(11) DEFAULT NULL COMMENT '最低学分',
  `learning_years` int(11) DEFAULT '4' COMMENT '学制年限',
  `degree_type` varchar(20) DEFAULT NULL COMMENT '学位类型',
  `source_type` tinyint(1) DEFAULT '0' COMMENT '来源类型：0-手动创建，1-导入，2-引用',
  `reference_id` bigint(20) DEFAULT NULL COMMENT '引用方案ID',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态：0-草稿，1-审核中，2-已发布，3-已归档',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `is_template` tinyint(1) DEFAULT '0' COMMENT '是否模板：0-否，1-是',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_school_major` (`school_id`,`college_id`,`major_id`),
  KEY `idx_year_version` (`year`,`version`),
  KEY `idx_status` (`status`),
  KEY `idx_is_template` (`is_template`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案表';

-- 培养方案模块表
CREATE TABLE IF NOT EXISTS `tp_program_module` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模块ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `name` varchar(100) NOT NULL COMMENT '模块名称',
  `code` varchar(50) DEFAULT NULL COMMENT '模块编码',
  `type` varchar(50) DEFAULT NULL COMMENT '模块类型',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父模块ID',
  `description` text COMMENT '模块描述',
  `total_credits` decimal(10,2) DEFAULT '0.00' COMMENT '总学分',
  `min_credits` decimal(10,2) DEFAULT '0.00' COMMENT '最低学分',
  `required_credits` decimal(10,2) DEFAULT '0.00' COMMENT '必修学分',
  `elective_credits` decimal(10,2) DEFAULT '0.00' COMMENT '选修学分',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案模块表';

-- 培养方案课程表
CREATE TABLE IF NOT EXISTS `tp_program_course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `module_id` bigint(20) DEFAULT NULL COMMENT '模块ID',
  `course_id` bigint(20) NOT NULL COMMENT '课程ID',
  `course_code` varchar(50) DEFAULT NULL COMMENT '课程代码',
  `course_name` varchar(100) DEFAULT NULL COMMENT '课程名称',
  `course_type` varchar(20) DEFAULT NULL COMMENT '课程类型',
  `course_nature` varchar(20) DEFAULT NULL COMMENT '课程性质：必修、选修',
  `credits` decimal(10,2) DEFAULT '0.00' COMMENT '学分',
  `theory_hours` int(11) DEFAULT '0' COMMENT '理论学时',
  `practice_hours` int(11) DEFAULT '0' COMMENT '实践学时',
  `total_hours` int(11) DEFAULT '0' COMMENT '总学时',
  `semester` varchar(20) DEFAULT NULL COMMENT '开课学期',
  `exam_type` varchar(20) DEFAULT NULL COMMENT '考核方式',
  `prerequisites` varchar(500) DEFAULT NULL COMMENT '先修课程',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_module_id` (`module_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案课程表';

-- 培养方案审批表
CREATE TABLE IF NOT EXISTS `tp_program_approval` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '审批ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `workflow_inst_id` bigint(20) DEFAULT NULL COMMENT '工作流实例ID',
  `submit_user_id` bigint(20) DEFAULT NULL COMMENT '提交用户ID',
  `submit_time` datetime DEFAULT NULL COMMENT '提交时间',
  `current_approver` varchar(100) DEFAULT NULL COMMENT '当前审批人',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态：0-待审批，1-审批中，2-已通过，3-已驳回',
  `result` tinyint(1) DEFAULT NULL COMMENT '结果：0-不通过，1-通过',
  `comment` text COMMENT '审批意见',
  `approve_time` datetime DEFAULT NULL COMMENT '审批时间',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_workflow_inst_id` (`workflow_inst_id`),
  KEY `idx_submit_user_id` (`submit_user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案审批表';

-- 培养方案模板表
CREATE TABLE IF NOT EXISTS `tp_program_template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `code` varchar(50) NOT NULL COMMENT '模板编码',
  `name` varchar(100) NOT NULL COMMENT '模板名称',
  `description` text COMMENT '模板描述',
  `category` varchar(50) DEFAULT NULL COMMENT '模板分类',
  `content` longtext COMMENT '模板内容(JSON)',
  `variable_def` text COMMENT '变量定义(JSON)',
  `source_program_id` bigint(20) DEFAULT NULL COMMENT '来源方案ID',
  `usage_count` int(11) DEFAULT '0' COMMENT '使用次数',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_category` (`category`),
  KEY `idx_source_program_id` (`source_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案模板表';

-- 培养方案与培养目标关联表
CREATE TABLE IF NOT EXISTS `tp_program_goal` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `code` varchar(50) NOT NULL COMMENT '编号',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案与培养目标关联表';

-- 培养方案与毕业要求关联表
CREATE TABLE IF NOT EXISTS `tp_program_requirement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `code` varchar(50) NOT NULL COMMENT '编号',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `sort` int(11) DEFAULT '0' COMMENT '显示顺序',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案与毕业要求关联表';

-- 培养方案引用记录表
CREATE TABLE IF NOT EXISTS `tp_program_reference` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `source_program_id` bigint(20) NOT NULL COMMENT '源方案ID',
  `target_program_id` bigint(20) NOT NULL COMMENT '目标方案ID',
  `reference_type` tinyint(1) DEFAULT '0' COMMENT '引用类型：0-完整引用，1-部分引用',
  `reference_content` text COMMENT '引用内容(JSON)',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reference` (`source_program_id`,`target_program_id`),
  KEY `idx_source_program_id` (`source_program_id`),
  KEY `idx_target_program_id` (`target_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案引用记录表';

-- 培养方案版本表
CREATE TABLE IF NOT EXISTS `tp_program_version` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `version` varchar(20) NOT NULL COMMENT '版本号',
  `content` longtext COMMENT '版本内容(JSON)',
  `change_log` text COMMENT '变更记录',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_program_version` (`program_id`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案版本表';

-- 培养方案导入记录表
CREATE TABLE IF NOT EXISTS `tp_program_import` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `file_name` varchar(200) DEFAULT NULL COMMENT '文件名',
  `file_type` varchar(20) DEFAULT NULL COMMENT '文件类型',
  `file_size` bigint(20) DEFAULT NULL COMMENT '文件大小',
  `file_url` varchar(500) DEFAULT NULL COMMENT '文件URL',
  `ocr_status` tinyint(1) DEFAULT '0' COMMENT 'OCR状态：0-未处理，1-处理中，2-处理成功，3-处理失败',
  `ocr_result` text COMMENT 'OCR结果(JSON)',
  `error_message` text COMMENT '错误信息',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_ocr_status` (`ocr_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案导入记录表';

-- 培养方案校验记录表
CREATE TABLE IF NOT EXISTS `tp_program_validation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `validation_type` varchar(50) DEFAULT NULL COMMENT '校验类型',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态：0-未通过，1-通过',
  `issues` text COMMENT '问题列表(JSON)',
  `suggestion` text COMMENT '建议',
  `validation_time` datetime DEFAULT NULL COMMENT '校验时间',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_validation_type` (`validation_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案校验记录表';

-- 培养方案同步教务系统记录表
CREATE TABLE IF NOT EXISTS `tp_program_sync` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `program_id` bigint(20) NOT NULL COMMENT '方案ID',
  `system_type` varchar(50) DEFAULT NULL COMMENT '教务系统类型',
  `sync_status` tinyint(1) DEFAULT '0' COMMENT '同步状态：0-未同步，1-同步中，2-同步成功，3-同步失败',
  `sync_time` datetime DEFAULT NULL COMMENT '同步时间',
  `sync_user_id` bigint(20) DEFAULT NULL COMMENT '同步用户ID',
  `error_message` text COMMENT '错误信息',
  `sync_data` text COMMENT '同步数据(JSON)',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_sync_user_id` (`sync_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案同步教务系统记录表';

-- 模块类型表
CREATE TABLE IF NOT EXISTS `module_type` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '类型名称',
  `code` VARCHAR(10) NOT NULL COMMENT '类型代码',
  `module_type` VARCHAR(50) NOT NULL COMMENT '模块类型键',
  `sort_order` INT DEFAULT 0 COMMENT '排序号',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_module_type` (`module_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模块类型表';

-- 模块子类表
CREATE TABLE IF NOT EXISTS `module_subtype` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '子类名称',
  `code` VARCHAR(20) NOT NULL COMMENT '子类代码',
  `type_id` VARCHAR(36) NOT NULL COMMENT '所属类型ID',
  `sort_order` INT DEFAULT 0 COMMENT '排序号',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type_id` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模块子类表';

-- 课程体系模板表
CREATE TABLE IF NOT EXISTS `curriculum_system_template` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
  `major_type` VARCHAR(50) NOT NULL COMMENT '专业类型',
  `degree_type` VARCHAR(20) NOT NULL COMMENT '学位类型',
  `description` TEXT COMMENT '模板描述',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `create_user_id` VARCHAR(36) COMMENT '创建用户ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_major_degree` (`major_type`, `degree_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程体系模板表';

-- 课程体系模板模块关联表
CREATE TABLE IF NOT EXISTS `template_module` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `template_id` VARCHAR(36) NOT NULL COMMENT '模板ID',
  `subtype_id` VARCHAR(36) NOT NULL COMMENT '模块子类ID',
  `credit_requirement` DECIMAL(5,1) DEFAULT NULL COMMENT '学分要求',
  `is_required` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否必修',
  `sort_order` INT DEFAULT 0 COMMENT '排序号',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_subtype` (`template_id`, `subtype_id`),
  KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模板与模块关联表';

-- 模块课程关联表
CREATE TABLE IF NOT EXISTS `module_course` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `subtype_id` VARCHAR(36) NOT NULL COMMENT '模块子类ID',
  `course_id` VARCHAR(36) NOT NULL COMMENT '课程ID',
  `term` VARCHAR(10) COMMENT '开课学期，如1-1表示第一学年第一学期',
  `is_required` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否必修',
  `sort_order` INT DEFAULT 0 COMMENT '排序号',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subtype_course` (`subtype_id`, `course_id`),
  KEY `idx_subtype_id` (`subtype_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模块课程关联表';

-- 培养方案表
CREATE TABLE IF NOT EXISTS `training_program` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '方案名称',
  `major_id` VARCHAR(36) NOT NULL COMMENT '专业ID',
  `department_id` VARCHAR(36) NOT NULL COMMENT '学院ID',
  `school_year` VARCHAR(20) NOT NULL COMMENT '学年度',
  `status` VARCHAR(20) NOT NULL DEFAULT 'draft' COMMENT '状态:draft-草稿,submitted-已提交,approved-已审核,rejected-已驳回',
  `template_id` VARCHAR(36) COMMENT '使用的课程体系模板ID',
  `description` TEXT COMMENT '方案描述',
  `create_user_id` VARCHAR(36) COMMENT '创建用户ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_major_year` (`major_id`, `school_year`),
  KEY `idx_department` (`department_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培养方案表';

-- 方案变更记录表
CREATE TABLE IF NOT EXISTS `program_change_record` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `program_id` VARCHAR(36) NOT NULL COMMENT '方案ID',
  `change_type` VARCHAR(50) NOT NULL COMMENT '变更类型',
  `change_content` TEXT NOT NULL COMMENT '变更内容',
  `reason` TEXT COMMENT '变更原因',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态:pending-待审核,approved-已审核,rejected-已驳回',
  `apply_user_id` VARCHAR(36) NOT NULL COMMENT '申请用户ID',
  `apply_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `audit_user_id` VARCHAR(36) COMMENT '审核用户ID',
  `audit_time` DATETIME COMMENT '审核时间',
  `audit_comment` TEXT COMMENT '审核意见',
  PRIMARY KEY (`id`),
  KEY `idx_program_id` (`program_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='方案变更记录表'; 