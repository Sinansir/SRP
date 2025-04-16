<template>
  <div class="architecture-config-container">
    <t-tabs v-model="activeTab" class="architecture-tabs">
      <t-tab-panel value="templates" label="架构模板管理">
        <template #panel>
          <div class="panel-container">
            <t-card title="架构模板列表" class="template-list-card">
              <template #actions>
                <t-button theme="primary" @click="handleAddTemplate">新增模板</t-button>
              </template>
              <t-space direction="vertical" style="width: 100%">
                <t-input v-model="templateSearchKey" placeholder="搜索模板名称" clearable>
                  <template #suffix-icon>
                    <search-icon />
                  </template>
                </t-input>
                <t-table
                  :data="filteredTemplates"
                  :columns="templateColumns"
                  :loading="loading"
                  row-key="id"
                  hover
                  stripe
                >
                  <template #isDefault="{ row }">
                    <t-tag theme="success" v-if="row.isDefault">默认</t-tag>
                    <t-tag theme="default" v-else>非默认</t-tag>
                  </template>
                  <template #category="{ row }">
                    <t-tag v-if="row.category === 'standard'" theme="primary">标准</t-tag>
                    <t-tag v-else-if="row.category === 'special'" theme="warning">特色</t-tag>
                    <t-tag v-else-if="row.category === 'engineering'" theme="success">工程类</t-tag>
                    <t-tag v-else-if="row.category === 'normal'" theme="default">师范类</t-tag>
                    <t-tag v-else-if="row.category === 'certification'" theme="danger">认证类</t-tag>
                    <t-tag v-else>其他</t-tag>
                  </template>
                  <template #op="slotProps">
                    <t-space>
                      <t-button theme="primary" variant="text" @click="handleViewTemplate(slotProps.row)">查看</t-button>
                      <t-button theme="primary" variant="text" @click="handleEditTemplate(slotProps.row)">编辑</t-button>
                      <t-button theme="danger" variant="text" @click="handleDeleteTemplate(slotProps.row)">删除</t-button>
                    </t-space>
                  </template>
                </t-table>
              </t-space>
            </t-card>
          </div>
        </template>
      </t-tab-panel>

      <t-tab-panel value="architectures" label="专业架构配置">
        <template #panel>
          <div class="panel-container">
            <t-card title="专业架构配置列表" class="architecture-list-card">
              <template #actions>
                <t-space>
                  <t-button theme="default" @click="handleBatchConfig">批量设置</t-button>
                  <t-button theme="primary" @click="handleAddArchitecture">新增架构</t-button>
                </t-space>
              </template>
              <t-space direction="vertical" style="width: 100%">
                <t-space>
                  <t-input v-model="architectureSearchKey" placeholder="搜索专业名称/代码" clearable style="width: 200px">
                    <template #suffix-icon>
                      <search-icon />
                    </template>
                  </t-input>
                  <t-select
                    v-model="departmentFilter"
                    placeholder="选择学院"
                    clearable
                    style="width: 180px"
                  >
                    <t-option
                      v-for="dept in departmentOptions"
                      :key="dept.value"
                      :label="dept.label"
                      :value="dept.value"
                    />
                  </t-select>
                  <t-select
                    v-model="templateFilter"
                    placeholder="选择架构模板"
                    clearable
                    style="width: 200px"
                  >
                    <t-option
                      v-for="template in templateOptions"
                      :key="template.id"
                      :label="template.name"
                      :value="template.id"
                    />
                  </t-select>
                </t-space>

                <t-table
                  :data="filteredArchitectures"
                  :columns="architectureColumns"
                  :loading="loading"
                  row-key="id"
                  hover
                  stripe
                >
                  <template #isActive="{ row }">
                    <t-tag theme="success" v-if="row.isActive">已启用</t-tag>
                    <t-tag theme="default" v-else>未启用</t-tag>
                  </template>
                  <template #op="slotProps">
                    <t-space>
                      <t-button theme="primary" variant="text" @click="handleViewArchitecture(slotProps.row)">查看</t-button>
                      <t-button theme="primary" variant="text" @click="handleEditArchitecture(slotProps.row)">编辑</t-button>
                      <t-button theme="primary" variant="text" @click="handleToggleArchitecture(slotProps.row)">
                        {{ slotProps.row.isActive ? '禁用' : '启用' }}
                      </t-button>
                    </t-space>
                  </template>
                </t-table>
              </t-space>
            </t-card>
          </div>
        </template>
      </t-tab-panel>
    </t-tabs>

    <!-- 查看模板弹窗 -->
    <t-dialog
      v-model:visible="templateDetailVisible"
      :header="currentTemplate?.name || '模板详情'"
      width="700px"
    >
      <t-space direction="vertical" style="width: 100%">
        <t-descriptions bordered>
          <t-descriptions-item label="模板名称">{{ currentTemplate?.name }}</t-descriptions-item>
          <t-descriptions-item label="模板描述">{{ currentTemplate?.description }}</t-descriptions-item>
          <t-descriptions-item label="分类">
            <t-tag v-if="currentTemplate?.category === 'standard'" theme="primary">标准</t-tag>
            <t-tag v-else-if="currentTemplate?.category === 'special'" theme="warning">特色</t-tag>
            <t-tag v-else-if="currentTemplate?.category === 'engineering'" theme="success">工程类</t-tag>
            <t-tag v-else-if="currentTemplate?.category === 'normal'" theme="default">师范类</t-tag>
            <t-tag v-else-if="currentTemplate?.category === 'certification'" theme="danger">认证类</t-tag>
            <t-tag v-else>其他</t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="是否默认">
            <t-tag theme="success" v-if="currentTemplate?.isDefault">是</t-tag>
            <t-tag theme="default" v-else>否</t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ currentTemplate?.createTime }}</t-descriptions-item>
          <t-descriptions-item label="更新时间">{{ currentTemplate?.updateTime }}</t-descriptions-item>
        </t-descriptions>

        <t-divider>包含模块</t-divider>

        <t-table
          v-if="currentTemplate?.modules?.length"
          :data="currentTemplate.modules"
          :columns="moduleColumns"
          row-key="id"
          stripe
          hover
        >
          <template #required="{ row }">
            <t-tag theme="success" v-if="row.required">必需</t-tag>
            <t-tag theme="default" v-else>可选</t-tag>
          </template>
        </t-table>
      </t-space>
      <template #footer>
        <t-button theme="default" @click="templateDetailVisible = false">关闭</t-button>
      </template>
    </t-dialog>

    <!-- 批量设置弹窗 -->
    <t-dialog
      v-model:visible="batchConfigVisible"
      header="批量架构配置"
      width="700px"
    >
      <t-form ref="batchConfigForm" :data="batchConfigData" :label-width="100">
        <t-form-item label="选择架构模板" name="templateId">
          <t-select v-model="batchConfigData.templateId" placeholder="请选择架构模板">
            <t-option
              v-for="item in templateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </t-select>
        </t-form-item>
        <t-form-item label="选择专业" name="majorCodes">
          <t-transfer
            v-model="batchConfigData.majorCodes"
            :data-source="majorTransferData"
            :title="['待选专业', '已选专业']"
            search
          />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="batchConfigVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSubmitBatchConfig">确认</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 模板编辑弹窗 -->
    <t-dialog
      v-model:visible="templateEditVisible"
      :header="isTemplateAdd ? '新增架构模板' : '编辑架构模板'"
      width="900px"
    >
      <t-form ref="templateForm" :data="templateFormData" :label-width="100" class="template-edit-form">
        <t-form-item label="模板名称" name="name">
          <t-input v-model="templateFormData.name" placeholder="请输入模板名称" />
        </t-form-item>
        <t-form-item label="模板描述" name="description">
          <t-textarea v-model="templateFormData.description" placeholder="请输入模板描述" />
        </t-form-item>
        <t-form-item label="分类" name="category">
          <t-select v-model="templateFormData.category" placeholder="请选择分类">
            <t-option key="standard" label="标准" value="standard" />
            <t-option key="special" label="特色" value="special" />
            <t-option key="engineering" label="工程类" value="engineering" />
            <t-option key="normal" label="师范类" value="normal" />
            <t-option key="certification" label="认证类" value="certification" />
          </t-select>
        </t-form-item>
        <t-form-item label="是否默认" name="isDefault">
          <t-switch v-model="templateFormData.isDefault" />
        </t-form-item>
        <t-divider>模块配置</t-divider>
        
        <div class="module-config-container">
          <!-- 左侧模块库 -->
          <div class="module-library">
            <h3>可选模块库</h3>
            <div class="module-list">
              <div
                v-for="module in moduleLibrary"
                :key="module.id"
                class="module-item"
                draggable="true"
                @dragstart="handleDragStart($event, module)"
                @dragend="handleDragEnd"
              >
                <div class="module-item-header">
                  <span>{{ module.name }}</span>
                </div>
                <div class="module-item-desc">{{ module.description }}</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧已选模块 -->
          <div 
            class="selected-modules"
            @dragover.prevent
            @drop="handleDrop"
          >
            <h3>已选模块（可拖拽排序）</h3>
            <div class="module-preview">
              <t-empty v-if="!templateFormData.modules.length" description="请从左侧拖拽模块到此处"></t-empty>
              <div 
                v-for="(module, index) in templateFormData.modules" 
                :key="module.id" 
                class="selected-module-item"
                draggable="true"
                @dragstart="handleSelectedDragStart($event, index)"
                @dragover.prevent
                @drop="handleSelectedDrop($event, index)"
              >
                <div class="module-item-content">
                  <div class="module-item-header">
                    <span>{{ module.name }}</span>
                    <t-tag theme="success" v-if="module.required">必需</t-tag>
                    <t-tag theme="default" v-else>可选</t-tag>
                  </div>
                  <div class="module-item-desc">{{ module.description }}</div>
                </div>
                <div class="module-item-actions">
                  <t-button theme="primary" variant="text" size="small" @click="editModule(index)">
                    编辑
                  </t-button>
                  <t-button theme="danger" variant="text" size="small" @click="removeModule(module)">
                    移除
                  </t-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="templateEditVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSaveTemplate">保存</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 模块编辑弹窗 -->
    <t-dialog
      v-model:visible="moduleEditVisible"
      header="编辑模块"
      width="500px"
    >
      <t-form ref="moduleForm" :data="moduleFormData" :label-width="100">
        <t-form-item label="模块名称" name="name">
          <t-input v-model="moduleFormData.name" placeholder="请输入模块名称" />
        </t-form-item>
        <t-form-item label="模块描述" name="description">
          <t-textarea v-model="moduleFormData.description" placeholder="请输入模块描述" />
        </t-form-item>
        <t-form-item label="模块类型" name="type">
          <t-input v-model="moduleFormData.type" placeholder="请输入模块类型" />
        </t-form-item>
        <t-form-item label="是否必需" name="required">
          <t-switch v-model="moduleFormData.required" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="moduleEditVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSaveModule">保存</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 架构编辑弹窗 -->
    <t-dialog
      v-model:visible="architectureEditVisible"
      :header="isArchitectureAdd ? '新增架构配置' : '编辑架构配置'"
      width="900px"
    >
      <t-form ref="architectureForm" :data="architectureFormData" :label-width="100" class="template-edit-form">
          <t-form-item label="架构名称" name="name">
          <t-input v-model="architectureFormData.name" placeholder="请输入架构名称" />
          </t-form-item>
          <t-form-item label="架构描述" name="description">
          <t-textarea v-model="architectureFormData.description" placeholder="请输入架构描述" />
          </t-form-item>
        <template v-if="isArchitectureAdd">
          <t-form-item label="选择专业" name="majorCode">
            <t-select v-model="architectureFormData.majorCode" placeholder="请选择专业" filterable>
              <t-option
                v-for="major in majors"
                :key="major.code"
                :label="`${major.name} (${major.code})`"
                :value="major.code"
              />
            </t-select>
          </t-form-item>
          <t-form-item label="选择模板" name="templateId">
            <t-select v-model="architectureFormData.templateId" placeholder="请选择架构模板" @change="handleTemplateChange">
              <t-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              />
            </t-select>
          </t-form-item>
        </template>
        <t-form-item label="是否启用" name="isActive">
          <t-switch v-model="architectureFormData.isActive" />
          </t-form-item>
        <t-divider>模块配置</t-divider>
        
        <div class="module-config-container">
          <!-- 左侧模块库 -->
          <div class="module-library">
            <h3>可选模块库</h3>
            <div class="module-list">
              <div
                v-for="module in moduleLibrary"
                :key="module.id"
                class="module-item"
                draggable="true"
                @dragstart="handleArchitectureDragStart($event, module)"
                @dragend="handleDragEnd"
              >
                <div class="module-item-header">
                  <span>{{ module.name }}</span>
                </div>
                <div class="module-item-desc">{{ module.description }}</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧已选模块 -->
          <div 
            class="selected-modules"
            @dragover.prevent
            @drop="handleArchitectureDrop"
          >
            <h3>已选模块（可拖拽排序）</h3>
            <div class="module-preview">
              <t-empty v-if="!architectureFormData.modules.length" description="请从左侧拖拽模块到此处"></t-empty>
              <div 
                v-for="(module, index) in architectureFormData.modules" 
                :key="module.id" 
                class="selected-module-item"
                draggable="true"
                @dragstart="handleArchitectureSelectedDragStart($event, index)"
                @dragover.prevent
                @drop="handleArchitectureSelectedDrop($event, index)"
              >
                <div class="module-item-content">
                  <div class="module-item-header">
                    <span>{{ module.name }}</span>
                    <t-tag theme="success" v-if="module.required">必需</t-tag>
                    <t-tag theme="default" v-else>可选</t-tag>
                  </div>
                  <div class="module-item-desc">{{ module.description }}</div>
                </div>
                <div class="module-item-actions">
                  <t-button theme="primary" variant="text" size="small" @click="editArchitectureModule(index)">
                    编辑
                  </t-button>
                  <t-button theme="danger" variant="text" size="small" @click="removeArchitectureModule(module)">
                    移除
                  </t-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="architectureEditVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSaveArchitecture">保存</t-button>
        </t-space>
      </template>
    </t-dialog>
    
    <!-- 架构详情弹窗 -->
    <t-dialog
      v-model:visible="architectureDetailVisible"
      :header="currentArchitecture?.name || '架构详情'"
      width="700px"
    >
      <t-space direction="vertical" style="width: 100%">
        <t-descriptions bordered>
          <t-descriptions-item label="架构名称">{{ currentArchitecture?.name }}</t-descriptions-item>
          <t-descriptions-item label="架构描述">{{ currentArchitecture?.description }}</t-descriptions-item>
          <t-descriptions-item label="专业名称">{{ currentArchitecture?.majorName }}</t-descriptions-item>
          <t-descriptions-item label="专业代码">{{ currentArchitecture?.majorCode }}</t-descriptions-item>
          <t-descriptions-item label="所属学院">{{ currentArchitecture?.departmentName }}</t-descriptions-item>
          <t-descriptions-item label="模板类型">
            {{ getTemplateNameById(currentArchitecture?.templateId) }}
          </t-descriptions-item>
          <t-descriptions-item label="状态">
            <t-tag theme="success" v-if="currentArchitecture?.isActive">已启用</t-tag>
            <t-tag theme="default" v-else>未启用</t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ currentArchitecture?.createTime }}</t-descriptions-item>
          <t-descriptions-item label="更新时间">{{ currentArchitecture?.updateTime }}</t-descriptions-item>
        </t-descriptions>

        <t-divider>包含模块</t-divider>

        <t-table
          v-if="currentArchitecture?.modules?.length"
          :data="currentArchitecture.modules"
          :columns="moduleColumns"
          row-key="id"
          stripe
          hover
        >
          <template #required="{ row }">
            <t-tag theme="success" v-if="row.required">必需</t-tag>
            <t-tag theme="default" v-else>可选</t-tag>
          </template>
        </t-table>
      </t-space>
      <template #footer>
        <t-button theme="default" @click="architectureDetailVisible = false">关闭</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';

// 数据类型定义
interface Module {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  order: number;
  minCredits?: number;
  maxCredits?: number;
  defaultCredits?: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
  modules: Module[];
  createTime: string;
  updateTime: string;
}

interface Architecture {
  id: string;
  name: string;
  description: string;
  majorCode: string;
  majorName: string;
  departmentName: string;
  templateId: string;
  modules: Module[];
  isActive: boolean;
  createTime: string;
  updateTime: string;
}

interface Major {
  code: string;
  name: string;
  department: string;
  category: string;
}

// 状态数据
const activeTab = ref('templates');
const loading = ref(false);
const templates = ref<Template[]>([]);
const architectures = ref<Architecture[]>([]);
const majors = ref<Major[]>([]);
const templateSearchKey = ref('');
const architectureSearchKey = ref('');
const departmentFilter = ref('');
const templateFilter = ref('');

// 当前选中的数据
const currentTemplate = ref<Template | null>(null);
const currentArchitecture = ref<Architecture | null>(null);
const batchConfigData = ref({
  templateId: '',
  majorCodes: [] as string[],
});

// 编辑表单数据
const templateFormData = ref({
  id: '',
  name: '',
  description: '',
  category: 'standard',
  isDefault: false,
  modules: [] as Module[],
});

const moduleFormData = ref({
  id: '',
  name: '',
  description: '',
  type: '',
  required: true,
  order: 0,
});

const architectureFormData = ref({
  id: '',
  name: '',
  description: '',
  majorCode: '',
  majorName: '',
  departmentName: '',
  templateId: '',
  modules: [] as Module[],
  isActive: true,
});

// 弹窗控制
const templateDetailVisible = ref(false);
const batchConfigVisible = ref(false);
const templateEditVisible = ref(false);
const moduleEditVisible = ref(false);
const architectureEditVisible = ref(false);
const architectureDetailVisible = ref(false);

// 操作标记
const isTemplateAdd = ref(false);
const isArchitectureAdd = ref(false);
const editingModuleIndex = ref(-1);

// 表格列配置
const templateColumns = [
  { colKey: 'name', title: '模板名称', width: 200 },
  { colKey: 'description', title: '模板描述', width: 300 },
  { colKey: 'category', title: '分类', width: 100 },
  { colKey: 'isDefault', title: '是否默认', width: 100 },
  { colKey: 'op', title: '操作', width: 180 },
];

const architectureColumns = [
  { colKey: 'majorName', title: '专业名称', width: 150 },
  { colKey: 'majorCode', title: '专业代码', width: 100 },
  { colKey: 'departmentName', title: '所属学院', width: 120 },
  { colKey: 'name', title: '架构名称', width: 180 },
  { colKey: 'isActive', title: '状态', width: 80 },
  { colKey: 'op', title: '操作', width: 180 },
];

const moduleColumns = [
  { colKey: 'name', title: '模块名称', width: 150 },
  { colKey: 'description', title: '模块描述', width: 250 },
  { colKey: 'required', title: '是否必需', width: 100 },
  { colKey: 'order', title: '显示顺序', width: 100 },
];

// 模块编辑表格列配置
const moduleEditColumns = [
  { colKey: 'name', title: '模块名称', width: 150 },
  { colKey: 'description', title: '模块描述', width: 250 },
  { colKey: 'required', title: '是否必需', width: 100 },
  { colKey: 'op', title: '操作', width: 100 },
];

// 模块库数据
const moduleLibrary = ref<Module[]>([
  {
    id: 'lib_basic_info',
    name: '专业基本信息',
    description: '包含专业代码、名称、学科门类等基本信息',
    type: 'basic_info',
    required: true,
    order: 0
  },
  {
    id: 'lib_introduction',
    name: '专业简介',
    description: '对专业的基本介绍',
    type: 'introduction',
    required: true,
    order: 0
  },
  {
    id: 'lib_training_objectives',
    name: '培养目标',
    description: '专业培养目标描述',
    type: 'objectives',
    required: true,
    order: 0
  },
  {
    id: 'lib_training_requirements',
    name: '培养要求',
    description: '专业总体培养要求',
    type: 'requirements',
    required: true,
    order: 0
  },
  {
    id: 'lib_graduation_requirements',
    name: '毕业要求及授予学位类型',
    description: '毕业生的基本要求和学位类型',
    type: 'graduation',
    required: true,
    order: 0
  },
  {
    id: 'lib_core_courses',
    name: '专业核心课程',
    description: '专业核心课程列表',
    type: 'core_courses',
    required: true,
    order: 0
  },
  {
    id: 'lib_practice',
    name: '主要实践教学环节',
    description: '包括实验、实习、毕业设计等实践环节',
    type: 'practice',
    required: true,
    order: 0
  },
  {
    id: 'lib_curriculum',
    name: '课程体系设置',
    description: '课程体系的总体设置',
    type: 'curriculum',
    required: true,
    order: 0
  },
  {
    id: 'lib_credit_statistics',
    name: '学分统计表',
    description: '各类课程学分统计',
    type: 'credits',
    required: true,
    order: 0
  },
  {
    id: 'lib_curriculum_topo',
    name: '课程体系拓扑图',
    description: '课程之间的关系拓扑图',
    type: 'topo',
    required: false,
    order: 0
  },
  {
    id: 'lib_graduation_matrix',
    name: '课程体系支撑毕业要求矩阵',
    description: '课程与毕业要求的支撑关系矩阵',
    type: 'matrix',
    required: false,
    order: 0
  },
  {
    id: 'lib_innovation_courses',
    name: '创新创业课程',
    description: '创新创业相关特色课程',
    type: 'innovation',
    required: false,
    order: 0
  },
  {
    id: 'lib_international_features',
    name: '国际化特色',
    description: '培养方案的国际化特色',
    type: 'international',
    required: false,
    order: 0
  },
  {
    id: 'lib_foreign_language',
    name: '外语强化要求',
    description: '外语能力的特殊要求',
    type: 'language',
    required: false,
    order: 0
  },
  {
    id: 'lib_teaching_ability',
    name: '教学能力培养',
    description: '教学能力培养的特殊要求',
    type: 'teaching',
    required: false,
    order: 0
  },
  {
    id: 'lib_educational_practice',
    name: '教育实习环节',
    description: '教育实习相关环节设置',
    type: 'edu_practice',
    required: false,
    order: 0
  },
  {
    id: 'lib_industry_requirements',
    name: '行业需求对接',
    description: '与行业需求的对接情况',
    type: 'industry',
    required: false,
    order: 0
  },
  {
    id: 'lib_engineering_practice',
    name: '工程实践强化',
    description: '工程实践能力培养的强化措施',
    type: 'engineering',
    required: false,
    order: 0
  },
  {
    id: 'lib_certification_requirements',
    name: '工程认证要求对照',
    description: '与工程教育认证标准的对照',
    type: 'certification',
    required: false,
    order: 0
  }
]);

// 拖拽相关变量
const draggedModuleIndex = ref(-1);

// 模板模块拖拽处理函数
const handleDragStart = (event: DragEvent, module: Module) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('moduleData', JSON.stringify(module));
  }
};

const handleDragEnd = () => {
  // 清理拖拽状态
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.preventDefault();
    const moduleData = event.dataTransfer.getData('moduleData');
    if (moduleData) {
      try {
        const module = JSON.parse(moduleData) as Module;
        // 生成新ID避免重复
        const newModule = {
          ...module,
          id: `module_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          order: templateFormData.value.modules.length + 1
        };
        templateFormData.value.modules.push(newModule);
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
      }
    }
  }
};

const handleSelectedDragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('selectedModuleIndex', index.toString());
    draggedModuleIndex.value = index;
  }
};

const handleSelectedDrop = (event: DragEvent, targetIndex: number) => {
  if (event.dataTransfer) {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData('selectedModuleIndex'), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      // 移动模块
      const modules = templateFormData.value.modules;
      const item = modules.splice(sourceIndex, 1)[0];
      modules.splice(targetIndex, 0, item);
      
      // 更新排序
      modules.forEach((module, index) => {
        module.order = index + 1;
      });
    }
    draggedModuleIndex.value = -1;
  }
};

// 编辑模块
const editModule = (index: number) => {
  editingModuleIndex.value = index;
  moduleFormData.value = { ...templateFormData.value.modules[index] };
  moduleEditVisible.value = true;
};

// 架构模块拖拽处理函数
const handleArchitectureDragStart = (event: DragEvent, module: Module) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('moduleData', JSON.stringify(module));
  }
};

const handleArchitectureDrop = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.preventDefault();
    const moduleData = event.dataTransfer.getData('moduleData');
    if (moduleData) {
      try {
        const module = JSON.parse(moduleData) as Module;
        // 生成新ID避免重复
        const newModule = {
          ...module,
          id: `module_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          order: architectureFormData.value.modules.length + 1
        };
        architectureFormData.value.modules.push(newModule);
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
      }
    }
  }
};

const handleArchitectureSelectedDragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('selectedModuleIndex', index.toString());
    draggedModuleIndex.value = index;
  }
};

const handleArchitectureSelectedDrop = (event: DragEvent, targetIndex: number) => {
  if (event.dataTransfer) {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData('selectedModuleIndex'), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      // 移动模块
      const modules = architectureFormData.value.modules;
      const item = modules.splice(sourceIndex, 1)[0];
      modules.splice(targetIndex, 0, item);
      
      // 更新排序
      modules.forEach((module, index) => {
        module.order = index + 1;
      });
    }
    draggedModuleIndex.value = -1;
  }
};

// 编辑架构模块
const editArchitectureModule = (index: number) => {
  editingModuleIndex.value = index;
  moduleFormData.value = { ...architectureFormData.value.modules[index] };
  moduleEditVisible.value = true;
};

// 计算属性
const filteredTemplates = computed(() => {
  if (!templateSearchKey.value) return templates.value;
  return templates.value.filter(item => 
    item.name.toLowerCase().includes(templateSearchKey.value.toLowerCase())
  );
});

const filteredArchitectures = computed(() => {
  let result = architectures.value;
  
  if (architectureSearchKey.value) {
    result = result.filter(item => 
      item.majorName.toLowerCase().includes(architectureSearchKey.value.toLowerCase()) ||
      item.majorCode.toLowerCase().includes(architectureSearchKey.value.toLowerCase())
    );
  }
  
  if (departmentFilter.value) {
    result = result.filter(item => item.departmentName === departmentFilter.value);
  }
  
  if (templateFilter.value) {
    result = result.filter(item => item.templateId === templateFilter.value);
  }
  
  return result;
});

const departmentOptions = computed(() => {
  const departments = new Set<string>();
  architectures.value.forEach(item => departments.add(item.departmentName));
  return Array.from(departments).map(dept => ({ label: dept, value: dept }));
});

const templateOptions = computed(() => {
  return templates.value.map(template => ({
    id: template.id,
    name: template.name,
  }));
});

const majorTransferData = computed(() => {
  return majors.value.map(major => ({
    value: major.code,
    label: `${major.name} (${major.code})`,
    description: major.department,
  }));
});

// 获取模板名称
const getTemplateNameById = (templateId: string | undefined): string => {
  if (!templateId) return '未知模板';
  const template = templates.value.find(t => t.id === templateId);
  return template ? template.name : '未知模板';
};

// 查看模板详情
const handleViewTemplate = (template: Template) => {
  currentTemplate.value = template;
  templateDetailVisible.value = true;
};

// 编辑模板
const handleEditTemplate = (template: Template) => {
  isTemplateAdd.value = false;
  templateFormData.value = {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    isDefault: template.isDefault,
    modules: JSON.parse(JSON.stringify(template.modules)), // 深拷贝
  };
  templateEditVisible.value = true;
};

// 删除模板
const handleDeleteTemplate = (template: Template) => {
  if (template.isDefault) {
    MessagePlugin.error('默认模板不可删除');
    return;
  }
  
  // 使用JavaScript的confirm确认
  if (confirm(`确定要删除模板"${template.name}"吗？此操作不可撤销。`)) {
    // 模拟删除操作
    MessagePlugin.success('删除模板成功');
    // 重新获取模板列表
    fetchTemplates();
  }
};

// 添加模板
const handleAddTemplate = () => {
  isTemplateAdd.value = true;
  templateFormData.value = {
    id: '',
    name: '',
    description: '',
    category: 'standard',
    isDefault: false,
    modules: [
      {
        id: `module_${Date.now()}_1`,
        name: '专业基本信息',
        description: '包含专业代码、名称、学科门类等基本信息',
        type: 'basic_info',
        required: true,
        order: 1
      },
      {
        id: `module_${Date.now()}_2`,
        name: '培养目标',
        description: '专业培养目标描述',
        type: 'objectives',
        required: true,
        order: 2
      }
    ],
  };
  templateEditVisible.value = true;
};

// 保存模板
const handleSaveTemplate = async () => {
  if (!templateFormData.value.name || !templateFormData.value.description || !templateFormData.value.category) {
    MessagePlugin.error('请填写完整信息');
    return;
  }
  
  if (!templateFormData.value.modules.length) {
    MessagePlugin.error('请至少添加一个模块');
    return;
  }
  
  loading.value = true;
  try {
    let url = '/api/program/architecture/template/add';
    if (!isTemplateAdd.value) {
      url = '/api/program/architecture/template/update';
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateFormData.value),
    });
    
    const data = await res.json();
    if (data.code === 0) {
      MessagePlugin.success(isTemplateAdd.value ? '新增模板成功' : '更新模板成功');
      templateEditVisible.value = false;
      fetchTemplates(); // 重新获取模板列表
    } else {
      MessagePlugin.error(data.message || (isTemplateAdd.value ? '新增模板失败' : '更新模板失败'));
    }
  } catch (error) {
    console.error(isTemplateAdd.value ? '新增模板失败:' : '更新模板失败:', error);
    MessagePlugin.error(isTemplateAdd.value ? '新增模板失败，请稍后重试' : '更新模板失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 查看架构配置
const handleViewArchitecture = (architecture: Architecture) => {
  currentArchitecture.value = architecture;
  architectureDetailVisible.value = true;
};

// 编辑架构配置
const handleEditArchitecture = (architecture: Architecture) => {
  isArchitectureAdd.value = false;
  architectureFormData.value = {
    id: architecture.id,
    name: architecture.name,
    description: architecture.description,
    majorCode: architecture.majorCode,
    majorName: architecture.majorName,
    departmentName: architecture.departmentName,
    templateId: architecture.templateId,
    modules: JSON.parse(JSON.stringify(architecture.modules)), // 深拷贝
    isActive: architecture.isActive,
  };
  architectureEditVisible.value = true;
};

// 切换架构配置状态
const handleToggleArchitecture = async (architecture: Architecture) => {
  loading.value = true;
  try {
    const res = await fetch('/api/program/architecture/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: architecture.id,
        name: architecture.name,
        isActive: !architecture.isActive,
        modules: architecture.modules,
      }),
    });
    
    const data = await res.json();
    if (data.code === 0) {
      MessagePlugin.success(`${architecture.isActive ? '禁用' : '启用'}架构配置成功`);
      fetchArchitectures(); // 重新获取架构配置列表
    } else {
      MessagePlugin.error(data.message || `${architecture.isActive ? '禁用' : '启用'}架构配置失败`);
    }
  } catch (error) {
    console.error(`${architecture.isActive ? '禁用' : '启用'}架构配置失败:`, error);
    MessagePlugin.error(`${architecture.isActive ? '禁用' : '启用'}架构配置失败，请稍后重试`);
  } finally {
    loading.value = false;
  }
};

// 添加架构配置
const handleAddArchitecture = () => {
  isArchitectureAdd.value = true;
  architectureFormData.value = {
    id: '',
    name: '',
    description: '',
    majorCode: '',
    majorName: '',
    departmentName: '',
    templateId: '',
    modules: [],
    isActive: true,
  };
  architectureEditVisible.value = true;
};

// 模板改变
const handleTemplateChange = (value: any) => {
  const templateId = value as string;
  if (!templateId) {
    architectureFormData.value.modules = [];
    return;
  }
  
  const template = templates.value.find(t => t.id === templateId);
  if (template) {
    // 使用模板中的模块
    architectureFormData.value.modules = JSON.parse(JSON.stringify(template.modules));
    
    // 更新专业信息
    if (architectureFormData.value.majorCode) {
      const major = majors.value.find(m => m.code === architectureFormData.value.majorCode);
      if (major) {
        architectureFormData.value.majorName = major.name;
        architectureFormData.value.departmentName = major.department;
      }
    }
  }
};

// 保存模块（修改为同时支持模板模块和架构模块的编辑）
const handleSaveModule = () => {
  if (!moduleFormData.value.name || !moduleFormData.value.description || !moduleFormData.value.type) {
    MessagePlugin.error('请填写完整信息');
    return;
  }
  
  if (editingModuleIndex.value !== -1) {
    // 根据当前活动的编辑对象确定更新目标
    if (templateEditVisible.value) {
      // 更新模板模块
      templateFormData.value.modules[editingModuleIndex.value] = {
        ...moduleFormData.value,
      };
      
      // 更新排序
      templateFormData.value.modules.forEach((module, index) => {
        module.order = index + 1;
      });
    } else if (architectureEditVisible.value) {
      // 更新架构模块
      architectureFormData.value.modules[editingModuleIndex.value] = {
        ...moduleFormData.value,
      };
      
      // 更新排序
      architectureFormData.value.modules.forEach((module, index) => {
        module.order = index + 1;
      });
    }
  }
  
  moduleEditVisible.value = false;
  editingModuleIndex.value = -1;
};

// 批量设置
const handleBatchConfig = () => {
  batchConfigData.value = {
    templateId: '',
    majorCodes: [],
  };
  batchConfigVisible.value = true;
};

// 提交批量设置
const handleSubmitBatchConfig = async () => {
  if (!batchConfigData.value.templateId || !batchConfigData.value.majorCodes.length) {
    MessagePlugin.error('请选择架构模板和专业');
    return;
  }
  
  loading.value = true;
  try {
    const res = await fetch('/api/program/architecture/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchConfigData.value),
    });
    const data = await res.json();
    if (data.code === 0) {
      MessagePlugin.success('批量配置专业架构成功');
      batchConfigVisible.value = false;
      fetchArchitectures(); // 重新获取架构配置列表
    } else {
      MessagePlugin.error(data.message || '批量配置专业架构失败');
    }
  } catch (error) {
    console.error('批量配置专业架构失败:', error);
    MessagePlugin.error('批量配置专业架构失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  fetchTemplates();
  fetchArchitectures();
  fetchMajors();
});

// 获取架构模板列表
const fetchTemplates = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/program/architecture/templates');
    const data = await res.json();
    if (data.code === 0) {
      templates.value = data.data.list;
    } else {
      MessagePlugin.error('获取架构模板列表失败');
    }
  } catch (error) {
    console.error('获取架构模板列表失败:', error);
    MessagePlugin.error('获取架构模板列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 获取专业架构配置列表
const fetchArchitectures = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/program/architecture/list');
    const data = await res.json();
    if (data.code === 0) {
      architectures.value = data.data.list;
    } else {
      MessagePlugin.error('获取专业架构配置列表失败');
    }
  } catch (error) {
    console.error('获取专业架构配置列表失败:', error);
    MessagePlugin.error('获取专业架构配置列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 获取专业列表
const fetchMajors = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/program/majors');
    const data = await res.json();
    if (data.code === 0) {
      majors.value = data.data.list;
    } else {
      MessagePlugin.error('获取专业列表失败');
    }
  } catch (error) {
    console.error('获取专业列表失败:', error);
    MessagePlugin.error('获取专业列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 移除模块
const removeModule = (module: Module) => {
  const index = templateFormData.value.modules.findIndex(m => m.id === module.id);
  if (index !== -1) {
    templateFormData.value.modules.splice(index, 1);
    
    // 更新排序
    templateFormData.value.modules.forEach((m, i) => {
      m.order = i + 1;
    });
  }
};

// 移除架构模块
const removeArchitectureModule = (module: Module) => {
  const index = architectureFormData.value.modules.findIndex(m => m.id === module.id);
  if (index !== -1) {
    architectureFormData.value.modules.splice(index, 1);
    
    // 更新排序
    architectureFormData.value.modules.forEach((m, i) => {
      m.order = i + 1;
    });
  }
};

// 保存架构配置
const handleSaveArchitecture = async () => {
  if (!architectureFormData.value.name || !architectureFormData.value.description) {
    MessagePlugin.error('请填写架构名称和描述');
    return;
  }
  
  if (isArchitectureAdd.value && (!architectureFormData.value.majorCode || !architectureFormData.value.templateId)) {
    MessagePlugin.error('请选择专业和架构模板');
    return;
  }
  
  if (!architectureFormData.value.modules.length) {
    MessagePlugin.error('请至少添加一个模块');
    return;
  }
  
  // 如果是新增架构配置，需要填充专业名称和学院信息
  if (isArchitectureAdd.value && architectureFormData.value.majorCode) {
    const major = majors.value.find(m => m.code === architectureFormData.value.majorCode);
    if (major) {
      architectureFormData.value.majorName = major.name;
      architectureFormData.value.departmentName = major.department;
    }
  }
  
  loading.value = true;
  try {
    let url = '/api/program/architecture/add';
    if (!isArchitectureAdd.value) {
      url = '/api/program/architecture/update';
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(architectureFormData.value),
    });
    
    const data = await res.json();
    if (data.code === 0) {
      MessagePlugin.success(isArchitectureAdd.value ? '新增架构配置成功' : '更新架构配置成功');
      architectureEditVisible.value = false;
      fetchArchitectures(); // 重新获取架构配置列表
    } else {
      MessagePlugin.error(data.message || (isArchitectureAdd.value ? '新增架构配置失败' : '更新架构配置失败'));
    }
  } catch (error) {
    console.error(isArchitectureAdd.value ? '新增架构配置失败:' : '更新架构配置失败:', error);
    MessagePlugin.error(isArchitectureAdd.value ? '新增架构配置失败，请稍后重试' : '更新架构配置失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.architecture-config-container {
  padding: 20px;
  
  .architecture-tabs {
    background-color: #fff;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .panel-container {
    margin-top: 20px;
  }
  
  .template-list-card,
  .architecture-list-card {
    margin-bottom: 20px;
  }
  
  :deep(.t-transfer) {
    width: 100%;
  }
  
  // 模块配置相关样式
  .template-edit-form {
    width: 100%;
  }
  
  .module-config-container {
    display: flex;
    gap: 20px;
    margin-top: 10px;
    min-height: 400px;
  }
  
  .module-library {
    flex: 1;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    padding: 10px;
    
    h3 {
      margin: 0 0 10px;
      font-size: 14px;
      color: #333;
    }
    
    .module-list {
      max-height: 500px;
      overflow-y: auto;
    }
    
    .module-item {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f5f7fa;
      border-radius: 3px;
      cursor: move;
      user-select: none;
      transition: all 0.3s;
      border-left: 3px solid #0052d9;
      
      &:hover {
        background-color: #edf3ff;
      }
      
      .module-item-header {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .module-item-desc {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .selected-modules {
    flex: 1;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    padding: 10px;
    
    h3 {
      margin: 0 0 10px;
      font-size: 14px;
      color: #333;
    }
    
    .module-preview {
      min-height: 350px;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .selected-module-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f5f7fa;
      border-radius: 3px;
      cursor: move;
      user-select: none;
      transition: all 0.3s;
      border-left: 3px solid #0052d9;
      
      &:hover {
        background-color: #edf3ff;
      }
      
      .module-item-content {
        flex: 1;
        
        .module-item-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .module-item-desc {
          font-size: 12px;
          color: #666;
        }
      }
      
      .module-item-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style> 