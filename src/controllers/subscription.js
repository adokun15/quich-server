import {
  //DisableSubscriptionAction,
  getAllUserPayments,
  getInvoices,
  getSingleInvoice,
  getSubcriptionInfo,
  InitializeSubscription,
  ManageSubscriptionLink,
  VerifySubscriptionPayment,
} from "../services/subscription.js";
import CustomError from "../utils/error/error.js";
import ValidationError from "../utils/error/ValidationError.js";

//Subscription
export const PaySubscriptionController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;
    const { plan_code, amount } = req.body;

    if (!merchant_id || !plan_code || !amount) {
      throw new ValidationError("Invalid request!", 400);
    }

    /**
PLN_ottjfgq9m9ch44e (basic)
PLN_mtbji3kbcyz5r2x ( growth)
PLN_i6u0a7jizvw83dk ( premium )
PLN_eyi0wu17c3xdyb3 (trial)
     */
    const url = await InitializeSubscription({
      plan_code,
      merchant_id,
      amount,
    });

    res.json({ data: { url }, status: true });
  } catch (e) {
    next(e);
  }
};

export const getUserBillingController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const subscription = await getSubcriptionInfo({
      merchant_id,
    });

    res.json({ data: subscription, status: true });
  } catch (e) {
    next(e);
  }
};

/*
export const disableSubcriptionController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const subscription = await DisableSubscriptionAction({
      merchant_id,
    });

    res.json({ data: subscription, status: true });
  } catch (e) {
    next(e);
  }
};
*/

export const manageSubcriptionController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;
    const { sub_code } = req.params;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const url = await ManageSubscriptionLink({
      merchant_id,
      subscription_code: sub_code,
    });

    res.json({ data: { url }, status: true });
  } catch (e) {
    next(e);
  }
};

export const VerifySubscriptionPaymentController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;
    const { reference } = req.params;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const data = await VerifySubscriptionPayment({
      merchant_id,
      reference,
    });

    console.log(data);
    res.json({ data, status: true });
  } catch (e) {
    next(e);
  }
};

//Invoices
export const getUserInvoicesController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const invoices = await getInvoices({
      merchant_id,
    });

    res.json({ data: { invoices }, status: true });
  } catch (e) {
    next(e);
  }
};

//Single Invoice
export const getSingleUserInvoiceController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;
    const { invoice_code } = req.params;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const invoice = await getSingleInvoice({
      merchant_id,
      invoice_code,
    });

    res.json({ data: invoice, status: true });
  } catch (e) {
    next(e);
  }
};

//Payment
export const getUserPaymentsController = async (req, res, next) => {
  try {
    const { merchant_id } = req.user;

    if (!merchant_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const payments = await getAllUserPayments({ merchant_id });

    console.log(payments);

    res.json({ data: payments, status: true });
  } catch (e) {
    next(e);
  }
};
