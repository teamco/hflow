import React from 'react';
import { BrowserRouter as ReactRouter } from 'react-router-dom';

export const Router = (Component) => (props) => <ReactRouter><Component {...props}/></ReactRouter>;
