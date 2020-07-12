export class Utils {
  static deprecate(message: string) {
    Utils.emitWarning(message, 'DeprecationWarning');
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static classToObject(theClass: any): any {
    const excludeProperties = ['constructor', 'length', 'prototype', 'toJSON'];

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

    // // walk inherited classes for any static properties or functions
    // const inherited = Object.getPrototypeOf(theClass);
    // for (const name of Object.getOwnPropertyNames(inherited)) {
    //   if (!excludeProperties.includes(name)) {
    //     final[name] = inherited[name];
    //   }
    // }

    // // walk the prototype of the inherited class for any functions
    // for (const name of Object.getOwnPropertyNames(inherited.prototype)) {
    //   if (!excludeProperties.includes(name)) {
    //     final[name] = inherited.prototype[name];
    //   }
    // }

    // // walk the actual prototype for instance functions
    // for (const name of Object.getOwnPropertyNames(theClass.prototype)) {
    //   if (!excludeProperties.includes(name)) {
    //     final[name] = theClass.prototype[name];
    //   }
    // }

    // // walk any instance properties
    // const instance = new theClass();
    // for (const name of Object.getOwnPropertyNames(instance)) {
    //   final[name] = instance[name];
    // }

    return final;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private static emitWarning(message: string, type: string) {
    process.emitWarning(message, type);
  }
}
