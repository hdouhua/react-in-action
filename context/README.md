# react context

## when to use context

The main idea of using the context is to allow your components to access some global data and re-render when that global data is changed.

**You can hold inside the context**

- global state
- theme
- application configuration
- authenticated user name
- user settings
- preferred language
- a collection of services

On the other side, you should think carefully before deciding to use context in your application.

First, integrating the context adds complexity. Creating the context, wrapping everything in the provider, using the useContext() in every consumer — this increases complexity.

Secondly, adding context makes it more difficult to unit test the components. During unit testing, you would have to wrap the consumer components into a context provider. Including the components that are indirectly affected by the context — the ancestors of context consumers!


**3 steps to use context in react**

- create context

- provide context

- consume context
   - the first way to consume - hook useContext
   - the second way to consume - Consumer
