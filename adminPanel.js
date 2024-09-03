const { Router } = require('express')
const router = Router()

router.get('/api/test', async (req, res) => {

    const html = `
    <html>
    <body>
        <h1>Привет, это страница теста</h1>
        <p>Текст на странице</p>
        <button onclick="alert('Кнопка нажата!')">Нажми меня</button>
    </body>
    </html>
    `;
    res.send(html);
})

module.exports = router