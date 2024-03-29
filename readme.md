# stencil-virtual-scroll

virtual-scroll typed web component that only render visible items on the DOM

Demo: https://virtual-scroll-demo.surge.sh

[![npm Package Version](https://img.shields.io/npm/v/stencil-virtual-scroll.svg?maxAge=2592000)](https://www.npmjs.com/package/stencil-virtual-scroll)
![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

## Why yet another virtual-scroll component?
1. The `ion-virtual-scroll` is only documented for Angular;
   not supported for react;
   undocumented and untyped for Javascript/Typescript (without framework)
2. The `ion-virtual-scroll` for Javascript doesn't allow content before / after it.
   i.e. It will occupy the entire page.
   (Workaround exist when providing `renderHeader` and `renderFooter` but still limiting the comsumer component structure)
3. The `ion-virtual-scroll` scroll height is not correct.
   The content height grow as you scroll, resulting 'endless list' feeling.

##### But why naming it stencil-virtual-scroll?
~~Because virtual-scroll is already occupied on npm.~~

Using this name for now in case people search for stencil style (typed) web component library.

Might rename it when better idea comes in. Welcome suggestions.

## Features
- [x] Auto places items based on their size.
- [x] Support multiple columns in a row if the item width is smaller than the half of container width
- [x] Allow parent to instruct the container to re-render when updated
- [x] Allow lazy loading items instead of constructing a huge array
- [x] Written in Typescript

## Components Properties
- [virtual-scroll](./src/components/virtual-scroll/readme.md)
- [virtual-scroll-list](./src/components/virtual-scroll-list/readme.md)

## Examples with typed hints on Props
Below shows some usage examples of <virtual-scroll> and <virtual-scroll-list>.

Details refer to:
- [stencil-virtual-scroll-demo](./src/components/stencil-virtual-scroll-demo)

### Using <virtual-scroll> for fixed-size cells in grid view:

```typescript jsx
import 'stencil-virtual-scroll'; // still need to import the library (js)

@Component({
  tag: 'virtual-scroll-demo',
  styleUrl: 'virtual-scroll-demo.css',
  scoped: true,
})
export class VirtualScrollDemo {

  render() {
    return (
      <div>
        before
        <virtual-scroll
          itemCount={100000}
          renderItem={i => <img src={`https://via.placeholder.com/600/${i}`}/>}
          itemWidth={48}
          itemHeight={48}
          style={{
            display: 'block',
            width: '100%',
            height: '450px',
            maxHeight: '80vh',
            outline: 'blue solid 1px',
          }}
        />
        after
      </div>
    );
  }

}
```

Details refer to:
- [virtual-scroll-demo](./src/components/virtual-scroll-demo)

### Using <virtual-scroll-list> for vary-height items in list view:

```typescript jsx
import { Component, h, Host } from '@stencil/core';

const N = 100;
const width = 450;
const height = 50;
const heights = Array(N).fill(height)
  .map(height => Math.floor(height * (1 + Math.random() * 2)));

@Component({
  tag: 'virtual-scroll-list-demo',
  styleUrl: 'virtual-scroll-list-demo.css',
  scoped: true,
})
export class VirtualScrollListDemo {

  renderItem(i: number) {
    let height = heights[i];
    return <div style={{
      width: '450px',
      height: height + 'px',
      outline: '1px solid purple',
      position: 'relative',
    }}>
      {i}
    </div>;
  }

  render() {
    return (
      <Host>
        before
        <virtual-scroll-list
          itemCount={N}
          renderItem={i => this.renderItem(i)}
          itemWidth={width}
          itemHeights={heights}
          estimatedItemHeight={height}
          style={{
            display: 'block',
            width: '100%',
            height: '450px',
            maxHeight: '80vh',
            outline: 'blue solid 1px',
          }}
        />
        after
      </Host>
    );
  }

}

```

Details refer to:
- [virtual-scroll-list-demo](./src/components/virtual-scroll-list-demo)

## About Stencil

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

## Getting Started

To develop this web component using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/beenotung/stencil-virtual-scroll.git
cd stencil-virtual-scroll
```

and run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

Need help? Check out our docs [here](https://stenciljs.com/docs/my-first-component).


## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.


## Using this component

The web component is published on npm as https://www.npmjs.com/package/stencil-virtual-scroll.

There are three options to use web components built with Stencil.

### In a stencil-starter app (recommended)
- Run `npm install stencil-virtual-scroll --save`
- Add an import to the npm packages `import 'stencil-virtual-scroll';`
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules (need backend support)
- Run `npm install stencil-virtual-scroll --save`
- Put a script tag similar to this `<script src='node_modules/stencil-virtual-scroll/dist/stencil-virtual-scroll.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Script tag (easiest but depends on 3rd-party service)

- Put a script tag similar to this `<script src='https://unpkg.com/stencil-virtual-scroll@0.0.5/dist/stencil-virtual-scroll.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc
