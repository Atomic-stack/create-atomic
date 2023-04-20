import { ComponentChild, ComponentChildren } from 'preact'

export * from 'preact'

export {
  Attributes,
  FunctionalComponent as SFC,
  AnyComponent as ComponentType,
  AnyComponent as JSXElementConstructor,
  Component as ComponentClass,
  ClassAttributes,
  PreactContext as Context,
  PreactProvider as Provider,
  VNode as ReactElement,
  createElement,
  Fragment,
  Ref,
  render,
  JSX,
  RenderableProps as ComponentPropsWithRef,
  RenderableProps as ComponentPropsWithoutRef
} from 'preact'

export * from 'preact/hooks'

export type ReactNode = ComponentChild | ComponentChildren
