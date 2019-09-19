import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from "../../components/Burger/OdrerSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axiosOrders from "../../axios-orders";
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

  state = {
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
  };

  componentDidMount() {
    console.log('Burger builder init');
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCloseHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push({pathname: '/checkout',});
  };

  checkPurchaseState(ingredients) {
    for (let ingredient in ingredients) {
      console.log(ingredient, 'count:', ingredients[ingredient]);
      if (ingredients[ingredient] > 0) {
        return true;
      }
    }
    return false;
  }

  render() {
    const enabledControls = {
      ...this.props.ingredients
    };
    for (let key in enabledControls) {
      enabledControls[key] = enabledControls[key] > 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? <p>Failed to load ingredients</p> : <Spinner/>;

    if (this.props.ingredients) {
      orderSummary = <OrderSummary
        ingredients={this.props.ingredients}
        totalPrice={this.props.totalPrice}
        purchaseCancelled={this.purchaseCloseHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />;
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingredients}/>
          <BuildControls
            purchasable={this.checkPurchaseState(this.props.ingredients)}
            price={this.props.totalPrice}
            ordered={this.purchaseHandler}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            enabled={enabledControls}/>
        </Aux>);
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

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (name) => dispatch(actions.addIngredient(name)),
    onIngredientRemoved: (name) => dispatch(actions.removeIngredient(name)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => {dispatch(actions.purchaseInit())}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axiosOrders));
