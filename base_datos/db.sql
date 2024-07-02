use delivery_;


CREATE TABLE users(
	id bigint primary KEY auto_increment,
    email varchar(180) NOT NULL UNIQUE,
    name varchar(90) NOT NULL,
    lastname Varchar(90) NOT NULL,
    notification_token Varchar(255),
    phone varchar(90) NOT NULL UNIQUE,
    image varchar(255) NOT NULL,
    password varchar(90) NOT NULL,
    created_at timestamp(0) NOT NULL,
    updated_at timestamp(0) NOT NULL
);
use delivery_;

create table roles(
id bigint primary key auto_increment,
name varchar(90) not null unique,
image varchar(255) null,
route varchar(180) not null,
created_at timestamp(0) not null,
updated_at timestamp(0) not null
);

Insert into roles(
    name,
    route,
    created_at,
    updated_at
)

Values(
'RESTAURANTE',
'/restaurant/orders/list',
'2023-10-25',
'2023-10-25'
);
Insert into roles(
    name,
    route,
    created_at,
    updated_at
)

Values(
'REPARTIDOR',
'/delivery/orders/list',
'2023-10-25',
'2023-10-25'
);
Insert into roles(
    name,
    route,
    created_at,
    updated_at
)

Values(
'CLIENTE',
'/client/products/list',
'2023-10-25',
'2023-10-25'
);
create table user_has_roles(
	id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null,
    foreign key(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE, 
	foreign key(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE, 
	primary key(id_user, id_rol)
    );

CREATE TABLE categories(
	id bigint primary key auto_increment,
    name VARCHAR(180) NOT null,
    description text not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) not null
);
CREATE table products(
	id bigint primary key auto_increment,
    name varchar(180) not null unique,
    description text not null,
    price double not null,
    image1 varchar(255) null,
    image2 varchar(255) null,
    image3 varchar(255) null,
    id_category bigint not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0)not null,
    foreign key(id_category) references categories(id) on update cascade on delete cascade
);
CREATE TABLE address(
	id bigint primary key auto_increment,
    address varchar(255) not null,
    neighborhood varchar(180) not null,
    lat double not null,
    lng double not null,
    created_at timestamp(0)not null,
    updated_at timestamp(0)not null,
    id_user bigint not null,
    foreign key(id_user) references users(id) on update cascade on delete cascade
);

CREATE TABLE orders(
	id bigint primary key auto_increment,
    id_client bigint not null,
    id_delivery bigint null, 
    id_address bigint not null,
    lat double precision,
    lng double precision,
    status varchar(90)not null,
    timestamp bigint not null,
    created_at timestamp(0)not null,
    updated_at timestamp(0)not null,
    foreign key(id_client)references users(id) on update cascade on delete cascade,
    foreign key(id_delivery)references users(id) on update cascade on delete cascade,
    foreign key(id_address)references address(id) on update cascade on delete cascade
);

CREATE table order_has_products(
id_order bigint not null,
id_product bigint not null,
quantity bigint not null,
created_at timestamp(0) not null,
updated_at timestamp(0) not null,
primary key(id_order, id_product),
foreign key(id_order)references orders(id)on update cascade on delete cascade,
foreign key(id_product)references products(id)on update cascade on delete cascade
);