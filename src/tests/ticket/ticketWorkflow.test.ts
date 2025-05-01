
import { moveToNextStatus } from '../../lib/ticket/ticketStatusService';

// Simple tests for the ticket workflow
test('moveToNextStatus advances pending to processing', () => {
  const ticket = { id: '1', status: 'pending' };
  const result = moveToNextStatus(ticket);
  expect(result.status).toBe('processing');
});

test('moveToNextStatus advances processing to ready', () => {
  const ticket = { id: '1', status: 'processing' };
  const result = moveToNextStatus(ticket);
  expect(result.status).toBe('ready');
});

test('moveToNextStatus advances ready to delivered', () => {
  const ticket = { id: '1', status: 'ready' };
  const result = moveToNextStatus(ticket);
  expect(result.status).toBe('delivered');
});

test('moveToNextStatus does not change delivered status', () => {
  const ticket = { id: '1', status: 'delivered' };
  const result = moveToNextStatus(ticket);
  expect(result.status).toBe('delivered');
});

test('moveToNextStatus does not change canceled status', () => {
  const ticket = { id: '1', status: 'canceled' };
  const result = moveToNextStatus(ticket);
  expect(result.status).toBe('canceled');
});
