import { Watch, Element, State, Prop, Component, h } from '@stencil/core';
import { VNode } from '@stencil/core/dist/declarations';

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
  renderItem!: (i: number) => VNode;

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
  @Watch('generator')
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

    // let child = this.container.children.item(0);
    // if (!child) {
    //   return this.renderMeasure();
    // }
    // this.itemWidth = child.clientWidth;
    // this.itemHeight = child.clientHeight;

    // create item in visible viewport
    let offsetTop = this.scrollTop % itemHeight;
    let W = this.host.clientWidth;
    let H = this.host.clientHeight;
    let nCol = Math.floor(W / itemWidth);
    // total number of row for all items, for scrollbar height
    let totalNRow = Math.ceil(this.itemCount / nCol);
    let nRowBefore = Math.floor(this.scrollTop / itemHeight);
    // maximum number of row to be displayed
    let nRow = Math.ceil(H / itemHeight);

    // left over space in the viewport after last complete item
    let usedSpace: number = nRow * itemHeight - offsetTop;
    if (usedSpace < H) {
      nRow++;
    }

    let itemFrom = nRowBefore * nCol;
    let itemTo = Math.min(this.itemCount, itemFrom + nCol * nRow);
    let iCol = 0;
    let iRow = 0;
    let children: VNode[] = new Array(itemTo - itemFrom + 1);
    for (let i = itemFrom; i < itemTo; i++) {
      let x = itemWidth * iCol;
      let y = itemHeight * iRow;
      let slot = i % (nCol * Math.ceil(H / itemHeight + 1));
      let child = (
        <div
          class="item"
          style={{
            transform: `translate(${x}px,${y}px)`,
            width: this.itemWidth + 'px',
            height: this.itemHeight + 'px',
          }}
        >
          {this.renderItem(i)}
        </div>
      );
      children[slot] = child;
      iCol++;
      if (iCol === nCol) {
        iCol = 0;
        iRow++;
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
            paddingTop: this.scrollTop - offsetTop + 'px',
            height: totalNRow * itemHeight + 'px',
            left: -W + 'px',
          }}
          ref={el => (this.container = el)}
        >
          {children}
        </div>
    ]
  }
}
