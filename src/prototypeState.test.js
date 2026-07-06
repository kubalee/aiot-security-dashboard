import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cloneEvents,
  advanceEvent,
  notifyAll,
  resetEvent,
  initialEvents,
  getAnalytics,
} from './prototypeState.js';

test('advanceEvent moves an active event to the next handling stage and writes an audit log', () => {
  const events = cloneEvents();
  const event = events.find((item) => item.id === 'E-001');
  const previousStage = event.stage;
  const previousProgress = event.progress;

  advanceEvent(event);

  assert.equal(event.stage, previousStage + 1);
  assert.ok(event.progress > previousProgress);
  assert.match(event.logs[0], /已启动/);
  const promotedDevice = event.devices.find((device) => device.name === '门禁系统');
  assert.equal(promotedDevice.status, 'running');
  assert.equal(promotedDevice.label, '执行中');
});

test('notifyAll marks pending contacts as reminded without losing confirmed contacts', () => {
  const events = cloneEvents();
  const event = events.find((item) => item.id === 'E-001');

  notifyAll(event);

  assert.equal(event.notify[0].status, 'done');
  assert.equal(event.notify[1].status, 'running');
  assert.equal(event.notify[2].label, '已催办');
  assert.match(event.logs[0], /一键催办/);
});

test('resetEvent restores a mutated event from the original fixture', () => {
  const events = cloneEvents();
  const event = events.find((item) => item.id === 'E-003');
  advanceEvent(event);
  notifyAll(event);

  const restored = resetEvent(events, initialEvents, 'E-003');

  assert.equal(restored.stage, 1);
  assert.equal(restored.progress, 25);
  assert.equal(events.find((item) => item.id === 'E-003'), restored);
});

test('getAnalytics summarizes event risk, response progress, linkage, notification, and area distribution', () => {
  const analytics = getAnalytics(cloneEvents());

  assert.equal(analytics.totalEvents, 5);
  assert.equal(analytics.severity.critical, 2);
  assert.equal(analytics.severity.warning, 2);
  assert.equal(analytics.severity.normal, 1);
  assert.equal(analytics.processingEvents, 3);
  assert.equal(analytics.closedEvents, 2);
  assert.equal(analytics.averageConfidence, 86.7);
  assert.equal(analytics.linkage.total, 14);
  assert.equal(analytics.linkage.active, 9);
  assert.equal(analytics.notification.total, 10);
  assert.equal(analytics.notification.touched, 7);
  assert.equal(analytics.stageDistribution.length, 5);
  assert.equal(analytics.areaDistribution[0].count, 2);
});
