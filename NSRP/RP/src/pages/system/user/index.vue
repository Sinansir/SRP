<template>
  <div class="container">
    <a-card class="general-card" title="用户管理">
      <template #extra>
        <a-button type="primary" @click="handleAddUser">
          <template #icon>
            <icon-plus />
          </template>
          新增用户
        </a-button>
      </template>
      
      <a-row :gutter="16" class="toolbar">
        <a-col :flex="1">
          <a-form :model="searchForm" layout="inline">
            <a-form-item field="keyword" label="关键字">
              <a-input v-model="searchForm.keyword" placeholder="用户名/姓名/手机号" />
            </a-form-item>
            <a-form-item field="status" label="状态">
              <a-select v-model="searchForm.status" placeholder="状态" style="width: 120px">
                <a-option value="">全部</a-option>
                <a-option value="1">启用</a-option>
                <a-option value="0">禁用</a-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      
      <a-table
        :loading="loading"
        :data="tableData"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="姓名" data-index="realName" />
          <a-table-column title="手机号" data-index="phone" />
          <a-table-column title="邮箱" data-index="email" />
          <a-table-column title="部门" data-index="department" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="record.status === '1' ? 'green' : 'red'">
                {{ record.status === '1' ? '启用' : '禁用' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" width="200">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button
                  type="text"
                  size="small"
                  status="warning"
                  @click="handleRoleAssign(record)"
                >角色分配</a-button>
                <a-button
                  type="text"
                  size="small"
                  :status="record.status === '1' ? 'danger' : 'success'"
                  @click="handleToggleStatus(record)"
                >
                  {{ record.status === '1' ? '禁用' : '启用' }}
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
});

// 表格加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});

// 表格数据
const tableData = ref([
  {
    id: '1',
    username: 'admin',
    realName: '系统管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    department: '技术部',
    status: '1',
    createTime: '2023-01-01',
  },
  {
    id: '2',
    username: 'teacher1',
    realName: '张教授',
    phone: '13800138001',
    email: 'teacher1@example.com',
    department: '计算机学院',
    status: '1',
    createTime: '2023-01-05',
  },
  {
    id: '3',
    username: 'staff1',
    realName: '李助教',
    phone: '13800138002',
    email: 'staff1@example.com',
    department: '电子工程学院',
    status: '0',
    createTime: '2023-01-10',
  },
]);

// 页码变化
const onPageChange = (current: number) => {
  pagination.current = current;
  // 这里添加加载数据的逻辑
};

// 查询
const handleSearch = () => {
  pagination.current = 1;
  // 这里添加查询逻辑
  console.log('搜索条件:', searchForm);
};

// 重置
const handleReset = () => {
  searchForm.keyword = '';
  searchForm.status = '';
  handleSearch();
};

// 新增用户
const handleAddUser = () => {
  // 这里添加新增用户逻辑
  console.log('新增用户');
};

// 编辑用户
const handleEdit = (record: any) => {
  // 这里添加编辑用户逻辑
  console.log('编辑用户:', record);
};

// 角色分配
const handleRoleAssign = (record: any) => {
  // 这里添加角色分配逻辑
  console.log('角色分配:', record);
};

// 切换状态
const handleToggleStatus = (record: any) => {
  // 这里添加切换状态逻辑
  console.log('切换状态:', record);
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  
  .toolbar {
    margin-bottom: 16px;
  }
}
</style> 