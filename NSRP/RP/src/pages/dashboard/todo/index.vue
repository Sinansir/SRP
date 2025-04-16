<template>
  <div class="container">
    <a-card class="general-card" title="待办事项">
      <a-space direction="vertical" size="large" fill>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-input-search
              placeholder="搜索待办事项"
              style="width: 300px"
              search-button
              @search="handleSearch"
            />
            <a-button type="primary" style="margin-left: 16px" @click="handleAddTodo">
              <template #icon>
                <icon-plus />
              </template>
              新建待办
            </a-button>
          </a-col>
        </a-row>

        <a-tabs default-active-key="all">
          <a-tab-pane key="all" title="全部">
            <a-table :data="filteredTodos" :pagination="false">
              <template #columns>
                <a-table-column title="状态" data-index="status" width="80">
                  <template #cell="{ record }">
                    <a-checkbox
                      :model-value="record.status === 'completed'"
                      @change="() => handleToggleStatus(record)"
                    />
                  </template>
                </a-table-column>
                <a-table-column title="优先级" data-index="priority" width="100">
                  <template #cell="{ record }">
                    <a-tag
                      :color="
                        record.priority === 'high' ? 'red' : record.priority === 'medium' ? 'orange' : 'green'
                      "
                    >
                      {{ getPriorityText(record.priority) }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="标题" data-index="title">
                  <template #cell="{ record }">
                    <span
                      :style="{
                        textDecoration: record.status === 'completed' ? 'line-through' : 'none',
                        color: record.status === 'completed' ? 'rgba(0, 0, 0, 0.45)' : 'inherit',
                      }"
                    >
                      {{ record.title }}
                    </span>
                  </template>
                </a-table-column>
                <a-table-column title="到期日" data-index="dueDate" width="120">
                  <template #cell="{ record }">
                    <span :style="{ color: isOverdue(record) ? '#f53f3f' : 'inherit' }">
                      {{ record.dueDate }}
                    </span>
                  </template>
                </a-table-column>
                <a-table-column title="类型" data-index="type" width="120">
                  <template #cell="{ record }">
                    <a-tag :color="getTypeColor(record.type)">
                      {{ getTypeText(record.type) }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="操作" width="150">
                  <template #cell="{ record }">
                    <a-space>
                      <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                      <a-button
                        type="text"
                        size="small"
                        status="danger"
                        @click="handleDelete(record)"
                      >
                        删除
                      </a-button>
                    </a-space>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="todo" title="待完成" />
          <a-tab-pane key="completed" title="已完成" />
        </a-tabs>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Message } from '@arco-design/web-vue';

interface Todo {
  id: number;
  title: string;
  status: 'todo' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  type: 'work' | 'personal' | 'review' | 'meeting';
}

// 搜索关键字
const searchKeyword = ref('');

// 待办列表
const todos = ref<Todo[]>([
  {
    id: 1,
    title: '审核培养方案',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-12-15',
    type: 'work',
  },
  {
    id: 2,
    title: '课程教学大纲评审会议',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-18',
    type: 'meeting',
  },
  {
    id: 3,
    title: '学生期末成绩评定',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-12-25',
    type: 'review',
  },
  {
    id: 4,
    title: '教学计划表填写',
    status: 'completed',
    priority: 'medium',
    dueDate: '2023-12-10',
    type: 'work',
  },
  {
    id: 5,
    title: '教师培训',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-12-20',
    type: 'meeting',
  },
]);

// 筛选后的待办列表
const filteredTodos = computed(() => {
  if (!searchKeyword.value) {
    return todos.value;
  }
  return todos.value.filter(
    (todo) => todo.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// 搜索
const handleSearch = (value: string) => {
  searchKeyword.value = value;
};

// 切换状态
const handleToggleStatus = (todo: Todo) => {
  const index = todos.value.findIndex((item) => item.id === todo.id);
  if (index !== -1) {
    todos.value[index].status = todo.status === 'todo' ? 'completed' : 'todo';
    Message.success(`已${todo.status === 'todo' ? '完成' : '重新开始'}任务`);
  }
};

// 是否过期
const isOverdue = (todo: Todo) => {
  if (todo.status === 'completed') return false;
  const today = new Date();
  const dueDate = new Date(todo.dueDate);
  return today > dueDate;
};

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const map: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  };
  return map[priority] || priority;
};

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    work: '工作',
    personal: '个人',
    review: '审核',
    meeting: '会议',
  };
  return map[type] || type;
};

// 获取类型颜色
const getTypeColor = (type: string) => {
  const map: Record<string, string> = {
    work: 'blue',
    personal: 'cyan',
    review: 'purple',
    meeting: 'gold',
  };
  return map[type] || 'default';
};

// 新建待办
const handleAddTodo = () => {
  Message.info('打开新建待办对话框');
  // 在这里实现打开新建待办对话框的逻辑
};

// 编辑待办
const handleEdit = (todo: Todo) => {
  Message.info(`编辑待办: ${todo.title}`);
  // 在这里实现编辑待办的逻辑
};

// 删除待办
const handleDelete = (todo: Todo) => {
  Message.success(`删除待办: ${todo.title}`);
  todos.value = todos.value.filter((item) => item.id !== todo.id);
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style> 