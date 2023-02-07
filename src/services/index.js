import axios from "axios";

export const getStockPortfolio = () => {
  const url = import.meta.env.VITE_PORTFOLIO_URL;
  return axios.get(url);
};

export const postStockPortfolio = (body) => {
  const url = import.meta.env.VITE_CALCULATE_PORTFOLIO;
  return axios.post(url, body);
};


export const postRebalanceStockPortfolio = (body) => {
  const url = import.meta.env.VITE_REBALANCE_PORTFOLIO;
  return axios.post(url, body);
};
