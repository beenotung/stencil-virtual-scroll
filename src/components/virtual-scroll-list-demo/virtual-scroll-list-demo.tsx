import { Component, h, Host } from '@stencil/core';

const N = 100;
const width = 450;
const height = 50;
const heights = Array(N).fill(height)
  .map(height => Math.floor(height * (1 + Math.random() * 2)));
const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
];

@Component({
  tag: 'virtual-scroll-list-demo',
  styleUrl: 'virtual-scroll-list-demo.css',
  scoped: true,
})
export class VirtualScrollListDemo {

  renderItem(i: number) {
    let color = colors[i % colors.length];
    let height = heights[i];
    return <div style={{
      width: width + 'px',
      height: height + 'px',
      outline: '1px solid ' + color,
      // backgroundColor: color,
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
      }}>{i}</div>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
      }}>{i}</div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
      }}>{i}</div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
      }}>{i}</div>
    </div>;
  }

  render() {
    console.log(heights);
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
