export async function auth() {
  return { user: { id: 'test_user_id' } }
}

export function getSession() {
  return { user: { id: 'test_user_id' } }
}

export const handlers = { GET: () => {}, POST: () => {} }
