export type ClassNameToggler = { [key: string]: boolean };

export default function toggleHTMLNodeClassNames(element: HTMLElement, classNames: ClassNameToggler) {
  Object.keys(classNames).forEach((key) => {
    if (classNames[key]) {
      element.classList.add(key);
    }
    else {
      element.classList.remove(key);
    }
  });
}
