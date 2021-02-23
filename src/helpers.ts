export type ClassNameToggler = { [key: string]: boolean };

export function toggleHTMLNodeClassNames(element: HTMLElement, classNames: ClassNameToggler) {
  Object.keys(classNames).forEach((key) => {
    if (classNames[key]) {
      element.classList.add(key);
    }
    else {
      element.classList.remove(key);
    }
  });
}

export function isValidString(val: any): val is string {
  return typeof val === 'string' && !!val.length;
}
