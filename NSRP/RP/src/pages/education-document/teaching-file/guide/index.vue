<template>
  <div class="guide-upload-container">
    <t-card title="实验指导书/其他上传" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleUpload">上传文件</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
        </t-space>
      </template>
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-form ref="form" :data="formData" :rules="rules" label-width="120px">
          <t-form-item label="文件类型" name="fileType">
            <t-radio-group v-model="formData.fileType">
              <t-radio value="experiment">实验指导书</t-radio>
              <t-radio value="other">其他教学文件</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="课程名称" name="courseName">
            <t-select v-model="formData.courseName" placeholder="请选择课程" clearable :options="courseOptions" />
          </t-form-item>
          <t-form-item label="学期" name="semester">
            <t-select v-model="formData.semester" placeholder="请选择学期" clearable :options="semesterOptions" />
          </t-form-item>
          <t-form-item label="文件标题" name="title">
            <t-input v-model="formData.title" placeholder="请输入文件标题" />
          </t-form-item>
          <t-form-item label="文件描述" name="description">
            <t-textarea
              v-model="formData.description"
              placeholder="请输入文件描述"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="上传文件" name="files">
            <t-upload
              v-model="formData.files"
              theme="file"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              :headers="{ token: 'mock-token' }"
              :max-size="20 * 1024 * 1024"
              :multiple="true"
              :format-response="formatResponse"
              :accept="'.pdf,.doc,.docx,.zip,.rar'"
              @success="handleSuccess"
              @validate="handleValidate"
            >
              <t-button theme="default">
                <template #icon>
                  <t-icon name="upload" />
                </template>
                选择文件
              </t-button>
              <span class="upload-tips">
                支持PDF、Word、压缩包等格式，单个文件不超过20MB
              </span>
            </t-upload>
          </t-form-item>
        </t-form>

        <t-divider />

        <div class="filter-container">
          <t-space>
            <t-select v-model="filter.fileType" placeholder="文件类型" clearable :options="fileTypeOptions" />
            <t-select v-model="filter.courseName" placeholder="课程名称" clearable :options="courseOptions" />
            <t-button theme="primary" @click="handleFilter">筛选</t-button>
            <t-button theme="default" @click="resetFilter">重置</t-button>
          </t-space>
        </div>

        <h3>已上传文件列表</h3>
        <t-table
          :data="fileList"
          :columns="columns"
          :hover="true"
          :stripe="true"
          :pagination="pagination"
          @page-change="onPageChange"
        />
      </t-space>
    </t-card>
  </div>
</template>

 