'use strict';
const jwt = require('jsonwebtoken');

module.exports = function(Order) {
  const MakeCustomerOrder = (items, req) => {
    const token = req.headers.authorization;

    // Verify and decode the token
    return new Promise((resolve, reject) => {
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          reject({success: false, message: 'Not authorized'});
        } else {
          const customerId = decoded.customerId;

          Order.create({
            customerId: customerId,
            orderCode:
              Math.random().toString(36).substring(2, 10) +
              Math.random().toString(36).substring(2, 10),
            status: 'WAITING',
            createdAt: new Date(),
          }, (err, order) => {
            if (err)
              reject({success: false});

            const MenuOrder = Order.app.models.MenuOrder;
            const itemsData = [];

            // after order is created, then process the menu items
            Promise.all(JSON.parse(items).map((item) => {
              return new Promise((_resolve, _reject) => {
                MenuOrder.create({
                  orderId: order.id,
                  menuId: item.id,
                  count: item.count,
                  price: item.price,
                  subtotal: item.st,
                  createdAt: new Date(),
                  name: item.name,
                }, (err, menuOrder) => {
                  console.log('menu order items', menuOrder);
                  if (err) return _reject(err);
                  _resolve(itemsData.push(menuOrder));
                });
              });
            })).then(() => {
              resolve({success: true, order, items: itemsData});
            }).catch(reject);
          });
        }
      });
    }).catch(err => {
      console.error(err);
      return {success: false, message: 'Fatal Error'};
    });
  };

  const OrderList = (req) => {
    return new Promise((resolve, reject) => {
      const token = req.headers.authorization;

      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          reject({success: false, message: 'Not authorized'});
        } else {
          // Get orders
          Order.find({}, (err, orders) => {
            if (err) {
              reject({success: false});
            } else {
              const MenuOrder = Order.app.models.MenuOrder;

              // after order is accessed, get the menu item
              Promise.all(orders.map((order) => {
                return new Promise((_resolve, _reject) => {
                  MenuOrder.find(
                    {where: {orderId: order.id}}
                    , (err, menuOrders) => {
                      if (err) return _reject(err);
                      const items = menuOrders.map(menuOrder => ({
                        name: menuOrder.name,
                        count: menuOrder.count,
                        subtotal: parseInt(menuOrder.subtotal),
                      }));
                      const total =
                        items.reduce(
                          (sum, item) => sum + parseInt(item.subtotal), 0
                        );
                      _resolve({
                        id: order.id,
                        orderCode: order.orderCode,
                        status: order.status,
                        items, total,
                      });
                    }
                  );
                });
              })).then((data) => {
                resolve({success: true, data});
              }).catch(reject);
            }
          });
        }
      });
    }).catch(err => {
      console.error(err);
      return {success: false, message: 'Fatal Error'};
    });
  };

  Order.createOrder = MakeCustomerOrder;
  Order.list = OrderList;

  Order.remoteMethod('createOrder', {
    accepts: [
      {arg: 'items', type: 'string'},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/create', verb: 'post'},
  });

  Order.remoteMethod('list', {
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/list', verb: 'get'},
  });
};
