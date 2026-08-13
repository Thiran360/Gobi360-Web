export const API_BASE_URL = 'https://api.codingboss.in/gobi360';

export const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
};

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;
  return fetch(apiUrl(path), {
    ...rest,
    headers: { ...API_HEADERS, ...headers },
  });
}

/** Fetch JSON safely — returns null on network error, non-OK status, or invalid JSON. */
export async function apiJson(path, options = {}) {
  try {
    const response = await apiFetch(path, options);
    if (!response.ok) return null;
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const ENDPOINTS = {
  login: '/login/',
  signup: '/signup/',
  experts: '/experts/',
  categories: '/categories/',
  expertCategories: '/expert-categories/',
  shops: '/shops/',
  products: '/products/',
  productCategories: '/product-categories/',
  productVariations: '/product-variations/',
  cart: (userId) => `/cart/?user_id=${userId}`,
  cartItem: (itemId) => `/cart/item/${itemId}/`,
  checkout: '/checkout/',
  orders: (userId) => `/orders/${userId}/`,
  order: (orderId) => `/order/${orderId}/`,
  orderCancel: '/order/cancel/',
  address: (userId) => `/address/?user_id=${userId}`,
  addressItem: (id) => `/address/${id}/`,
  rewardSetting: (shopId) => `/reward-setting/${shopId}/`,
  shopkeeperRewardSetting: (userId) => `/shopkeeper/reward-setting/${userId}/`,
  shopkeeperRewardSettingUpdate: (userId) => `/shopkeeper/reward-setting/update/${userId}/`,
  expertServiceRequest: (userId) => `/expert/service-request/${userId}/`,
  expertServiceRequestUpdate: (id) => `/expert/service-request/update/${id}/`,
  customerServiceOrders: (customerId) => `/customer/service-orders/${customerId}/`,
  callRequest: '/call-request/',
  callRequestList: '/call-request-list/',
};
