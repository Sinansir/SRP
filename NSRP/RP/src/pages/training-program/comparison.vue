<template>
  <div class="training-program-comparison">
    <t-card class="selection-card">
      <template #title>
        <span class="card-title">选择培养方案</span>
      </template>
      <div class="selection-area">
        <div class="selection-left">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索培养方案"
            suffix-icon="search"
            @enter="onSearch"
          />
          <t-tree
            :data="programTree"
            :checkable="true"
            :check-strictly="true"
            :expand-on-click-node="false"
            :hover="true"
            :load-data="onLoadData"
            v-model:checked-keys="checkedKeys"
            @click="onTreeNodeClick"
          />
        </div>
        <div class="selection-right">
          <div class="selected-header">
            <span class="selected-title">已选择的培养方案</span>
            <t-button v-if="selectedPrograms.length > 0" size="small" @click="clearSelection">清空</t-button>
          </div>
          
          <template v-if="selectedPrograms.length > 0">
            <t-list>
              <t-list-item v-for="(program, index) in selectedPrograms" :key="index">
                <t-list-item-meta :title="program.name">
                  <template #description>
                    <div>{{ program.college }} - {{ program.major }}</div>
                    <div>{{ program.version }}</div>
                  </template>
                </t-list-item-meta>
                <template #action>
                  <t-button theme="danger" variant="text" size="small" @click="removeProgram(index)">
                    <t-icon name="close" />
                  </t-button>
                </template>
              </t-list-item>
            </t-list>
          </template>
          
          <template v-else>
            <div class="empty-selection">
              <t-empty description="暂无选择的培养方案" />
            </div>
          </template>
          
          <div class="selection-tip">
            <p>从左侧选择1-4个培养方案进行对比分析</p>
          </div>
        </div>
      </div>
      <template #footer>
        <t-button theme="primary" :loading="loading" @click="comparePrograms">开始对比分析</t-button>
      </template>
    </t-card>
    
    <t-card class="compare-card" v-if="showCompareResult">
      <template #title>
        <span class="card-title">对比分析结果</span>
      </template>
      <t-tabs class="compare-tabs" v-model="activeTab">
        <t-tab-panel value="basic" label="基本信息对比">
          <t-table 
            :data="basicCompareData" 
            :columns="getCompareColumns('basic')"
            :loading="loading"
            :bordered="true"
            :stripe="true"
            :max-height="600"
          />
        </t-tab-panel>
        <t-tab-panel value="courses" label="课程结构对比">
          <t-table 
            :data="coursesCompareData" 
            :columns="getCompareColumns('courses')"
            :loading="loading"
            :bordered="true"
            :stripe="true"
            :max-height="600"
          />
        </t-tab-panel>
        <t-tab-panel value="credit" label="学分结构对比">
          <div class="chart-container">
            <div ref="chartRef" class="credit-chart"></div>
          </div>
        </t-tab-panel>
        <t-tab-panel value="ability" label="能力指标对比">
          <t-table 
            :data="abilityCompareData" 
            :columns="getCompareColumns('ability')"
            :loading="loading"
            :bordered="true"
            :stripe="true"
            :max-height="600"
          />
        </t-tab-panel>
      </t-tabs>
      
      <div class="diff-highlight-legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: var(--td-success-color-1)"></div>
          <span class="legend-text">完全相同</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: var(--td-warning-color-1)"></div>
          <span class="legend-text">部分相同</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: var(--td-error-color-1)"></div>
          <span class="legend-text">完全不同</span>
        </div>
      </div>
      
      <template #footer>
        <t-button theme="default" @click="handleExport">导出对比结果</t-button>
      </template>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer
]);

const { t } = useI18n();
let chartInstance: any = null;

// 界面状态控制
const loading = ref(false);
const showCompareResult = ref(false);
const searchKeyword = ref('');
const activeTab = ref('basic');
const chartRef = ref<HTMLElement | null>(null);

// 树选择状态
const checkedKeys = ref<string[]>([]);
const selectedPrograms = ref<any[]>([]);

// 对比数据
const basicCompareData = ref([
  { field: '所属院系', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '专业名称', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '版本', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '学位类型', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '学制', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '培养目标', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '核心能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
]);

const coursesCompareData = ref([
  { field: '公共基础课', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '学科基础课', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '专业核心课', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '专业选修课', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '实践环节', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
]);

const abilityCompareData = ref([
  { field: '专业知识能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '工程实践能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '创新思维能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '团队协作能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
  { field: '国际视野能力', program1: '', program2: '', program3: '', program4: '', diff1: '', diff2: '', diff3: '', diff4: '' },
]);

// 培养方案树数据（示例数据）
const programTree = ref([
  {
    value: 'college-1',
    label: '计算机学院',
    children: [
      {
        value: 'major-1-1',
        label: '计算机科学与技术',
        children: [
          { value: 'program-1-1-1', label: '计算机科学与技术专业培养方案（2022版）', data: {
            id: '1',
            name: '计算机科学与技术专业培养方案（2022版）',
            major: '计算机科学与技术',
            college: '计算机学院',
            version: '2022版',
            degreeType: '工学学士',
            duration: '四年制',
            goal: '培养具有扎实的计算机科学理论基础，掌握计算机软硬件和网络系统的基本原理，具备较强的程序设计能力和实践能力的高素质应用型人才。',
            ability: '具备计算机系统分析、设计、实现和管理能力，能够在信息技术相关领域从事软件设计与开发、网络工程与管理、系统集成与维护等工作。',
          } },
          { value: 'program-1-1-2', label: '计算机科学与技术专业培养方案（2021版）', data: {
            id: '2',
            name: '计算机科学与技术专业培养方案（2021版）',
            major: '计算机科学与技术',
            college: '计算机学院',
            version: '2021版',
            degreeType: '工学学士',
            duration: '四年制',
            goal: '培养掌握计算机科学与技术领域的基础理论知识，具备计算机系统、网络系统和应用软件的开发与管理能力的应用型人才。',
            ability: '能够在IT企业、科研机构和国家机关等部门从事计算机教学、科研、开发和管理等工作。',
          } },
        ],
      },
      {
        value: 'major-1-2',
        label: '软件工程',
        children: [
          { value: 'program-1-2-1', label: '软件工程专业培养方案（2022版）', data: {
            id: '3',
            name: '软件工程专业培养方案（2022版）',
            major: '软件工程',
            college: '计算机学院',
            version: '2022版',
            degreeType: '工学学士',
            duration: '四年制',
            goal: '培养具有扎实的软件工程理论基础，掌握先进的软件开发技术和方法，能够承担大中型软件系统的分析、设计和开发工作的高素质应用型人才。',
            ability: '具备软件系统分析设计、程序开发、项目管理和系统维护等能力，能够在软件企业及信息技术相关领域从事软件设计、开发、测试和项目管理等工作。',
          } },
        ],
      },
    ],
  },
  {
    value: 'college-2',
    label: '信息工程学院',
    children: [
      {
        value: 'major-2-1',
        label: '人工智能',
        children: [
          { value: 'program-2-1-1', label: '人工智能专业培养方案（2022版）', data: {
            id: '4',
            name: '人工智能专业培养方案（2022版）',
            major: '人工智能',
            college: '信息工程学院',
            version: '2022版',
            degreeType: '工学学士',
            duration: '四年制',
            goal: '培养具备扎实的数学基础和计算机技术基础，掌握人工智能领域的基本理论和方法，能够从事智能系统设计、开发与应用的高素质应用型人才。',
            ability: '具备机器学习、深度学习、自然语言处理、计算机视觉等人工智能核心技术能力，能够开发智能算法和系统，解决实际问题。',
          } },
        ],
      },
    ],
  },
  {
    value: 'college-3',
    label: '电子工程学院',
    children: [
      {
        value: 'major-3-1',
        label: '网络工程',
        children: [
          { value: 'program-3-1-1', label: '网络工程专业培养方案（2022版）', data: {
            id: '5',
            name: '网络工程专业培养方案（2022版）',
            major: '网络工程',
            college: '电子工程学院',
            version: '2022版',
            degreeType: '工学学士',
            duration: '四年制',
            goal: '培养掌握计算机网络领域的基本理论、基本知识和基本技能，能够从事网络系统规划、设计、实施、运维和管理的高素质应用型人才。',
            ability: '具备计算机网络原理与技术、网络设备配置、网络安全防护、网络管理与维护等能力，能够从事网络系统集成与网络应用软件开发等工作。',
          } },
        ],
      },
    ],
  },
]);

// 监听选中的节点变化，更新已选择的培养方案
watch(checkedKeys, (newValues) => {
  // 重置选择，仅保留叶子节点
  selectedPrograms.value = [];
  
  // 找到所有选中的叶子节点
  const allLeafs = [];
  const findSelectedLeafs = (nodes) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        findSelectedLeafs(node.children);
      } else if (newValues.includes(node.value) && node.data) {
        allLeafs.push(node.data);
      }
    });
  };
  
  findSelectedLeafs(programTree.value);
  
  // 最多允许选择4个
  selectedPrograms.value = allLeafs.slice(0, 4);
  
  // 如果选择超过了4个，更新选中状态
  if (allLeafs.length > 4) {
    MessagePlugin.warning('最多只能选择4个培养方案进行对比');
  }
});

// 根据类型获取对比表格列
const getCompareColumns = (type) => {
  const baseColumn = {
    colKey: 'field',
    title: t('对比项'),
    width: 160,
    fixed: 'left',
  };
  
  const programColumns = selectedPrograms.value.map((program, index) => ({
    colKey: `program${index + 1}`,
    title: program.name,
    width: 280,
    // 单元格渲染
    cell: (h, { row }) => {
      let content = row[`program${index + 1}`];
      let diffType = row[`diff${index + 1}`];
      let bgColor = 'transparent';
      
      if (diffType === 'same') {
        bgColor = 'var(--td-success-color-1)';
      } else if (diffType === 'partial') {
        bgColor = 'var(--td-warning-color-1)';
      } else if (diffType === 'different') {
        bgColor = 'var(--td-error-color-1)';
      }
      
      return h('div', {
        style: {
          backgroundColor: bgColor,
          padding: '8px'
        }
      }, content);
    },
  }));
  
  return [baseColumn, ...programColumns];
};

// 搜索树节点
const onSearch = () => {
  // 实际项目中应该实现搜索逻辑
  // 此处仅作示例，可以扩展为实际的搜索功能
  if (searchKeyword.value) {
    MessagePlugin.info(`搜索关键词: ${searchKeyword.value}`);
  }
};

// 树节点点击
const onTreeNodeClick = (context) => {
  const { node } = context;
  // 如果是叶子节点，检查是否已经选中
  if (!node.children || node.children.length === 0) {
    // 如果已经在已选列表中，不做处理
    // 如果不在已选列表中且已选数量小于4，则添加
    if (
      !selectedPrograms.value.some((p) => p.id === node.data?.id) &&
      selectedPrograms.value.length < 4 &&
      node.data
    ) {
      selectedPrograms.value.push(node.data);
      if (!checkedKeys.value.includes(node.value)) {
        checkedKeys.value.push(node.value);
      }
    }
  }
};

// 异步加载子节点（示例）
const onLoadData = (node) => {
  return new Promise((resolve) => {
    // 模拟异步加载，实际项目中应该调用API
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// 清空选择
const clearSelection = () => {
  selectedPrograms.value = [];
  checkedKeys.value = [];
};

// 移除某个已选培养方案
const removeProgram = (index) => {
  // 先找到对应的节点值
  const programToRemove = selectedPrograms.value[index];
  // 从已选数组中移除
  selectedPrograms.value.splice(index, 1);
  
  // 更新树的选中状态
  let nodeValue = '';
  const findNodeValue = (nodes) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        findNodeValue(node.children);
      } else if (node.data && node.data.id === programToRemove.id) {
        nodeValue = node.value;
        break;
      }
    }
  };
  
  findNodeValue(programTree.value);
  
  if (nodeValue) {
    checkedKeys.value = checkedKeys.value.filter((key) => key !== nodeValue);
  }
};

// 开始对比
const comparePrograms = () => {
  if (selectedPrograms.value.length < 2) {
    MessagePlugin.warning('请至少选择2个培养方案进行对比');
    return;
  }
  
  loading.value = true;
  showCompareResult.value = true;
  
  // 模拟加载过程
  setTimeout(() => {
    // 填充基本信息对比数据
    basicCompareData.value.forEach(row => {
      selectedPrograms.value.forEach((program, index) => {
        let fieldValue = '';
        let diffType = 'different';
        
        // 根据字段类型获取对应的值
        if (row.field === '所属院系') fieldValue = program.college;
        else if (row.field === '专业名称') fieldValue = program.major;
        else if (row.field === '版本') fieldValue = program.version;
        else if (row.field === '学位类型') fieldValue = program.degreeType;
        else if (row.field === '学制') fieldValue = program.duration;
        else if (row.field === '培养目标') fieldValue = program.goal;
        else if (row.field === '核心能力') fieldValue = program.ability;
        
        // 设置字段值
        row[`program${index + 1}`] = fieldValue;
        
        // 计算差异类型（示例：简单比较）
        if (index > 0) {
          const prevValue = row[`program1`]; // 以第一个为基准
          if (fieldValue === prevValue) {
            diffType = 'same';
          } else if (fieldValue && prevValue && 
                    (fieldValue.includes(prevValue) || prevValue.includes(fieldValue))) {
            diffType = 'partial';
          }
        } else {
          diffType = ''; // 第一个不需要差异标记
        }
        
        row[`diff${index + 1}`] = diffType;
      });
    });
    
    // 填充其他对比数据（示例数据）
    const generateRandomData = (dataRef) => {
      dataRef.value.forEach(row => {
        selectedPrograms.value.forEach((program, index) => {
          // 根据不同的字段生成不同的示例数据
          let value = '';
          
          if (row.field.includes('课')) {
            // 课程相关，生成学分数据
            let credits = Math.floor(Math.random() * 30) + 10;
            let courses = Math.floor(Math.random() * 8) + 2;
            value = `${credits}学分，${courses}门课程`;
          } else {
            // 能力相关，生成等级数据
            const levels = ['优秀', '良好', '中等', '基础'];
            value = levels[Math.floor(Math.random() * levels.length)];
          }
          
          row[`program${index + 1}`] = value;
          
          // 计算差异类型
          let diffType = 'different';
          if (index > 0) {
            const prevValue = row[`program1`]; // 以第一个为基准
            if (value === prevValue) {
              diffType = 'same';
            } else if (value && prevValue && 
                      (value.includes(prevValue) || prevValue.includes(value))) {
              diffType = 'partial';
            }
          } else {
            diffType = ''; // 第一个不需要差异标记
          }
          
          row[`diff${index + 1}`] = diffType;
        });
      });
    };
    
    generateRandomData(coursesCompareData);
    generateRandomData(abilityCompareData);
    
    loading.value = false;
    
    // 在数据加载完成后初始化图表
    if (activeTab.value === 'credit') {
      nextTick(() => {
        initCreditChart();
      });
    }
  }, 1000);
};

// 初始化学分结构图表
const initCreditChart = () => {
  if (!chartRef.value) return;
  
  // 如果图表实例已存在，先销毁
  if (chartInstance) {
    chartInstance.dispose();
  }
  
  // 创建新的图表实例
  chartInstance = echarts.init(chartRef.value);
  
  // 模拟数据
  const categories = ['公共基础课', '学科基础课', '专业核心课', '专业选修课', '实践环节'];
  const seriesData = selectedPrograms.value.map((program, index) => {
    // 随机生成各分类的学分数，实际项目中应该使用真实数据
    return {
      name: program.name,
      type: 'bar',
      data: categories.map(() => Math.floor(Math.random() * 30) + 10),
    };
  });
  
  // 配置图表选项
  const option = {
    title: {
      text: '学分结构对比',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: selectedPrograms.value.map((p) => p.name),
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: '学分',
    },
    series: seriesData,
  };
  
  // 应用图表配置
  chartInstance.setOption(option);
  
  // 添加窗口大小变化时的自适应调整
  window.addEventListener('resize', () => {
    chartInstance && chartInstance.resize();
  });
};

// Tab 变化时处理
watch(activeTab, (newValue) => {
  if (newValue === 'credit' && showCompareResult.value) {
    nextTick(() => {
      initCreditChart();
    });
  }
});

// 导出对比结果
const handleExport = () => {
  MessagePlugin.success('开始导出对比结果');
  // 实际导出逻辑...
};

// 组件挂载时的处理
onMounted(() => {
  // 可以在此处进行初始化操作
});
</script>

<style lang="less" scoped>
.training-program-comparison {
  padding: 20px;
  
  .card-title {
    font-weight: 500;
  }
  
  .selection-card {
    margin-bottom: 16px;
    
    .selection-area {
      display: flex;
      gap: 16px;
      
      .selection-left {
        flex: 1;
        border-right: 1px solid var(--td-component-stroke);
        padding-right: 16px;
        
        .t-input {
          margin-bottom: 16px;
        }
      }
      
      .selection-right {
        width: 360px;
        
        .selected-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          .selected-title {
            font-size: 16px;
            font-weight: 500;
          }
        }
        
        .empty-selection {
          padding: 40px 0;
        }
        
        .selection-tip {
          margin-top: 12px;
          color: var(--td-text-color-secondary);
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
  
  .compare-card {
    .compare-tabs {
      margin-bottom: 16px;
    }
    
    .chart-container {
      height: 400px;
      width: 100%;
      
      .credit-chart {
        height: 100%;
        width: 100%;
      }
    }
    
    .diff-highlight-legend {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      
      .legend-item {
        display: flex;
        align-items: center;
        margin: 0 12px;
        
        .legend-color {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border-radius: 4px;
        }
        
        .legend-text {
          font-size: 14px;
          color: var(--td-text-color-secondary);
        }
      }
    }
  }
}
</style>