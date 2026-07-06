export const stageNames = ['设备上报', 'AI 复核', '风险决策', '联动执行', '复查闭环'];

export const initialEvents = [
  {
    id: 'E-001',
    type: '明火与烟雾',
    location: 'A区 · 1号楼大门入口',
    device: 'CAM-A01 / EDGE-A01',
    time: '10:32:45',
    severity: 'critical',
    level: '严重',
    confidence: 94.7,
    progress: 62,
    stage: 2,
    riskPoint: { x: 35, y: 58, warning: false },
    decision: '系统判断为严重火情风险。建议立即触发声光报警、消防喷淋、疏散广播，并通知安保主管与消防负责人到场复核。',
    plan: ['启动 A区声光报警器', '打开疏散通道门禁', '联动消防喷淋预备', '通知安保主管和消防负责人'],
    ai: [
      { name: '明火特征', value: 94.7 },
      { name: '烟雾扩散', value: 82.3 },
      { name: '热源异常', value: 76.9 },
      { name: '误报排除', value: 91.4 },
    ],
    devices: [
      { name: '声光报警器', desc: 'A区 1号楼', status: 'running', label: '已触发' },
      { name: '门禁系统', desc: '大门与疏散通道', status: 'pending', label: '待解锁' },
      { name: '消防喷淋', desc: 'A区入口半径 50m', status: 'pending', label: '待联动' },
      { name: '应急广播', desc: 'A区与中庭', status: 'running', label: '播报中' },
    ],
    notify: [
      { name: '李明', desc: '值班主管 · 已读 10:33', status: 'done', label: '已确认' },
      { name: '周倩', desc: '消防负责人 · 推送/短信', status: 'running', label: '待确认' },
      { name: '王磊', desc: '物业经理 · 电话外呼', status: 'pending', label: '排队中' },
    ],
    logs: ['边缘盒子上传视觉事件与热源读数', '平台 AI 完成多源复核，置信度 94.7%', '生成消防联动建议，等待关键设备回执'],
  },
  {
    id: 'E-002',
    type: '人员闯入',
    location: 'B区 · 后门通道',
    device: 'CAM-B03 / 门禁 B-12',
    time: '10:28:12',
    severity: 'warning',
    level: '警告',
    confidence: 91.2,
    progress: 100,
    stage: 4,
    riskPoint: { x: 43, y: 46, warning: true },
    decision: '系统判断为非授权人员进入后门通道。已联动门禁锁定、现场广播警告，并推送给安保巡逻人员。',
    plan: ['锁定 B区后门', '调取近 5 分钟回放', '通知巡逻组', '完成现场复查'],
    ai: [
      { name: '人体目标', value: 91.2 },
      { name: '身份未授权', value: 86.1 },
      { name: '热源正常', value: 70.2 },
      { name: '误报排除', value: 88.5 },
    ],
    devices: [
      { name: '后门门禁', desc: 'B区 B-12', status: 'done', label: '已锁定' },
      { name: '现场广播', desc: '后门通道', status: 'done', label: '已播报' },
      { name: '巡更系统', desc: '最近巡逻点', status: 'done', label: '已派单' },
    ],
    notify: [
      { name: '赵强', desc: '巡逻队长 · App', status: 'done', label: '已接单' },
      { name: '李明', desc: '值班主管 · App', status: 'done', label: '已确认' },
    ],
    logs: ['识别到未授权人员进入', '门禁系统返回锁定成功', '巡逻队长接单并完成复核'],
  },
  {
    id: 'E-003',
    type: '烟雾与热源异常',
    location: 'C区 · 仓库3号',
    device: 'CAM-C05 / 烟感 C-09',
    time: '10:35:08',
    severity: 'critical',
    level: '严重',
    confidence: 82.1,
    progress: 25,
    stage: 1,
    riskPoint: { x: 57, y: 35, warning: false },
    decision: '烟雾与热源读数同时升高，系统建议继续复核烟感、热成像与仓库门磁，并预置消防联动方案。',
    plan: ['复核烟感 C-09', '读取仓库热成像', '通知仓库主管', '准备消防设备联动'],
    ai: [
      { name: '烟雾特征', value: 82.1 },
      { name: '热源异常', value: 71.5 },
      { name: '门磁状态', value: 63.8 },
      { name: '误报排除', value: 74.9 },
    ],
    devices: [
      { name: '烟感系统', desc: 'C区 C-09', status: 'running', label: '复核中' },
      { name: '消防喷淋', desc: '仓库3号', status: 'pending', label: '待命' },
      { name: '仓库门禁', desc: 'C区侧门', status: 'pending', label: '待检测' },
    ],
    notify: [
      { name: '陈晨', desc: '仓库主管 · App/短信', status: 'running', label: '待确认' },
      { name: '周倩', desc: '消防负责人 · App', status: 'pending', label: '待发送' },
    ],
    logs: ['边缘设备上报烟雾识别结果', '烟感 C-09 数据同步中', 'AI 正在计算影响范围'],
  },
  {
    id: 'E-004',
    type: '消防通道堵塞',
    location: 'A区 · 2号楼楼梯间',
    device: 'CAM-A06 / 巡检机器人',
    time: '10:15:47',
    severity: 'warning',
    level: '警告',
    confidence: 89.3,
    progress: 40,
    stage: 2,
    riskPoint: { x: 28, y: 73, warning: true },
    decision: '消防通道被杂物阻塞，影响疏散效率。建议通知物业清理并安排巡检机器人复查。',
    plan: ['创建物业清理工单', '通知楼宇管理员', '标记疏散路径风险', '巡检机器人复查'],
    ai: [
      { name: '通道堵塞', value: 89.3 },
      { name: '通行宽度不足', value: 84.0 },
      { name: '人员聚集', value: 31.5 },
      { name: '误报排除', value: 80.7 },
    ],
    devices: [
      { name: '工单系统', desc: '物业维修', status: 'running', label: '已创建' },
      { name: '巡检机器人', desc: 'A区 2号楼', status: 'pending', label: '待派发' },
    ],
    notify: [
      { name: '王磊', desc: '物业经理 · App', status: 'running', label: '待确认' },
      { name: '孙雨', desc: '楼宇管理员 · 短信', status: 'pending', label: '待发送' },
    ],
    logs: ['识别到楼梯间通道被占用', '系统生成物业清理建议', '等待管理员确认工单'],
  },
  {
    id: 'E-005',
    type: '设备离线',
    location: 'D区 · 电梯间',
    device: 'CAM-D02 / EDGE-D02',
    time: '10:20:33',
    severity: 'normal',
    level: '一般',
    confidence: 76.4,
    progress: 100,
    stage: 4,
    riskPoint: { x: 71, y: 64, warning: true },
    decision: '监控设备短时离线后恢复。系统已通知运维团队检查网络链路，并记录设备健康状态。',
    plan: ['记录设备健康事件', '通知运维检查', '恢复监控流', '关闭告警'],
    ai: [
      { name: '视频流中断', value: 76.4 },
      { name: '网络抖动', value: 69.2 },
      { name: '设备恢复', value: 93.0 },
      { name: '风险影响', value: 28.6 },
    ],
    devices: [
      { name: '摄像头', desc: 'CAM-D02', status: 'done', label: '已恢复' },
      { name: '运维工单', desc: '网络检查', status: 'done', label: '已创建' },
    ],
    notify: [
      { name: '刘洋', desc: '运维工程师 · 工单', status: 'done', label: '已接收' },
    ],
    logs: ['检测到视频流离线 52 秒', '设备自动恢复上线', '生成运维巡检工单'],
  },
];

export function cloneEvents(source = initialEvents) {
  return structuredClone(source);
}

export function advanceEvent(event) {
  if (event.stage < stageNames.length - 1) {
    event.stage += 1;
    event.progress = Math.min(100, event.progress + 22);
    const pendingDevice = event.devices.find((device) => device.status === 'pending');
    if (pendingDevice) {
      pendingDevice.status = 'running';
      pendingDevice.label = '执行中';
    }
    const pendingContact = event.notify.find((person) => person.status === 'pending');
    if (pendingContact) {
      pendingContact.status = 'running';
      pendingContact.label = '已推送';
    }
    event.logs.unshift(`${stageNames[event.stage]}已启动，系统等待回执`);
  } else {
    event.progress = 100;
    event.devices.forEach((device) => {
      if (device.status !== 'failed') {
        device.status = 'done';
        device.label = '完成';
      }
    });
    event.notify.forEach((person) => {
      if (person.status !== 'failed') {
        person.status = 'done';
        person.label = '已确认';
      }
    });
    event.logs.unshift('事件已进入复查闭环');
  }
  return event;
}

export function notifyAll(event) {
  event.notify.forEach((person) => {
    if (person.status === 'pending') {
      person.status = 'running';
      person.label = '已催办';
    }
  });
  event.logs.unshift('值班员发起一键催办，通知 App/短信/电话通道同步触达');
  return event;
}

export function confirmFromMobile(event) {
  if (event.notify[0]) {
    event.notify[0].status = 'done';
    event.notify[0].label = '已确认';
  }
  event.logs.unshift('手机端值班人员已确认事件并留痕');
  return event;
}

export function resetEvent(events, source, id) {
  const index = events.findIndex((event) => event.id === id);
  const original = source.find((event) => event.id === id);
  if (index === -1 || !original) return undefined;
  events[index] = structuredClone(original);
  return events[index];
}

export function getAnalytics(events) {
  const severity = { critical: 0, warning: 0, normal: 0 };
  const stageCounts = new Map(stageNames.map((name) => [name, 0]));
  const areaCounts = new Map();
  let deviceTotal = 0;
  let deviceActive = 0;
  let notifyTotal = 0;
  let notifyTouched = 0;
  let confidenceTotal = 0;

  events.forEach((event) => {
    severity[event.severity] += 1;
    stageCounts.set(stageNames[event.stage], (stageCounts.get(stageNames[event.stage]) || 0) + 1);
    const area = event.location.split('·')[0].trim();
    areaCounts.set(area, (areaCounts.get(area) || 0) + 1);
    confidenceTotal += event.confidence;
    deviceTotal += event.devices.length;
    deviceActive += event.devices.filter((device) => ['done', 'running'].includes(device.status)).length;
    notifyTotal += event.notify.length;
    notifyTouched += event.notify.filter((person) => ['done', 'running'].includes(person.status)).length;
  });

  const totalEvents = events.length;
  const processingEvents = events.filter((event) => event.progress < 100).length;
  const closedEvents = totalEvents - processingEvents;

  return {
    totalEvents,
    severity,
    processingEvents,
    closedEvents,
    averageProgress: Math.round(events.reduce((sum, event) => sum + event.progress, 0) / totalEvents),
    averageConfidence: Number((confidenceTotal / totalEvents).toFixed(1)),
    linkage: {
      total: deviceTotal,
      active: deviceActive,
      rate: Math.round((deviceActive / deviceTotal) * 100),
    },
    notification: {
      total: notifyTotal,
      touched: notifyTouched,
      rate: Math.round((notifyTouched / notifyTotal) * 100),
    },
    stageDistribution: Array.from(stageCounts.entries()).map(([name, count]) => ({
      name,
      count,
      rate: totalEvents ? Math.round((count / totalEvents) * 100) : 0,
    })),
    areaDistribution: Array.from(areaCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
        rate: totalEvents ? Math.round((count / totalEvents) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count),
  };
}
