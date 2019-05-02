class Loan {
  constructor() {
    this.loanData = [{
      id: 'jksd83w72kjsd0die7728ujdj98e8',
      userEmail: 'benshidanny11@gmail.com',
      status: 'pending',
      repaid: 'false',
      tanor: 6,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 1000000,
    },
    {
      id: 'jksd83w72kjsd0909398e8hd89w9',
      userEmail: 'dukuze11@gmail.com',
      status: 'approved',
      repaid: 'false',
      tanor: 6,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 100000,
    },
    {
      id: 'jksd83wrgjsd0909398e8hd8rf',
      userEmail: 'kalisa11@gmail.com',
      status: 'approved',
      repaid: 'repaid',
      tanor: 5,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 0,
    }];
  }

  async applyforLoan(loan) {
    if (!loan) {
      return false;
    }
    this.loanData.push(loan);
    return true;
  }

  async getLoanByUserEmail(email) {
    return this.loanData.find(loan => loan.userEmail === email);
  }
}


export default new Loan();
