import * as React from "react";

import { Hello } from './Hello';

export default class App extends React.Component<any, any> {
  render() {
    return <Hello compiler="Typescript" framework="React"/>;
  }
}