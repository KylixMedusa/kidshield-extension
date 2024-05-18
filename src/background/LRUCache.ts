// Defines a generic class LRUCache for a cache system implementing the LRU (Least Recently Used) cache eviction policy.
export class LRUCache<K, V> {
  // Maximum number of items the cache can hold.
  private readonly MAX: number;

  // Internal Map to store cache items with key-value pairs.
  private readonly cache: Map<K, V>;

  // Constructor to create an LRUCache object with a specific maximum size.
  constructor(_MAX: number) {
    if (typeof _MAX !== 'number') throw new Error('Please set cache max size');

    this.MAX = _MAX; // Sets the maximum size of the cache.
    this.cache = new Map(); // Initializes the cache.
  }

  // Retrieves the value associated with the key from the cache and refreshes its position to mark it as recently used.
  public get(key: K): V | undefined {
    const item = this.cache.get(key); // Attempts to get the item from the cache.

    if (item !== undefined) {
      // If the item exists, refresh its position in the cache.
      this.cache.delete(key); // Remove the item from its current position.
      this.cache.set(key, item); // Reinsert the item to mark it as recently used.
    }

    return item; // Return the retrieved item or undefined if not found.
  }

  // Checks if the cache contains an item associated with the specified key.
  public has(key: K): boolean {
    return this.cache.has(key); // Returns true if the key exists in the cache, false otherwise.
  }

  // Adds or updates an item in the cache with the provided key and value, applying LRU rules.
  public set(key: K, val: V): void {
    if (this.cache.has(key)) {
      // If the key already exists in the cache, remove it first to update its position.
      this.cache.delete(key);
    } else if (this.cache.size === this.MAX) {
      // If the cache is full, remove the least recently used item before adding the new one.
      this.cache.delete(this.first());
    }
    this.cache.set(key, val); // Insert the new item into the cache.
  }

  // Clears all items from the cache.
  public clear(): void {
    this.cache.clear();
  }

  // Helper method to get the first (least recently used) key in the cache.
  private first(): K {
    return this.cache.keys().next().value; // Returns the first key in the iterator of keys, which is the least recently used.
  }
}
