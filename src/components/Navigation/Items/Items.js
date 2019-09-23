import React from 'react';

import classes from './NavItems.css';
import Item from './Item';

const items = () => (
  <ul className={classes.NavigationItems}>
    <Item link="/" exact>Burger Builder</Item>
    <Item link="/orders">Orders</Item>
    <Item link="/auth">Authenticate</Item>
  </ul>
);

export default items;
