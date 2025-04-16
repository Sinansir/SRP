<template>
  <div class="course-view-container">
    <t-loading
      v-if="loading"
      :loading="loading"
      style="display: flex; align-items: center; justify-content: center; height: 300px;"
    />
    
    <template v-else>
      <t-card :title="`课程详情: ${courseData.name}`" class="course-detail-card" header-bordered>
        <template #actions>
          <t-space>
            <t-button theme="default" @click="handleEdit">编辑</t-button>
            <t-button theme="default" @click="handleBack">返回</t-button>
          </t-space>
        </template>
        
        <t-row :gutter="[24, 24]">
          <!-- 基本信息卡片 -->
          <t-col :xs="24" :sm="12" :xl="6">
            <t-card title="基本信息" :bordered="true" class="sub-card" headerBordered>
              <div class="detail-item">
                <span class="detail-label">课程代码:</span>
                <span class="detail-value">{{ courseData.code }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">课程名称:</span>
                <span class="detail-value">{{ courseData.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">英文名称:</span>
                <span class="detail-value">{{ courseData.englishName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">课程类别:</span>
                <span class="detail-value">{{ courseData.categoryName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">课程性质:</span>
                <span class="detail-value">{{ courseData.natureName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">开课院系:</span>
                <span class="detail-value">{{ courseData.departmentName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">学分:</span>
                <span class="detail-value">{{ courseData.credits }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">考核方式:</span>
                <span class="detail-value">{{ courseData.examTypeName }}</span>
              </div>
            </t-card>
          </t-col>
          
          <!-- 学时信息卡片 -->
          <t-col :xs="24" :sm="12" :xl="6">
            <t-card title="学时信息" :bordered="true" class="sub-card" headerBordered>
              <div class="detail-hours-container">
                <div class="detail-hours">
                  <div class="hours-value">{{ courseData.theoryHours }}</div>
                  <div class="hours-label">理论学时</div>
                </div>
                <div class="detail-hours">
                  <div class="hours-value">{{ courseData.practiceHours }}</div>
                  <div class="hours-label">实践学时</div>
                </div>
                <div class="detail-hours highlight">
                  <div class="hours-value">{{ courseData.totalHours }}</div>
                  <div class="hours-label">总学时</div>
                </div>
              </div>
            </t-card>
          </t-col>
          
          <!-- 管理信息卡片 -->
          <t-col :xs="24" :sm="12" :xl="6">
            <t-card title="管理信息" :bordered="true" class="sub-card" headerBordered>
              <div class="detail-item">
                <span class="detail-label">创建人:</span>
                <span class="detail-value">{{ courseData.createdBy }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ courseData.createdTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">最后更新人:</span>
                <span class="detail-value">{{ courseData.updatedBy }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">最后更新时间:</span>
                <span class="detail-value">{{ courseData.updatedTime }}</span>
              </div>
            </t-card>
          </t-col>
          
          <!-- 教学资料卡片 -->
          <t-col :xs="24" :sm="12" :xl="6">
            <t-card title="教学资料" :bordered="true" class="sub-card" headerBordered>
              <t-empty v-if="!materials.length" description="暂无教学资料" />
              <template v-else>
                <div v-for="item in materials" :key="item.id" class="material-item">
                  <div class="material-header">
                    <div class="material-icon">
                      <t-icon :name="getMaterialIcon(item.type)" />
                    </div>
                    <div class="material-name">{{ item.name }}</div>
                  </div>
                  <div class="material-info">
                    <t-tag variant="light" size="small">{{ item.type }}</t-tag>
                    <span>{{ item.size }}</span>
                  </div>
                  <div class="material-action">
                    <t-button theme="primary" variant="text" size="small" @click="handleDownload(item)">
                      <template #icon><t-icon name="download" /></template>
                      下载
                    </t-button>
                  </div>
                </div>
              </template>
            </t-card>
          </t-col>
        </t-row>
      </t-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRoute, useRouter } from 'vue-router';

// 定义类型
interface CourseData {
  id: string;
  code: string;
  name: string;
  englishName: string;
  category: string;
  categoryName: string;
  nature: string;
  natureName: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  totalHours: number;
  examType: string;
  examTypeName: string;
  department: string;
  departmentName: string;
  isCore: boolean;
  isBilingual: boolean;
  status: number;
  statusName: string;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
  description: string;
}

interface MaterialItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadTime: string;
}

const router = useRouter();
const route = useRoute();
const loading = ref(true);

// 课程数据
const courseData = reactive<CourseData>({
  id: '',
  code: '',
  name: '',
  englishName: '',
  category: '',
  categoryName: '',
  nature: '',
  natureName: '',
  credits: 0,
  theoryHours: 0,
  practiceHours: 0,
  totalHours: 0,
  examType: '',
  examTypeName: '',
  department: '',
  departmentName: '',
  isCore: false,
  isBilingual: false,
  status: 1,
  statusName: '',
  createdBy: '',
  createdTime: '',
  updatedBy: '',
  updatedTime: '',
  description: '',
});

// 教学资料列表
const materials = ref<MaterialItem[]>([]);

// 获取课程数据
const fetchCourseData = async () => {
  loading.value = true;
  try {
    // 从路由获取课程ID
    const id = route.params.id as string;
    
    if (!id) {
      MessagePlugin.error('缺少课程ID参数');
      loading.value = false;
      return;
    }
    
    console.log('获取课程详情，ID:', id);
    
    // 从Mock API获取数据
    fetch(`/api/course/detail/${id}`)
      .then(response => response.json())
      .then(result => {
        if (result.code === 0 && result.data) {
          // 直接使用API返回的数据
          Object.assign(courseData, result.data);
          
          // 模拟教学资料数据
          if (Math.random() > 0.3) {
            materials.value = [
              {
                id: 1,
                name: '教学大纲.doc',
                type: '文档',
                size: '245KB',
                uploadTime: '2023-02-15',
              },
              {
                id: 2,
                name: '课程PPT第一章.pptx',
                type: '演示文稿',
                size: '3.5MB',
                uploadTime: '2023-02-18',
              },
              {
                id: 3,
                name: '参考资料.pdf',
                type: '文档',
                size: '1.2MB',
                uploadTime: '2023-02-20',
              },
            ];
          }
          
          loading.value = false;
        } else {
          console.error('获取课程数据失败:', result.message);
          MessagePlugin.error(result.message || '获取课程数据失败');
          loading.value = false;
          
          // 返回到列表页
          router.push('/course-library/maintain/list');
        }
      })
      .catch(error => {
        console.error('获取课程数据出错:', error);
        MessagePlugin.error('获取课程数据失败，请稍后重试');
        loading.value = false;
        
        // 返回到列表页
        router.push('/course-library/maintain/list');
      });
  } catch (error) {
    console.error('获取课程数据出错:', error);
    MessagePlugin.error('获取课程数据失败');
    loading.value = false;
    
    // 返回到列表页
    router.push('/course-library/maintain/list');
  }
};

// 获取资料图标
const getMaterialIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    '文档': 'file-excel',
    '演示文稿': 'file-powerpoint',
    '视频': 'video',
    '音频': 'sound',
    '图片': 'image',
    '其他': 'file'
  };
  
  return iconMap[type] || 'file';
};

// 下载资料
const handleDownload = (item: MaterialItem): void => {
  MessagePlugin.info(`正在下载: ${item.name}`);
};

// 编辑课程
const handleEdit = (): void => {
  router.push(`/course-library/maintain/edit/${courseData.id}`);
};

// 返回列表
const handleBack = (): void => {
  router.push('/course-library/maintain/list');
};

// 页面加载时获取数据
onMounted(() => {
  fetchCourseData();
});
</script>

<style lang="less" scoped>
.course-view-container {
  padding: 16px;
  
  .course-detail-card {
    position: relative;
    margin-bottom: 24px;
  }
  
  .sub-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .t-card__title {
      font-size: 16px;
      font-weight: 500;
    }
    
    .t-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  
  .detail-item {
    display: flex;
    margin-bottom: 12px;
    
    .detail-label {
      width: 100px;
      color: var(--td-text-color-secondary);
      font-weight: 400;
      flex-shrink: 0;
    }
    
    .detail-value {
      font-weight: 500;
      word-break: break-word;
    }
  }
  
  .detail-hours-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .detail-hours {
    text-align: center;
    padding: 16px 10px;
    border-radius: 6px;
    background-color: var(--td-bg-color-container-hover);
    
    &.highlight {
      background-color: var(--td-brand-color-light);
      
      .hours-value {
        color: var(--td-brand-color);
      }
    }
    
    .hours-value {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    
    .hours-label {
      color: var(--td-text-color-secondary);
      font-size: 14px;
    }
  }
  
  .material-item {
    padding: 10px 0;
    border-bottom: 1px solid var(--td-component-stroke);
    
    &:last-child {
      border-bottom: none;
    }
    
    .material-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .material-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background-color: var(--td-bg-color-container-hover);
        border-radius: 4px;
        margin-right: 8px;
      }
      
      .material-name {
        font-weight: 500;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .material-info {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      span {
        margin-left: 8px;
        color: var(--td-text-color-secondary);
        font-size: 12px;
      }
    }
    
    .material-action {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style> 