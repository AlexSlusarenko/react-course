import React, {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axiosOrders from "../../../axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault(); //prevents default submit

    this.setState({loading: true});

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice, //not a setup for real app
      customer: {
        name: 'Alex',
        email: 'test@test.com',
        address: {
          street: 'street 1'
        }
      },
      deliveryMethod: 'fastest',
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

  render() {

    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="Your name"/>
        <input className={classes.Input} type="email" name="email" placeholder="Your email"/>
        <input className={classes.Input} type="text" name="street" placeholder="Your street"/>
        <input className={classes.Input} type="text" name="postalCode" placeholder="Your postal code"/>
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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
