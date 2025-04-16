<template>
  <div class="curriculum-system-card">
    <t-card
      hoverable
      :class="['system-card', isSelected ? 'system-card--selected' : '']"
      :bordered="true"
      @click="handleClick"
    >
      <template #title>
        <div class="system-card__header">
          <h3 class="system-card__title">{{ template.name }}</h3>
          <t-tag v-if="template.isDefault" theme="success" variant="light">默认</t-tag>
        </div>
      </template>
      
      <div class="system-card__content">
        <p class="system-card__description">{{ template.description }}</p>
        <div class="system-card__info">
          <div class="system-card__info-item">
            <span class="system-card__label">专业类型：</span>
            <span class="system-card__value">{{ getMajorTypeText(template.majorType) }}</span>
          </div>
          <div class="system-card__info-item">
            <span class="system-card__label">学位类型：</span>
            <span class="system-card__value">{{ getDegreeTypeText(template.degreeType) }}</span>
          </div>
          <div class="system-card__info-item">
            <span class="system-card__label">模块数量：</span>
            <span class="system-card__value">{{ template.modules.length }}</span>
          </div>
          <div class="system-card__info-item">
            <span class="system-card__label">学分要求：</span>
            <span class="system-card__value">{{ getRecommendedCredits(template.creditRequirements) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="system-card__footer">
          <div class="system-card__meta">
            <t-tooltip content="创建时间">
              <t-icon name="time" size="small" />
              <span>{{ formatDate(template.createTime) }}</span>
            </t-tooltip>
          </div>
          <div class="system-card__actions">
            <t-tooltip content="预览">
              <t-button theme="primary" variant="text" shape="square" @click.stop="onPreview">
                <template #icon><t-icon name="browse" /></template>
              </t-button>
            </t-tooltip>
            <t-tooltip content="编辑">
              <t-button theme="primary" variant="text" shape="square" @click.stop="onEdit">
                <template #icon><t-icon name="edit" /></template>
              </t-button>
            </t-tooltip>
            <t-tooltip v-if="!template.isDefault" content="设为默认">
              <t-button theme="warning" variant="text" shape="square" @click.stop="onSetDefault">
                <template #icon><t-icon name="star" /></template>
              </t-button>
            </t-tooltip>
            <t-tooltip v-if="!template.isDefault" content="删除">
              <t-button theme="danger" variant="text" shape="square" @click.stop="onDelete">
                <template #icon><t-icon name="delete" /></template>
              </t-button>
            </t-tooltip>
          </div>
        </div>
      </template>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  template: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['preview', 'edit', 'delete', 'set-default', 'click']);

const handleClick = () => {
  emit('click', props.template);
};

const onPreview = () => {
  emit('preview', props.template);
};

const onEdit = () => {
  emit('edit', props.template);
};

const onDelete = () => {
  emit('delete', props.template);
};

const onSetDefault = () => {
  emit('set-default', props.template);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getMajorTypeText = (type: string) => {
  const types = {
    'engineering': '工科类',
    'science': '理科类',
    'arts': '文科类',
    'economics_management': '经管类',
    'medicine': '医学类',
    'education': '教育类',
    'art': '艺术类'
  };
  return types[type] || type;
};

const getDegreeTypeText = (type: string) => {
  const types = {
    'bachelor': '学士',
    'master': '硕士',
    'doctor': '博士'
  };
  return types[type] || type;
};

const getRecommendedCredits = (creditRequirements) => {
  const totalCredits = creditRequirements.find(item => item.category === '总学分要求');
  return totalCredits ? `${totalCredits.recommendedCredits}学分` : '未设置';
};
</script>

<style lang="less" scoped>
.curriculum-system-card {
  margin-bottom: 16px;
  
  .system-card {
    transition: all 0.3s;
    
    &--selected {
      border-color: var(--td-brand-color);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    &__title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    &__content {
      min-height: 120px;
    }
    
    &__description {
      margin-bottom: 16px;
      color: var(--td-text-color-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    &__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
    }
    
    &__info-item {
      display: flex;
      align-items: center;
    }
    
    &__label {
      color: var(--td-text-color-secondary);
      font-size: 13px;
    }
    
    &__value {
      color: var(--td-text-color-primary);
      font-size: 13px;
    }
    
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    &__meta {
      display: flex;
      align-items: center;
      color: var(--td-text-color-secondary);
      font-size: 12px;
      
      .t-icon {
        margin-right: 4px;
      }
    }
    
    &__actions {
      display: flex;
      gap: 4px;
    }
  }
}
</style> 