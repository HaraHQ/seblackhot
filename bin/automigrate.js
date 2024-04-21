'use strict';

var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.postgre;

ds.automigrate('menu', function(err) {
  if (err) throw err;

  // initialize the data to be inserted
  var menus = [
    {
      name: 'Seblack Junior',
      desc: 'Seblak dengan kencur pedas seuhah',
      imageUrl: '/seblack.png',
      price: 10000,
      createdAt: new Date(),
      updateDate: new Date(),
    },
    {
      name: 'Seblack Jamuy Kencuy',
      desc: 'Seblak dengan bumbu jamur extra kencur bikin bibir ancur',
      imageUrl: '/seblack.png',
      price: 15000,
      createdAt: new Date(),
      updateDate: new Date(),
    },
    {
      name: 'Seblack Blacknya',
      desc: 'Seblak bumbu hitam penuh ketidakwarasan kokinya',
      imageUrl: '/seblack.png',
      price: 20000,
      createdAt: new Date(),
      updateDate: new Date(),
    },
  ];

  // for each row create the data
  menus.map(menu => app.models.menu.create(menu));
});
