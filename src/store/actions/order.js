import * as actionTypes from './actionTypes';
import axiosOrders from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData,
  }
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error,
  }
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  }
};

export const purchaseBurger = (order) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axiosOrders.post('/orders.json', order)
      .then(response => {
        dispatch(purchaseBurgerSuccess(response.data.name, order));
      })
      .catch(error => {
        dispatch(purchaseBurgerFail(error));
      });
  }
};

export const purchaseInit = () => {
  return {type: actionTypes.PURCHASE_INIT}
};

export const fetchOrdersStart = () => {
  return {type: actionTypes.FETCH_ORDERS_START}
};

export const fetchOrdersSuccess = (orders) => {
  return {type: actionTypes.FETCH_ORDERS_SUCCESS, orders}
};

export const fetchOrdersFail = (error) => {
  return {type: actionTypes.FETCH_ORDERS_FAILED, error}
};

export const fetchOrders = () => {
  return dispatch => {
    fetchOrdersStart();
    axiosOrders.get('/orders.json')
      .then(res => {
        const orders = [];
        for (let key in res.data) {
          orders.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchOrdersSuccess(orders));
      })
      .catch(err => {
        dispatch(fetchOrdersFail(err));
      })
  }
};
