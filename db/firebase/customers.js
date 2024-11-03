//Read & Deleted
import { getFirestore } from "firebase-admin/firestore";

//Charge Success - splitCode - merchant
const getMerchantBySplitCode = async (splitCode) => {
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
            code: data?.customer.customer_code,
          };

          transaction.create(customerRef, { ...customer, orders: [newOrder] });
          return "New Customer order created!";
        }

        //Update Transaction Only
        const newOrderList = [newOrder, ...customerDoc.data().orders];

        transaction.update(customerRef, { orders: newOrderList });
        return "Existing Customer order updated!";
      }
    );
    return updateCustomerOrder;
  } catch (e) {
    console.log(e);
    throw new Error(e?.code || e?.message || "Something went wrong");
  }
};

export const getAllCustomers = async (merchantId) => {
  //paginate late
  const ref = getFirestore().collection(`customers/${merchantId}/users`);

  let customers = [];

  await ref
    .get()
    .then((data) => {
      data.forEach((customer) => {
        if (customer?.exists) {
          customers.push({ ...customer.data(), customerDocId: customer.id });
        }
      });
    })
    .catch((err) => {
      throw new Error(
        err?.code || err?.message || "Something went wrong getting customers"
      );
    });
  return { customers };
};
