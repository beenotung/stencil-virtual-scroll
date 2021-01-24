import { Component, Host, h, State } from '@stencil/core';

@Component({
  tag: 'stencil-virtual-scroll-demo',
  styleUrl: 'stencil-virtual-scroll-demo.css',
  shadow: true,
})
export class StencilVirtualScrollDemo {

  @State()
  mode = 'none';

  renderItem(props: { name: string, desc: string }) {
    return <p>
      <b>{props.name}</b>
      <span> ({props.desc})</span>
      <br />
      {this.mode === props.name
        ? <button onClick={() => this.mode = 'none'}>Hide Demo</button>
        : <button onClick={() => this.mode = props.name}>Show Demo</button>
      }
    </p>;
  }

  renderDemo() {
    if (this.mode === 'virtual-scroll') {
      return <div class='demo'>
        <virtual-scroll-demo />
      </div>;
    }
    if (this.mode === 'virtual-scroll-list') {
      return <div class='demo'>
        <virtual-scroll-list-demo />
      </div>;
    }
  }

  render() {
    return (
      <Host>
        <h1>
          stencil-virtual-scroll Demo
        </h1>
        {this.renderItem({ name: 'virtual-scroll', desc: 'fixed-size cells in grid view' })}
        {this.renderItem({ name: 'virtual-scroll-list', desc: 'vary-height items in list view' })}
        {this.renderDemo()}
      </Host>
    );
  }

}
