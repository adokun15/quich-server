//Process paystack
const secret = `${process.env.PAYSTACK_SECRET_KEY}`;

//Disable ---- Fetch(my db) ---- Start;
export const start_subcription = async (req, res, next) => {
  //Validate Input Field From User
  //Retrieve
};

export const get_billings_subcription = async (req, res, next) => {};

export const disable_subcription = async (req, res, next) => {};

export const paystack_controller = async (req, res, next) => {
  //Process

  //Respond

  //Use Ip addres
  const { event, data } = req.body;

  res.status(200).json({ message: "success" });

  if (event === "subcription.create") {
    try {
      //Create Subcription
    } catch (e) {
      next(e);
    }
  }

  if (event === "subcription.disable") {
    try {
      /*
      Update Subcription status : inactive,
      Update Subcription end_date,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "subcription.non_renew") {
    try {
      /*
      Update Subcription status : non_renew,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.create") {
    try {
      /*
       create invoice,; status pending
       notify user;
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.payment_failed") {
    try {
      /*
       update invoice,; status failed
       update subscription status to 'attention'
       notify user: 'payment failed, we added grace period of 3 days to resume your subscrip';
       "Add extra 3day- grace-- EXTENDED END-DATE; on Subscription Table!"
      */
    } catch (e) {
      next(e);
    }

    if (event === "charge.success") {
      try {
        /*
       update invoice if invoice_parameter is there; status "paid", paid_at : "121"
       insert/create payment; status "paid", paid_at : "121"
       notify user;
      */
      } catch (e) {
        next(e);
      }
    }

    //
    if (event === "subscription.expiring_cards") {
      try {
        /*
       notify user via Email!;
       send a link to reset!
      */
      } catch (e) {
        next(e);
      }
    }
  }
  return res.status(200).end();
};
