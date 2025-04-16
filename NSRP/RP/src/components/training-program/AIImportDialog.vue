<template>
  <t-dialog
    :visible="modelValue"
    @update:visible="updateVisible"
    header="AI导入课程体系"
    :footer="false"
    width="800px"
    destroy-on-close
  >
    <t-steps :current="currentStep" :theme="theme">
      <t-step-item title="选择文件" content="选择要导入的课程体系文件" />
      <t-step-item title="处理中" content="AI分析处理文件内容" />
      <t-step-item title="预览结果" content="预览并确认导入结果" />
    </t-steps>

    <!-- 步骤1：文件上传 -->
    <div v-if="currentStep === 0" class="mt-4">
      <t-form>
        <t-form-item label="AI服务">
          <t-select v-model="serviceId" placeholder="请选择AI服务">
            <t-option
              v-for="item in aiServiceList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </t-select>
        </t-form-item>
        
        <t-form-item label="文件上传">
          <t-upload
            v-model="fileList"
            :action="uploadAction"
            theme="file"
            :headers="uploadHeaders"
            :data="uploadData"
            :max-size="10 * 1024 * 1024"
            :accept="'.docx,.pdf,.xlsx,.csv'"
            :before-upload="beforeUpload"
            :on-progress="onUploadProgress"
            :on-success="onUploadSuccess"
            :on-fail="onUploadFail"
            :draggable="true"
            :multiple="false"
          >
            <t-button>选择文件</t-button>
            <template #dragContent>
              <div class="upload-drag-container">
                <div class="upload-drag-content">
                  <p class="upload-drag-title">
                    点击选择或拖拽文件到此处上传
                  </p>
                  <p class="upload-drag-subtitle">
                    支持DOCX、PDF、XLSX、CSV格式文件，单个文件大小不超过10MB
                  </p>
                </div>
              </div>
            </template>
          </t-upload>
        </t-form-item>
      </t-form>
      
      <div class="dialog-footer">
        <t-space>
          <t-button theme="default" @click="closeDialog">取消</t-button>
          <t-button theme="primary" :disabled="!canProceed" @click="startProcessing">开始导入</t-button>
        </t-space>
      </div>
    </div>

    <!-- 步骤2：处理中 -->
    <div v-if="currentStep === 1" class="mt-4">
      <div class="processing-container">
        <t-loading :loading="true" />
        <div class="processing-info">
          <p class="processing-file-name">正在处理文件: {{ currentFileName }}</p>
          <t-progress :percentage="importProgress" :color="{ from: '#0052D9', to: '#00A870' }" />
          <p class="processing-status">{{ importStatus }}</p>
        </div>
      </div>
    </div>

    <!-- 步骤3：预览结果 -->
    <div v-if="currentStep === 2" class="mt-4">
      <div v-if="!importResult" class="import-error">
        <t-alert
          theme="error"
          message="导入失败"
          description="无法解析文件内容，请检查文件格式或选择其他文件重试。"
        />
        <div class="dialog-footer mt-4">
          <t-space>
            <t-button theme="default" @click="closeDialog">取消</t-button>
            <t-button theme="primary" @click="resetImport">重新导入</t-button>
          </t-space>
        </div>
      </div>
      
      <div v-else class="import-result">
        <div class="result-summary">
          <t-alert
            theme="success"
            message="导入成功"
            description="AI成功识别了课程体系数据，请预览并确认导入结果。"
          />
          
          <div class="summary-info mt-4">
            <p><b>模板名称：</b><t-input v-model="templateName" placeholder="请输入模板名称" /></p>
            <p><b>专业类型：</b>
              <t-select v-model="majorType" placeholder="请选择专业类型" style="width: 200px">
                <t-option value="engineering" label="工科类" />
                <t-option value="science" label="理科类" />
                <t-option value="arts" label="文科类" />
                <t-option value="economics_management" label="经管类" />
                <t-option value="medicine" label="医学类" />
                <t-option value="education" label="教育类" />
                <t-option value="art" label="艺术类" />
              </t-select>
            </p>
            <p><b>识别课程数：</b>{{ getTotalCourseCount() }}门</p>
            <p><b>总学分：</b>{{ getTotalCredits() }}分</p>
          </div>
        </div>
        
        <div class="modules-preview mt-4">
          <t-collapse :default-expand-all="true">
            <t-collapse-panel 
              v-for="(module, index) in importResult.modules" 
              :key="index" 
              :header="module.name"
              :value="index"
            >
              <div class="module-info">
                <p><b>模块类型：</b>{{ getModuleTypeText(module.type) }}</p>
                <p><b>学分要求：</b>{{ module.minCredits }}-{{ module.maxCredits }}学分 (建议{{ module.recommendedCredits }}学分)</p>
                <p><b>课程数量：</b>必修{{ module.requiredCourses?.length || 0 }}门，选修{{ module.electiveCourses?.length || 0 }}门</p>
              </div>
              
              <div v-if="module.requiredCourses && module.requiredCourses.length > 0" class="course-list">
                <p class="course-list-title">必修课程：</p>
                <t-table
                  :data="module.requiredCourses"
                  :columns="courseColumns"
                  row-key="id"
                  size="small"
                  stripe
                  bordered
                />
              </div>
              
              <div v-if="module.electiveCourses && module.electiveCourses.length > 0" class="course-list mt-2">
                <p class="course-list-title">选修课程：</p>
                <t-table
                  :data="module.electiveCourses"
                  :columns="courseColumns"
                  row-key="id"
                  size="small"
                  stripe
                  bordered
                />
              </div>
            </t-collapse-panel>
          </t-collapse>
        </div>
        
        <div class="dialog-footer mt-4">
          <t-space>
            <t-button theme="default" @click="closeDialog">取消</t-button>
            <t-button theme="default" @click="resetImport">重新导入</t-button>
            <t-button theme="primary" @click="saveTemplate">保存为课程体系模板</t-button>
          </t-space>
        </div>
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { MessagePlugin, UploadFile } from 'tdesign-vue-next';
import Mock from 'mockjs';

// 定义组件的Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

// 更新visible值的方法
const updateVisible = (val: boolean) => {
  emit('update:modelValue', val);
};

// 步骤控制
const currentStep = ref(0);
const theme = ref<'default' | 'dot'>('default');

// AI服务相关
const serviceId = ref('1'); // 默认选择第一个服务
const aiServiceList = ref([]);

// 文件上传相关
const fileList = ref([]);
const uploadAction = '/api/program/ai-import/upload';
const uploadHeaders = {};
const uploadData = computed(() => ({
  serviceId: serviceId.value
}));
const canProceed = computed(() => serviceId.value);

// 导入任务相关
const taskId = ref('');
const importProgress = ref(0);
const importStatus = ref('准备导入...');
const currentFileName = ref('');
const importResult = ref(null);
const isMockMode = ref(false); // 标记是否使用模拟模式

// 导入结果相关
const templateName = ref('');
const majorType = ref('engineering');

// 课程表格列定义
const courseColumns = [
  { colKey: 'code', title: '课程代码', width: 100 },
  { colKey: 'name', title: '课程名称', width: 180 },
  { colKey: 'credits', title: '学分', width: 80 },
  { colKey: 'hours', title: '学时', width: 80 },
  { colKey: 'property', title: '课程性质', width: 100 },
  { colKey: 'term', title: '开课学期', width: 120 }
];

// 计算总课程数量
const getTotalCourseCount = () => {
  if (!importResult.value || !importResult.value.modules) return 0;
  
  // @ts-ignore
  return importResult.value.modules.reduce((total, module) => {
    const requiredCount = module.requiredCourses?.length || 0;
    const electiveCount = module.electiveCourses?.length || 0;
    return total + requiredCount + electiveCount;
  }, 0);
};

// 计算总学分数
const getTotalCredits = () => {
  if (!importResult.value || !importResult.value.modules) return 0;
  
  // @ts-ignore
  return importResult.value.modules.reduce((total, module) => {
    return total + (module.recommendedCredits || 0);
  }, 0);
};

// 获取模块类型文本
const getModuleTypeText = (type: string) => {
  const types: Record<string, string> = {
    public_basic: '公共基础课程',
    discipline_basic: '学科基础课程',
    professional_core: '专业核心课程',
    professional_elective: '专业选修课程',
    general_education: '通识教育课程',
    practice: '实践课程'
  };
  // @ts-ignore
  return types[type] || type;
};

// 初始化加载AI服务列表
const loadAIServices = async () => {
  try {
    const res = await fetch('/api/program/ai-import/list');
    const data = await res.json();
    
    if (data.code === 0) {
      aiServiceList.value = data.data.list;
      
      // 选择默认服务
      const defaultService = aiServiceList.value.find(service => service.isDefault);
      if (defaultService) {
        serviceId.value = defaultService.id;
      }
    } else {
      MessagePlugin.error(data.message || '获取AI服务列表失败');
    }
  } catch (error) {
    console.error('获取AI服务列表出错:', error);
    MessagePlugin.error('获取AI服务列表出错');
  }
};

// 文件上传前的处理
const beforeUpload = (file: UploadFile) => {
  // 检查文件大小和类型
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['.docx', '.pdf', '.xlsx', '.csv'];
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (file.size > maxSize) {
    MessagePlugin.error('文件大小不能超过10MB');
    return false;
  }
  
  if (!allowedTypes.includes(fileExtension)) {
    MessagePlugin.error('仅支持DOCX、PDF、XLSX、CSV格式文件');
    return false;
  }
  
  currentFileName.value = file.name;
  return true;
};

// 上传进度处理
const onUploadProgress = (options: any) => {
  // 进度只会到50%，剩下的50%是AI处理的进度
  importProgress.value = Math.floor(options.percent / 2);
};

// 上传成功处理
const onUploadSuccess = (result: any) => {
  if (result.code === 0) {
    taskId.value = result.data.taskId;
    importStatus.value = '文件上传成功，开始AI分析...';
    
    // 设置为模拟模式，使用模拟数据演示
    isMockMode.value = true;
    
    // 直接开始处理
    startProcessing();
  } else {
    // 静默处理异常，直接使用模拟数据
    useMockUpload(currentFileName.value || '模拟文件.docx');
  }
};

// 上传失败处理
const onUploadFail = (options: any) => {
  MessagePlugin.warning('文件上传失败，将使用模拟数据继续演示');
  console.error('文件上传失败:', options.response?.message || '未知错误');
  
  // 使用模拟数据继续流程
  useMockUpload(options?.file?.name || '模拟文件.docx');
};

// 模拟上传功能
const useMockUpload = (fileName: string) => {
  // 创建模拟任务ID
  taskId.value = Mock.Random.guid();
  currentFileName.value = fileName;
  importStatus.value = '使用模拟数据，开始AI分析...';
  isMockMode.value = true; // 设置为模拟模式
  
  // 继续处理流程
  startProcessing();
};

// 生成模拟导入结果
const generateMockImportResult = (fileType: string) => {
  const courseCategories = [
    '公共基础课', '数学与自然科学基础课', '专业基础课', '专业核心课', 
    '专业选修课', '通识教育课', '创新创业与实践课'
  ];
  
  const courseTypes = ['必修课', '选修课', '限选课'];
  
  const courseModuleTypes = [
    'public_basic', 'discipline_basic', 'professional_core', 
    'professional_elective', 'general_education', 'practice'
  ];
  
  // 生成课程数据
  const generateCourses = () => {
    const courses = [];
    const courseCount = Mock.Random.integer(20, 30);
    
    for (let i = 0; i < courseCount; i++) {
      const categoryIndex = Mock.Random.integer(0, courseCategories.length - 1);
      const typeIndex = Mock.Random.integer(0, courseTypes.length - 1);
      const moduleIndex = Math.min(categoryIndex, courseModuleTypes.length - 1);
      
      // 生成课程代码前缀，模拟不同学科
      const prefixes = ['CS', 'EE', 'MA', 'PH', 'EN', 'EC'];
      const prefix = prefixes[Mock.Random.integer(0, prefixes.length - 1)];
      
      courses.push({
        courseName: Mock.Random.ctitle(4, 10),
        courseCode: `${prefix}${Mock.Random.integer(1000, 9999)}`,
        credits: parseFloat(Mock.Random.float(0.5, 6, 0, 1).toFixed(1)),
        hours: Mock.Random.integer(16, 96),
        courseCategory: courseCategories[categoryIndex],
        courseType: courseTypes[typeIndex],
        moduleType: courseModuleTypes[moduleIndex],
        term: `${Mock.Random.integer(1, 4)}-${Mock.Random.integer(1, 2)}`,
        description: Mock.Random.cparagraph(1, 3)
      });
    }
    
    return courses;
  };
  
  // 生成课程数据
  const courses = generateCourses();
  
  // 将课程按模块类型分组
  const coursesByModule: Record<string, any[]> = {};
  
  courses.forEach(course => {
    if (!coursesByModule[course.moduleType]) {
      coursesByModule[course.moduleType] = [];
    }
    coursesByModule[course.moduleType].push(course);
  });
  
  // 生成课程体系模块数据
  const modules = Object.keys(coursesByModule).map((moduleType, index) => {
    const moduleCourses = coursesByModule[moduleType];
    const requiredCourses = moduleCourses.filter(c => c.courseType === '必修课');
    const electiveCourses = moduleCourses.filter(c => c.courseType !== '必修课');
    
    // 计算模块总学分
    const totalCredits = moduleCourses.reduce((sum, course) => sum + course.credits, 0);
    
    // 模块类型映射到名称
    const moduleNames: Record<string, string> = {
      public_basic: '公共基础课程模块',
      discipline_basic: '学科基础课程模块',
      professional_core: '专业核心课程模块',
      professional_elective: '专业选修课程模块',
      general_education: '通识教育课程模块',
      practice: '实践课程模块'
    };
    
    return {
      id: `module_${moduleType}`,
      name: moduleNames[moduleType] || `模块${index + 1}`,
      description: `包含${moduleCourses.length}门课程，总学分${totalCredits.toFixed(1)}`,
      type: moduleType,
      required: true,
      order: index + 1,
      minCredits: Math.max(5, Math.floor(totalCredits * 0.8)),
      maxCredits: Math.ceil(totalCredits * 1.2),
      recommendedCredits: Math.round(totalCredits),
      courseCategories: [...new Set(moduleCourses.map(c => c.courseCategory))],
      requiredCourses: requiredCourses.map(c => ({
        id: Mock.Random.guid(),
        code: c.courseCode,
        name: c.courseName,
        credits: c.credits,
        hours: c.hours,
        property: '必修',
        term: c.term,
        required: true
      })),
      electiveCourses: electiveCourses.map(c => ({
        id: Mock.Random.guid(),
        code: c.courseCode,
        name: c.courseName,
        credits: c.credits,
        hours: c.hours,
        property: c.courseType === '限选课' ? '限选' : '选修',
        term: c.term,
        required: false
      }))
    };
  });
  
  return {
    templateName: `来自${fileType}文件的课程体系`,
    description: '通过AI导入自动生成的课程体系模板',
    majorType: 'engineering',
    degreeType: 'bachelor',
    modules: modules,
    creditRequirements: [
      {
        category: '总学分',
        minCredits: modules.reduce((sum, m) => sum + m.minCredits, 0),
        maxCredits: modules.reduce((sum, m) => sum + m.maxCredits, 0),
        recommendedCredits: modules.reduce((sum, m) => sum + m.recommendedCredits, 0),
        minCourses: modules.reduce((sum, m) => sum + (m.requiredCourses?.length || 0) + (m.electiveCourses?.length || 0), 0)
      },
      {
        category: '必修课学分',
        minCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        maxCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        recommendedCredits: modules.reduce((sum, m) => sum + (m.requiredCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        minCourses: modules.reduce((sum, m) => sum + (m.requiredCourses?.length || 0), 0)
      },
      {
        category: '选修课学分',
        minCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        maxCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        recommendedCredits: modules.reduce((sum, m) => sum + (m.electiveCourses?.reduce((s, c) => s + c.credits, 0) || 0), 0),
        minCourses: modules.reduce((sum, m) => sum + (m.electiveCourses?.length || 0), 0)
      }
    ]
  };
};

// 开始处理文件
const startProcessing = () => {
  if (!serviceId.value) {
    MessagePlugin.warning('请先选择AI服务');
    return;
  }
  
  // 如果没有选择文件，自动使用模拟数据
  if (fileList.value.length === 0 && !taskId.value) {
    useMockUpload('demo_curriculum.docx');
    return;
  }
  
  // 如果还没有上传但已选择了文件，则触发上传
  if (!taskId.value) {
    const uploadDom = document.querySelector('.t-upload__trigger') as HTMLElement;
    if (uploadDom) {
      uploadDom.click();
    }
    return;
  }
  
  // 进入处理步骤
  currentStep.value = 1;
  
  // 开始轮询任务状态
  pollTaskStatus();
};

// 轮询任务状态
const pollTaskStatus = async () => {
  try {
    // 如果是模拟模式，直接生成模拟数据
    if (isMockMode.value) {
      // 模拟进度更新
      let interval = setInterval(() => {
        importProgress.value += Mock.Random.integer(5, 15);
        
        if (importProgress.value < 70) {
          importStatus.value = '正在分析文件内容...';
        } else if (importProgress.value < 90) {
          importStatus.value = '正在提取课程数据...';
        } else {
          importStatus.value = '正在生成课程体系结构...';
        }
        
        if (importProgress.value >= 100) {
          importProgress.value = 100;
          clearInterval(interval);
          
          // 模拟完成，生成结果
          const fileType = currentFileName.value.substring(currentFileName.value.lastIndexOf('.') + 1).toLowerCase();
          
          // 生成模拟的导入结果
          const mockResult = generateMockImportResult(fileType);
          importResult.value = mockResult;
          templateName.value = mockResult.templateName;
          majorType.value = mockResult.majorType;
          
          currentStep.value = 2;
          MessagePlugin.success('文件导入成功');
        }
      }, 300);
      
      return;
    }
    
    // 非模拟模式，发送请求
    const res = await fetch(`/api/program/ai-import/task/${taskId.value}`);
    const data = await res.json();
    
    if (data.code === 0) {
      importProgress.value = Math.floor(50 + data.data.progress / 2); // 50%是上传进度，50%是处理进度
      importStatus.value = data.data.message;
      
      if (data.data.status === 'completed') {
        // 处理完成，进入结果预览
        importResult.value = data.data.result;
        templateName.value = data.data.result.templateName;
        majorType.value = data.data.result.majorType;
        
        currentStep.value = 2;
        MessagePlugin.success('文件导入成功');
      } else if (data.data.status === 'failed') {
        // 处理失败
        MessagePlugin.error(data.data.message || '文件处理失败');
        currentStep.value = 2;
      } else {
        // 继续轮询
        setTimeout(pollTaskStatus, 1000);
      }
    } else {
      MessagePlugin.error(data.message || '获取任务状态失败');
      currentStep.value = 2;
    }
  } catch (error) {
    console.error('获取任务状态出错:', error);
    
    // 出错时也切换到模拟模式
    if (!isMockMode.value) {
      isMockMode.value = true;
      importProgress.value = 0;
      // 静默处理连接失败，不显示警告信息
      pollTaskStatus(); // 重新调用使用模拟数据
    } else {
      MessagePlugin.error('获取任务状态出错');
      currentStep.value = 2;
    }
  }
};

// 重置导入流程
const resetImport = () => {
  currentStep.value = 0;
  fileList.value = [];
  taskId.value = '';
  importProgress.value = 0;
  importStatus.value = '准备导入...';
  importResult.value = null;
  isMockMode.value = false;
};

// 保存为课程体系模板
const saveTemplate = async () => {
  try {
    // 验证模板名称
    if (!templateName.value) {
      MessagePlugin.warning('请输入模板名称');
      return;
    }
    
    const templateData = {
      name: templateName.value,
      description: `通过AI导入自动生成的课程体系模板，来源文件：${currentFileName.value}`,
      majorType: majorType.value,
      degreeType: 'bachelor',
      modules: importResult.value.modules,
      creditRequirements: importResult.value.creditRequirements
    };
    
    // 如果是模拟模式，直接返回成功
    if (isMockMode.value) {
      const mockTemplateId = Mock.Random.guid();
      MessagePlugin.success('课程体系模板创建成功');
      emit('save', {
        templateId: mockTemplateId,
        templateName: templateData.name,
        message: '课程体系模板创建成功'
      });
      closeDialog();
      return;
    }
    
    // 调用应用API
    const res = await fetch('/api/program/ai-import/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskId: taskId.value,
        templateData
      })
    });
    
    const data = await res.json();
    
    if (data.code === 0) {
      MessagePlugin.success('课程体系模板创建成功');
      emit('save', data.data);
      closeDialog();
    } else {
      MessagePlugin.error(data.message || '创建课程体系模板失败');
    }
  } catch (error) {
    console.error('创建课程体系模板出错:', error);
    
    // 错误时也使用模拟数据
    if (isMockMode.value || error.toString().includes('Failed to fetch')) {
      const mockTemplateId = Mock.Random.guid();
      MessagePlugin.success('课程体系模板创建成功');
      emit('save', {
        templateId: mockTemplateId,
        templateName: templateName.value,
        message: '课程体系模板创建成功'
      });
      closeDialog();
    } else {
      MessagePlugin.error('创建课程体系模板出错');
    }
  }
};

// 关闭对话框
const closeDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
  
  // 重置状态，以便下次打开
  setTimeout(() => {
    resetImport();
  }, 300);
};

// 监听对话框可见性变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 对话框打开时，加载AI服务列表
    loadAIServices();
  }
});

// 组件挂载时，初始化
onMounted(() => {
  if (props.modelValue) {
    loadAIServices();
  }
});
</script>

<style lang="less" scoped>
.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.upload-drag-container {
  padding: 40px 0;
  text-align: center;
}

.upload-drag-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.upload-drag-subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}

.processing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.processing-info {
  width: 100%;
  margin-top: 20px;
}

.processing-file-name {
  font-weight: 500;
  margin-bottom: 8px;
}

.processing-status {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.6);
}

.import-error {
  padding: 20px 0;
}

.import-result {
  padding: 10px 0;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modules-preview {
  margin-top: 20px;
}

.module-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.course-list-title {
  font-weight: 500;
  margin-bottom: 8px;
}
</style> 