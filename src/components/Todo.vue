<template>
  <div class="w-96 mx-auto box-border bg-white border-2 border-gray-100 shadow rounded-lg p-5">
    <h1 class="text-3xl">Todo Component</h1>
    <form v-on:submit.prevent="submitTodo">
        <input type="text" v-model="description"
        placeholder="What needs to be done?" 
        class="block appearance-none placeholder-gray-500 placeholder-opacity-100 border border-light-blue-400 rounded-md w-full py-3 px-4 text-gray-700 leading-5 focus:outline-none focus:ring-1 focus:ring-light-blue-300">
    </form>
    <ul  class="divide-y divide-gray-200 text-left leading-snug">
      <li v-for="todo in todos" :key="todo.id" :data-id="todo.id" :data-created="todo.createdAt" class="text-lg pt-3 pb-3 break-all flex items-center">
        <input type="checkbox" :checked="todo.isComplete" @change="completeTodo(todo)" class="transition mr-2 rounded-full h-6 w-6 border border-gray-300  checked:bg-blue-600 checked:border-transparent focus:outline-none"> 
        <div :class="{'line-through': todo.isComplete}" >{{todo.description}}</div>
      </li>
    </ul>
    <h1>{{itemsLeft}} </h1>

    <button class="mr-1 py-2 bg-green-500 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50" v-on:click="boom('ALL')">All</button>
    <button class="mr-1 py-2 bg-green-500 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50" v-on:click="boom('ACTIVE')">Active</button>
    <button class="mr-1 py-2 bg-green-500 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none disabled:opacity-50" v-on:click="boom('COMPLETED')">Completed</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore, ActionTypes, Todo } from "../store";
import { format } from 'date-fns'

enum FilterTypes {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export default defineComponent({
  name: 'Todo',

  props: {},

  setup() {
    const store = useStore();
    const description = ref('');
    const todoType = ref('ALL')

    const submitTodo = (): void => {
      if (!description.value) {
        return;
      }

      store.dispatch(ActionTypes.ADD_TODO, {description: description.value, isComplete: false, createdAt: format(new Date(), 'MM/dd/yyyy'), completedAt: ''})
      description.value = '';
    }

    const completeTodo = (todo: Todo): void => {
      store.dispatch(ActionTypes.COMPLETED_TODO, todo)
    }

    const todos = computed(() => {
      if(todoType.value === FilterTypes.ALL) {
        return store.state.todos
      } else if ( todoType.value === FilterTypes.COMPLETED) {
        return store.state.todos.filter(item => item.isComplete)
      } else if (todoType.value === FilterTypes.ACTIVE) {
        return store.state.todos.filter(item => !item.isComplete)
      }
    });

    const boom = (type: string): void => {
      todoType.value = type
    }



    const itemsLeft = computed(() => {
      const todos = store.state.todos;
      return `${todos.filter(item => !item.isComplete).length} items left`
    })

    onMounted(() => {
      store.dispatch(ActionTypes.GET_TODOS);
    })

    return {
      todos,
      description,
      submitTodo,
      completeTodo,
      itemsLeft,
      boom
    }
  }
});
</script>

<style scoped lang="scss">
</style>
