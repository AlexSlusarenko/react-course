import React, {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axiosOrders from "../../../axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest',
        valid: true
      },
    },
    loading: false,
    formIsValid: false,
  };

  orderHandler = (event) => {
    event.preventDefault(); //prevents default submit
    this.setState({loading: true});

    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice, //not a setup for real app
      orderData: formData,
    };
    axiosOrders.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({loading: false});
      });

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


  inputChangedHandler = (event, inputId) => {
    const updatedOrderForm = {...this.state.orderForm};
    const updatedFormElement = {...updatedOrderForm[inputId]};
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.validateInput(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputId] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifiers in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid});
  };

  render() {

    const formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({id: key, config: this.state.orderForm[key]});
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementArray.map(element => (
          <Input
            key={element.id}
            value={element.config.value}
            invalid={!element.config.valid}
            touched={element.config.touched}
            shouldValidate={element.config.validation}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            changed={(event) => this.inputChangedHandler(event, element.id)}/>
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner/>
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter contact data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
