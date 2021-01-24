import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'virtual-scroll-demo',
  styleUrl: 'virtual-scroll-demo.css',
  scoped: true
})
export class VirtualScrollDemo {

  render() {
    const width = 250
    const height = 150
    return (
      <Host>
        before
        <virtual-scroll
          itemCount={100000}
          renderItem={i => <img src={`https://via.placeholder.com/${width}x${height}/${i}`}/>}
          itemWidth={width}
          itemHeight={height}
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
