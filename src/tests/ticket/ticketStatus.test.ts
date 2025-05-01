
import { TICKET_STATUS } from '@/lib/constants/appConstants';

// Import functions from the module we want to test
import { mapToSimplifiedStatus, mapToDatabaseStatus, moveToNextStatus } from '@/lib/ticket/ticketStatusService';

// Test mapToSimplifiedStatus function
test('mapToSimplifiedStatus should simplify pending status', () => {
  expect(mapToSimplifiedStatus('pending')).toBe('PENDING');
});

test('mapToSimplifiedStatus should simplify processing status', () => {
  expect(mapToSimplifiedStatus('processing')).toBe('PENDING');
});

test('mapToSimplifiedStatus should simplify ready status', () => {
  expect(mapToSimplifiedStatus('ready')).toBe('READY');
});

test('mapToSimplifiedStatus should simplify delivered status', () => {
  expect(mapToSimplifiedStatus('delivered')).toBe('DELIVERED');
});

// Test mapToDatabaseStatus function
test('mapToDatabaseStatus should convert PENDING to ready', () => {
  expect(mapToDatabaseStatus('PENDING')).toBe('ready');
});

test('mapToDatabaseStatus should preserve specific pending status', () => {
  expect(mapToDatabaseStatus('PENDING', 'processing')).toBe('processing');
});

test('mapToDatabaseStatus should convert DELIVERED to delivered', () => {
  expect(mapToDatabaseStatus('DELIVERED')).toBe('delivered');
});

test('mapToDatabaseStatus should convert CANCELLED to canceled', () => {
  expect(mapToDatabaseStatus('CANCELLED')).toBe('canceled');
});
