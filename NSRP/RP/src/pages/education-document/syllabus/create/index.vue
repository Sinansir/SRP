<template>
  <div class="container">
    <a-card class="general-card" title="新建教学大纲">
      <a-form
        :model="formData"
        layout="vertical"
        ref="formRef"
        :rules="rules"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="course" label="课程名称" required>
              <a-select
                v-model="formData.course"
                placeholder="请选择课程"
                allow-search
                @search="handleCourseSearch"
              >
                <a-option v-for="item in courses" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="teacher" label="授课教师" required>
              <a-select
                v-model="formData.teacher"
                placeholder="请选择授课教师"
                allow-search
                @search="handleTeacherSearch"
              >
                <a-option v-for="item in teachers" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="credit" label="学分" required>
              <a-input-number
                v-model="formData.credit"
                placeholder="请输入学分"
                step="0.5"
                min="0.5"
                max="10"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="hours" label="总学时" required>
              <a-input-number
                v-model="formData.hours"
                placeholder="请输入总学时"
                step="2"
                min="16"
                max="128"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="department" label="开课学院" required>
              <a-select v-model="formData.department" placeholder="请选择开课学院">
                <a-option value="1">计算机科学与技术学院</a-option>
                <a-option value="2">电子工程学院</a-option>
                <a-option value="3">数学学院</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item field="objectives" label="教学目标" required>
          <a-textarea
            v-model="formData.objectives"
            placeholder="请输入教学目标"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

        <a-divider>教学内容</a-divider>

        <div v-for="(chapter, index) in formData.chapters" :key="index" class="chapter-item">
          <a-row :gutter="16" align="center">
            <a-col :span="22">
              <a-form-item :field="`chapters[${index}].title`" label="章节标题" required>
                <a-input v-model="chapter.title" placeholder="请输入章节标题" />
              </a-form-item>
            </a-col>
            <a-col :span="2" style="text-align: right">
              <a-button
                type="text"
                status="danger"
                shape="circle"
                @click="handleRemoveChapter(index)"
              >
                <template #icon>
                  <icon-delete />
                </template>
              </a-button>
            </a-col>
          </a-row>
          <a-form-item :field="`chapters[${index}].content`" label="章节内容" required>
            <a-textarea
              v-model="chapter.content"
              placeholder="请输入章节内容"
              :auto-size="{ minRows: 2, maxRows: 4 }"
            />
          </a-form-item>
          <a-form-item :field="`chapters[${index}].hours`" label="学时">
            <a-input-number v-model="chapter.hours" placeholder="学时" min="1" />
          </a-form-item>
          <a-divider v-if="index < formData.chapters.length - 1" />
        </div>

        <a-space size="medium" fill>
          <a-button type="dashed" long @click="handleAddChapter">
            <template #icon>
              <icon-plus />
            </template>
            添加章节
          </a-button>
        </a-space>

        <a-divider>考核方式</a-divider>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item field="assessment" label="考核方式" required>
              <a-space wrap>
                <a-checkbox-group v-model="formData.assessment">
                  <a-checkbox value="exam">期末考试</a-checkbox>
                  <a-checkbox value="quiz">课堂测验</a-checkbox>
                  <a-checkbox value="homework">课后作业</a-checkbox>
                  <a-checkbox value="project">课程项目</a-checkbox>
                  <a-checkbox value="presentation">课堂展示</a-checkbox>
                  <a-checkbox value="lab">实验</a-checkbox>
                </a-checkbox-group>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item field="textbooks" label="教材与参考资料" required>
              <a-textarea
                v-model="formData.textbooks"
                placeholder="请输入教材与参考资料"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-space>
          <a-button type="primary" @click="handleSubmit">提交大纲</a-button>
          <a-button @click="handleSaveDraft">保存草稿</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref();

// 课程列表
const courses = [
  { value: 'CS101', label: '计算机导论' },
  { value: 'CS201', label: '数据结构' },
  { value: 'CS301', label: '操作系统' },
  { value: 'CS401', label: '编译原理' },
  { value: 'CS501', label: '人工智能' },
];

// 教师列表
const teachers = [
  { value: '1', label: '张教授' },
  { value: '2', label: '李教授' },
  { value: '3', label: '王教授' },
  { value: '4', label: '刘教授' },
  { value: '5', label: '赵教授' },
];

// 表单数据
const formData = reactive({
  course: '',
  teacher: '',
  credit: 3,
  hours: 48,
  department: '',
  objectives: '',
  chapters: [
    {
      title: '',
      content: '',
      hours: 4,
    },
  ],
  assessment: ['exam', 'homework'],
  textbooks: '',
});

// 验证规则
const rules = {
  course: [{ required: true, message: '请选择课程' }],
  teacher: [{ required: true, message: '请选择授课教师' }],
  credit: [{ required: true, message: '请输入学分' }],
  hours: [{ required: true, message: '请输入总学时' }],
  department: [{ required: true, message: '请选择开课学院' }],
  objectives: [{ required: true, message: '请输入教学目标' }],
  assessment: [{ required: true, message: '请选择考核方式' }],
  textbooks: [{ required: true, message: '请输入教材与参考资料' }],
};

// 搜索课程
const handleCourseSearch = (value: string) => {
  console.log('搜索课程:', value);
  // 可以在这里实现课程搜索逻辑
};

// 搜索教师
const handleTeacherSearch = (value: string) => {
  console.log('搜索教师:', value);
  // 可以在这里实现教师搜索逻辑
};

// 添加章节
const handleAddChapter = () => {
  formData.chapters.push({
    title: '',
    content: '',
    hours: 4,
  });
};

// 移除章节
const handleRemoveChapter = (index: number) => {
  if (formData.chapters.length > 1) {
    formData.chapters.splice(index, 1);
  } else {
    Message.warning('至少保留一个章节');
  }
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    Message.success('教学大纲提交成功');
    router.push('/education-document/syllabus');
  });
};

// 保存草稿
const handleSaveDraft = () => {
  Message.success('草稿保存成功');
};

// 取消
const handleCancel = () => {
  router.push('/education-document/syllabus');
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .chapter-item {
    margin-bottom: 16px;
  }
}
</style> 