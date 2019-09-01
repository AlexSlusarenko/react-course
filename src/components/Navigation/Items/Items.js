import React from 'react';

import classes from './NavItems.css';
import Item from './Item';

const items = () => (
  <ul className={classes.NavigationItems}>
    <Item link="/" active>Burger Builder</Item>
    <Item link="/">Checkout</Item>
  </ul>
);

export default items;