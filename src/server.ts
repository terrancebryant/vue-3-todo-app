import { createServer, Model, Factory, RestSerializer } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
    const server = createServer({
        environment,

        models: {
            todo: Model.extend({}),
        },

        serializers: {
            todo: RestSerializer.extend({}),
        },

        factories: {
            todo: Factory.extend({
                id: '1',
            
                description(i: number): string {
                    return `Todo item-${i}`
                },

                isComplete: false,
            }),
        },

        routes() {
            this.namespace = "api"

            this.get("/todos", (schema) => {
                return schema.all("todo")
            })

            this.post("/todos", (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                return schema.create("todo", attrs);
            });

            this.put("/todos/:id")
        },

        seeds(server) {
            server.createList("todo", 3)
        },
    });

  return server;
}