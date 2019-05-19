import joi from 'joi';

class Validator {
  constructor() {
    this.Validate = {
      loginSchema: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().regex(/^[a-zA-Z]/).min(7).required(),
      }),
      userSchema: joi.object().keys({
        email: joi.string().email().required(),
        firstName: joi.string().regex(/^[a-zA-Z]/).min(1).required(),
        lastName: joi.string().regex(/^[a-zA-Z]/).min(1).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]/).min(8).required(),
        // status:joi.string().regex(/^[a-zA-Z0-9]/).min(3).required(),
        address: joi.string().regex(/^[a-zA-Z]/).min(3).required(),
        userRole: joi.string().regex(/^[a-zA-Z]/).min(3).required(),
      }),
      verifySchema: joi.object().keys({
        status: joi.string().regex(/^[a-zA-Z]/).min(3).required(),
      }),
      loanSchema: joi.object().keys({
        userEmail: joi.string().regex(/^[a-zA-Z]/).required(),
        tenor: joi.number().required(),
        amount: joi.number().required(),
      }),
      repaidLoanSchema: joi.object().keys({
        status: joi.string().regex(/^[a-zA-Z]/).min(6).required(),
        repaid: joi.boolean().required(),
      }),
      approveOrRejectSchema: joi.object().keys({
        status: joi.string().regex(/^[a-zA-Z]/).min(6).required(),
      }),
      repayLoanSchema: joi.object().keys({
        paidAmount: joi.number().required(),
      }),
      repayLoanSchemaV2: joi.object().keys({
        paidAmount: joi.number().required(),
        userEmail: joi.string().regex(/^[a-zA-Z]/).required(),
      }),
      postRepaymentScema: joi.object().keys({
        loanId: joi.string().regex(/^[a-zA-Z]/).min(5).required(),
        userEmail: joi.string().regex(/^[a-zA-Z]/).min(5).required(),
        paidAmount: joi.number().required(),
      }),
      resetPassSchema: joi.object().keys({
        oldPassword: joi.string().regex(/^[a-zA-Z]/).required(),
        newPassword: joi.string().regex(/^[a-zA-Z]/).min(8).required(),
        confirmPassword:  joi.string().regex(/^[a-zA-Z]/).min(8).required(),
      }),
    };
  }
}

export default new Validator();
