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
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {

  state = {
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: null,
  };

  componentDidMount() {
    /*    axiosOrders.get('/ingredients.json')
          .then(response => {
            this.setState({ingredients: response.data});
          })
          .catch(error => {
            this.setState({error: error});
          });*/
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCloseHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {
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
    let burger = this.state.error ? <p>{this.state.error.message}</p> : <Spinner/>;

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

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (name) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: name}),
    onIngredientRemoved: (name) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: name})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axiosOrders));
