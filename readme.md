# Seblack Hot Backend
---
This is LoopBack3.x REST API server using empty template + postgre connector

First things first;

This is my very first time to develop an application using LoopBack, so I try this with combination
of AI (Copilot and ChatGPT), but to be precisely... they are more usable when lint code than
giving correct codes for me.

More codes here mostly run by trials and errors, because it's my first time experience code with
LoopBack, so it quite hard at first time to find out why the code is not running, it's like:
1. the code not running because it's not supporting async await
2. modern import not working, it's need old express / nodejs import using require
3. datasource is confusing me, even models js file able to run with default empty configuration
4. it's kind of confuse me with ACL, because mostly code that i've already build is using JWT in
   some traditional way (login -> get token -> use token), i know using some roles but in this test
   i just think to overkill, so I just want to simplify it by using only token here.

After 3 days, i found some way to overcome tricky situation using LoopBack, just like using Promise
to replace the async await (thanks copilot), accessing headers to get token (thanks gpt).

I know, i feel bad by extend my learning using AI but as per their company said, the AI would give
wrong information, so basically I use two of it and lot's of time its make me confuse until i try it alots
and found the solution without their answers (and yeah, some code come from them too, but its already adjusted)

---
Disclaimer: all this code probably make you bit confused, but i try to follow the default convention (use CLI)
and, another Disclaimer: i'm sorry it's make my chances getting lower (a bit maybe?), to be honest, until now
I still doesn't understand unit test, and there some task from other company need to be done at this moment,
so I'll ask you to consider this without test unit 🙏.
also, another Disclaimer (again): this code not using ENV, because I just follow the CLI style. Just like datasource
is using its value directly on datasource json file. And my datasource is using free postgresql hosting named,
ElephantSQL.

---
### Model Config (server/model-config.json)

I just hide all non required public api from customers, because i only show the login and register
```
  "customer": {
    "dataSource": "postgre",
    "public": true,
    "options": {
      "remoting": {
        "sharedMethods": {
          "*": false,
          "login": true,
          "register": true
        }
      }
    }
  },
```

### Schema

Basically, the schema on common/models can be used, but here the sql file of all tables
```SQL
CREATE TABLE public.customer (
	id serial4 NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NULL,
	createdat timestamp NULL,
	updatedat timestamp NULL,
	CONSTRAINT customer_pkey PRIMARY KEY (id)
);

CREATE TABLE public.menu (
	"name" text NOT NULL,
	"desc" text NULL,
	imageurl text NULL,
	price int4 NULL,
	createdat timestamptz NULL,
	updatedat timestamptz NULL,
	id serial4 NOT NULL,
	CONSTRAINT menu_pkey PRIMARY KEY (id)
);

CREATE TABLE public."order" (
	id serial4 NOT NULL,
	customerid int4 NOT NULL,
	ordercode varchar(255) NOT NULL,
	createdat timestamp NULL,
	updatedat timestamp NULL,
	status varchar NULL,
	CONSTRAINT order_pkey PRIMARY KEY (id)
);
```

and here the required relation many to many, i approach this by using a table bridge
```SQL
-- public.menu_order definition

-- Drop table

-- DROP TABLE public.menu_order;

CREATE TABLE public.menu_order (
	id serial4 NOT NULL,
	menuid int4 NOT NULL,
	orderid int4 NOT NULL,
	count int4 NULL,
	price numeric NULL,
	subtotal numeric NULL,
	createdat timestamp NULL,
	updatedat timestamp NULL,
	"name" varchar NULL,
	CONSTRAINT menu_order_pkey PRIMARY KEY (id)
);
```

Some of coding, will explain the function... so please access all on each folders

Thanks,

M. Rizkiansyah
