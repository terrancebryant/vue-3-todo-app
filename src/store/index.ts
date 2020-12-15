import { createStore } from 'vuex'
import { format } from 'date-fns'

interface Todo {
  id: number;
  description: string;
  isComplete: boolean ;
  createdAt: Date;
  completedAt: string;
}
interface TodoState {
  todos: Todo[];
}

export default createStore({
  state: {
    todos: Array<Todo>(),
  },
  mutations: {
    setTodo(state, todo: Todo): void {
      state.todos = [...state.todos, todo]
    },

    setTodoComplete(state, id: number): void {
      const item = state.todos.find((todo: Todo) => todo.id === id);
      if(item) {
        item.isComplete = true
        item.completedAt = format(new Date(), 'MM/dd/yyyy')
      }
      debugger;
    }
  },
  actions: {
    addTodo({commit}, newTodo): void {
      commit("setTodo", newTodo)
    },

    completeTodo({commit}, id: number): void {
      commit("setTodoComplete", id);
    }
  },
  modules: {
  }
})
