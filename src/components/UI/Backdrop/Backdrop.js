import React from 'react';

import classes from './Backdrop.css';

const backdrop = (props) => (
  props.show ? <div className={classes.Modal} onClick={props.clicked}></div> : null
);

export default backdrop;