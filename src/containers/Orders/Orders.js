import React, {Component} from 'react';
import axiosOrders from "../../axios-orders";

import Order from '../../components/Order/Order';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  };

  componentDidMount() {
    axiosOrders.get('/orders.json')
      .then(res => {
        console.log(res);
        const orders = [];
        for (let key in res.data) {
          orders.push({
            ...res.data[key],
            id: key,
          });
        }
        this.setState({loading: false, orders});
      })
      .catch(err => {
        this.setState({loading: false});
      })
  }

  render() {
    return (
      <div>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axiosOrders);
