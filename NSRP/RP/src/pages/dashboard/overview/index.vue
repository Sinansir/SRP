<template>
  <div class="dashboard-overview">
    <a-card class="general-card" title="数据概览">
      <a-skeleton :loading="loading" animation>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card class="dashboard-card">
              <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                  <div class="dashboard-card-title">培养方案</div>
                  <div class="dashboard-card-icon bg-blue">
                    <icon-file-text />
                  </div>
                </div>
                <div class="dashboard-card-value">126</div>
                <div class="dashboard-card-footer">
                  <div class="dashboard-card-trend">
                    <icon-arrow-up class="up" />
                    <span>12.5%</span>
                  </div>
                  <div class="dashboard-card-description">较上月</div>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="dashboard-card">
              <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                  <div class="dashboard-card-title">课程库</div>
                  <div class="dashboard-card-icon bg-green">
                    <icon-book />
                  </div>
                </div>
                <div class="dashboard-card-value">328</div>
                <div class="dashboard-card-footer">
                  <div class="dashboard-card-trend">
                    <icon-arrow-up class="up" />
                    <span>8.2%</span>
                  </div>
                  <div class="dashboard-card-description">较上月</div>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="dashboard-card">
              <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                  <div class="dashboard-card-title">教学大纲</div>
                  <div class="dashboard-card-icon bg-orange">
                    <icon-calendar />
                  </div>
                </div>
                <div class="dashboard-card-value">215</div>
                <div class="dashboard-card-footer">
                  <div class="dashboard-card-trend">
                    <icon-arrow-down class="down" />
                    <span>3.8%</span>
                  </div>
                  <div class="dashboard-card-description">较上月</div>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="dashboard-card">
              <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                  <div class="dashboard-card-title">分析报告</div>
                  <div class="dashboard-card-icon bg-purple">
                    <icon-chart-pie />
                  </div>
                </div>
                <div class="dashboard-card-value">87</div>
                <div class="dashboard-card-footer">
                  <div class="dashboard-card-trend">
                    <icon-arrow-up class="up" />
                    <span>15.3%</span>
                  </div>
                  <div class="dashboard-card-description">较上月</div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-skeleton>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(false);
</script>

<style scoped lang="less">
.dashboard-overview {
  padding: 20px;

  .dashboard-card {
    margin-bottom: 16px;
    
    .dashboard-card-content {
      .dashboard-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .dashboard-card-title {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
        }

        .dashboard-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          color: #fff;
        }
      }

      .dashboard-card-value {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .dashboard-card-footer {
        display: flex;
        align-items: center;

        .dashboard-card-trend {
          display: flex;
          align-items: center;
          margin-right: 8px;

          .up {
            color: #f53f3f;
          }

          .down {
            color: #00b42a;
          }
        }

        .dashboard-card-description {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
        }
      }
    }
  }

  .bg-blue {
    background-color: #165dff;
  }

  .bg-green {
    background-color: #00b42a;
  }

  .bg-orange {
    background-color: #ff7d00;
  }

  .bg-purple {
    background-color: #722ed1;
  }
}
</style> 