<template>
  <div class="course-edit-container">
    <t-card v-if="loading" class="loading-card">
      <t-loading size="medium" />
    </t-card>
    
    <t-card v-else :title="`编辑课程: ${formData.name}`" header-bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleSubmit">保存</t-button>
          <t-button theme="default" @click="handleCancel">取消</t-button>
        </t-space>
      </template>
      
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100">
        <t-row :gutter="[16, 16]">
          <t-col :span="12">
            <t-form-item label="课程代码" name="code">
              <t-input v-model="formData.code" placeholder="请输入课程代码" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="课程名称" name="name">
              <t-input v-model="formData.name" placeholder="请输入课程名称" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="英文名称" name="englishName">
              <t-input v-model="formData.englishName" placeholder="请输入英文名称" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="课程类别" name="category">
              <t-select v-model="formData.category" placeholder="请选择课程类别" clearable>
                <t-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="课程性质" name="nature">
              <t-select v-model="formData.nature" placeholder="请选择课程性质" clearable>
                <t-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="开课院系" name="department">
              <t-select v-model="formData.department" placeholder="请选择开课院系" clearable>
                <t-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="学分" name="credits">
              <t-input-number v-model="formData.credits" :min="0" :max="30" :step="0.5" />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="理论学时" name="theoryHours">
              <t-input-number v-model="formData.theoryHours" :min="0" :max="200" />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="实践学时" name="practiceHours">
              <t-input-number v-model="formData.practiceHours" :min="0" :max="200" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="考核方式" name="examType">
              <t-select v-model="formData.examType" placeholder="请选择考核方式">
                <t-option v-for="item in examOptions" :key="item.value" :label="item.label" :value="item.value" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="课程状态" name="status">
              <t-radio-group v-model="formData.status">
                <t-radio :value="1">正常</t-radio>
                <t-radio :value="0">禁用</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const form = ref(null);
const loading = ref(true);

// 表单数据
const formData = reactive({
  id: '',
  code: '',
  name: '',
  englishName: '',
  category: '',
  nature: '',
  credits: 3,
  theoryHours: 32,
  practiceHours: 16,
  examType: 'exam',
  department: '',
  status: 1,
});

// 表单验证规则
const rules = {
  code: [{ required: true, message: '请输入课程代码', type: 'error' }],
  name: [{ required: true, message: '请输入课程名称', type: 'error' }],
  category: [{ required: true, message: '请选择课程类别', type: 'error' }],
  nature: [{ required: true, message: '请选择课程性质', type: 'error' }],
  credits: [{ required: true, message: '请输入学分', type: 'error' }],
  department: [{ required: true, message: '请选择开课院系', type: 'error' }],
};

// 课程类别选项
const categoryOptions = ref([
  { label: '公共基础课', value: 'GC' },
  { label: '专业基础课', value: 'ZJ' },
  { label: '专业课', value: 'ZY' },
  { label: '实践教学', value: 'SJ' },
  { label: '通识选修课', value: 'TX' },
]);

// 课程性质选项
const natureOptions = ref([
  { label: '必修', value: 'required' },
  { label: '选修', value: 'elective' },
  { label: '限选', value: 'limited' },
]);

// 开课院系选项
const departmentOptions = ref([
  { label: '计算机学院', value: '3' },
  { label: '机械学院', value: '4' },
  { label: '电子信息学院', value: '5' },
  { label: '外国语学院', value: '6' },
]);

// 考核方式选项
const examOptions = ref([
  { label: '考试', value: 'exam' },
  { label: '考查', value: 'check' },
  { label: '论文', value: 'paper' },
  { label: '设计', value: 'design' },
  { label: '操作', value: 'operation' },
]);

// 获取课程数据
const fetchCourseData = async () => {
  loading.value = true;
  try {
    // 从路由获取课程ID
    const id = route.params.id;
    
    // 模拟从API获取数据
    const response = await fetch(`/api/course/${id}`);
    const data = await response.json();
    
    if (data.code === 0 && data.data) {
      // 更新表单数据
      Object.keys(formData).forEach(key => {
        if (key in data.data) {
          formData[key] = data.data[key];
        }
      });
    } else {
      MessagePlugin.error('获取课程数据失败');
    }
    
    loading.value = false;
  } catch (error) {
    console.error('获取课程数据出错:', error);
    MessagePlugin.error('获取课程数据失败');
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchCourseData();
});

// 表单提交
const handleSubmit = () => {
  form.value?.validate().then((result) => {
    if (result === true) {
      // 发送请求到mock API保存数据
      fetch(`/api/course/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 0) {
            MessagePlugin.success('保存成功');
            router.push('/course-library/maintain/list');
          } else {
            MessagePlugin.error(data.message || '保存失败');
          }
        })
        .catch(error => {
          console.error('保存课程出错:', error);
          MessagePlugin.error('保存失败');
        });
    }
  });
};

// 取消操作
const handleCancel = () => {
  router.push('/course-library/maintain/list');
};
</script>

<style lang="less" scoped>
.course-edit-container {
  padding: 16px;
  
  .loading-card {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 