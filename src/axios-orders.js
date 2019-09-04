import axios from 'axios';

const axiosOrders = axios.create({
  baseURL: 'https://react-course-d5cfd.firebaseio.com/'
});

export default axiosOrders;
