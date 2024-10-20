class UserModel {
  constructor(
    name,
    phone,
    email,
    total_amt,
    pending_amt,
    createdDate,
    bank,
    id,
    role,
    link,
    subAccount
  ) {
    this.businessName = name;
    this.phoneNumber = phone;
    this.email = email;
    this.totalAmount = total_amt;
    this.pendingAmount = pending_amt;
    this.userId = id;
    this.bank_details = bank;
    this.subaccount = subAccount;
    this.role = role;
    this.storeLink = link;
    this.dateJoined = createdDate;
  }
}

export default UserModel;
