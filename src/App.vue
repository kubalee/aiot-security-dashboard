<script setup>
import { computed, ref } from 'vue';
import {
  advanceEvent as advanceEventState,
  cloneEvents,
  confirmFromMobile,
  getAnalytics,
  initialEvents,
  notifyAll as notifyAllState,
  resetEvent as resetEventState,
  stageNames,
} from './prototypeState.js';

const events = ref(cloneEvents());
const activeId = ref(events.value[0].id);
const initialView = new URLSearchParams(window.location.search).get('view');
const viewMode = ref(['desktop', 'analytics', 'mobile'].includes(initialView) ? initialView : 'desktop');
const phoneTab = ref('event');
const toast = ref('');
let toastTimer;

const activeEvent = computed(() => events.value.find((event) => event.id === activeId.value));
const criticalCount = computed(() => events.value.filter((event) => event.severity === 'critical').length);
const warningCount = computed(() => events.value.filter((event) => event.severity === 'warning').length);
const pendingCount = computed(() => events.value.filter((event) => event.progress < 100).length);
const linkedCount = computed(() => events.value.reduce((sum, event) => sum + event.devices.filter((device) => ['done', 'running'].includes(device.status)).length, 0));
const notifiedCount = computed(() => events.value.reduce((sum, event) => sum + event.notify.filter((person) => ['done', 'running'].includes(person.status)).length, 0));
const analytics = computed(() => getAnalytics(events.value));

const kpis = computed(() => [
  { tone: 'critical', value: criticalCount.value, label: '严重事件', desc: '需立即处置' },
  { tone: 'warning', value: pendingCount.value, label: '处理中', desc: 'AI 正在跟进' },
  { tone: 'blue', value: linkedCount.value, label: '联动指令', desc: '已下发/执行中' },
  { tone: 'green', value: notifiedCount.value, label: '通知触达', desc: '人员/系统' },
]);

function showToast(message) {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = '';
  }, 1800);
}

function selectEvent(id) {
  activeId.value = id;
}

function setView(mode) {
  viewMode.value = mode;
}

function setPhoneTab(tab) {
  phoneTab.value = tab;
}

function advanceEvent() {
  advanceEventState(activeEvent.value);
  showToast(`已推进到：${stageNames[activeEvent.value.stage]}`);
}

function resetEvent() {
  const restored = resetEventState(events.value, initialEvents, activeId.value);
  activeId.value = restored.id;
  showToast('当前事件已复位');
}

function notifyAll() {
  notifyAllState(activeEvent.value);
  showToast('已向相关人员发起催办');
}

function phoneConfirm() {
  confirmFromMobile(activeEvent.value);
  showToast('手机端已确认');
}

function callOwner() {
  showToast('已拨打现场负责人电话');
}

function stepState(index) {
  if (index < activeEvent.value.stage) return 'done';
  if (index === activeEvent.value.stage) return 'active';
  return '';
}
</script>

<template>
  <div class="app" :class="viewMode === 'mobile' ? 'mobile-mode' : 'desktop-mode'">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">盾</div>
        <span>安芯智慧安防平台</span>
      </div>
      <div class="page-title">AIoT 安防联动中枢</div>
      <div class="live-badge">
        <span class="pulse"></span>
        <span>{{ events.length }} 起事件 · {{ criticalCount }} 起严重 · {{ warningCount }} 起警告</span>
      </div>
      <div class="topbar-spacer"></div>
      <div class="view-switch" aria-label="视图切换">
        <button :class="{ active: viewMode === 'desktop' }" @click="setView('desktop')">PC 看板</button>
        <button :class="{ active: viewMode === 'analytics' }" @click="setView('analytics')">统计分析</button>
        <button :class="{ active: viewMode === 'mobile' }" @click="setView('mobile')">手机看板</button>
      </div>
      <div class="operator-badge">值班：李明 · 10:37:26</div>
    </header>

    <main v-if="viewMode === 'desktop'" class="workspace">
      <aside class="panel">
        <div class="panel-head">
          <div class="panel-title">AI 设备上报</div>
          <span class="subtle">实时</span>
        </div>
        <div class="panel-body event-list">
          <button
            v-for="event in events"
            :key="event.id"
            class="event-item"
            :class="[event.severity, { active: event.id === activeId }]"
            @click="selectEvent(event.id)"
          >
            <span class="event-row">
              <b>{{ event.type }}</b>
              <span class="severity" :class="event.severity">{{ event.level }}</span>
            </span>
            <span class="event-location">{{ event.location }}</span>
            <span class="event-meta">
              <span class="mono">{{ event.time }}</span>
              <span>{{ event.device }}</span>
            </span>
            <span class="progress-mini"><span :style="{ width: `${event.progress}%` }"></span></span>
          </button>
        </div>
      </aside>

      <section class="center-column">
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.label" class="kpi" :class="kpi.tone">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}<small>{{ kpi.desc }}</small></div>
          </div>
        </div>

        <div class="center-grid">
          <div class="card">
            <div class="card-head">
              <div class="card-title">事件现场与设备感知</div>
              <span class="subtle mono">{{ activeEvent.device }} · {{ activeEvent.time }}</span>
            </div>
            <div class="card-body">
              <div class="video-frame">
                <div class="zone-map">
                  <div class="map-line v1"></div>
                  <div class="map-line v2"></div>
                  <div class="map-line h1"></div>
                  <div class="map-line h2"></div>
                </div>
                <div class="camera-dot dot-a">CAM</div>
                <div class="camera-dot dot-b">CAM</div>
                <div class="camera-dot dot-c">CAM</div>
                <div
                  class="risk-area"
                  :class="{ warning: activeEvent.riskPoint.warning }"
                  :style="{ left: `${activeEvent.riskPoint.x}%`, top: `${activeEvent.riskPoint.y}%` }"
                >
                  <div class="detect-label">{{ activeEvent.type }} · {{ activeEvent.confidence }}%</div>
                </div>
                <div class="video-footer">
                  <span>{{ activeEvent.location }}</span>
                  <span class="mono">LIVE · {{ activeEvent.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card decision-card">
            <div class="card-head">
              <div class="card-title">平台 AI 决策</div>
              <span class="severity" :class="activeEvent.severity">{{ activeEvent.level }}</span>
            </div>
            <div class="card-body">
              <p class="decision-text">{{ activeEvent.decision }}</p>
              <div class="plan-list">
                <div v-for="(item, index) in activeEvent.plan" :key="item" class="plan-item">
                  <span class="plan-icon">{{ index < activeEvent.stage ? '✓' : '□' }}</span>
                  <span>{{ item }}</span>
                </div>
              </div>
              <div class="ai-summary">
                <div v-for="item in activeEvent.ai" :key="item.name" class="ai-chip">
                  <strong><span>{{ item.name }}</span><span class="mono">{{ item.value }}%</span></strong>
                  <div class="confidence"><span :style="{ width: `${item.value}%` }"></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card flow-card">
          <div class="card-head">
            <div class="card-title">AI 处置链路</div>
            <div class="actions">
              <button class="btn" @click="resetEvent">复位状态</button>
              <button class="btn primary" @click="advanceEvent">推进下一步</button>
            </div>
          </div>
          <div class="card-body flow">
            <div v-for="(stage, index) in stageNames" :key="stage" class="flow-step" :class="stepState(index)">
              <div class="flow-head">{{ index < activeEvent.stage ? '✓' : '□' }} {{ stage }}</div>
              <div class="flow-desc">
                {{ ['AI 设备、边缘盒子、传感器上报原始事件', '平台 AI 多源复核并排除误报', '生成风险等级、影响范围与处置建议', '通知物联系统和人员，等待回执', '巡检复查、留痕归档、关闭事件'][index] }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="right-stack">
        <div class="card">
          <div class="card-head">
            <div class="card-title">物联系统联动</div>
            <span class="subtle">自动下发</span>
          </div>
          <div class="card-body stack-list">
            <div v-for="device in activeEvent.devices" :key="`${device.name}-${device.desc}`" class="stack-row">
              <div class="row-icon">联</div>
              <div class="row-main">
                <b>{{ device.name }}</b>
                <span>{{ device.desc }}</span>
              </div>
              <span class="status" :class="device.status">{{ device.label }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title">人员通知</div>
            <button class="btn" @click="notifyAll">一键催办</button>
          </div>
          <div class="card-body stack-list">
            <div v-for="person in activeEvent.notify" :key="`${person.name}-${person.desc}`" class="stack-row">
              <div class="row-icon">人</div>
              <div class="row-main">
                <b>{{ person.name }}</b>
                <span>{{ person.desc }}</span>
              </div>
              <span class="status" :class="person.status">{{ person.label }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title">联动日志</div>
            <span class="subtle">{{ activeEvent.logs.length }} 条</span>
          </div>
          <div class="card-body stack-list">
            <div v-for="(log, index) in activeEvent.logs" :key="`${log}-${index}`" class="log-row">
              <span class="log-time">10:{{ String(32 + index).padStart(2, '0') }}</span>
              <span>{{ log }}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <main v-if="viewMode === 'analytics'" class="analytics-page">
      <section class="analytics-hero">
        <div>
          <span class="section-kicker">OVERALL ANALYTICS</span>
          <h1>安防 AI 联动统计分析</h1>
          <p>汇总 AI 设备上报、平台 AI 研判、物联系统联动和人员通知数据，帮助值班中心判断整体风险态势与处置效率。</p>
        </div>
        <div class="health-score">
          <span>综合处置指数</span>
          <strong>{{ Math.round((analytics.averageProgress + analytics.linkage.rate + analytics.notification.rate) / 3) }}</strong>
          <small>进度 / 联动 / 触达</small>
        </div>
      </section>

      <section class="analytics-grid">
        <div class="analysis-card wide">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">RISK</span>
              <h2>事件风险结构</h2>
            </div>
            <span class="analysis-chip">{{ analytics.totalEvents }} 起事件</span>
          </div>
          <div class="risk-bars">
            <div class="risk-bar critical">
              <span>严重</span>
              <strong>{{ analytics.severity.critical }}</strong>
              <div><i :style="{ width: `${analytics.severity.critical / analytics.totalEvents * 100}%` }"></i></div>
            </div>
            <div class="risk-bar warning">
              <span>警告</span>
              <strong>{{ analytics.severity.warning }}</strong>
              <div><i :style="{ width: `${analytics.severity.warning / analytics.totalEvents * 100}%` }"></i></div>
            </div>
            <div class="risk-bar normal">
              <span>一般</span>
              <strong>{{ analytics.severity.normal }}</strong>
              <div><i :style="{ width: `${analytics.severity.normal / analytics.totalEvents * 100}%` }"></i></div>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">AI</span>
              <h2>识别质量</h2>
            </div>
          </div>
          <div class="metric-large">{{ analytics.averageConfidence }}<small>%</small></div>
          <p class="analysis-note">平均 AI 置信度，来自当前事件队列的识别结果。</p>
        </div>

        <div class="analysis-card">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">CLOSE LOOP</span>
              <h2>闭环状态</h2>
            </div>
          </div>
          <div class="donut" :style="{ '--value': `${analytics.closedEvents / analytics.totalEvents * 100}%` }">
            <span>{{ analytics.closedEvents }}/{{ analytics.totalEvents }}</span>
          </div>
          <p class="analysis-note">{{ analytics.processingEvents }} 起仍在处置链路中。</p>
        </div>

        <div class="analysis-card wide">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">PROCESS</span>
              <h2>AI 处置阶段分布</h2>
            </div>
            <span class="analysis-chip">平均进度 {{ analytics.averageProgress }}%</span>
          </div>
          <div class="stage-chart">
            <div v-for="stage in analytics.stageDistribution" :key="stage.name" class="stage-column">
              <div class="stage-bar"><i :style="{ height: `${Math.max(stage.rate, 4)}%` }"></i></div>
              <b>{{ stage.count }}</b>
              <span>{{ stage.name }}</span>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">IOT</span>
              <h2>物联联动执行</h2>
            </div>
          </div>
          <div class="metric-large blue">{{ analytics.linkage.rate }}<small>%</small></div>
          <p class="analysis-note">{{ analytics.linkage.active }} / {{ analytics.linkage.total }} 条联动指令已下发或执行。</p>
        </div>

        <div class="analysis-card">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">NOTICE</span>
              <h2>人员通知触达</h2>
            </div>
          </div>
          <div class="metric-large green">{{ analytics.notification.rate }}<small>%</small></div>
          <p class="analysis-note">{{ analytics.notification.touched }} / {{ analytics.notification.total }} 位相关人员已触达或响应。</p>
        </div>

        <div class="analysis-card wide">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">AREA</span>
              <h2>区域风险热度</h2>
            </div>
          </div>
          <div class="area-list">
            <div v-for="area in analytics.areaDistribution" :key="area.name" class="area-row">
              <span>{{ area.name }}</span>
              <div><i :style="{ width: `${area.rate}%` }"></i></div>
              <strong>{{ area.count }} 起</strong>
            </div>
          </div>
        </div>

        <div class="analysis-card wide">
          <div class="analysis-head">
            <div>
              <span class="section-kicker">INSIGHT</span>
              <h2>平台 AI 研判摘要</h2>
            </div>
          </div>
          <div class="insight-list">
            <div>严重事件集中在 A区与 C区，建议优先复核消防设备联动回执。</div>
            <div>当前仍有 {{ analytics.processingEvents }} 起事件未闭环，主要卡点在风险决策与联动执行阶段。</div>
            <div>通知触达率 {{ analytics.notification.rate }}%，可对待确认人员发起 App、短信、电话三通道催办。</div>
          </div>
        </div>
      </section>
    </main>

    <section class="mobile-shell-wrap">
      <div class="phone">
        <div class="phone-status"><span>10:37</span><span>5G 89%</span></div>
        <div class="phone-head">
          <div class="phone-title">
            <span>安防值班</span>
            <span class="severity" :class="activeEvent.severity">{{ activeEvent.level }}</span>
          </div>
          <div class="phone-tabs">
            <button :class="{ active: phoneTab === 'event' }" @click="setPhoneTab('event')">事件</button>
            <button :class="{ active: phoneTab === 'link' }" @click="setPhoneTab('link')">联动</button>
            <button :class="{ active: phoneTab === 'notify' }" @click="setPhoneTab('notify')">通知</button>
          </div>
        </div>
        <div class="phone-body">
          <template v-if="phoneTab === 'event'">
            <div class="mobile-alert" :class="activeEvent.severity">
              <div class="mobile-alert-head">
                <div>
                  <div class="mobile-alert-title">{{ activeEvent.type }}</div>
                  <div class="subtle">{{ activeEvent.id }} · {{ activeEvent.time }}</div>
                </div>
                <span class="severity" :class="activeEvent.severity">{{ activeEvent.level }}</span>
              </div>
              <div class="mobile-field"><span>位置</span><b>{{ activeEvent.location }}</b></div>
              <div class="mobile-field"><span>来源</span><span>{{ activeEvent.device }}</span></div>
              <div class="mobile-field"><span>置信度</span><span class="mono">{{ activeEvent.confidence }}%</span></div>
            </div>
            <div class="phone-camera" :class="{ warning: activeEvent.riskPoint.warning }">
              <span>{{ activeEvent.device }}</span>
            </div>
            <div class="card">
              <div class="card-head"><div class="card-title">AI 建议</div></div>
              <div class="card-body">{{ activeEvent.decision }}</div>
            </div>
          </template>
          <template v-else-if="phoneTab === 'link'">
            <div v-for="(stage, index) in stageNames" :key="stage" class="mobile-step" :class="stepState(index)">
              <span class="mobile-step-dot"></span>
              <span><b>{{ stage }}</b><small>{{ index < activeEvent.stage ? '已完成' : index === activeEvent.stage ? '进行中' : '待执行' }}</small></span>
            </div>
            <div v-for="device in activeEvent.devices" :key="`m-${device.name}`" class="stack-row">
              <div class="row-icon">联</div>
              <div class="row-main"><b>{{ device.name }}</b><span>{{ device.desc }}</span></div>
              <span class="status" :class="device.status">{{ device.label }}</span>
            </div>
          </template>
          <template v-else>
            <div v-for="person in activeEvent.notify" :key="`m-${person.name}`" class="stack-row">
              <div class="row-icon">人</div>
              <div class="row-main"><b>{{ person.name }}</b><span>{{ person.desc }}</span></div>
              <span class="status" :class="person.status">{{ person.label }}</span>
            </div>
          </template>
        </div>
        <div class="phone-bottom">
          <button class="btn" @click="phoneConfirm">确认</button>
          <button class="btn primary" @click="advanceEvent">派发</button>
          <button class="btn danger" @click="callOwner">呼叫</button>
        </div>
      </div>
    </section>

    <div v-if="toast" class="toast show">{{ toast }}</div>
  </div>
</template>
