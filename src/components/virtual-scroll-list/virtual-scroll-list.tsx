import { Watch, Element, State, Prop, Component, h } from '@stencil/core';
import { VNode, ChildType } from '@stencil/core/internal/index';

/**
 * the parent should the style of this component, including
 *   - width
 *   - height
 *   - display
 * */
@Component({
  tag: 'virtual-scroll-list',
  styleUrl: 'virtual-scroll-list.scss',
  scoped: true,
})
export class VirtualScrollList {
  @Element()
  host!: HTMLElement;

  @State()
  container?: HTMLElement;

  @Prop({ mutable: true })
  itemCount!: number;

  @Prop()
  renderItem!: (i: number) => ChildType | Promise<ChildType> | ChildType[] | Promise<ChildType[]> | Promise<ChildType>[];

  @Prop({ mutable: true })
  itemWidth!: number;

  @Prop({ mutable: true })
  estimatedItemHeight!: number;

  @Prop({ mutable: true })
  itemHeights!: number[];

  @State()
  scrollTop: number = 0;

  @State()
  totalHeight = 1;

  @Watch('itemHeights')
  @Watch('estimatedItemHeight')
  updateTotalHeight() {
    let totalHeight = 0;
    for (let i = 0; i < this.itemCount; i++) {
      totalHeight += this.itemHeights[i] || this.estimatedItemHeight;
    }
    this.totalHeight = totalHeight;
  }

  scrollListener = (_ev: Event) => {
    this.scrollTop = this.host.scrollTop;
  };

  connectedCallback() {
    this.host.addEventListener('scroll', this.scrollListener);
    this.updateTotalHeight();
  }

  disconnectedCallback() {
    this.host.removeEventListener('scroll', this.scrollListener);
  }

  getFirstRowInView(scrollTop: number) {
    let accHeight = 0;
    let i = 0;
    let n = this.itemCount;
    let heights = this.itemHeights;
    let estimatedItemHeight = this.estimatedItemHeight;
    for (; i < n; i++) {
      let itemHeight = heights[i] || estimatedItemHeight;
      if (scrollTop >= accHeight + itemHeight) {
        break;
      }
      accHeight += itemHeight;
    }
    return { firstRow: i, accHeight };
  }

  render() {
    let W = this.host.clientWidth;
    let H = this.host.clientHeight;
    let heights = this.itemHeights;
    let estimatedItemHeight = this.estimatedItemHeight;
    let N = this.itemCount;
    let scrollTop = this.scrollTop;


    let children: VNode[] = [];
    let accHeight = 0;
    for (let i = 0; i < N; i++) {
      let itemHeight = heights[i] || estimatedItemHeight;
      if (scrollTop > accHeight + itemHeight) {
        accHeight += itemHeight;
        continue; // this item is above the viewport
      }
      if (scrollTop + H < accHeight) {
        break; // this item is below the viewport
      }
      let x = 0;
      let y = accHeight;
      children.push(<div
        class='item'
        style={{
          transform: `translate(${x}px,${y}px)`,
          width: this.itemWidth + 'px',
          height: itemHeight + 'px',
        }}>
        {this.renderItem(i)}
      </div>);
      accHeight += itemHeight;
    }

    return [
      <div
        // to capture scroll action
        class="scroller"
        style={{
          height: this.totalHeight + 'px',
          width: W + 'px',
        }}
      />,
      <div
        // to display payload
        class="item-container"
        style={{
          // paddingTop: this.scrollTop - offsetTop + 'px',
          height: this.totalHeight + 'px',
          left: -W + 'px',
        }}
        ref={el => (this.container = el)}
      >
        {children}
      </div>,
    ];
  }

}
