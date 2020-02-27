Page({
  data: {
    input: '',
    todos: [],
    logs: [],
    leftCount: 0,
    allCompleted: false
  },

  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },

  load: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todos: todos, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },

  onLoad: function () {
    this.load()
  },
  inputChangeHandle: function(e) {
    this.setData({ input: e.detail.value });
  },

  addToDohandle: function(e) {
    var input = this.data.input;
    if(!input || !input.trim()) return;
    var todos = this.data.todos;
    var logs = this.data.logs;
    todos.push({ name: input, completed: false });
    logs.push({ timestamp: new Date(), action: 'Add', name: this.data.input });
    console.log('todos', todos);

    this.setData({
      input: '',
      todos: todos,
      logs: logs,
      leftCount: this.data.leftCount + 1,
    })
    this.save()
  },

  toggleTodoHandle: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log('e', e)
    var todos = this.data.todos;
    todos[index].completed = !todos[index].completed;

    var logs = this.data.logs;
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'finsh' : 'Restart',
      name: todos[index].name
    })

    this.setData({
      todos,
      logs,
      leftCount: this.data.completed + (todos[index].completed ? -1 : 1)
    })
    this.save()
  },

  toggleAllHandle: function(e) {
    this.data.allCompleted = !this.data.allCompleted;
    var todos = this.data.todos;
    var logs = this.data.logs;

    for (var i = 0; i < todos.length; i ++) {
      todos[i].completed = this.data.allCompleted;
    }
    logs.push({
      timestamp:new Date(),
      action: this.data.allCompleted ? 'Finsh' :'Restar',
      name: 'All todos'
    })
    this.setData({
      todos,
      logs,
      leftCount: this.data.allCompleted ? 0 : todos.length
    })
    this.save()
  },

  clearCompletedHandle: function(e) {
    var todos = this.data.todos;
    var remains = [];
    var logs = this.data.logs;
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({
      todos: remains,
      logs
    })
    this.save()
  }
})