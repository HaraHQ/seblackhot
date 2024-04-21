'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = function(Customer) {
  // Make login using email and password
  const Login = (email, password) => {
    return new Promise((resolve, reject) => {
      Customer.findOne({where: {email}}, (err, data) => {
        if (err)
          // when rejected it automatically return data as callback
          reject({
            message: 'Account is not found',
          });

        if (bcrypt.compareSync(password, data.password)) {
          // return customer id that the password is matched using bcrypt
          resolve({
            token: jwt.sign({
              customerId: data.id,
            }, 'secret'),
          });
        }

        reject({
          message: 'Invalid email or password',
        });
      });
    });
  };

  const Register = (email, password, cb) => {
    return new Promise((resolve, reject) => {
      // on register, find the email first to prevent dupe
      Customer.findOne({where: {email}}, (err) => {
        if (err) reject({
          message: 'Email already used...',
        });
      });

      // create a new customer account
      Customer.create({
        email,
        password: bcrypt.hashSync(password, 12),
        createdAt: new Date(),
      }, (err, data) => {
        if (err) reject({
          message: 'Unable to register',
        });

        resolve({
          message: 'Success',
        });
      });
    });
  };

  Customer.login = Login;
  Customer.register = Register;

  Customer.remoteMethod('login', {
    accepts: [
      {arg: 'email', type: 'string'},
      {arg: 'password', type: 'string'},
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/login', verb: 'post'},
  });

  Customer.remoteMethod('register', {
    accepts: [
      {arg: 'email', type: 'string'},
      {arg: 'password', type: 'string'},
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/register', verb: 'post'},
  });
};
