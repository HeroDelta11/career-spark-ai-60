export async function invokeFunction<T = any>(name: string, body: any): Promise<{ data?: T; error?: { message: string } }>{
  try {
    const res = await fetch(`/functions/v1/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: { message: text || `Request failed: ${res.status}` } };
    }
    const data = (await res.json()) as T;
    return { data };
  } catch (e: any) {
    return { error: { message: e?.message ?? 'Network error' } };
  }
}
