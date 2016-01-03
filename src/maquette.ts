/**
 * A virtual representation of a DOM Node. Maquette assumes that {@link VNode} objects are never modified externally.
 * Instances of {@link VNode} can be created using {@link module:maquette.h}.
 */
export interface VNode {
  /**
   * The CSS selector containing tagname, css classnames and id. An empty string is used to denote a text node.
   */
  vnodeSelector: string;
  /**
   * Object containing attributes, properties, event handlers and more @see module:maquette.h
   * @memberof VNode#
   */
  properties: VNodeProperties;
  /**
   * Array of VNodes to be used as children. This array is already flattened.
   * @memberof VNode#
   */
  children: Array<VNode>;
  /**
   * Used in a special case when a VNode only has one childnode which is a textnode. Only used in combination with children === undefined.
   */
  text: string;
  /**
   * Used by maquette to store the domNode that was produced from this {@link VNode}.
   */
  domNode: Node;
}

/**
 * Used to create and update the DOM.
 * Use {@link Projector#append}, {@link Projector#merge}, {@link Projector#insertBefore} and {@link Projector#replace}
 * to create the DOM.
 * The `renderMaquetteFunction` callbacks will be called immediately to create the DOM. Afterwards, these functions
 * will be called again to update the DOM on the next animation-frame after:
 *
 *  - The {@link Projector#scheduleRender} function  was called
 *  - An event handler (like `onclick`) on a rendered {@link VNode} was called.
 *
 * The projector stops when {@link Projector#stop} is called or when an error is thrown during rendering.
 * It is possible to use `window.onerror` to handle these errors.
 * Instances of {@link Projector} can be created using {@link module:maquette.createProjector}.
 */
export interface Projector {
  /**
   * Appends a new childnode to the DOM using the result from the provided `renderMaquetteFunction`.
   * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
   * @param {Element} parentNode - The parent node for the new childNode.
   * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
   */
  append(parentNode: Element, renderMaquetteFunction: () => VNode): void;
  /**
   * Inserts a new DOM node using the result from the provided `renderMaquetteFunction`.
   * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
   * @param {Element} beforeNode - The node that the DOM Node is inserted before.
   * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
   */
  insertBefore(beforeNode: Element, renderMaquetteFunction: () => VNode): void;
  /**
   * Merges a new DOM node using the result from the provided `renderMaquetteFunction` with an existing DOM Node.
   * This means that the virtual DOM and real DOM have one overlapping element.
   * Therefore the selector for the root {VNode} will be ignored, but its properties and children will be applied to the Element provided
   * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
   * @param {Element} domNode - The existing element to adopt as the root of the new virtual DOM. Existing attributes and childnodes are preserved.
   * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
   */
  merge(domNode: Element, renderMaquetteFunction: () => VNode): void;
  /**
   * Replaces an existing DOM node with the result from the provided `renderMaquetteFunction`.
   * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
   * @param {Element} domNode - The DOM node to replace.
   * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
   */
  replace(domNode: Element, renderMaquetteFunction: () => VNode): void;
  /**
   * Resumes the projector. Use this method to resume rendering after stop was called or an error occurred during rendering.
   */
  resume(): void;
  /**
   * Instructs the projector to re-render to the DOM at the next animation-frame using the registered `renderMaquette` functions.
   * This method is automatically called for you when event-handlers that are registered in the {@link VNode}s are invoked.
   * You need to call this method for instance when timeouts expire or AJAX responses arrive.
   */
  scheduleRender(): void;
  /**
   * Stops the projector. This means that the registered `renderMaquette` functions will not be called anymore.
   * Note that calling {@link Projector#stop} is not mandatory. A projector is a passive object that will get garbage collected
   * as usual if it is no longer in scope.
   */
  stop(): void;
}

export interface Transitions {
  enter: (element: Element, properties: VNodeProperties, enterAnimation: string) => void;
  exit: (element: Element, properties: VNodeProperties, exitAnimation: string, removeElement: () => void) => void;
};

export interface ProjectionOptions {
  transitions?: Transitions;
  /**
   * Only for internal use.
   */
  namespace: string;
  eventHandlerInterceptor: Function;
  styleApplyer: (domNode: HTMLElement, styleName: string, value: string) => void;
};

export interface VNodeProperties {
  enterAnimation?: ((element: Element, properties?: VNodeProperties) => void) | string;
  exitAnimation?: ((element: Element, removeElement: () => void, properties?: VNodeProperties) => void) | string;
  updateAnimation?: (element: Element, properties?: VNodeProperties, previousProperties?: VNodeProperties) => void;
  afterCreate?: (element: Element, projectionOptions: ProjectionOptions, vnodeSelector: string, properties: VNodeProperties,
    children: VNode[]) => void;
  afterUpdate?: (element: Element, projectionOptions: ProjectionOptions, vnodeSelector: string, properties: VNodeProperties,
    children: VNode[]) => void;
  key?: Object;
  classes?: {[index: string]: boolean};
  styles?: {[index: string]: string};

  // From Element
  ontouchcancel?: (ev?: TouchEvent) => boolean|void;
  ontouchend?: (ev?: TouchEvent) => boolean|void;
  ontouchmove?: (ev?: TouchEvent) => boolean|void;
  ontouchstart?: (ev?: TouchEvent) => boolean|void;
  // From HTMLFormElement
  action?: string;
  encoding?: string;
  enctype?: string;
  method?: string;
  name?: string;
  target?: string;
  // From HTMLElement
  onblur?: (ev?: FocusEvent) => boolean|void;
  onchange?: (ev?: Event) => boolean|void;
  onclick?: (ev?: MouseEvent) => boolean|void;
  ondblclick?: (ev?: MouseEvent) => boolean|void;
  onfocus?: (ev?: FocusEvent) => boolean|void;
  oninput?: (ev?: Event) => boolean|void;
  onkeydown?: (ev?: KeyboardEvent) => boolean|void;
  onkeypress?: (ev?: KeyboardEvent) => boolean|void;
  onkeyup?: (ev?: KeyboardEvent) => boolean|void;
  onload?: (ev?: Event) => boolean|void;
  onmousedown?: (ev?: MouseEvent) => boolean|void;
  onmouseenter?: (ev?: MouseEvent) => boolean|void;
  onmouseleave?: (ev?: MouseEvent) => boolean|void;
  onmousemove?: (ev?: MouseEvent) => boolean|void;
  onmouseout?: (ev?: MouseEvent) => boolean|void;
  onmouseover?: (ev?: MouseEvent) => boolean|void;
  onmouseup?: (ev?: MouseEvent) => boolean|void;
  onmousewheel?: (ev?: MouseWheelEvent) => boolean|void;
  onscroll?: (ev?: UIEvent) => boolean|void;
  onsubmit?: (ev?: Event) => boolean|void;
  spellcheck?: boolean;
  tabIndex?: number;
  title?: string;
  accessKey?: string;
  id?: string;
  // From HTMLInputElement
  autocomplete?: string;
  checked?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  src?: string;
  value?: string;
  // From HTMLImageElement
  alt?: string;
  srcset?: string;

  // Everything else (uncommon or custom properties and attributes)
  [index: string]: any;
};

/**
 * Represents a {@link VNode} tree that has been rendered to a real DOM tree.
 */
export interface Projection {
  /**
   * The DOM node that is used as the root of this {@link Projection}.
   * @type {Element}
   */
  domNode: Element;
  /**
   * Updates the projection with the new virtual DOM tree.
   * @param {VNode} updatedVnode - The updated virtual DOM tree. Note: The selector for the root of the tree must remain constant.
   */
  update(updatedVnode: VNode): void;
}


const NAMESPACE_SVG = 'http://www.w3.org/2000/svg';

// Utilities

let emptyArray = <VNode[]>[];

let extend = <T>(base: T, overrides: any): T => {
  let result = {} as any;
  Object.keys(base).forEach(function(key) {
    result[key] = (base as any)[key];
  });
  if (overrides) {
    Object.keys(overrides).forEach(function(key) {
      result[key] = overrides[key];
    });
  }
  return result;
};

// Hyperscript helper functions

let same = function(vnode1: VNode, vnode2: VNode) {
  if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
    return false;
  }
  if (vnode1.properties && vnode2.properties) {
    return vnode1.properties.key === vnode2.properties.key;
  }
  return !vnode1.properties && !vnode2.properties;
};

let toTextVNode = (data: any): VNode => {
  return {
    vnodeSelector: '',
    properties: undefined,
    children: undefined,
    text: (data === null || data === undefined) ? '' : data.toString(),
    domNode: null
  };
};

let appendChildren = function(parentSelector: string, insertions: any[], main: VNode[]) {
  for (let i = 0; i < insertions.length; i++) {
    let item = insertions[i];
    if (Array.isArray(item)) {
      appendChildren(parentSelector, item, main);
    } else {
      if (item !== null && item !== undefined) {
        if (!item.hasOwnProperty('vnodeSelector')) {
          item = toTextVNode(item);
        }
        main.push(item);
      }
    }
  }
};

// Render helper functions

let missingTransition = function() {
  throw new Error('Provide a transitions object to the projectionOptions to do animations');
};

const DEFAULT_PROJECTION_OPTIONS: ProjectionOptions = {
  namespace: undefined,
  eventHandlerInterceptor: undefined,
  styleApplyer: function(domNode: HTMLElement, styleName: string, value: string) {
    // Provides a hook to add vendor prefixes for browsers that still need it.
    (domNode.style as any)[styleName] = value;
  },
  transitions: {
    enter: missingTransition,
    exit: missingTransition
  }
};

let applyDefaultProjectionOptions = function(projectionOptions: ProjectionOptions) {
  return extend(DEFAULT_PROJECTION_OPTIONS, projectionOptions);
};

let checkStyleValue = function(styleValue: Object) {
  if (typeof styleValue !== 'string') {
    throw new Error('Style values must be strings');
  }
};

let setProperties = function(domNode: Node, properties: VNodeProperties, projectionOptions: ProjectionOptions) {
  if (!properties) {
    return;
  }
  let eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
  let propNames = Object.keys(properties);
  let propCount = propNames.length;
  for (let i = 0; i < propCount; i++) {
    let propName = propNames[i];
    /* tslint:disable:no-var-keyword: edge case */
    var propValue = properties[propName];
    /* tslint:enable:no-var-keyword */
    if (propName === 'class' || propName === 'className' || propName === 'classList') {
      throw new Error('Property ' + propName + ' is not supported, use classes.');
    } else if (propName === 'classes') {
      // object with string keys and boolean values
      let classNames = Object.keys(propValue);
      let classNameCount = classNames.length;
      for (let j = 0; j < classNameCount; j++) {
        let className = classNames[j];
        if (propValue[className]) {
          (domNode as Element).classList.add(className);
        }
      }
    } else if (propName === 'styles') {
      // object with string keys and string (!) values
      let styleNames = Object.keys(propValue);
      let styleCount = styleNames.length;
      for (let j = 0; j < styleCount; j++) {
        let styleName = styleNames[j];
        let styleValue = propValue[styleName];
        if (styleValue) {
          checkStyleValue(styleValue);
          projectionOptions.styleApplyer(<HTMLElement>domNode, styleName, styleValue);
        }
      }
    } else if (propName === 'key') {
      continue;
    } else if (propValue === null || propValue === undefined) {
      continue;
    } else {
      let type = typeof propValue;
      if (type === 'function') {
        if (eventHandlerInterceptor && (propName.lastIndexOf('on', 0) === 0)) { // lastIndexOf(,0)===0 -> startsWith
          propValue = eventHandlerInterceptor(propName, propValue, domNode, properties); // intercept eventhandlers
          if (propName === 'oninput') {
            (function() {
              // record the evt.target.value, because IE sometimes does a requestAnimationFrame between changing value and running oninput
              let oldPropValue = propValue;
              propValue = function(evt: Event) {
                (evt.target as any)['oninput-value'] = (evt.target as HTMLInputElement).value; // may be HTMLTextAreaElement as well
                oldPropValue.apply(this, [evt]);
              };
            } ());
          }
        }
        (domNode as any)[propName] = propValue;
      } else if (type === 'string' && propName !== 'value') {
        (domNode as Element).setAttribute(propName, propValue);
      } else {
        (domNode as any)[propName] = propValue;
      }
    }
  }
};

let updateProperties = function(domNode: Node, previousProperties: VNodeProperties, properties: VNodeProperties, projectionOptions: ProjectionOptions) {
  if (!properties) {
    return;
  }
  let propertiesUpdated = false;
  let propNames = Object.keys(properties);
  let propCount = propNames.length;
  for (let i = 0; i < propCount; i++) {
    let propName = propNames[i];
    // assuming that properties will be nullified instead of missing is by design
    let propValue = properties[propName];
    let previousValue = previousProperties[propName];
    if (propName === 'classes') {
      let classList = (domNode as Element).classList;
      let classNames = Object.keys(propValue);
      let classNameCount = classNames.length;
      for (let j = 0; j < classNameCount; j++) {
        let className = classNames[j];
        let on = !!propValue[className];
        let previousOn = !!previousValue[className];
        if (on === previousOn) {
          continue;
        }
        propertiesUpdated = true;
        if (on) {
          classList.add(className);
        } else {
          classList.remove(className);
        }
      }
    } else if (propName === 'styles') {
      let styleNames = Object.keys(propValue);
      let styleCount = styleNames.length;
      for (let j = 0; j < styleCount; j++) {
        let styleName = styleNames[j];
        let newStyleValue = propValue[styleName];
        let oldStyleValue = previousValue[styleName];
        if (newStyleValue === oldStyleValue) {
          continue;
        }
        propertiesUpdated = true;
        if (newStyleValue) {
          checkStyleValue(newStyleValue);
          projectionOptions.styleApplyer(domNode as HTMLElement, styleName, newStyleValue);
        } else {
          projectionOptions.styleApplyer(domNode as HTMLElement, styleName, '');
        }
      }
    } else {
      if (!propValue && typeof previousValue === 'string') {
        propValue = '';
      }
      if (propName === 'value') { // value can be manipulated by the user directly and using event.preventDefault() is not an option
        if ((domNode as any)[propName] !== propValue && (domNode as any)['oninput-value'] !== propValue) {
          (domNode as any)[propName] = propValue; // Reset the value, even if the virtual DOM did not change
          (domNode as any)['oninput-value'] = undefined;
        } // else do not update the domNode, otherwise the cursor position would be changed
        if (propValue !== previousValue) {
          propertiesUpdated = true;
        }
      } else if (propValue !== previousValue) {
        let type = typeof propValue;
        if (type === 'function') {
          throw new Error('Functions may not be updated on subsequent renders (property: ' + propName +
            '). Hint: declare event handler functions outside the render() function.');
        }
        if (type === 'string') {
          (domNode as Element).setAttribute(propName, propValue);
        } else {
          if ((domNode as any)[propName] !== propValue) { // Comparison is here for side-effects in Edge with scrollLeft and scrollTop
            (domNode as any)[propName] = propValue;
          }
        }
        propertiesUpdated = true;
      }
    }
  }
  return propertiesUpdated;
};

let findIndexOfChild = function(children: VNode[], sameAs: VNode, start: number) {
  if (sameAs.vnodeSelector !== '') {
    // Never scan for text-nodes
    for (let i = start; i < children.length; i++) {
      if (same(children[i], sameAs)) {
        return i;
      }
    }
  }
  return -1;
};

let nodeAdded = function(vNode: VNode, transitions: Transitions) {
  if (vNode.properties) {
    let enterAnimation = vNode.properties.enterAnimation;
    if (enterAnimation) {
      if (typeof enterAnimation === 'function') {
        enterAnimation(vNode.domNode as Element, vNode.properties);
      } else {
        transitions.enter(vNode.domNode as Element, vNode.properties, enterAnimation as string);
      }
    }
  }
};

let nodeToRemove = function(vNode: VNode, transitions: Transitions) {
  let domNode = vNode.domNode;
  if (vNode.properties) {
    let exitAnimation = vNode.properties.exitAnimation;
    if (exitAnimation) {
      (domNode as HTMLElement).style.pointerEvents = 'none';
      let removeDomNode = function() {
        if (domNode.parentNode) {
          domNode.parentNode.removeChild(domNode);
        }
      };
      if (typeof exitAnimation === 'function') {
        exitAnimation(domNode as Element, removeDomNode, vNode.properties);
        return;
      } else {
        transitions.exit(vNode.domNode as Element, vNode.properties, exitAnimation as string, removeDomNode);
        return;
      }
    }
  }
  if (domNode.parentNode) {
    domNode.parentNode.removeChild(domNode);
  }
};

let checkDistinguishable = function(childNodes: VNode[], indexToCheck: number, parentVNode: VNode, operation: string) {
  let childNode = childNodes[indexToCheck];
  if (childNode.vnodeSelector === '') {
    return; // Text nodes need not be distinguishable
  }
  let key = childNode.properties ? childNode.properties.key : undefined;
  if (!key) { // A key is just assumed to be unique
    for (let i = 0; i < childNodes.length; i++) {
      if (i !== indexToCheck) {
        let node = childNodes[i];
        if (same(node, childNode)) {
          if (operation === 'added') {
            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' +
              'added, but there is now more than one. You must add unique key properties to make them distinguishable.');
          } else {
            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' +
              'removed, but there were more than one. You must add unique key properties to make them distinguishable.');
          }
        }
      }
    }
  }
};

let createDom: (vnode: VNode, parentNode: Node, insertBefore: Node, projectionOptions: ProjectionOptions) => void;
let updateDom: (previous: VNode, vnode: VNode, projectionOptions: ProjectionOptions) => boolean;

let updateChildren = function(vnode: VNode, domNode: Node, oldChildren: VNode[], newChildren: VNode[], projectionOptions: ProjectionOptions) {
  if (oldChildren === newChildren) {
    return false;
  }
  oldChildren = oldChildren || emptyArray;
  newChildren = newChildren || emptyArray;
  let oldChildrenLength = oldChildren.length;
  let newChildrenLength = newChildren.length;
  let transitions = projectionOptions.transitions;

  let oldIndex = 0;
  let newIndex = 0;
  let i: number;
  let textUpdated = false;
  while (newIndex < newChildrenLength) {
    let oldChild = (oldIndex < oldChildrenLength) ? oldChildren[oldIndex] : undefined;
    let newChild = newChildren[newIndex];
    if (oldChild !== undefined && same(oldChild, newChild)) {
      textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
      oldIndex++;
    } else {
      let findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
      if (findOldIndex >= 0) {
        // Remove preceding missing children
        for (i = oldIndex; i < findOldIndex; i++) {
          nodeToRemove(oldChildren[i], transitions);
          checkDistinguishable(oldChildren, i, vnode, 'removed');
        }
        textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
        oldIndex = findOldIndex + 1;
      } else {
        // New child
        createDom(newChild, domNode, (oldIndex < oldChildrenLength) ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
        nodeAdded(newChild, transitions);
        checkDistinguishable(newChildren, newIndex, vnode, 'added');
      }
    }
    newIndex++;
  }
  if (oldChildrenLength > oldIndex) {
    // Remove child fragments
    for (i = oldIndex; i < oldChildrenLength; i++) {
      nodeToRemove(oldChildren[i], transitions);
      checkDistinguishable(oldChildren, i, vnode, 'removed');
    }
  }
  return textUpdated;
};

let addChildren = function(domNode: Node, children: VNode[], projectionOptions: ProjectionOptions) {
  if (!children) {
    return;
  }
  for (let i = 0; i < children.length; i++) {
    createDom(children[i], domNode, undefined, projectionOptions);
  }
};

let initPropertiesAndChildren = function(domNode: Node, vnode: VNode, projectionOptions: ProjectionOptions) {
  addChildren(domNode, vnode.children, projectionOptions); // children before properties, needed for value property of <select>.
  if (vnode.text) {
    domNode.textContent = vnode.text;
  }
  setProperties(domNode, vnode.properties, projectionOptions);
  if (vnode.properties && vnode.properties.afterCreate) {
    vnode.properties.afterCreate(domNode as Element, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children);
  }
};

createDom = function(vnode, parentNode, insertBefore, projectionOptions) {
  let domNode: Node, i: number, c: string, start = 0, type: string, found: string;
  let vnodeSelector = vnode.vnodeSelector;
  if (vnodeSelector === '') {
    domNode = vnode.domNode = document.createTextNode(vnode.text);
    if (insertBefore !== undefined) {
      parentNode.insertBefore(domNode, insertBefore);
    } else {
      parentNode.appendChild(domNode);
    }
  } else {
    for (i = 0; i <= vnodeSelector.length; ++i) {
      c = vnodeSelector.charAt(i);
      if (i === vnodeSelector.length || c === '.' || c === '#') {
        type = vnodeSelector.charAt(start - 1);
        found = vnodeSelector.slice(start, i);
        if (type === '.') {
          (domNode as HTMLElement).classList.add(found);
        } else if (type === '#') {
          (domNode as Element).id = found;
        } else {
          if (found === 'svg') {
            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
          }
          if (projectionOptions.namespace !== undefined) {
            domNode = vnode.domNode = document.createElementNS(projectionOptions.namespace, found);
          } else {
            domNode = vnode.domNode = document.createElement(found);
          }
          if (insertBefore !== undefined) {
            parentNode.insertBefore(domNode, insertBefore);
          } else {
            parentNode.appendChild(domNode);
          }
        }
        start = i + 1;
      }
    }
    initPropertiesAndChildren(domNode, vnode, projectionOptions);
  }
};

updateDom = function(previous, vnode, projectionOptions) {
  let domNode = previous.domNode;
  if (!domNode) {
    throw new Error('previous node was not rendered');
  }
  let textUpdated = false;
  if (previous === vnode) {
    return textUpdated; // we assume that nothing has changed
  }
  let updated = false;
  if (vnode.vnodeSelector === '') {
    if (vnode.text !== previous.text) {
      domNode.nodeValue = vnode.text;
      textUpdated = true;
    }
  } else {
    if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) { // lastIndexOf(needle,0)===0 means StartsWith
      projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
    }
    if (previous.text !== vnode.text) {
      updated = true;
      if (vnode.text === undefined) {
        domNode.removeChild(domNode.firstChild); // the only textnode presumably
      } else {
        domNode.textContent = vnode.text;
      }
    }
    updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
    updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
    if (vnode.properties && vnode.properties.afterUpdate) {
      vnode.properties.afterUpdate(<Element>domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children);
    }
  }
  if (updated && vnode.properties && vnode.properties.updateAnimation) {
    vnode.properties.updateAnimation(<Element>domNode, vnode.properties, previous.properties);
  }
  vnode.domNode = previous.domNode;
  return textUpdated;
};

/**
 * Represents a {@link VNode} tree that has been rendered to a real DOM tree.
 * @interface Projection
 */
let createProjection = function(vnode: VNode, projectionOptions: ProjectionOptions): Projection {
  if (!vnode.vnodeSelector) {
    throw new Error('Invalid vnode argument');
  }
  return {
    /**
     * Updates the projection with the new virtual DOM tree.
     * @param {VNode} updatedVnode - The updated virtual DOM tree. Note: The selector for the root of the tree must remain constant.
     * @memberof Projection#
     */
    update: function(updatedVnode: VNode) {
      if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
        throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
      }
      updateDom(vnode, updatedVnode, projectionOptions);
      vnode = updatedVnode;
    },
    /**
     * The DOM node that is used as the root of this {@link Projection}.
     * @type {Element}
     * @memberof Projection#
     */
    domNode: <Element>vnode.domNode
  };
};

// Declaration of interfaces and callbacks, before the @exports maquette

/**
 * A CalculationCache object remembers the previous outcome of a calculation along with the inputs.
 * On subsequent calls the previous outcome is returned if the inputs are identical.
 * This object can be used to bypass both rendering and diffing of a virtual DOM subtree.
 * Instances of {@link CalculationCache} can be created using {@link module:maquette.createCache}.
 * @interface CalculationCache
 */

/**
 * Keeps an array of result objects synchronized with an array of source objects.
 * Mapping provides a {@link Mapping#map} function that updates the {@link Mapping#results}.
 * The {@link Mapping#map} function can be called multiple times and the results will get created, removed and updated accordingly.
 * A {@link Mapping} can be used to keep an array of components (objects with a `renderMaquette` method) synchronized with an array of data.
 * Instances of {@link Mapping} can be created using {@link module:maquette.createMapping}.
 * @interface Mapping
 */

/**
 * Used to create and update the DOM.
 * Use {@link Projector#append}, {@link Projector#merge}, {@link Projector#insertBefore} and {@link Projector#replace}
 * to create the DOM.
 * The `renderMaquetteFunction` callbacks will be called immediately to create the DOM. Afterwards, these functions
 * will be called again to update the DOM on the next animation-frame after:
 *
 *  - The {@link Projector#scheduleRender} function  was called
 *  - An event handler (like `onclick`) on a rendered {@link VNode} was called.
 *
 * The projector stops when {@link Projector#stop} is called or when an error is thrown during rendering.
 * It is possible to use `window.onerror` to handle these errors.
 * Instances of {@link Projector} can be created using {@link module:maquette.createProjector}.
 * @interface Projector
 */

/**
 * @callback enterAnimationCallback
 * @param {Element} element - Element that was just added to the DOM.
 * @param {Object} properties - The properties object that was supplied to the {@link module:maquette.h} method
 */

/**
 * @callback exitAnimationCallback
 * @param {Element} element - Element that ought to be removed from to the DOM.
 * @param {function(Element)} removeElement - Function that removes the element from the DOM.
 * This argument is supplied purely for convenience.
 * You may use this function to remove the element when the animation is done.
 * @param {Object} properties - The properties object that was supplied to the {@link module:maquette.h} method that rendered this {@link VNode}
 * the previous time.
 */

/**
 * @callback updateAnimationCallback
 * @param {Element} element - Element that was modified in the DOM.
 * @param {Object} properties - The last properties object that was supplied to the {@link module:maquette.h} method
 * @param {Object} previousProperties - The previous properties object that was supplied to the {@link module:maquette.h} method
 */

/**
 * @callback afterCreateCallback
 * @param {Element} element - The element that was added to the DOM.
 * @param {Object} projectionOptions - The projection options that were used see {@link module:maquette.createProjector}.
 * @param {string} vnodeSelector - The selector passed to the {@link module:maquette.h} function.
 * @param {Object} properties - The properties passed to the {@link module:maquette.h} function.
 * @param {VNode[]} children - The children that were created.
 * @param {Object} properties - The last properties object that was supplied to the {@link module:maquette.h} method
 * @param {Object} previousProperties - The previous properties object that was supplied to the {@link module:maquette.h} method
 */

/**
 * @callback afterUpdateCallback
 * @param {Element} element - The element that may have been updated in the DOM.
 * @param {Object} projectionOptions - The projection options that were used see {@link module:maquette.createProjector}.
 * @param {string} vnodeSelector - The selector passed to the {@link module:maquette.h} function.
 * @param {Object} properties - The properties passed to the {@link module:maquette.h} function.
 * @param {VNode[]} children - The children for this node.
 */

/**
 * Contains simple low-level utility functions to manipulate the real DOM. The singleton instance is available under {@link module:maquette.dom}.
 * @interface MaquetteDom
 */

/**
 * The `h` method is used to create a virtual DOM node.
 * This function is largely inspired by the mercuryjs and mithril frameworks.
 * The `h` stands for (virtual) hyperscript.
 *
 * @param {string} selector - Contains the tagName, id and fixed css classnames in CSS selector format.
 * It is formatted as follows: `tagname.cssclass1.cssclass2#id`.
 * @param {Object} [properties] - An object literal containing properties that will be placed on the DOM node.
 * @param {function} properties.<b>*</b> - Properties with functions values like `onclick:handleClick` are registered as event handlers
 * @param {String} properties.<b>*</b> - Properties with string values, like `href:'/'` are used as attributes
 * @param {object} properties.<b>*</b> - All non-string values are put on the DOM node as properties
 * @param {Object} properties.key - Used to uniquely identify a DOM node among siblings.
 * A key is required when there are more children with the same selector and these children are added or removed dynamically.
 * @param {Object} properties.classes - An object literal like `{important:true}` which allows css classes, like `important` to be added and removed
 * dynamically.
 * @param {Object} properties.styles - An object literal like `{height:'100px'}` which allows styles to be changed dynamically. All values must be strings.
 * @param {(string|enterAnimationCallback)} properties.enterAnimation - The animation to perform when this node is added to an already existing parent.
 * {@link http://maquettejs.org/docs/animations.html|More about animations}.
 * When this value is a string, you must pass a `projectionOptions.transitions` object when creating the projector {@link module:maquette.createProjector}.
 * @param {(string|exitAnimationCallback)} properties.exitAnimation - The animation to perform when this node is removed while its parent remains.
 * When this value is a string, you must pass a `projectionOptions.transitions` object when creating the projector {@link module:maquette.createProjector}.
 * {@link http://maquettejs.org/docs/animations.html|More about animations}.
 * @param {updateAnimationCallback} properties.updateAnimation - The animation to perform when the properties of this node change.
 * This also includes attributes, styles, css classes. This callback is also invoked when node contains only text and that text changes.
 * {@link http://maquettejs.org/docs/animations.html|More about animations}.
 * @param {afterCreateCallback} properties.afterCreate - Callback that is executed after this node is added to the DOM. Childnodes and properties have
 * already been applied.
 * @param {afterUpdateCallback} properties.afterUpdate - Callback that is executed every time this node may have been updated. Childnodes and properties
 * have already been updated.
 * @param {Object[]} [children] - An array of virtual DOM nodes to add as child nodes.
 * This array may contain nested arrays, `null` or `undefined` values.
 * Nested arrays are flattened, `null` and `undefined` will be skipped.
 *
 * @returns {VNode} A VNode object, used to render a real DOM later.
 * NOTE: There are {@link http://maquettejs.org/docs/rules.html|three basic rules} you should be aware of when updating the virtual DOM.
 */
export let h = function(selector: string /*, ...propertiesAndChildren */): VNode {
  let properties = arguments[1];
  if (typeof selector !== 'string') {
    throw new Error();
  }
  let childIndex = 1;
  if (properties && !properties.hasOwnProperty('vnodeSelector') && !Array.isArray(properties) && typeof properties === 'object') {
    childIndex = 2;
  } else {
    // Optional properties argument was omitted
    properties = undefined;
  }
  let text = undefined as string;
  let children = undefined as VNode[];
  let argsLength = arguments.length;
  // Recognize a common special case where there is only a single text node
  if (argsLength === childIndex + 1) {
    let onlyChild = arguments[childIndex];
    if (typeof onlyChild === 'string') {
      text = onlyChild;
    } else if (onlyChild !== undefined && onlyChild.length === 1 && typeof onlyChild[0] === 'string') {
      text = onlyChild[0];
    }
  }
  if (text === undefined) {
    children = [];
    for (; childIndex < arguments.length; childIndex++) {
      let child = arguments[childIndex];
      if (child === null || child === undefined) {
        continue;
      } else if (Array.isArray(child)) {
        appendChildren(selector, child, children);
      } else if (child.hasOwnProperty('vnodeSelector')) {
        children.push(child);
      } else {
        children.push(toTextVNode(child));
      }
    }
  }
  return {
    vnodeSelector: selector,
    properties: properties,
    children: children,
    text: text,
    domNode: null
  };
};

/**
 * @type MaquetteDom
 */
export let dom = {
  /**
   * Creates a real DOM tree from a {@link VNode}. The {@link Projection} object returned will contain the resulting DOM Node under
   * the {@link Projection#domNode} property.
   * This is a low-level method. Users wil typically use a {@link Projector} instead.
   * @memberof MaquetteDom#
   * @param {VNode} vnode - The root of the virtual DOM tree that was created using the {@link module:maquette.h} function. NOTE: {@link VNode}
   * objects may only be rendered once.
   * @param {Object} projectionOptions - Options to be used to create and update the projection, see {@link module:maquette.createProjector}.
   * @returns {Projection} The {@link Projection} which contains the DOM Node that was created.
   */
  create: function(vnode: VNode, projectionOptions: ProjectionOptions) {
    projectionOptions = applyDefaultProjectionOptions(projectionOptions);
    createDom(vnode, document.createElement('div'), undefined, projectionOptions);
    return createProjection(vnode, projectionOptions);
  },

  /**
   * Appends a new childnode to the DOM which is generated from a {@link VNode}.
   * This is a low-level method. Users wil typically use a {@link Projector} instead.
   * @memberof MaquetteDom#
   * @param {Element} parentNode - The parent node for the new childNode.
   * @param {VNode} vnode - The root of the virtual DOM tree that was created using the {@link module:maquette.h} function. NOTE: {@link VNode}
   * objects may only be rendered once.
   * @param {Object} projectionOptions - Options to be used to create and update the projection, see {@link module:maquette.createProjector}.
   * @returns {Projection} The {@link Projection} that was created.
   */
  append: function(parentNode: Element, vnode: VNode, projectionOptions: ProjectionOptions) {
    projectionOptions = applyDefaultProjectionOptions(projectionOptions);
    createDom(vnode, parentNode, undefined, projectionOptions);
    return createProjection(vnode, projectionOptions);
  },

  /**
   * Inserts a new DOM node which is generated from a {@link VNode}.
   * This is a low-level method. Users wil typically use a {@link Projector} instead.
   * @memberof MaquetteDom#
   * @param {Element} beforeNode - The node that the DOM Node is inserted before.
   * @param {VNode} vnode - The root of the virtual DOM tree that was created using the {@link module:maquette.h} function.
   * NOTE: {@link VNode} objects may only be rendered once.
   * @param {Object} projectionOptions - Options to be used to create and update the projection, see {@link module:maquette.createProjector}.
   * @returns {Projection} The {@link Projection} that was created.
   */
  insertBefore: function(beforeNode: Element, vnode: VNode, projectionOptions: ProjectionOptions) {
    projectionOptions = applyDefaultProjectionOptions(projectionOptions);
    createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
    return createProjection(vnode, projectionOptions);
  },

  /**
   * Merges a new DOM node which is generated from a {@link VNode} with an existing DOM Node.
   * This means that the virtual DOM and real DOM have one overlapping element.
   * Therefore the selector for the root {@link VNode} will be ignored, but its properties and children will be applied to the Element provided
   * This is a low-level method. Users wil typically use a {@link Projector} instead.
   * @memberof MaquetteDom#
   * @param {Element} domNode - The existing element to adopt as the root of the new virtual DOM. Existing attributes and childnodes are preserved.
   * @param {VNode} vnode - The root of the virtual DOM tree that was created using the {@link module:maquette.h} function. NOTE: {@link VNode} objects
   * may only be rendered once.
   * @param {Object} projectionOptions - Options to be used to create and update the projection, see {@link module:maquette.createProjector}.
   * @returns {Projection} The {@link Projection} that was created.
   */
  merge: function(element: Element, vnode: VNode, projectionOptions: ProjectionOptions) {
    projectionOptions = applyDefaultProjectionOptions(projectionOptions);
    vnode.domNode = element;
    initPropertiesAndChildren(element, vnode, projectionOptions);
    return createProjection(vnode, projectionOptions);
  }
};

/**
 * Creates a {@link CalculationCache} object, useful for caching {@link VNode} trees.
 * In practice, caching of {@link VNode} trees is not needed, because achieving 60 frames per second is almost never a problem.
 * @returns {CalculationCache}
 */
export let createCache = function() {
  let cachedInputs = undefined as Object[];
  let cachedOutcome = undefined as Object;
  let result = {
    /**
     * Manually invalidates the cached outcome.
     * @memberof CalculationCache#
     */
    invalidate: function() {
      cachedOutcome = undefined;
      cachedInputs = undefined;
    },
    /**
     * If the inputs array matches the inputs array from the previous invocation, this method returns the result of the previous invocation.
     * Otherwise, the calculation function is invoked and its result is cached and returned.
     * Objects in the inputs array are compared using ===.
     * @param {Object[]} inputs - Array of objects that are to be compared using === with the inputs from the previous invocation.
     * These objects are assumed to be immutable primitive values.
     * @param {function} calculation - Function that takes zero arguments and returns an object (A {@link VNode} assumably) that can be cached.
     * @memberof CalculationCache#
     */
    result: function(inputs: Object[], calculation: () => Object) {
      if (cachedInputs) {
        for (let i = 0; i < inputs.length; i++) {
          if (cachedInputs[i] !== inputs[i]) {
            cachedOutcome = undefined;
          }
        }
      }
      if (!cachedOutcome) {
        cachedOutcome = calculation();
        cachedInputs = inputs;
      }
      return cachedOutcome;
    }
  };
  return result;
};

/**
 * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
 * @param {function} getSourceKey - `function(source)` that must return a key to identify each source object. The result must eather be a string or a number.
 * @param {function} createResult - `function(source, index)` that must create a new result object from a given source. This function is identical
 * argument of `Array.map`.
 * @param {function} updateResult - `function(source, target, index)` that updates a result to an updated source.
 * @returns {Mapping}
 */
export let createMapping = function(
  getSourceKey: (source: Object) => Object,
  createResult: (source: Object, index: number) => Object,
  updateResult: (source: Object, target: Object, index: number) => void
  /*, deleteTarget*/) {
  let keys = [] as Object[];
  let results = [] as  Object[];

  return {
    /**
     * The array of results. These results will be synchronized with the latest array of sources that were provided using {@link Mapping#map}.
     * @type {Object[]}
     * @memberof Mapping#
     */
    results: results,
    /**
     * Maps a new array of sources and updates {@link Mapping#results}.
     * @param {Object[]} newSources - The new array of sources.
     * @memberof Mapping#
     */
    map: function(newSources: Object[]) {
      let newKeys = newSources.map(getSourceKey);
      let oldTargets = results.slice();
      let oldIndex = 0;
      for (let i = 0; i < newSources.length; i++) {
        let source = newSources[i];
        let sourceKey = newKeys[i];
        if (sourceKey === keys[oldIndex]) {
          results[i] = oldTargets[oldIndex];
          updateResult(source, oldTargets[oldIndex], i);
          oldIndex++;
        } else {
          let found = false;
          for (let j = 1; j < keys.length; j++) {
            let searchIndex = (oldIndex + j) % keys.length;
            if (keys[searchIndex] === sourceKey) {
              results[i] = oldTargets[searchIndex];
              updateResult(newSources[i], oldTargets[searchIndex], i);
              oldIndex = searchIndex + 1;
              found = true;
              break;
            }
          }
          if (!found) {
            results[i] = createResult(source, i);
          }
        }
      }
      results.length = newSources.length;
      keys = newKeys;
    }
  };
};

/**
 * Creates a {@link Projector} instance using the provided projectionOptions.
 * @param {Object} [projectionOptions] - Options that influence how the DOM is rendered and updated.
 * @param {Object} projectionOptions.transitions - A transition strategy to invoke when
 * enterAnimation and exitAnimation properties are provided as strings.
 * The module `cssTransitions` in the provided `css-transitions.js` file provides such a strategy.
 * A transition strategy is not needed when enterAnimation and exitAnimation properties are provided as functions.
 * @returns {Projector}
 */
export let createProjector = function(projectionOptions: ProjectionOptions) {
  let projector: Projector;
  projectionOptions = applyDefaultProjectionOptions(projectionOptions);
  projectionOptions.eventHandlerInterceptor = function(propertyName: string, functionPropertyArgument: Function) {
    return function() {
      // intercept function calls (event handlers) to do a render afterwards.
      projector.scheduleRender();
      return functionPropertyArgument.apply(this, arguments);
    };
  };
  let renderCompleted = true;
  let scheduled: number;
  let stopped = false;
  let projections = [] as Projection[];
  let renderFunctions = [] as (() => VNode)[]; // matches the projections array

  let doRender = function() {
    scheduled = undefined;
    if (!renderCompleted) {
      return; // The last render threw an error, it should be logged in the browser console.
    }
    renderCompleted = false;
    for (let i = 0; i < projections.length; i++) {
      let updatedVnode = renderFunctions[i]();
      projections[i].update(updatedVnode);
    }
    renderCompleted = true;
  };

  projector = {
    /**
     * Instructs the projector to re-render to the DOM at the next animation-frame using the registered `renderMaquette` functions.
     * This method is automatically called for you when event-handlers that are registered in the {@link VNode}s are invoked.
     * You need to call this method for instance when timeouts expire or AJAX responses arrive.
     * @memberof Projector#
     */
    scheduleRender: function() {
      if (!scheduled && !stopped) {
        scheduled = requestAnimationFrame(doRender);
      }
    },
    /**
     * Stops the projector. This means that the registered `renderMaquette` functions will not be called anymore.
     * Note that calling {@link Projector#stop} is not mandatory. A projector is a passive object that will get garbage collected as usual
     * if it is no longer in scope.
     * @memberof Projector#
     */
    stop: function() {
      if (scheduled) {
        cancelAnimationFrame(scheduled);
        scheduled = undefined;
      }
      stopped = true;
    },

    /**
     * Resumes the projector. Use this method to resume rendering after stop was called or an error occurred during rendering.
     * @memberof Projector#
     */
    resume: function() {
      stopped = false;
      renderCompleted = true;
      projector.scheduleRender();
    },

    /**
     * Appends a new childnode to the DOM using the result from the provided `renderMaquetteFunction`.
     * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
     * @param {Element} parentNode - The parent node for the new childNode.
     * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
     * @memberof Projector#
     */
    append: function(parentNode, renderMaquetteFunction) {
      projections.push(dom.append(parentNode, renderMaquetteFunction(), projectionOptions));
      renderFunctions.push(renderMaquetteFunction);
    },

    /**
     * Inserts a new DOM node using the result from the provided `renderMaquetteFunction`.
     * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
     * @param {Element} beforeNode - The node that the DOM Node is inserted before.
     * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
     * @memberof Projector#
     */
    insertBefore: function(beforeNode, renderMaquetteFunction) {
      projections.push(dom.insertBefore(beforeNode, renderMaquetteFunction(), projectionOptions));
      renderFunctions.push(renderMaquetteFunction);
    },

    /**
     * Merges a new DOM node using the result from the provided `renderMaquetteFunction` with an existing DOM Node.
     * This means that the virtual DOM and real DOM have one overlapping element.
     * Therefore the selector for the root {@link VNode} will be ignored, but its properties and children will be applied to the Element provided
     * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
     * @param {Element} domNode - The existing element to adopt as the root of the new virtual DOM. Existing attributes and childnodes are preserved.
     * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
     * @memberof Projector#
     */
    merge: function(domNode, renderMaquetteFunction) {
      projections.push(dom.merge(domNode, renderMaquetteFunction(), projectionOptions));
      renderFunctions.push(renderMaquetteFunction);
    },

    /**
     * Replaces an existing DOM node with the result from the provided `renderMaquetteFunction`.
     * The `renderMaquetteFunction` will be invoked again to update the DOM when needed.
     * @param {Element} domNode - The DOM node to replace.
     * @param {function} renderMaquetteFunction - Function with zero arguments that returns a {@link VNode} tree.
     * @memberof Projector#
     */
    replace: function(domNode, renderMaquetteFunction) {
      let vnode = renderMaquetteFunction();
      createDom(vnode, domNode.parentNode, domNode, projectionOptions);
      domNode.parentNode.removeChild(domNode);
      projections.push(createProjection(vnode, projectionOptions));
      renderFunctions.push(renderMaquetteFunction);
    }
  };
  return projector;
};
