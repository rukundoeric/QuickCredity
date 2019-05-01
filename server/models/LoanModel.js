class Loan {
  constructor() {
    this.loanData = [{
      id: 2020, userEmail: 'benshidanny11@gmail.com', status: 'pending', repaid: 'false', tanor: 6, amount: 1000000,
    }];
  }

  async viewLoan() {
    return this.loanData;
  }
}
export default new Loan();