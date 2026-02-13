export async function checkValues(val1: string, val2: string): Promise<{ result: string }> {
    const response = await fetch('http://127.0.0.1:8080/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ val1, val2 })
    });
    return await response.json();
};