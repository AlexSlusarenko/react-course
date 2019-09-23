import React, {Component} from 'react';
import {connect} from "react-redux";

import * as actions from '../../store/actions/index';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Your Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      }
    },
    isSignUp: true,
  };

  validateInput(value, rules) {
    if (!rules) {
      return true;
    }

    let isValid = true;
    if (rules.required) {
      isValid = isValid && value.trim() !== '';
    }
    if (rules.minLength) {
      isValid = isValid && value.length >= rules.minLength
    }
    if (rules.maxLength) {
      isValid = isValid && value.length <= rules.maxLength;
    }
    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.validateInput(event.target.value, this.state.controls[controlName].validation),
        touched: true,
      }
    };

    this.setState({controls: updatedControls});
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = () => {
    this.setState(previousState => {
        return {isSignUp: !previousState.isSignUp}
      }
    );
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.controls) {
      formElementArray.push({id: key, config: this.state.controls[key]});
    }

    const form = formElementArray.map(element => (
      <Input
        key={element.id}
        value={element.config.value}
        invalid={!element.config.valid}
        touched={element.config.touched}
        shouldValidate={element.config.validation}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        changed={(event) => this.inputChangedHandler(event, element.id)}/>
    ));

    return (
      <div className={classes.Auth}>
        <form>
          {form}
          <Button btnType="Success" onSubmit={this.submitHandler}>Submit</Button>
        </form>
        <Button
          btnType="Danger"
          clicked={this.switchAuthModeHandler}>
          Switch to {this.state.isSignUp ? 'SingIn' : 'SignUp'}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
  }
};

export default connect(null, mapDispatchToProps)(Auth);
