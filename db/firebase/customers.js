//Read & Deleted
import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";

//Charge Success - splitCode - merchant
const getMerchantBySplitCode = async (splitCode) => {
  if (!splitCode) {
    throw new CustomError("Account Not Found!");
  }

  const merchantRef = getFirestore()
    .collection("users")
    .where("splitCode", "==", splitCode);
  let uid = null;
  await merchantRef.get().then((user) => {
    return user.forEach((data) => {
      if (data.exists) {
        uid = data.get("userId");
      }
    });
  });
  return uid;
};

export const addCustomerTransactions = async (data) => {
  try {
    const customer_Date = new Date();
    const merchantId = await getMerchantBySplitCode(data?.split?.split_code);

    const customerRef = getFirestore()
      .collection(`customers/${merchantId}/users`)
      .doc(`${data?.customer?.customer_code}`);

    const updateCustomerOrder = await getFirestore().runTransaction(
      async (transaction) => {
        const customerDoc = await transaction.get(customerRef);
        const newOrder = {
          status: data?.status,
          transactionId: data?.reference,
          paidAt: data?.paid_at,
          channel: data?.channel,
          authCode: data?.authorization?.authorization_code,
          amount: data?.amount / 100,
        };

        if (!customerDoc.exists) {
          //Set new data,npm stsar
          const customer = {
            id: data?.customer?.id,
            name: data?.customer?.first_name,
            lastName: data?.customer?.last_name,
            email: data?.customer?.email,
            phone: data?.customer?.phone,
            updated: customer_Date.getTime(),
            created: customer_Date.toISOString(),
            code: data?.customer.customer_code,
          };

          transaction.create(customerRef, { ...customer, orders: [newOrder] });
          return "New Customer order created!";
        }

        //Update Transaction Only
        const newOrderList = [newOrder, ...customerDoc.data().orders];

        const transactionExistAlready = customerDoc
          .data()
          .orders?.some(
            (order) => order.transactionId === newOrder?.transactionId
          );
        if (!transactionExistAlready) {
          transaction.update(customerRef, {
            orders: newOrderList,
            updated: customer_Date.getTime(),
          });
          return "Existing Customer order updated!";
        } else {
          return "Transaction already exist on Database!";
        }
      }
    );
    return updateCustomerOrder;
  } catch (e) {
    throw new CustomError(e?.code || e?.message || "Something went wrong");
  }
};

export const getAllCustomers = async (merchantId) => {
  //paginate late
  try {
    const ref = getFirestore()
      .collection(`customers/${merchantId}/users`)
      .orderBy("updated", "desc");
    //Run tansaction
    const Customers = await getFirestore().runTransaction(
      async (transaction) => {
        const customersDoc = await transaction.get(ref);

        if (customersDoc.empty) {
          throw new CustomError("No Customer yet!");
        }

        let list = [];
        //Get all customer
        customersDoc.docs.forEach((customer) => {
          list.push({ ...customer.data(), customerDocId: customer.id });
        });
        return list;
      }
    );

    return Customers;
  } catch (e) {
    throw new CustomError(e?.message || e?.code);
  }
};
