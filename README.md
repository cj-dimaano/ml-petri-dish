# ML Petri Dish

The purpose of this project is to demonstrate a very basic Artificial Neural Network with a
simplified simulation of a petri dish with a few bacteria acting as the AI agents, bubbles of
oxygen, and various food sources (proteins) for the bacteria.

# Build and Run

[Webpack](https://webpack.github.io/) is needed to transpile the code which depends on
[Node.JS](https://nodejs.org/).

Make sure you have Node.JS installed.

```
$ node -v
v8.1.4
```

```
$ npm -v
5.3.0
```
> If you do not have Node.JS installed, you can find it in the link above.

While in the project root directory, install project dependencies.

```
$ npm install
```

Build the project with Webpack.

```
$ npm run webpack
```

> Webpack will create a single `index.js` file in the project root directory.

Open `index.html` in the project root directory to see the simulation.

> Testing is exclusively performed on Google Chrome.

---

Created July 17, 2017 by CJ Dimaano
