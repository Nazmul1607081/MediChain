const express = require('express');
const app = express();
var http = require("http");
const Crypto = require('crypto');
const crypto = require('asymmetric-crypto')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const mysql = require('mysql');
const debug = require('debug')('savjeecoin:blockchain');

var con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "",
  database: "medichain",

});


class Transaction {
  /**
   * @param {string} fromAddress
   * @param {string} toAddress
   * @param {string} amount
   */
  constructor(fromAddress, toAddress, amount ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  /**
   * Creates a SHA256 hash of the transaction
   *
   * @returns {string}
   */
  calculateHash() {
    return Crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
  }

  /**
   * Signs a transaction with the given signingKey (which is an Elliptic keypair
   * object that contains a private key). The signature is then stored inside the
   * transaction object and later stored on the blockchain.
   *
   * @param {string} signingKey
   */
  signTransaction(signingKey) {
    const newKeyPair = crypto.fromSecretKey(signingKey)
    if (newKeyPair.publicKey !== this.fromAddress) {
      console.log("test key error")
      console.log(signingKey)
      console.log(newKeyPair.publicKey)
      console.log(this.fromAddress)
      throw new Error('You cannot sign transactions for other wallets!');
    }
    

    // Calculate the hash of this transaction, sign it with the key
    // and store it inside the transaction obect
    const hashTx = this.calculateHash();
    this.signature = crypto.sign(hashTx,signingKey)


  }

  /**
   * Checks if the signature is valid (transaction has not been tampered with).
   * It uses the fromAddress as the public key.
   *
   * @returns {boolean}
   */
  isValid() {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress == null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }
    const publicKey = this.fromAddress;
    return crypto.verify(this.calculateHash(), this.signature,publicKey);
  }
}

class Block {

  constructor(timestamp, transactions, previousHash = '',hash='') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    if(hash===''){this.hash = this.calculateHash();}
    else {
      this.hash = hash;
    }

  }


  calculateHash() {
    return Crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
  }


  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    debug(`Block mined: ${this.hash}`);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}


class Blockchain {
  constructor(chain) {
    //this.chain = [this.createGenesisBlock()];
    this.chain = chain;
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
    console.log("in the blockchian")
    console.log(this.chain);
  }

  createGenesisBlock() {
    return new Block(Date.parse('2017-01-01'), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    //const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    //this.pendingTransactions.push(rewardTx);

    var block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    let transaction_no = this.pendingTransactions[0].timestamp;
    let from_address = this.pendingTransactions[0].fromAddress;
    let to_address = this.pendingTransactions[0].toAddress;
    let amount = this.pendingTransactions[0].amount;
    let timestamp = Date.now();

    let previousHash = this.getLatestBlock().hash;


    let transaction_sql= "INSERT INTO transactions ( from_address,to_address,amount,transaction_no) VALUES (?,?,?,?)";
    let block_sql = "INSERT INTO blocks (previousHash,timestamp,transactions,hash)VALUES (?,?,?,?)"
    con.query(transaction_sql,[from_address,to_address,amount,transaction_no],function (error,results,fields) {
        if(error) throw error;
        console.log("before insert into bocks")
        console.log(block.previousHash)
        console.log(block.timestamp)
        console.log(block.calculateHash())
        if(results){
            con.query(block_sql,[previousHash,block.timestamp,transaction_no,block.calculateHash()],function (error,res,fields) {
                if(error)throw error;
                if(res){
                  console.log("Block added successfully")
                }
            })
        }
    })

    debug('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  /**
   * Add a new transaction to the list of pending transactions (to be added
   * next time the mining process starts). This verifies that the given
   * transaction is properly signed.
   *
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    ///TODO: please uncomment below two line
    // if (transaction.amount <= 0) {
    //   throw new Error('Transaction amount should be higher than 0');
    // }
    
    // Making sure that the amount sent is not greater than existing balance
    ///TODO: please uncomment below two line
    // if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
    //   throw new Error('Not enough balance');
    // }

    this.pendingTransactions.push(transaction);
    debug('transaction added: %s', transaction);
  }

  /**
   * Returns the balance of a given wallet address.
   *
   * @param {string} address
   * @returns {[]} The balance of the wallet
   */
  getBalanceOfAddress(address) {
    let balance = [];
    let publicKey = crypto.fromSecretKey(address).publicKey;
    //console.log(publicKey)
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        //console.log(trans)
         if(trans.toAddress===publicKey){
              let amount = trans.amount;
              let nonce = amount.split("*medichain*")[0];
              let data = amount.split("*medichain*")[1];
              let temp  = crypto.decrypt(data,nonce,trans.fromAddress,address);
              console.log(temp)
              let bal = {fromAddress:trans.fromAddress,toAddress:trans.toAddress,data:temp,type:'appointment'}
              balance.push(bal);
         }
         if(trans.fromAddress === publicKey){
              let amount = trans.amount;
              let nonce = amount.split("*medichain*")[0];
              let data = amount.split("*medichain*")[1];
              let temp  = crypto.decrypt(data,nonce,trans.toAddress,address);
              console.log(temp)
              let bal = {fromAddress:trans.fromAddress,toAddress:trans.toAddress,data:temp,type:'advice'}
              balance.push(bal);
         }
      }
      //console.log("block")
      //console.log(block)
    }

    return balance;
  }


  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    debug('get transactions for wallet count: %s', txs.length);
    return txs;
  }
  isChainValid() {
    const realGenesis = JSON.stringify(this.createGenesisBlock());
    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      // if (!currentBlock.hasValidTransactions()) {
      //   return false;
      // }

      // if (currentBlock.hash !== currentBlock.calculateHash()) {
      //   return false;
      // }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
