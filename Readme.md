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
