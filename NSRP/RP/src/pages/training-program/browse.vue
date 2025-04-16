<template>
  <div class="training-program-browse-container">
    <!-- 搜索筛选区域 -->
    <t-card :bordered="false" class="filter-card">
      <t-form :data="formData" :colon="true" labelWidth="80px">
        <t-row :gutter="[16, 16]">
          <t-col :span="8">
            <t-form-item :label="t('方案名称')">
              <t-input v-model="formData.name" :placeholder="t('请输入培养方案名称')" />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item :label="t('专业')">
              <t-select v-model="formData.major" :placeholder="t('请选择专业')" clearable>
                <t-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item :label="t('学院')">
              <t-select v-model="formData.college" :placeholder="t('请选择学院')" clearable>
                <t-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item :label="t('版本')">
              <t-select v-model="formData.version" :placeholder="t('请选择版本')" clearable>
                <t-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item :label="t('状态')">
              <t-select v-model="formData.status" :placeholder="t('请选择状态')" clearable>
                <t-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8" class="operation-col">
            <t-button theme="primary" @click="fetchData">
              {{ t('查询') }}
            </t-button>
            <t-button theme="default" @click="resetForm" class="reset-btn">
              {{ t('重置') }}
            </t-button>
          </t-col>
        </t-row>
      </t-form>
    </t-card>

    <!-- 培养方案列表展示区域 -->
    <t-card :bordered="false" class="list-card">
      <template #title>
        <div class="card-title">
          {{ t('培养方案列表') }}
          <t-tag theme="primary" variant="light" class="tag-count">{{ total }}</t-tag>
        </div>
      </template>
      <template #actions>
        <t-radio-group v-model="viewType">
          <t-radio-button value="card">
            <template #default>
              <t-icon name="view-module" />
            </template>
          </t-radio-button>
          <t-radio-button value="list">
            <template #default>
              <t-icon name="view-list" />
            </template>
          </t-radio-button>
        </t-radio-group>
      </template>

      <!-- 卡片视图 -->
      <template v-if="viewType === 'card'">
        <div class="program-card-list">
          <t-loading :loading="loading" style="width: 100%">
            <t-row :gutter="[16, 16]">
              <t-col :span="6" v-for="(item, index) in programList" :key="index">
                <t-card :bordered="true" class="program-card" :hover-shadow="true" @click="handleCardClick(item)">
                  <template #title>
                    <div class="program-card-title">
                      <span class="program-name text-ellipsis">{{ item.name }}</span>
                      <t-tag size="small" :theme="getStatusTheme(item.status)" variant="light">
                        {{ item.statusText }}
                      </t-tag>
                    </div>
                  </template>
                  <div class="program-card-content">
                    <div class="info-item">
                      <span class="info-label">{{ t('专业') }}:</span>
                      <span class="info-value">{{ item.major }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">{{ t('学院') }}:</span>
                      <span class="info-value">{{ item.college }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">{{ t('版本') }}:</span>
                      <span class="info-value">{{ item.version }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">{{ t('修订日期') }}:</span>
                      <span class="info-value">{{ item.updateTime }}</span>
                    </div>
                  </div>
                  <template #footer>
                    <div class="program-card-footer">
                      <div class="creator">
                        <t-avatar size="small">{{ item.creator ? item.creator.slice(0, 1) : '?' }}</t-avatar>
                        <span>{{ item.creator || t('未知') }}</span>
                      </div>
                      <div class="operation">
                        <t-button variant="text" shape="circle" @click.stop="handleView(item)">
                          <template #icon>
                            <t-icon name="browse" />
                          </template>
                        </t-button>
                        <t-button variant="text" shape="circle" @click.stop="handleDownload(item)">
                          <template #icon>
                            <t-icon name="download" />
                          </template>
                        </t-button>
                      </div>
                    </div>
                  </template>
                </t-card>
              </t-col>
            </t-row>
          </t-loading>
        </div>
      </template>

      <!-- 列表视图 -->
      <template v-else>
        <t-table
          :data="programList"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </template>

      <!-- 分页（仅在卡片视图时显示） -->
      <t-pagination
        v-if="viewType === 'card'"
        v-model="pagination.current"
        :total="total"
        :page-size="pagination.pageSize"
        :page-size-options="[12, 24, 48]"
        :show-total="true"
        :show-jumper="true"
        :show-page-size="true"
        @change="onPageChange"
      />
    </t-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TrainingProgramBrowseRoot',
};
</script>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';

import { t } from '@/locales';

const router = useRouter();

// 表单数据
const formData = reactive({
  name: '',
  major: '',
  college: '',
  version: '',
  status: '',
});

// 下拉选项
const majorOptions = ref([
  { label: '计算机科学与技术', value: '1' },
  { label: '软件工程', value: '2' },
  { label: '人工智能', value: '3' },
  { label: '网络工程', value: '4' },
]);

const collegeOptions = ref([
  { label: '计算机学院', value: '1' },
  { label: '信息工程学院', value: '2' },
  { label: '电子工程学院', value: '3' },
]);

const versionOptions = ref([
  { label: '2023版', value: '2023' },
  { label: '2022版', value: '2022' },
  { label: '2021版', value: '2021' },
]);

const statusOptions = ref([
  { label: '已发布', value: 'published' },
  { label: '审核中', value: 'reviewing' },
  { label: '草稿', value: 'draft' },
]);

// 视图类型
const viewType = ref('card');

// 加载状态
const loading = ref(false);

// 分页设置
const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
});

// 总数
const total = ref(0);

// 表格列定义
const columns = [
  { colKey: 'name', title: t('方案名称'), width: 200 },
  { colKey: 'major', title: t('专业'), width: 180 },
  { colKey: 'college', title: t('学院'), width: 150 },
  { colKey: 'version', title: t('版本'), width: 100 },
  { colKey: 'status', title: t('状态'), width: 100 },
  { colKey: 'updateTime', title: t('修订日期'), width: 150 },
  { colKey: 'creator', title: t('创建人'), width: 120 },
  {
    colKey: 'operation',
    title: t('操作'),
    width: 120,
    cell: (h, { row }) => h('div', { class: 'operation-column' }, [
      h(
        't-button',
        {
          theme: 'primary',
          variant: 'text',
          onClick: () => handleView(row),
        },
        t('查看')
      ),
      h(
        't-button',
        {
          theme: 'primary',
          variant: 'text',
          onClick: () => handleDownload(row),
        },
        t('下载')
      ),
    ]),
  },
];

// 培养方案列表模拟数据
const programList = ref([
  {
    id: '1',
    name: '计算机科学与技术专业培养方案',
    major: '计算机科学与技术',
    college: '计算机学院',
    version: '2023版',
    status: 'published',
    statusText: '已发布',
    updateTime: '2023-09-01',
    creator: '张三',
  },
  {
    id: '2',
    name: '软件工程专业培养方案',
    major: '软件工程',
    college: '计算机学院',
    version: '2023版',
    status: 'reviewing',
    statusText: '审核中',
    updateTime: '2023-08-15',
    creator: '李四',
  },
  {
    id: '3',
    name: '人工智能专业培养方案',
    major: '人工智能',
    college: '计算机学院',
    version: '2022版',
    status: 'draft',
    statusText: '草稿',
    updateTime: '2023-07-20',
    creator: '王五',
  },
  {
    id: '4',
    name: '网络工程专业培养方案',
    major: '网络工程',
    college: '计算机学院',
    version: '2022版',
    status: 'published',
    statusText: '已发布',
    updateTime: '2023-06-10',
    creator: '赵六',
  },
]);

// 根据状态获取标签主题色
const getStatusTheme = (status: string) => {
  const themeMap: Record<string, string> = {
    published: 'success',
    reviewing: 'warning',
    draft: 'default',
  };
  return themeMap[status] || 'default';
};

// 获取数据
const fetchData = () => {
  loading.value = true;
  // 模拟API请求
  setTimeout(() => {
    // 实际项目中应该调用后端API获取数据
    // ...

    // 创建原始数据的副本，避免修改原始数据
    const originalData = [
      {
        id: '1',
        name: '计算机科学与技术专业培养方案',
        major: '计算机科学与技术',
        college: '计算机学院',
        version: '2023版',
        status: 'published',
        statusText: '已发布',
        updateTime: '2023-09-01',
        creator: '张三',
      },
      {
        id: '2',
        name: '软件工程专业培养方案',
        major: '软件工程',
        college: '计算机学院',
        version: '2023版',
        status: 'reviewing',
        statusText: '审核中',
        updateTime: '2023-08-15',
        creator: '李四',
      },
      {
        id: '3',
        name: '人工智能专业培养方案',
        major: '人工智能',
        college: '计算机学院',
        version: '2022版',
        status: 'draft',
        statusText: '草稿',
        updateTime: '2023-07-20',
        creator: '王五',
      },
      {
        id: '4',
        name: '网络工程专业培养方案',
        major: '网络工程',
        college: '计算机学院',
        version: '2022版',
        status: 'published',
        statusText: '已发布',
        updateTime: '2023-06-10',
        creator: '赵六',
      },
    ];

    // 模拟筛选
    const filteredList = originalData.filter((item) => {
      return (
        (formData.name ? item.name.includes(formData.name) : true) &&
        (formData.major ? item.major === majorOptions.value.find((m) => m.value === formData.major)?.label : true) &&
        (formData.college ? item.college === collegeOptions.value.find((c) => c.value === formData.college)?.label : true) &&
        (formData.version ? item.version === versionOptions.value.find((v) => v.value === formData.version)?.label : true) &&
        (formData.status ? item.status === formData.status : true)
      );
    });

    programList.value = filteredList;
    total.value = filteredList.length;
    loading.value = false;
  }, 500);
};

// 重置表单
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
  fetchData();
};

// 处理分页变化
const onPageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchData();
};

// 处理卡片点击
const handleCardClick = (item: any) => {
  handleView(item);
};

// 查看详情
const handleView = (item: any) => {
  router.push(`/training-program/detail/${item.id}`);
};

// 下载培养方案
const handleDownload = (item: any) => {
  MessagePlugin.success(`开始下载《${item.name}》培养方案`);
  // 实际下载逻辑...
};

onMounted(() => {
  fetchData();
  total.value = programList.value.length;
});
</script>

<style lang="less" scoped>
.training-program-browse-container {
  padding: 20px;
  
  .filter-card {
    margin-bottom: 16px;
  }

  .operation-col {
    display: flex;
    align-items: flex-start;
    
    .reset-btn {
      margin-left: 8px;
    }
  }

  .list-card {
    .card-title {
      display: flex;
      align-items: center;
      
      .tag-count {
        margin-left: 8px;
      }
    }
  }

  .program-card-list {
    margin-top: 16px;
  }

  .program-card {
    height: 100%;
    cursor: pointer;
    
    .program-card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .program-name {
        max-width: 70%;
        font-weight: 500;
      }
    }
    
    .program-card-content {
      font-size: 14px;
      
      .info-item {
        margin-bottom: 8px;
        display: flex;
        
        .info-label {
          color: var(--td-text-color-secondary);
          min-width: 70px;
        }
        
        .info-value {
          flex: 1;
          word-break: break-all;
        }
      }
    }
    
    .program-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .creator {
        display: flex;
        align-items: center;
        
        span {
          margin-left: 8px;
          font-size: 14px;
          color: var(--td-text-color-secondary);
        }
      }
    }
  }

  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation-column {
    button + button {
      margin-left: 8px;
    }
  }

  :deep(.t-pagination) {
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style> 