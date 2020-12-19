import { 
    createStore, 
    Store as VuexStore, 
    ActionTree, 
    ActionContext, 
    MutationTree,
    CommitOptions,
    DispatchOptions
 } from 'vuex'
import { format } from 'date-fns';


export interface Todo {
  id?: number;
  description: string;
  isComplete: boolean ;
  createdAt: string;
  completedAt: string;
}

interface TodoResponse {
  todo: {
    id: number;
    description: string;
    isComplete: boolean ;
    createdAt: string;
    completedAt: string;
  };
}

// ENUMS
export enum MutationTypes {
    SET_TODOS = "SET_TODOS",
    SET_TODO = "SET_TODO",
    COMPLETED_TODO = "COMPLETED_TODO"
}

export enum ActionTypes {
    GET_TODOS = "GET_TODOS",
    ADD_TODO = "ADD_TODO",
    COMPLETED_TODO = "COMPLETED_TODO"
}

// TYPES
export type State = { todos: Todo[] };

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
    [ActionTypes.GET_TODOS](
        { commit }: AugmentedActionContext,
    ): Promise<void>;

    [ActionTypes.ADD_TODO](
        { commit }: AugmentedActionContext,
        newtodo: Todo
    ): Promise<void>;

    [ActionTypes.COMPLETED_TODO](
        { commit }: AugmentedActionContext,
        payload: Todo
    ): void;
}

export type Mutations<S = State> = {
    [MutationTypes.SET_TODOS](state: S, payload: Todo[]): void;
    [MutationTypes.SET_TODO](state: S, payload: TodoResponse): void;
    [MutationTypes.COMPLETED_TODO](state: S, payload: Todo): void;
};

export type Store = Omit<
    VuexStore<State>,
    "commit" | "getters" | "dispatch"
> & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
        key: K,
        payload: P,
        options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
    dispatch<K extends keyof Actions>(
        key: K,
        payload?: Parameters<Actions[K]>[1],
        options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

const state: State = {
    todos: [],
};
const actions: ActionTree<State, State> & Actions = {

    async [ActionTypes.GET_TODOS]({ commit }) {
        const response = await fetch("/api/todos");
        const data = await response.json();
        commit(MutationTypes.SET_TODOS, data.todos);
    },

    async [ActionTypes.ADD_TODO]({ commit }, newTodo) {
        const resp = await fetch("/api/todos", {
            method: 'POST',
            body: JSON.stringify(newTodo)
        })
              
        const data = await resp.json()
        await commit(MutationTypes.SET_TODO, data)
    },

    async [ActionTypes.COMPLETED_TODO]({commit}, todo: Todo): Promise<void> {
        let putData;
        if (todo.isComplete) {
            putData = {todo: { isComplete: false, completedAt: ''}}
        } else {
            putData = {todo: { isComplete: true, completedAt: format(new Date(), 'MM/dd/yyyy')}}
        }

        const resp = await fetch(`api/todos/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify(putData)
        })

        const data = await resp.json()
      commit(MutationTypes.COMPLETED_TODO, data.todo);
    }
};

const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_TODOS](state: State, payload: Todo[]) {
        state.todos = payload
    },

    [MutationTypes.SET_TODO](state: State, payload: TodoResponse) {
        if (!state.todos) {
            state.todos = [payload.todo]
        } else {
            state.todos = [...state?.todos, payload.todo]
        }
    },

    [MutationTypes.COMPLETED_TODO](state: State, payload: Todo) {
        const item = state.todos.find((todo: Todo) => todo.id === payload.id);
        Object.assign(item, payload)
    }
}

export const store = createStore({
    state,
    actions,
    mutations
  
})

export function useStore() {
    return store as Store;
}
