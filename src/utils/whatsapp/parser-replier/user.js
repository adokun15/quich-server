async function startAccountCreation() {
  //Check if phone has account before;
  //Check if email exist before;
  //Send Text MESSAGE TO ENTER EMAIL ADDRESS;
  //Restart if needed
  //Create converstion flow:  flow: create_account, step: awaiting_email
}

async function OtpCodeToUserEmailFlow() {
  //Send Text MESSAGE TO ENTER EMAIL ADDRESS;
  //Create converstion flow: flow: invalid_input_email | awaiting_otp, data: { email };
}

//Final step;
async function VerifyUserEmailCreationFlow() {
  //Success: update : data: null, step: null, flow: create_store ( Then send a Create store Form);
  //Create converstion flow: step: invalid_input_otp | timeout_otp |  data:{ reason, otp_received: };
}

async function RestartCreationFlow() {
  //Find email in state, delete mercahnt accouunt; SendHelpToNewUser();
  //Create converstion flow: flow: 'create_account', step: null;
}

async function ErrorEmailFlow() {
  //Get email from state and tell user it is not a valid email
  //Request again: flow: 'create_account', step: awaiting_email
}

async function ErrorOtpFlow() {
  //Get Otp from state and tell user it is not a valid Otp
  //Request again: flow: 'create_account', step: awaiting_otp
}
