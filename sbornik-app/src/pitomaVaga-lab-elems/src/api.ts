export async function checkMeasurement(data: {
    L: number,
    N: number,
    t: number,
    T_student: number,
    g_student: number
}): Promise<{ is_correct: boolean }> {
    const response = await fetch('http://127.0.0.1:8080/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function checkFullTable(measurements: any[]): Promise<{ results: boolean[] }> {
    const response = await fetch('http://127.0.0.1:8080/verify-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements })
    });
    return await response.json(); // Ожидаем массив [true, false, true...]
}