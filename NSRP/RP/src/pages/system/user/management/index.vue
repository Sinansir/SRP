<template>
  <div class="container">
    <a-card class="general-card" title="用户管理">
      <a-tabs default-active-key="list">
        <a-tab-pane key="list" title="用户列表">
          <a-space direction="vertical" size="large" fill>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-space>
                  <a-button type="primary" @click="handleAddUser">
                    <template #icon>
                      <icon-plus />
                    </template>
                    新增用户
                  </a-button>
                  <a-button @click="handleBatchEnable" :disabled="selectedKeys.length === 0">
                    批量启用
                  </a-button>
                  <a-button @click="handleBatchDisable" :disabled="selectedKeys.length === 0">
                    批量禁用
                  </a-button>
                </a-space>
              </a-col>
            </a-row>

            <a-table
              row-key="id"
              :columns="columns"
              :data="tableData"
              :pagination="pagination"
              :row-selection="rowSelection"
              @page-change="onPageChange"
            >
              <template #status="{ record }">
                <a-tag :color="record.status ? 'green' : 'red'">
                  {{ record.status ? '启用' : '禁用' }}
                </a-tag>
              </template>
              <template #operations="{ record }">
                <a-space>
                  <a-button type="text" size="small" @click="handleEdit(record)">
                    编辑
                  </a-button>
                  <a-button type="text" size="small" @click="handleAssignRoles(record)">
                    分配角色
                  </a-button>
                  <a-button
                    type="text"
                    size="small"
                    :status="record.status ? 'danger' : 'success'"
                    @click="handleToggleStatus(record)"
                  >
                    {{ record.status ? '禁用' : '启用' }}
                  </a-button>
                </a-space>
              </template>
            </a-table>
          </a-space>
        </a-tab-pane>
        
        <a-tab-pane key="roles" title="角色管理">
          <a-space direction="vertical" size="large" fill>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-button type="primary" @click="handleAddRole">
                  <template #icon>
                    <icon-plus />
                  </template>
                  新增角色
                </a-button>
              </a-col>
            </a-row>
            
            <a-table
              row-key="id"
              :columns="roleColumns"
              :data="roleData"
              :pagination="rolePagination"
              @page-change="onRolePageChange"
            >
              <template #operations="{ record }">
                <a-space>
                  <a-button type="text" size="small" @click="handleEditRole(record)">
                    编辑
                  </a-button>
                  <a-button type="text" size="small" @click="handleConfigPermissions(record)">
                    配置权限
                  </a-button>
                  <a-button
                    type="text"
                    size="small"
                    status="danger"
                    @click="handleDeleteRole(record)"
                  >
                    删除
                  </a-button>
                </a-space>
              </template>
            </a-table>
          </a-space>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';

// 选中的用户
const selectedKeys = ref<string[]>([]);

// 表格列
const columns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '真实姓名', dataIndex: 'realName' },
  { title: '性别', dataIndex: 'gender' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '所属部门', dataIndex: 'department' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'operations', width: 240 },
];

// 用户数据
const tableData = ref([
  {
    id: '1',
    username: 'admin',
    realName: '管理员',
    gender: '男',
    phone: '13800138000',
    email: 'admin@example.com',
    department: '信息技术部',
    status: true,
  },
  {
    id: '2',
    username: 'teacher1',
    realName: '张三',
    gender: '男',
    phone: '13800138001',
    email: 'teacher1@example.com',
    department: '计算机学院',
    status: true,
  },
  {
    id: '3',
    username: 'teacher2',
    realName: '李四',
    gender: '女',
    phone: '13800138002',
    email: 'teacher2@example.com',
    department: '电子工程学院',
    status: false,
  },
  {
    id: '4',
    username: 'student1',
    realName: '王五',
    gender: '男',
    phone: '13800138003',
    email: 'student1@example.com',
    department: '学生处',
    status: true,
  },
  {
    id: '5',
    username: 'staff1',
    realName: '赵六',
    gender: '女',
    phone: '13800138004',
    email: 'staff1@example.com',
    department: '人事部',
    status: true,
  },
]);

// 角色列
const roleColumns = [
  { title: '角色名称', dataIndex: 'name' },
  { title: '角色编码', dataIndex: 'code' },
  { title: '角色描述', dataIndex: 'description' },
  { title: '操作', slotName: 'operations', width: 240 },
];

// 角色数据
const roleData = ref([
  {
    id: '1',
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '系统最高权限，可以操作系统所有功能',
  },
  {
    id: '2',
    name: '管理员',
    code: 'ADMIN',
    description: '系统管理权限，可以操作大部分功能',
  },
  {
    id: '3',
    name: '教师',
    code: 'TEACHER',
    description: '教师权限，可以操作与教学相关的功能',
  },
  {
    id: '4',
    name: '学生',
    code: 'STUDENT',
    description: '学生权限，可以查看学习相关的内容',
  },
  {
    id: '5',
    name: '系统管理人员',
    code: 'SYS_MANAGER',
    description: '系统运维人员，负责系统的日常维护',
  },
]);

// 用户分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 50,
});

// 角色分页
const rolePagination = ref({
  current: 1,
  pageSize: 10,
  total: 20,
});

// 行选择配置
const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
  onChange: (selectedRowKeys: string[]) => {
    selectedKeys.value = selectedRowKeys;
  },
};

// 用户分页变化
const onPageChange = (current: number) => {
  pagination.value.current = current;
};

// 角色分页变化
const onRolePageChange = (current: number) => {
  rolePagination.value.current = current;
};

// 新增用户
const handleAddUser = () => {
  Message.info('新增用户功能待实现');
};

// 编辑用户
const handleEdit = (record: any) => {
  Message.info(`编辑用户: ${record.realName}`);
};

// 分配角色
const handleAssignRoles = (record: any) => {
  Message.info(`分配角色: ${record.realName}`);
};

// 切换状态
const handleToggleStatus = (record: any) => {
  const newStatus = !record.status;
  const action = newStatus ? '启用' : '禁用';
  
  Modal.confirm({
    title: `确认${action}用户`,
    content: `确定要${action}用户 "${record.realName}" 吗？`,
    onOk: () => {
      // 在实际应用中，应该调用API来更新状态
      record.status = newStatus;
      Message.success(`成功${action}用户: ${record.realName}`);
    },
  });
};

// 批量启用
const handleBatchEnable = () => {
  Modal.confirm({
    title: '批量启用用户',
    content: `确定要启用选中的 ${selectedKeys.value.length} 个用户吗？`,
    onOk: () => {
      // 在实际应用中，应该调用API来批量更新状态
      tableData.value.forEach((item) => {
        if (selectedKeys.value.includes(item.id)) {
          item.status = true;
        }
      });
      Message.success(`成功启用 ${selectedKeys.value.length} 个用户`);
      selectedKeys.value = [];
    },
  });
};

// 批量禁用
const handleBatchDisable = () => {
  Modal.confirm({
    title: '批量禁用用户',
    content: `确定要禁用选中的 ${selectedKeys.value.length} 个用户吗？`,
    onOk: () => {
      // 在实际应用中，应该调用API来批量更新状态
      tableData.value.forEach((item) => {
        if (selectedKeys.value.includes(item.id)) {
          item.status = false;
        }
      });
      Message.success(`成功禁用 ${selectedKeys.value.length} 个用户`);
      selectedKeys.value = [];
    },
  });
};

// 新增角色
const handleAddRole = () => {
  Message.info('新增角色功能待实现');
};

// 编辑角色
const handleEditRole = (record: any) => {
  Message.info(`编辑角色: ${record.name}`);
};

// 配置权限
const handleConfigPermissions = (record: any) => {
  Message.info(`配置权限: ${record.name}`);
};

// 删除角色
const handleDeleteRole = (record: any) => {
  Modal.confirm({
    title: '删除角色',
    content: `确定要删除角色 "${record.name}" 吗？`,
    onOk: () => {
      // 在实际应用中，应该调用API来删除角色
      roleData.value = roleData.value.filter(item => item.id !== record.id);
      Message.success(`成功删除角色: ${record.name}`);
    },
  });
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style> 