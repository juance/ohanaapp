
// Fix comma errors in test file
test('it should correctly map database status to simplified status', () => {
  expect(mapToSimplifiedStatus('delivered')).toBe('DELIVERED');
  expect(mapToSimplifiedStatus('ready')).toBe('PENDING');
  expect(mapToSimplifiedStatus('processing')).toBe('PENDING');
  expect(mapToSimplifiedStatus('pending')).toBe('PENDING');
});

test('it should correctly map simplified status to database status', () => {
  expect(mapToDatabaseStatus('DELIVERED')).toBe('delivered');
  expect(mapToDatabaseStatus('PENDING')).toBe('ready'); // Default pending status is 'ready'
  expect(mapToDatabaseStatus('PENDING', 'processing')).toBe('processing'); // Preserves current pending status
  expect(mapToDatabaseStatus('PENDING', 'delivered')).toBe('ready'); // Invalid current status defaults to 'ready'
});
