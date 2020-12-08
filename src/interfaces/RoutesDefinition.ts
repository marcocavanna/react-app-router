export type ParamsDefinition = {
  [param: string]: string | undefined
};

export type BaseRoutesDefinition = {
  [route: string]: ParamsDefinition
};
