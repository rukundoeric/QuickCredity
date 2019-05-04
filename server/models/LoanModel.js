class Loan {
  constructor() {
    this.loanData = [{
      id: 'jksd83w72kjsd0die7728ujdj98e8',
      userEmail: 'benshidanny11@gmail.com',
      status: 'pending',
      repaid: false,
      tanor: 6,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 1000000,
      interest: 200000,
    },
    {
      id: 'jksd83w72kjsd0909398e8hd89w9',
      userEmail: 'dukuze11@gmail.com',
      status: 'approved',
      repaid: false,
      tanor: 6,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 100000,
      interest: 200000,
    },
    {
      id: 'jksd83wrgjsd0909398e8hd8rf',
      userEmail: 'dannykamo2023@gmail.com',
      status: 'approved',
      repaid: true,
      tanor: 5,
      amount: 1000000,
      paymentInstallment: 20000,
      balance: 0,
      interest: 200000,
    }];
    this.repaymentHistory = [
      {
        loanId: 'jksd83w72kjsd0die7728ujdj98e8',
        userEmail: 'benshidanny11@gmail.com',
        createdOn: '4/5/2019',
        monthlyInstallment: 200000,
        amount: 1000000,
        paidAmount: 200000,
      },
      {
        loanId: 'jksd83wrgjsd0909398e8hd8rf',
        userEmail: 'dannykamo2023@gmail.com',
        createdOn: '4/5/2019',
        monthlyInstallment: 200000,
        amount: 1000000,
        paidAmount: 200000,
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

  async viewLoan() {
    return this.loanData;
  }

  async getSpecLoan(id) {
    return this.loanData.find(loan => loan.id === id);
  }

  async viewRepaymentHistory() {
    return this.repaymentHistory;
  }
}


export default new Loan();
