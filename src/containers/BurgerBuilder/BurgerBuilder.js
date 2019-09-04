import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from "../../components/Burger/OdrerSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axiosOrders from "../../axios-orders";

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: null,
  };

  componentDidMount() {
    axiosOrders.get('/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({error: error});
      });
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCloseHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {
    this.setState({loading: true});

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, //not a setup for real app
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
        console.log(response);
        this.setState({loading: false, purchasing: false});
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false, purchasing: false});
      });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;

    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
      purchasable: true,
    })
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;

    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
      purchasable:
        updatedIngredients.salad > 0
        || updatedIngredients.meat > 0
        || updatedIngredients.cheese > 0
        || updatedIngredients.bacon > 0
    })
  };

  render() {
    const enabledControls = {
      ...this.state.ingredients
    };
    for (let key in enabledControls) {
      enabledControls[key] = enabledControls[key] > 0;
    }
    let orderSummary = null;
    let burger = this.state.error? <p>{this.state.error.message}</p> : <Spinner/>;

    if (this.state.ingredients) {
      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        totalPrice={this.state.totalPrice}
        purchaseCancelled={this.purchaseCloseHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />;
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            enabled={enabledControls}/>
        </Aux>);
    }

    if (this.state.loading) {
      orderSummary = <Spinner/>;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCloseHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axiosOrders);
