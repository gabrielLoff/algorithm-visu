export class PriorityQueue<T> {
  private items: { data: T; priority: number }[] = [];

  push(data: T, priority: number): void {
    this.items.push({ data, priority });
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined;

    let minIdx = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (this.items[i].priority < this.items[minIdx].priority) {
        minIdx = i;
      }
    }

    const item = this.items[minIdx];
    this.items.splice(minIdx, 1);
    return item.data;
  }

  get length(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return this.items.map((item) => item.data);
  }
}
