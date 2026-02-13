export function zalupa() {
    const btn = document.getElementById('debug_button');
    const label = document.getElementById('debug_text');

    btn.addEventListener('click', async () => {
        const val1 = document.getElementById('debug_input1').value;
        const val2 = document.getElementById('debug_input2').value;

        try {
            const response = await fetch('http://127.0.0.1:8080/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ val1, val2 })
            });

            const data = await response.json();
            label.innerText = data.result; // Обновляем текст лейбла
        } catch (error) {
            label.innerText = "Ошибка: Бэкенд не отвечает";
            console.error(error);
        }
    });
}