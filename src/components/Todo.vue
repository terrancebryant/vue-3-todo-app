<template>
  <div class="hello">
    <h1>Todo Component</h1>
    <form v-on:submit.prevent="submitTodo">
        <input type="text" v-model="description">
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id" :data-id="todo.id" :data-created="todo.createdAt">
        <input type="checkbox" :checked="todo.isComplete" @change="completeTodo(todo.id)"> {{todo.description}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { format } from 'date-fns'

export default defineComponent({
  name: 'Todo',

  props: {},

  setup() {
    const store = useStore();

    const description = ref(null);

    const generateId = (): number => {
      return store.state.todos.length + 1
    }

    const submitTodo = (): void => {
      if (!description.value) {
        return;
      }

      store.dispatch("addTodo", {id: generateId(), description: description.value, isComplete: false, createdAt: format(new Date(), 'MM/dd/yyyy')})
      description.value = null;
    }

    const completeTodo = (todoId: number) => {
      store.dispatch("completeTodo", todoId)
    }

    return {
      todos: computed(() => store.state.todos),
      description,
      submitTodo,
      completeTodo,
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
