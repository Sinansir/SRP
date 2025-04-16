<template>
  <div class="teaching-calendar-container">
    <t-card title="教学日历表单" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleSubmit">提交</t-button>
          <t-button theme="default" @click="handleSaveDraft">保存草稿</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
        </t-space>
      </template>
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-form-item label="课程名称" name="courseName">
            <t-select
              v-model="formData.courseName"
              placeholder="请选择课程"
              clearable
              :options="courseOptions"
            />
          </t-form-item>
          <t-form-item label="课程代码" name="courseCode">
            <t-input v-model="formData.courseCode" placeholder="请输入课程代码" />
          </t-form-item>
          <t-form-item label="学期" name="semester">
            <t-select
              v-model="formData.semester"
              placeholder="请选择学期"
              clearable
              :options="semesterOptions"
            />
          </t-form-item>
          <t-form-item label="授课教师" name="teacher">
            <t-input v-model="formData.teacher" placeholder="请输入授课教师姓名" />
          </t-form-item>
          <t-form-item label="教学班级" name="class">
            <t-input v-model="formData.class" placeholder="请输入教学班级" />
          </t-form-item>
          <t-form-item label="总学时" name="totalHours">
            <t-input-number v-model="formData.totalHours" placeholder="请输入总学时" />
          </t-form-item>
          <t-form-item label="讲课学时" name="lectureHours">
            <t-input-number v-model="formData.lectureHours" placeholder="请输入讲课学时" />
          </t-form-item>
          <t-form-item label="实验学时" name="experimentHours">
            <t-input-number v-model="formData.experimentHours" placeholder="请输入实验学时" />
          </t-form-item>
          <t-form-item label="考核方式" name="assessmentMethod">
            <t-radio-group v-model="formData.assessmentMethod">
              <t-radio value="exam">考试</t-radio>
              <t-radio value="check">考查</t-radio>
            </t-radio-group>
          </t-form-item>
          
          <t-divider>教学进度安排</t-divider>
          
          <t-row :gutter="[16, 16]" style="margin-bottom: 16px">
            <t-col :span="6">
              <t-button theme="primary" @click="addScheduleItem">添加教学进度</t-button>
            </t-col>
          </t-row>
          
          <div v-for="(item, index) in formData.schedule" :key="`schedule-${index}`" class="schedule-item">
            <t-row :gutter="[16, 16]">
              <t-col :span="24">
                <t-alert
                  theme="info"
                  :title="`第${index + 1}周教学安排`"
                  :close="false"
                  style="margin-bottom: 8px"
                >
                  <template #operation>
                    <t-button theme="danger" variant="text" size="small" @click="removeScheduleItem(index)">
                      删除
                    </t-button>
                  </template>
                </t-alert>
              </t-col>
            </t-row>
            
            <t-row :gutter="[16, 16]">
              <t-col :span="8">
                <t-form-item :label="`第${index + 1}周`" :name="`schedule[${index}].week`" label-width="80px">
                  <t-input v-model="item.week" placeholder="请输入周次，例如：1-2" />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="教学内容" :name="`schedule[${index}].content`" label-width="80px">
                  <t-input v-model="item.content" placeholder="请输入教学内容" />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="课时" :name="`schedule[${index}].hours`" label-width="80px">
                  <t-input-number v-model="item.hours" placeholder="请输入课时" />
                </t-form-item>
              </t-col>
            </t-row>
            
            <t-row :gutter="[16, 16]">
              <t-col :span="8">
                <t-form-item label="授课方式" :name="`schedule[${index}].teachingMethod`" label-width="80px">
                  <t-select
                    v-model="item.teachingMethod"
                    placeholder="请选择授课方式"
                    clearable
                    :options="teachingMethodOptions"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="16">
                <t-form-item label="备注" :name="`schedule[${index}].remark`" label-width="80px">
                  <t-input v-model="item.remark" placeholder="请输入备注信息" />
                </t-form-item>
              </t-col>
            </t-row>
            
            <t-divider v-if="index !== formData.schedule.length - 1"></t-divider>
          </div>
          
          <t-divider>课程考核安排</t-divider>
          
          <t-form-item label="考试时间" name="examTime">
            <t-date-picker v-model="formData.examTime" placeholder="请选择考试时间" />
          </t-form-item>
          <t-form-item label="考试地点" name="examLocation">
            <t-input v-model="formData.examLocation" placeholder="请输入考试地点" />
          </t-form-item>
          <t-form-item label="考核方式说明" name="assessmentDescription">
            <t-textarea
              v-model="formData.assessmentDescription"
              placeholder="请输入考核方式说明，包括平时成绩、期中成绩、期末成绩的占比等"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          
          <t-divider>教学资源</t-divider>
          
          <t-form-item label="教材" name="textbook">
            <t-input v-model="formData.textbook" placeholder="请输入教材信息" />
          </t-form-item>
          <t-form-item label="参考资料" name="references">
            <t-textarea
              v-model="formData.references"
              placeholder="请输入参考资料信息"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="教学课件" name="courseware">
            <t-upload
              v-model="formData.courseware"
              theme="file"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              :headers="{ token: 'mock-token' }"
              :max-size="20 * 1024 * 1024"
              :format-response="formatResponse"
            >
              <t-button theme="default">
                <template #icon>
                  <t-icon name="upload" />
                </template>
                上传课件
              </t-button>
            </t-upload>
          </t-form-item>
        </t-form>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const formData = reactive({
  courseName: '',
  courseCode: '',
  semester: '',
  teacher: '',
  class: '',
  totalHours: 64,
  lectureHours: 48,
  experimentHours: 16,
  assessmentMethod: 'exam',
  schedule: [
    {
      week: '1',
      content: '课程介绍与概述',
      hours: 4,
      teachingMethod: 'lecture',
      remark: '',
    },
  ],
  examTime: '',
  examLocation: '',
  assessmentDescription: '',
  textbook: '',
  references: '',
  courseware: [],
});

const rules = {
  courseName: [{ required: true, message: '请选择课程', type: 'error' }],
  courseCode: [{ required: true, message: '请输入课程代码', type: 'error' }],
  semester: [{ required: true, message: '请选择学期', type: 'error' }],
  teacher: [{ required: true, message: '请输入授课教师姓名', type: 'error' }],
  class: [{ required: true, message: '请输入教学班级', type: 'error' }],
  totalHours: [{ required: true, message: '请输入总学时', type: 'error' }],
  lectureHours: [{ required: true, message: '请输入讲课学时', type: 'error' }],
  experimentHours: [{ required: true, message: '请输入实验学时', type: 'error' }],
  'schedule[].week': [{ required: true, message: '请输入周次', type: 'error' }],
  'schedule[].content': [{ required: true, message: '请输入教学内容', type: 'error' }],
  'schedule[].hours': [{ required: true, message: '请输入课时', type: 'error' }],
  'schedule[].teachingMethod': [{ required: true, message: '请选择授课方式', type: 'error' }],
};

// 课程选项
const courseOptions = [
  { label: '计算机网络', value: '计算机网络' },
  { label: '操作系统', value: '操作系统' },
  { label: '软件工程', value: '软件工程' },
  { label: '数据结构', value: '数据结构' },
  { label: '数据库系统原理', value: '数据库系统原理' },
];

// 学期选项
const semesterOptions = [
  { label: '2023-2024学年第一学期', value: '2023-2024-1' },
  { label: '2023-2024学年第二学期', value: '2023-2024-2' },
  { label: '2024-2025学年第一学期', value: '2024-2025-1' },
];

// 授课方式选项
const teachingMethodOptions = [
  { label: '讲授', value: 'lecture' },
  { label: '实验', value: 'experiment' },
  { label: '讨论', value: 'discussion' },
  { label: '自学', value: 'self-study' },
  { label: '作业', value: 'assignment' },
  { label: '复习', value: 'review' },
  { label: '考试', value: 'exam' },
];

const form = ref(null);

// 添加教学进度项
const addScheduleItem = () => {
  formData.schedule.push({
    week: '',
    content: '',
    hours: 0,
    teachingMethod: '',
    remark: '',
  });
};

// 删除教学进度项
const removeScheduleItem = (index) => {
  formData.schedule.splice(index, 1);
};

// 格式化上传响应
const formatResponse = (res) => {
  return { ...res.data, name: res.data.name };
};

// 提交表单
const handleSubmit = () => {
  form.value?.validate().then((result) => {
    if (!result) {
      // 校验通过，提交表单
      MessagePlugin.success('教学日历提交成功');
    }
  });
};

// 保存草稿
const handleSaveDraft = () => {
  MessagePlugin.success('教学日历已保存为草稿');
};

// 重置表单
const handleReset = () => {
  form.value?.reset();
  formData.schedule = [
    {
      week: '1',
      content: '课程介绍与概述',
      hours: 4,
      teachingMethod: 'lecture',
      remark: '',
    },
  ];
};
</script>

<style scoped>
.teaching-calendar-container {
  margin: 20px;
}

.schedule-item {
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}
</style> 