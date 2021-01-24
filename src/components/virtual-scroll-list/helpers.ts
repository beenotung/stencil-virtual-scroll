export function getElementHeight(e: Element): number {
  return e.clientHeight || e.getBoundingClientRect().height
}
