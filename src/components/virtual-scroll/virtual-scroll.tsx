import { Watch, Element, State, Prop, Component, h, VNode } from '@stencil/core';
import { ChildType } from '@stencil/core/internal';

/**
 * the parent should the style of this component, including
 *   - width
 *   - height
 *   - display
 * */
@Component({
  tag: 'virtual-scroll',
  styleUrl: 'virtual-scroll.scss',
  scoped: true,
})
export class VirtualScroll {

  @Element()
  host!: HTMLElement;

  @State()
  container?: HTMLElement;

  @Prop({ mutable: true })
  tick?: any;

  @Prop({ mutable: true })
  itemCount!: number;

  @Prop()
  renderItem!: (i: number) => ChildType | Promise<ChildType>
    | ChildType[] | Promise<ChildType[]> | Promise<ChildType>[];

  @Prop({ mutable: true })
  itemWidth?: number;

  @Prop({ mutable: true })
  itemHeight?: number;

  @Prop()
  autoDetectSize?: boolean;

  @Prop()
  sameSize?: boolean;

  @State()
  detectedSize = false;

  @State()
  scrollTop: number = 0;

  scrollListener = (_ev: Event) => {
    this.scrollTop = this.host.scrollTop;
  };

  @Watch('itemCount')
  @Watch('renderItem')
  @Watch('itemWidth')
  @Watch('itemHeight')
  handlePropUpdate() {
    this.detectedSize = false;
  }

  connectedCallback() {
    this.host.addEventListener('scroll', this.scrollListener);
  }

  disconnectedCallback() {
    this.host.removeEventListener('scroll', this.scrollListener);
  }

  renderMeasure() {
    requestAnimationFrame(() => (this.tick = {}));
    return <div ref={el => (this.container = el)}>{this.renderItem(0)}</div>;
  }

  getItemDimension(): { itemWidth: number; itemHeight: number } | undefined {
    let itemWidth = this.itemWidth;
    let itemHeight = this.itemHeight;
    if (itemWidth && itemHeight) {
      return { itemWidth, itemHeight };
    }
    // obtain dimension from the dom
    if (!this.container) {
      return;
    }
    if (this.sameSize) {
      // obtain dimension from the first child
      let child = this.container.firstElementChild;
      if (!child) {
        return;
      }
      itemWidth = child.clientWidth;
      itemHeight = child.clientHeight;
    } else {
      // obtain max dimension from all children
      itemWidth = 0;
      itemHeight = 0;
      this.container.childNodes.forEach(child => {
        if (child instanceof HTMLElement) {
          itemWidth = Math.max(itemWidth!, child.clientWidth);
          itemHeight = Math.max(itemHeight!, child.clientHeight);
        }
      });
    }
    if (itemWidth && itemHeight) {
      if (this.autoDetectSize && !this.detectedSize) {
        requestAnimationFrame(() => {
          this.detectedSize = true;
        });
      }
      return { itemWidth, itemHeight };
    }
    // no children or child size is not establish yet
    return;
  }

  render() {
    let itemDimension = this.getItemDimension();
    if (!itemDimension) {
      return this.renderMeasure();
    }
    let { itemWidth, itemHeight } = itemDimension;
    let scrollTop = this.scrollTop;
    let W = this.host.clientWidth;
    let H = this.host.clientHeight;
    let N = this.itemCount;
    let nCol = Math.floor(W / itemWidth);
    // total number of row for all items, for scrollbar height
    let totalNRow = Math.ceil(N / nCol);
    let nRowBefore = Math.floor(scrollTop / itemHeight);
    // amount of non visible heights of first row above the viewport
    let offsetTop = scrollTop % itemHeight;
    // amount of rows in viewport
    let nRow = Math.ceil((H + offsetTop) / itemHeight);

    let children: VNode[] = [];
    main:
      for (let iRow = nRowBefore; iRow < nRowBefore + nRow; iRow++) {
        for (let iCol = 0; iCol < nCol; iCol++) {
          let i = iRow * nCol + iCol;
          if (i >= N) break main;
          let x = itemWidth * iCol;
          let y = itemHeight * iRow;
          children.push(<div
            class='item'
            style={{
              transform: `translate(${x}px,${y}px)`,
              width: itemWidth + 'px',
              height: itemHeight + 'px',
            }}>
            {this.renderItem(i)}
          </div>);
        }
      }

    return [
      <div
        // to capture scroll action
        class="scroller"
        style={{
          height: totalNRow * itemHeight + 'px',
          width: W + 'px',
        }}
      />,
      <div
        // to display payload
        class="item-container"
        style={{
          height: totalNRow * itemHeight + 'px',
          left: -W + 'px',
        }}
        ref={el => (this.container = el)}
      >
        {children}
      </div>,
    ];
  }
}
