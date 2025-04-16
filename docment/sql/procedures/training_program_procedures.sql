-- 培养方案相关的存储过程和函数

-- 切换数据库分隔符
DELIMITER $$

-- 移动模块类型排序（上移或下移）
CREATE PROCEDURE IF NOT EXISTS `sp_move_module_type_order` (
    IN p_id VARCHAR(36),
    IN p_direction VARCHAR(10) -- 'up' 或 'down'
)
BEGIN
    DECLARE v_current_order INT;
    DECLARE v_target_id VARCHAR(36);
    DECLARE v_target_order INT;
    
    -- 获取当前排序号
    SELECT sort_order INTO v_current_order FROM module_type WHERE id = p_id;
    
    -- 根据移动方向查找目标记录
    IF p_direction = 'up' THEN
        -- 上移：查找排序号小于当前项且最接近的记录
        SELECT id, sort_order
        INTO v_target_id, v_target_order
        FROM module_type
        WHERE sort_order < v_current_order
        ORDER BY sort_order DESC
        LIMIT 1;
    ELSE
        -- 下移：查找排序号大于当前项且最接近的记录
        SELECT id, sort_order
        INTO v_target_id, v_target_order
        FROM module_type
        WHERE sort_order > v_current_order
        ORDER BY sort_order ASC
        LIMIT 1;
    END IF;
    
    -- 如果找到目标记录，则交换排序号
    IF v_target_id IS NOT NULL THEN
        -- 使用事务确保原子性
        START TRANSACTION;
        
        -- 更新当前记录排序号
        UPDATE module_type SET sort_order = v_target_order WHERE id = p_id;
        
        -- 更新目标记录排序号
        UPDATE module_type SET sort_order = v_current_order WHERE id = v_target_id;
        
        COMMIT;
    END IF;
END$$

-- 移动模块子类排序（上移或下移）
CREATE PROCEDURE IF NOT EXISTS `sp_move_module_subtype_order` (
    IN p_id VARCHAR(36),
    IN p_direction VARCHAR(10) -- 'up' 或 'down'
)
BEGIN
    DECLARE v_current_order INT;
    DECLARE v_type_id VARCHAR(36);
    DECLARE v_target_id VARCHAR(36);
    DECLARE v_target_order INT;
    
    -- 获取当前记录信息
    SELECT sort_order, type_id 
    INTO v_current_order, v_type_id 
    FROM module_subtype 
    WHERE id = p_id;
    
    -- 根据移动方向查找同一类型下的目标记录
    IF p_direction = 'up' THEN
        -- 上移：查找同一类型下排序号小于当前项且最接近的记录
        SELECT id, sort_order
        INTO v_target_id, v_target_order
        FROM module_subtype
        WHERE type_id = v_type_id AND sort_order < v_current_order
        ORDER BY sort_order DESC
        LIMIT 1;
    ELSE
        -- 下移：查找同一类型下排序号大于当前项且最接近的记录
        SELECT id, sort_order
        INTO v_target_id, v_target_order
        FROM module_subtype
        WHERE type_id = v_type_id AND sort_order > v_current_order
        ORDER BY sort_order ASC
        LIMIT 1;
    END IF;
    
    -- 如果找到目标记录，则交换排序号
    IF v_target_id IS NOT NULL THEN
        -- 使用事务确保原子性
        START TRANSACTION;
        
        -- 更新当前记录排序号
        UPDATE module_subtype SET sort_order = v_target_order WHERE id = p_id;
        
        -- 更新目标记录排序号
        UPDATE module_subtype SET sort_order = v_current_order WHERE id = v_target_id;
        
        COMMIT;
    END IF;
END$$

-- 重新整理模块类型排序（修复排序号不连续的问题）
CREATE PROCEDURE IF NOT EXISTS `sp_reorder_module_types` ()
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    -- 创建临时表存储ID和排序号
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_module_type_order (
        id VARCHAR(36) NOT NULL,
        new_order INT NOT NULL,
        PRIMARY KEY (id)
    );
    
    -- 清空临时表
    TRUNCATE TABLE temp_module_type_order;
    
    -- 根据当前排序填充临时表，确保排序号连续
    INSERT INTO temp_module_type_order (id, new_order)
    SELECT id, (@row_number:=@row_number+1) AS new_order
    FROM module_type, (SELECT @row_number:=0) AS t
    ORDER BY sort_order, create_time;
    
    -- 使用临时表更新实际表中的排序号
    UPDATE module_type mt
    JOIN temp_module_type_order tmp ON mt.id = tmp.id
    SET mt.sort_order = tmp.new_order;
    
    -- 删除临时表
    DROP TEMPORARY TABLE IF EXISTS temp_module_type_order;
END$$

-- 重新整理特定类型下的模块子类排序
CREATE PROCEDURE IF NOT EXISTS `sp_reorder_module_subtypes` (
    IN p_type_id VARCHAR(36)
)
BEGIN
    -- 创建临时表存储ID和排序号
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_module_subtype_order (
        id VARCHAR(36) NOT NULL,
        new_order INT NOT NULL,
        PRIMARY KEY (id)
    );
    
    -- 清空临时表
    TRUNCATE TABLE temp_module_subtype_order;
    
    -- 根据当前排序填充临时表，确保排序号连续
    INSERT INTO temp_module_subtype_order (id, new_order)
    SELECT id, (@row_number:=@row_number+1) AS new_order
    FROM module_subtype, (SELECT @row_number:=0) AS t
    WHERE type_id = p_type_id
    ORDER BY sort_order, create_time;
    
    -- 使用临时表更新实际表中的排序号
    UPDATE module_subtype ms
    JOIN temp_module_subtype_order tmp ON ms.id = tmp.id
    SET ms.sort_order = tmp.new_order;
    
    -- 删除临时表
    DROP TEMPORARY TABLE IF EXISTS temp_module_subtype_order;
END$$

-- 获取模块类型及其子类型，按排序号排序
CREATE PROCEDURE IF NOT EXISTS `sp_get_module_types_with_subtypes` ()
BEGIN
    -- 获取所有模块类型，按排序号排序
    SELECT 
        mt.id, 
        mt.name, 
        mt.code, 
        mt.module_type,
        mt.sort_order
    FROM module_type mt
    ORDER BY mt.sort_order, mt.create_time;
    
    -- 获取所有模块子类型，按类型ID和排序号排序
    SELECT 
        ms.id, 
        ms.name, 
        ms.code, 
        ms.type_id,
        ms.sort_order
    FROM module_subtype ms
    ORDER BY ms.type_id, ms.sort_order, ms.create_time;
END$$

-- 恢复数据库分隔符
DELIMITER ; 