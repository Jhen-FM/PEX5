import fetch from 'node-fetch';

test('GET /api/items retorna lista de itens', async () => {
  const res = await fetch('http://localhost:3000/api/items');
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
});
