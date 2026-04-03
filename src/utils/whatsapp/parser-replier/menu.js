async function SendNoScoreMenuToUser() {}
async function SendLowScoreMenuToUser() {}

async function SendMenuToUser() {
  await WhatsappInteractiveListButton({
    phone,
    header_text: `Welcome ${name}`,
    body_text: "Select the next menu to continue",
    action_button_text: "Menu Guide",
    sections_list: [
      //1 section
      {
        title: "Product",
        rows: [
          {
            id: "add_product",
            title: "Add Product",
            description: "Create a new product for your store",
          },
          {
            id: "view_products",
            title: "View Products",
            description: "Manage and see newly added products",
          },
        ],
      },

      {
        title: "Customers",
        rows: [
          {
            id: "view_customers",
            title: "View recent Customers",
            description: "(e.g Who just bought goods from you?)",
          },
          {
            id: "manage_customers",
            title: "Manage Customers",
            description: "(e.g Update a customer detail)",
          },
        ],
      },
      {
        title: "Orders",
        rows: [
          {
            id: "view_orders",
            title: "View Recent Orders",
            description: "Get the last 8 orders,",
          },
          {
            id: "manage_orders",
            title: "Manage Orders",
            description: "(e.g Change an Order's status)",
          },
        ],
      },
      {
        title: "Store",
        rows: [
          {
            id: "storefront",
            title: "Access StoreFront",
            description: "Take a look at your store",
          },

          {
            id: "store_settings",
            title: "Store Settings",
            description: "Change your store settings",
          },
          {
            id: "billing",
            title: "Manage billing",
            description: "Take control of your subcription payment.",
          },
          {
            id: "login",
            title: "Access Dashboard",
            description: "Operate via website",
          },
          //   <!-- Additional rows would go here -->
        ],
      },
    ],
  });
}
