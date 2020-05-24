create schema if not exists door_system collate utf8mb4_0900_ai_ci;
use door_system;

create table if not exists devices
(
    i_device    int auto_increment
        primary key,
    name        varchar(255)                                         not null,
    description varchar(255)                                         null,
    ip          varchar(255)                                         null,
    mode        enum ('LOCKED', 'UNLOCKED', 'GUARD') default 'GUARD' not null,
    token       varchar(255)                                         null,
    constraint ip
        unique (ip),
    constraint ip_2
        unique (ip)
);

create table if not exists roles
(
    i_role      int auto_increment
        primary key,
    name        varchar(255)         not null,
    allowed_all tinyint(1) default 0 not null
);

create table if not exists cards
(
    i_card int auto_increment
        primary key,
    uuid   varchar(255) null,
    name   varchar(255) null,
    i_role int          null,
    constraint cards_ibfk_1
        foreign key (i_role) references roles (i_role)
            on update cascade on delete set null
);

create table if not exists logs
(
    i_log       int auto_increment
        primary key,
    i_device    int          null,
    device_name varchar(255) null,
    i_role      int          null,
    role_name   varchar(255) null,
    i_card      int          null,
    card_name   varchar(255) null,
    time        datetime     null,
    access      tinyint(1)   null,
    device_ip   varchar(255) null,
    uuid        varchar(255) null,
    error       varchar(255) null,
    constraint logs_ibfk_4
        foreign key (i_device) references devices (i_device)
            on update cascade on delete set null,
    constraint logs_ibfk_5
        foreign key (i_role) references roles (i_role)
            on update cascade on delete set null,
    constraint logs_ibfk_6
        foreign key (i_card) references cards (i_card)
            on update cascade on delete set null
);

create table if not exists role_device_permissions
(
    i_role_device int auto_increment
        primary key,
    i_device      int null,
    i_role        int null,
    constraint role_device_permissions_i_role_i_device_unique
        unique (i_device, i_role),
    constraint role_device_permissions_ibfk_3
        foreign key (i_device) references devices (i_device)
            on update cascade on delete cascade,
    constraint role_device_permissions_ibfk_4
        foreign key (i_role) references roles (i_role)
            on update cascade on delete cascade
);


create table if not exists users
(
    i_user   int auto_increment
        primary key,
    name     varchar(255) not null,
    login    varchar(255) not null,
    password varchar(255) not null
);

create table if not exists sessions
(
    i_session  int auto_increment
        primary key,
    session    varchar(255) not null,
    created_at datetime     null,
    i_user     int          not null,
    constraint sessions_ibfk_1
        foreign key (i_user) references users (i_user)
            on update cascade
);

create index i_role on cards (i_role);

create index i_card on logs (i_card);

create index i_device on logs (i_device);

create index i_role on logs (i_role);

create index i_role on role_device_permissions (i_role);

create index i_user on sessions (i_user);
