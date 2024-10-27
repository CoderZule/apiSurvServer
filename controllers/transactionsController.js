const Transaction = require('../models/transaction');


const fetchTransaction = async (req, res) => {
  try {
    const userId = req.query.userId;

    const transactions = await Transaction.find({ User: userId });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const createTransaction = async (req, res) => {
  try {
    const { OperationType, Description, TransactionDate, Category, Amount, Note, User } = req.body;


    if (!OperationType ||!Description || !TransactionDate || !Category || !Amount || !User) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newTransaction = new Transaction({
      OperationType,
      Description,
      TransactionDate: new Date(TransactionDate),
      Category,
      Amount,
      Note,
      User
    });

    await newTransaction.save();

    res.status(201).json({ success: true, message: 'Transaction added successfully', data: newTransaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error getting transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function editTransaction(req, res) {
  try {
    const editedTransactionData = req.body;
    const { _id } = editedTransactionData;

    const transaction = await Transaction.findByIdAndUpdate(_id, editedTransactionData, { new: true });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.send("Transaction updated successfully");
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { transactionId } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction entry not found' });
    }

    return res.json({ message: 'Transaction entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction entry:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

}

module.exports = {
  fetchTransaction: fetchTransaction,
  createTransaction: createTransaction,
  getTransactionById: getTransactionById,
  editTransaction: editTransaction,
  deleteTransaction: deleteTransaction
};
