class Order {
  constructor(
    orderid,
    invoiceid,
    amt,
    dueDate,
    pdfurl,
    status,
    lineItem,
    rqCode,
    merchantid,
    customer,
    ref,
    recipient,
    merchantrole
  ) {
    this.orderId = orderid;
    this.invoiceId = invoiceid;
    this.amount = amt;
    this.due_date = dueDate;
    this.pdf_url = pdfurl;
    this.status = status;
    this.checkoutList = lineItem;
    this.requestCode = rqCode;
    this.merchantId = merchantid; //metadata : { }
    this.customer = customer;
    this.reference = ref;
    this.recipient = recipient;
    this.role = merchantrole;
    //  this.actualProfitAmount = profit;
  }
}

export default Order;
