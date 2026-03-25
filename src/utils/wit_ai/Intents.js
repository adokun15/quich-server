//Intent with expected entities;
export const intents = {
  create_account: [],//Flow
  delete_account: [],
  account_summary: [],
  edit_account: [],

  //Store
  create_store: [],//Flow
  store_settings: [],
  store_summary: [],
  community: ["link"],
  store_video: [],

  //Orders
  view_order: ["order_id"],
  view_orders: [],
  add_order: [], //Flow
  cancel_order: ["order_id"],
  mark_order_complete: ["order_id"],

  //Products
  create_product: [],//Flow
  remove_product: ["product_name"],
  remove_product_from_category: ["category_name", "product_name"],
  add_product_to_category: ["category_name", "product_name"],
  edit_product: ["product_name"],
  //add_product_image: ["product"],//Flow
  // "view_product_stats":[],

  //Customers
  all_customers: [],
  recent_customers: [],
  active_customers: [],
  add_customer_to_blacklist: ["customer_phone"],
  remove_customer_from_blacklist: ["customer_phone"],
  customer_orders: ["customer_phone"],
  customer_info: ["customer_phone"],

  //Category
  create_category: ["category_name"],
  update_category: ["category_name"],
  view_category: ["category_name"],
  view_categories: [""],
  remove_category: ["category_name"],

  //Subscription
  pause_subscription: ["subscription_plan"],
  help_subscription: [],
  plans_for_subscription: [],
  resume_subscription: [],
  start_subscription: [],
  subscription_status: [],
  change_subscription: ["plan_name"],

  //Support
  about: [],
  contact: [],
  connect_socials: [],
  give_feedback: [],
  feature_request: [],
  privacy_policy: [],
  company_terms: [],
};
