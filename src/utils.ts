export class Utils {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static classToObject(theClass: any): any {
    const excludeProperties = ['constructor', 'length', 'prototype', 'toJSON'];

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const final: any = {};

    if (typeof theClass === 'object') {
      return theClass;
    }

    // get any static functions or properties
    for (const name of Object.getOwnPropertyNames(theClass)) {
      if (!excludeProperties.includes(name)) {
        final[name] = theClass[name];
      }
    }

    return final;
  }
}
