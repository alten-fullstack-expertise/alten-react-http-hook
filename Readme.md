# Alten React useHttpHook

This package provides an easy way to manage the state from Promises (with http requests in mind) using a single hook.
It provides an easy way to cache results in either local, or session storage for increased performance.

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
            { todos.result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
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
            { todos.result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
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
            { todos.result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
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
            { todos.result?.map( todo => <span key={todo.id}>{todo.title}</span>)}
        </div>
    );
}
```

# Boilerplate for creating React npm packages with Typescript

This is a boilerplate project that can be used to create npm packages with Typescript.

It supports a minimum react version from 16.8 onwards.

Run the following commands to start developing + testing.

1. Installation: `npm run setup`
2. Development: `npm run ts-dev` to build and watch for Typescript changes
3. In a new terminal window run `npm run react-dev` to start the react demo project.

Changes to you `src/index.tsx` should be immediately visible in your example react demo application.

### Publish

To publish your new react package, follow the steps below.

1. In the project root run `npm run build`. This creates a build for both server side and client side projects.
2. In the project root, change the following data in the `package.json`: name, version, description. Make sure the name field is unique. No other NPM package can have that name.
3. If you are not logged in to npm, run the command ``npm login`` and enter your NPM credentials. If you have none, create an npm account on https://www.npmjs.com/
4. Finally, run `npm publish`

Congrats, your package has been published!
