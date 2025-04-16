-- 系统初始数据
-- 创建时间：2023-04-10
-- 创建者：AI助手

-- 系统参数配置初始数据
INSERT INTO `sys_config` (`name`, `key`, `value`, `type`, `remark`) VALUES 
('系统名称', 'system.name', '人才培养支撑系统', 1, '系统名称'),
('系统简称', 'system.short.name', 'PTSS', 1, '系统简称'),
('版权年份', 'system.copyright.year', '2023', 1, '版权年份'),
('版权所有者', 'system.copyright.owner', '人才培养支撑系统开发团队', 1, '版权所有者'),
('系统版本', 'system.version', 'V1.0.0', 1, '系统版本'),
('上传路径', 'system.upload.path', '/upload', 1, '上传文件存储路径'),
('默认学制', 'system.default.school.year', '4', 1, '默认学制年限'),
('是否开启演示模式', 'system.demo.enabled', 'false', 1, '是否开启演示模式：true-是，false-否'),
('OCR接口地址', 'system.ocr.api.url', 'http://api.example.com/ocr', 1, 'OCR服务接口地址'),
('是否启用AI分析', 'system.ai.analysis.enabled', 'true', 1, '是否启用AI分析功能：true-是，false-否');

-- 字典类型初始数据
INSERT INTO `sys_dict_type` (`name`, `type`, `status`, `remark`) VALUES 
('用户性别', 'sys_user_gender', 1, '用户性别列表'),
('用户状态', 'sys_user_status', 1, '用户状态列表'),
('菜单类型', 'sys_menu_type', 1, '菜单类型列表'),
('系统是否', 'sys_yes_no', 1, '是否列表'),
('状态', 'sys_common_status', 1, '通用状态列表'),
('课程性质', 'course_nature', 1, '课程性质列表'),
('课程类型', 'course_type', 1, '课程类型列表'),
('考核方式', 'exam_type', 1, '考核方式列表'),
('培养方案状态', 'program_status', 1, '培养方案状态列表'),
('学位类型', 'degree_type', 1, '学位类型列表'),
('课程关系类型', 'course_relation_type', 1, '课程关系类型列表'),
('文档类型', 'document_type', 1, '文档类型列表'),
('文档状态', 'document_status', 1, '文档状态列表'),
('教学成果级别', 'teaching_achievement_level', 1, '教学成果级别列表'),
('实验类型', 'experiment_type', 1, '实验类型列表');

-- 字典数据初始数据
-- 用户性别
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('sys_user_gender', '男', '1', 1),
('sys_user_gender', '女', '2', 2),
('sys_user_gender', '未知', '0', 3);

-- 用户状态
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('sys_user_status', '正常', '1', 1),
('sys_user_status', '禁用', '0', 2);

-- 菜单类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('sys_menu_type', '目录', '0', 1),
('sys_menu_type', '菜单', '1', 2),
('sys_menu_type', '按钮', '2', 3);

-- 系统是否
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('sys_yes_no', '是', '1', 1),
('sys_yes_no', '否', '0', 2);

-- 状态
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('sys_common_status', '正常', '1', 1),
('sys_common_status', '禁用', '0', 2);

-- 课程性质
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('course_nature', '必修', 'required', 1),
('course_nature', '选修', 'elective', 2),
('course_nature', '限选', 'limited', 3);

-- 课程类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('course_type', '理论课', 'theory', 1),
('course_type', '实践课', 'practice', 2),
('course_type', '实验课', 'experiment', 3),
('course_type', '混合课', 'hybrid', 4);

-- 考核方式
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('exam_type', '考试', 'exam', 1),
('exam_type', '考查', 'check', 2),
('exam_type', '论文', 'paper', 3),
('exam_type', '设计', 'design', 4),
('exam_type', '操作', 'operation', 5);

-- 培养方案状态
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('program_status', '草稿', '0', 1),
('program_status', '审核中', '1', 2),
('program_status', '已发布', '2', 3),
('program_status', '已归档', '3', 4);

-- 学位类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('degree_type', '学士', 'bachelor', 1),
('degree_type', '硕士', 'master', 2),
('degree_type', '博士', 'doctor', 3);

-- 课程关系类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('course_relation_type', '先修', 'prerequisite', 1),
('course_relation_type', '后续', 'subsequent', 2),
('course_relation_type', '并行', 'parallel', 3),
('course_relation_type', '替代', 'alternative', 4);

-- 文档类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('document_type', '教学大纲', 'syllabus', 1),
('document_type', '教案', 'teaching_plan', 2),
('document_type', '试卷', 'exam_paper', 3),
('document_type', '实验指导', 'experiment_guide', 4),
('document_type', '教学小结', 'teaching_summary', 5);

-- 文档状态
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('document_status', '草稿', '0', 1),
('document_status', '审核中', '1', 2),
('document_status', '已通过', '2', 3),
('document_status', '已驳回', '3', 4);

-- 教学成果级别
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('teaching_achievement_level', '国家级', 'national', 1),
('teaching_achievement_level', '省级', 'provincial', 2),
('teaching_achievement_level', '市级', 'city', 3),
('teaching_achievement_level', '校级', 'school', 4),
('teaching_achievement_level', '院级', 'college', 5);

-- 实验类型
INSERT INTO `sys_dict_data` (`dict_type`, `label`, `value`, `sort`) VALUES 
('experiment_type', '验证性', 'verification', 1),
('experiment_type', '综合性', 'comprehensive', 2),
('experiment_type', '设计性', 'design', 3),
('experiment_type', '研究性', 'research', 4);

-- 管理员账号
INSERT INTO `sys_user` (`username`, `password`, `real_name`, `gender`, `email`, `mobile`, `status`, `remark`) VALUES 
('admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '管理员', '1', 'admin@example.com', '13800000000', 1, '系统管理员');

-- 角色信息
INSERT INTO `sys_role` (`name`, `code`, `sort`, `status`, `remark`) VALUES 
('超级管理员', 'admin', 1, 1, '系统超级管理员'),
('教务管理员', 'academic', 2, 1, '教务管理员'),
('教师', 'teacher', 3, 1, '教师角色'),
('学院管理员', 'college_admin', 4, 1, '学院管理员'),
('系主任', 'department_head', 5, 1, '系主任');

-- 用户角色关联
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 部门信息
INSERT INTO `sys_dept` (`parent_id`, `name`, `sort`, `leader`, `phone`, `email`, `status`) VALUES 
(0, '人才培养支撑系统', 1, '张三', '13800000001', 'president@example.com', 1),
(1, '教务处', 1, '李四', '13800000002', 'academic@example.com', 1),
(1, '计算机学院', 2, '王五', '13800000003', 'computer@example.com', 1),
(1, '机械学院', 3, '赵六', '13800000004', 'mechanical@example.com', 1),
(3, '计算机科学系', 1, '孙七', '13800000005', 'cs@example.com', 1),
(3, '软件工程系', 2, '周八', '13800000006', 'se@example.com', 1),
(4, '机械设计系', 1, '吴九', '13800000007', 'design@example.com', 1),
(4, '自动化系', 2, '郑十', '13800000008', 'auto@example.com', 1);

-- 默认课程类别
INSERT INTO `cl_course_category` (`name`, `code`, `parent_id`, `level`, `sort`) VALUES 
('公共基础课', 'GC', 0, 1, 1),
('专业基础课', 'ZJ', 0, 1, 2),
('专业课', 'ZY', 0, 1, 3),
('实践教学', 'SJ', 0, 1, 4),
('通识选修课', 'TX', 0, 1, 5);

-- 初始流程定义
INSERT INTO `sys_workflow_def` (`name`, `code`, `description`, `version`, `content`, `status`) VALUES 
('培养方案审批流程', 'program_approval', '培养方案审批流程定义', 1, '{"nodes":[{"id":"start","type":"start","name":"开始"},{"id":"dept_head","type":"approval","name":"系主任审批"},{"id":"college_dean","type":"approval","name":"学院院长审批"},{"id":"academic_dean","type":"approval","name":"教务处长审批"},{"id":"end","type":"end","name":"结束"}],"edges":[{"source":"start","target":"dept_head"},{"source":"dept_head","target":"college_dean"},{"source":"college_dean","target":"academic_dean"},{"source":"academic_dean","target":"end"}]}', 1),
('教学大纲审批流程', 'syllabus_approval', '教学大纲审批流程定义', 1, '{"nodes":[{"id":"start","type":"start","name":"开始"},{"id":"dept_head","type":"approval","name":"系主任审批"},{"id":"college_dean","type":"approval","name":"学院院长审批"},{"id":"end","type":"end","name":"结束"}],"edges":[{"source":"start","target":"dept_head"},{"source":"dept_head","target":"college_dean"},{"source":"college_dean","target":"end"}]}', 1),
('试卷审批流程', 'exam_paper_approval', '试卷审批流程定义', 1, '{"nodes":[{"id":"start","type":"start","name":"开始"},{"id":"dept_head","type":"approval","name":"系主任审批"},{"id":"end","type":"end","name":"结束"}],"edges":[{"source":"start","target":"dept_head"},{"source":"dept_head","target":"end"}]}', 1);

-- 初始系统集成配置
INSERT INTO `sys_integration` (`name`, `type`, `config`, `status`, `remark`) VALUES 
('OCR服务配置', 'ocr', '{"provider":"baidu","apiKey":"your_api_key","secretKey":"your_secret_key","endpointUrl":"https://aip.baidubce.com/rest/2.0/ocr/v1/general"}', 1, 'OCR服务配置'),
('AI分析服务配置', 'ai', '{"provider":"openai","apiKey":"your_openai_key","model":"gpt-3.5-turbo","maxTokens":2000}', 1, 'AI分析服务配置'),
('正方教务系统', 'academic', '{"provider":"zf","endpointUrl":"http://jwxt.example.com/api","username":"interface_user","password":"interface_pwd","syncInterval":86400}', 1, '正方教务系统集成配置'); 