export type ClassNameToggler = { [key: string]: boolean };

export default function toggleHTMLNodeClassNames(element: HTMLElement, classNames: ClassNameToggler) {
  const classToAdd: string[] = [];
  const classToRemove: string[] = [];

  Object.keys(classNames).forEach((className) => {
    const arr = classNames[className] ? classToAdd : classToRemove;
    arr.push(className);
  });

  element.classList.remove(...classToRemove);
  element.classList.add(...classToAdd);
}
