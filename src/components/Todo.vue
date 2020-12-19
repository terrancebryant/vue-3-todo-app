<template>
  <div class="hello">
    <h1>Todo Component</h1>
    <form v-on:submit.prevent="submitTodo">
        <input type="text" v-model="description">
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id" :class="{done: todo.isComplete}" :data-id="todo.id" :data-created="todo.createdAt">
        <input type="checkbox" :checked="todo.isComplete" @change="completeTodo(todo)"> {{todo.description}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore, MutationTypes, ActionTypes, Todo } from "../store";
import { format } from 'date-fns'

export default defineComponent({
  name: 'Todo',

  props: {},

  setup() {
    const store = useStore();
    const description = ref('');

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

    onMounted(() => {
      store.dispatch(ActionTypes.GET_TODOS);
    })

    return {
      todos: computed(() => store.state.todos),
      description,
      submitTodo,
      completeTodo,
    }
  }
});
</script>

<style scoped lang="scss">
</style>
