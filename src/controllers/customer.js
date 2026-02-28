const getAllCustomersController = async (req, res, next) => {
  const merchantId = req?.uid;

  if (!merchantId) {
    throw new CustomError("Unauthorized Access to Customers Data!", 403);
  }
  const customers = await getAllCustomers(merchantId);
  res.json({ customers });
};

//Blacklist toggle
const updateCustomerStatus = async (req, res, next) => {};

const getSingleCustomerController = async (req, res, next) => {
  //Orders & Customer Details

  const merchantId = req?.uid;

  if (!merchantId) {
    throw new CustomError("Unauthorized Access to Customers Data!", 403);
  }
  const customers = await getAllCustomers(merchantId);
  res.json({ customers });
};
