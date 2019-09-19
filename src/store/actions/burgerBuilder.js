import * as actionTypes from './actionTypes';
import axiosOrders from '../../axios-orders';

export const addIngredient = (ingredientName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName,
  }
};

export const removeIngredient = (ingredientName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName,
  }
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients
  }
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FET_INGREDIENTS_FAILED,
  }
};

export const initIngredients = () => {
  return (dispatch) => {
    axiosOrders.get('/ingredients.json')
      .then(response => {
        dispatch(setIngredients(response.data));
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed());
      });
  };
};
