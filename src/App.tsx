import React, { createElement } from 'react';
import logo from './logo.svg';
import './App.css';



type Props = { children: React.ReactNode };

type Provider<P extends Props> = React.ComponentType<P> | [React.ComponentType<P>, Omit<P, "children">];

type Providers<T extends any[]> = {
  [P in keyof T]: T[P] extends T[number] ? Provider<T[P]> : never;
};




const wrap = <T extends any[]>(...providers: Providers<T>) => (element: React.ReactNode) =>
  providers.reduceRight((element: React.ReactNode, provider) => {
    let Provider: React.ComponentType<Props & any>,
      providerProps: object = {};

    if (Array.isArray(provider)) [Provider, providerProps] = provider;
    else Provider = provider!;

    const wrap = createElement(Provider, providerProps, element);

    return wrap;
  }, element);

const getDisplayName = (WrappedComponent: React.ComponentType<any>) => WrappedComponent.displayName || WrappedComponent.name || "Component";



const provide = <T extends any[]>(...providers: Providers<T>) => <
  P extends {}
>(component: React.ComponentType<P>) => {
  const Provide: React.ComponentType<P> = (props) => {
    return wrap(...providers)(
      createElement(component, props)
    ) as React.ReactElement<P>;
  };

  Provide.displayName = `provide(${getDisplayName(component)})`;

  return Provide;
};



const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>
    {children}
  </div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default provide(Wrapper)(App);
