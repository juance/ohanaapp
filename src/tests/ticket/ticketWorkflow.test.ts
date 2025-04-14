
// Fix comma errors in test file
test('It should transition from pending to processing', () => {
  const ticket = { id: '1', status: 'pending' };
  const newTicket = moveToNextStatus(ticket);
  expect(newTicket.status).toBe('processing');
});

test('It should transition from processing to ready', () => {
  const ticket = { id: '1', status: 'processing' };
  const newTicket = moveToNextStatus(ticket);
  expect(newTicket.status).toBe('ready');
});
