const {Router} = require('express')
const Todo = require('../models/Todo')

const router = Router()

router.get('/', async (req, res) => {
    const todos = await Todo.find({}).lean()
    
    res.render('index', {
       title: 'Todos list',
       isIndex: true,
       todos
    })
})


router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create toto',
        isCreate: true,        
    })
})

router.post('/create', async (req, res) => {
    const todo = new Todo({
        title: req.body.title
    })

    await todo.save()
    res.redirect('/')
})


router.post('/complete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)


    todo.completed = true
    await todo.save()

    res.redirect('/')

})

module.exports = router