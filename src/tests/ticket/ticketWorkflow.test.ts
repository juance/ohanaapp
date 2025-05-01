
import { TICKET_STATUS } from '@/lib/constants/appConstants';

// Import functions from the module we want to test
import { moveToNextStatus } from '@/lib/ticket/ticketStatusService';

// Test moveToNextStatus function
test('moveToNextStatus should move from pending to processing', () => {
  const ticket = { id: '1', status: 'pending' };
  const updatedTicket = moveToNextStatus(ticket);
  expect(updatedTicket.status).toBe('processing');
});

test('moveToNextStatus should move from processing to ready', () => {
  const ticket = { id: '1', status: 'processing' };
  const updatedTicket = moveToNextStatus(ticket);
  expect(updatedTicket.status).toBe('ready');
});

test('moveToNextStatus should move from ready to delivered', () => {
  const ticket = { id: '1', status: 'ready' };
  const updatedTicket = moveToNextStatus(ticket);
  expect(updatedTicket.status).toBe('delivered');
});

test('moveToNextStatus should not change delivered status', () => {
  const ticket = { id: '1', status: 'delivered' };
  const updatedTicket = moveToNextStatus(ticket);
  expect(updatedTicket).toBe(ticket); // Should return the same ticket object
});
