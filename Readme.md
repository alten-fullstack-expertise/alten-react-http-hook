# Alten React useHttpHook

This package provides an easy way to manage the state from Promises (with http requests in mind) using a single hook.
It provides an easy way to cache results in either local, or session storage for increased performance.
Use the dependency array to trigger a new http/promise request, just like you're used to with useState!

## Examples

Most minimal use
```tsx
import React from "react";
import { useHttpHook } from "alten-react-http-hook";

const getTodos = async () => {
    return yourHttpLib.get(`/todos`);
}

function App() {
    
    const { result, error, loading } = useHttpHook(getTodos);

    if (loading) return <p>loading...</p>
    
    return (
        <div className="App">
            { result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
        </div>
    );
}
```

With types and typechecking
```tsx
import React from "react";
import { useHttpHook } from "alten-react-http-hook";

interface Todo {
    userId: number;
    id: number;
    title:string;
    completed: boolean;
}

const isATodo = (obj: any): obj is Todo => {
    return 'id' in obj && 'message' in obj;
}

const getTodos = async (): Promise<Todo[]> => {
    return yourHttpLib.get(`/todos`);
}

function App() {
    // The first param is the http request (or any other promise), the second param is an object with configuration.
    const { result, error, loading } = useHttpHook<Todo[]>(() => getTodos(), {typeCheck: isATodo});

    if (loading) return <p>loading...</p>
    
    return (
        <div className="App">
            { result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
        </div>
    );
}
```

With caching
```tsx
import React from "react";
import { useHttpHook } from "alten-react-http-hook";

interface Todo {
    userId: number;
    id: number;
    title:string;
    completed: boolean;
}

const isATodo = (obj: any): obj is Todo => {
    return 'id' in obj && 'message' in obj;
}

const getTodos = async (): Promise<Todo[]> => {
    return yourHttpLib.get(`/todos`);
}

function App() {
    
    const { result, error, loading } = useHttpHook<Todo[]>(
        getTodos,
        {
            // Typecheck to see if result is a single todo. Will currently fail because we are getting a list of todos.
            typeCheck: isATodo,
            cache: {
                // Will cache result.
                cacheResult: true,
                // can be found in session or localstorage under this key.
                cacheKey: "todos",
                // If the storage is older than the current time + 20000 seconds, the result will be refetched.
                cacheExpires: 20000,
                // use local storage istead of session storage so the cache persists through app visits.
                useLocalStorage: true
            }
        });

    if (loading) return <p>loading...</p>
    
    return (
        <div className="App">
            { result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
        </div>
    );
}
```

Use onSuccess and onError to take action when a promise resolves.
If a typecheck fails, the onError will also run.
```tsx
import React from "react";
import { useHttpHook } from "alten-react-http-hook";

interface Todo {
    userId: number;
    id: number;
    title:string;
    completed: boolean;
}

const getTodos = async (id: number): Promise<Todo[]> => {
    return yourHttpLib.get(`/todos/${id}`);
}

function App() {
    
    const { result, error, loading } = useHttpHook<Todo[]>(
        () => getTodos(1),
        // Extra Configuration
        {
            // The result will be of Todo[]
            onSuccess: (result: Todo[]) => {
                console.log("The request succeeded, do whatever you want with the response.");
            },
            onError: () => {
                console.log("Failed! What now?");
            }
        }
    );

    if (loading) return <p>loading...</p>
    
    return (
        <div className="App">
            { result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
        </div>
    );
}
```

Now let's combine everything we've seen, and add a dependency array for automatic reloads. 
```tsx
import React from "react";
import { useHttpHook } from "alten-react-http-hook";

interface Todo {
    userId: number;
    id: number;
    title:string;
    completed: boolean;
}

const isATodo = (obj: any): obj is Todo => {
    return 'id' in obj && 'message' in obj;
}

const getTodos = async (): Promise<Todo[]> => {
    return yourHttpLib.get(`/todos`);
}
const getTodoById = async (id: number): Promise<Todo> => {
    return yourHttpLib.get(`/todos/${id}`);
}

function App() {
    
    const [id, setId] = useState<number>(1);
    const todos = useHttpHook<Todo[]>(
        getTodos,
        {
            cache: {
                // Will cache result.
                cacheResult: true,
                // can be found in session or localstorage under this key.
                cacheKey: "todos",
                // If the storage is older than the current time + 20000 seconds, the result will be refetched.
                cacheExpires: 20000,
                // use local storage istead of session storage so the cache persists through app visits.
                useLocalStorage: true
            }
        });
    // We add the id property to the dependency array, so that every time it changes we fetch the selected todo. 
    const todo = useHttpHook<Todo>(() => getTodo(id), {typeCheck: isATodo}, [id]);

    if (loading) return <p>loading...</p>
    
    return (
        <div className="App">
            { todos.result?.map( todo => {
                return (
                    // Every time we click on a todo, we load the todo details beacuse the id has been added to the dependency array.. 
                    <span key={todo.result?.id} onClick={() => setId(todo.id)}>
                        {todo.result?.title}
                    </span>
                )
            })}

            {/* Every time we click on t */}
            <div>
                {todo.result?.title}
            </div>
        </div>
    );
}
```
