class Customer {
  constructor(name, phone, email, total_amt, createdDate, code, id, orders) {
    this.customerName = name;
    this.customerPhoneNumber = phone;
    this.customerEmail = email;
    this.customerTotalAmount = total_amt;
    this.dateJoined = createdDate;
    this.customerCode = code;
    this.customerId = id;
    this.orders = orders || [];
  }
}

export default Customer;
