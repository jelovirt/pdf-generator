'use strict';

import _ from 'lodash';

export class Version {
  constructor(v) {
    this.version = v;
    this.tokens = _(v.split('.')).map(Number).value();
  }

  toString() {
    return this.version;
  }

  compareTo(other) {
    if (this.version === other.version) {
      return 0;
    } else {
      const n = Math.min(this.tokens.length, other.tokens.length)
      for (let i of _.range(n)) {
        if (this.tokens[i] > other.tokens[i]) {
          return 1;
        } else if (this.tokens[i] < other.tokens[i]) {
          return -1;
        }
      }
      if (this.tokens.length > n) {
        return 1;
      } else {
        return -1;
      }
    }
  }
}
