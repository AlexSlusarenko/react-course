import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utils";

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
  error: null,
};

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, {orderId: action.orderId});
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder),
  });
};

const purchaseInit = (state, action) => {
  return updateObject(state, {purchased: false});
};

const purchaseBurgerStart = (state, action) => {
  return updateObject(state, {loading: true});
};

const purchaseBurgerFailed = (state, action) => {
  return updateObject(state, {loading: false});
};

const fetchOrdersStart = (state, action) => {
  return updateObject(state, {loading: true});
};

const fetchOrdersSuccess = (state, action) => {
  return updateObject(state, {loading: false, orders: action.orders});
};

const fetchOrdersFailed = (state, action) => {
  return updateObject(state, {loading: false, error: action.error});
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case(actionTypes.PURCHASE_INIT): return purchaseInit(state, action);
    case(actionTypes.PURCHASE_BURGER_START): return purchaseBurgerStart(state, action);
    case(actionTypes.PURCHASE_BURGER_SUCCESS): return purchaseBurgerSuccess(state, action);
    case(actionTypes.PURCHASE_BURGER_FAIL): return purchaseBurgerFailed(state, action);
    case(actionTypes.FETCH_ORDERS_START): return fetchOrdersStart(state, action);
    case(actionTypes.FETCH_ORDERS_SUCCESS): return fetchOrdersSuccess(state, action);
    case(actionTypes.FETCH_ORDERS_FAILED): return fetchOrdersFailed(state, action);
    default: return state;
  }

};

export default reducer;
