// Design and implement a data structure for Least Recently Used (LRU) cache. It should support the following operations: get and set.

// get(key) - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1.
// set(key, value) - Set or insert the value if the key is not already present. When the cache reached its capacity, 
// it should invalidate the least recently used item before inserting a new item.


// I will use a Doubly-Linked List to keep track of and remove the least recently used items.
// Least recently used items will be at the head of the list
// Whenever a get is performed for an item or it is updated, that item (or node) will be moved to
// the tail of the list.  
// This will allow us to maintain O(1) time for both setting items in the cache and removing items.
// I will also use a hash table to store key value pairs.  This will allow for O(1) time in getting
// any items.

// constructor
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.cache = {};
    this.head = null;
    this.tail = null;
};


LRUCache.prototype.get = function(key) {
    if (!(this.cache.hasOwnProperty(key))) {
        return -1;
    }
    // move the node to the tail of the linked list
    if (this.tail.key !== this.cache[key].key) {
        this.moveToTail(this.cache[key]);
    } 
    
    // return the value for the key
    return this.cache[key].value;
};


LRUCache.prototype.set = function(key, value) {
    if (this.cache.hasOwnProperty(key)) {
        this.cache[key].value = value;
        if (this.tail.key !== this.cache[key].key) {
            this.moveToTail(this.cache[key]);
        }
        return;
    }
  
    if (this.size === this.capacity) {
        this.removeHead();
        this.size--;
    }

    this.cache[key] = this.createNode(key, value);
    this.addToTail(this.cache[key]);
    this.size++;
    return;
    
};

LRUCache.prototype.createNode = function (key, value) {
    return {
        key: key,
        value: value,
        previous: null,
        next: null
    }
}

LRUCache.prototype.addToTail = function (node) {
    if (!this.head) {
        this.head = node;
        this.tail = node;
        return;
    }
    node.previous = this.tail;
    this.tail.next = node;
    this.tail = node;
    return;
}

LRUCache.prototype.removeHead = function () {
    var oldHead = this.head;
    if (this.head.key === this.tail.key) {
        this.head = null;
        this.tail = null;
        delete this.cache[oldHead.key];
        return;
    }
    
    this.head.next.previous = null;
    this.head = this.head.next;
    
    delete this.cache[oldHead.key];
    return;
}

LRUCache.prototype.moveToTail = function (node) {
    // if the node we're moving is the head,
    if (this.head.key === node.key) {
        node.next.previous = null;
        this.head = node.next;
        
    } else {
        node.previous.next = node.next;
        node.next.previous = node.previous;
    }
    node.previous = this.tail;
    node.next = null;
    this.tail.next = node;
    this.tail = node;
    return;
}