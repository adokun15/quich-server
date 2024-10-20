//Read & Deleted
import { getFirestore } from "firebase-admin/firestore";

export const getAllCustomers = async (merchantId) => {
  //Use Firebase
  const merchant_customer_path = await getFirestore()
    .collection("customers")
    .doc(merchantId)
    .get();
  const merchant_customers = merchant_customer_path?.customers;
  return merchant_customers;
};

export const getSingleCustomer = async (merchantId, customerId) => {
  const merchant_customer_path = await getFirestore()
    .collection("customers")
    .doc(merchantId)
    .get();
  const merchant_customers = merchant_customer_path?.customers?.find(
    (customer) => customer.id == customerId
  );
};
export const removeSingleCustomer = async (merchantId, customerId) => {
  const merchant_customer_doc = getFirestore()
    .collection("customers")
    .doc(merchantId);

  const merchant_customers = await merchant_customer_doc
    .get()
    ?.customers?.filter((customer) => customer.id != customerId);

  const merchant_customer_path = await merchant_customer_doc.update({
    customers: merchant_customers,
  });

  return "Removed Successfully!";
};
