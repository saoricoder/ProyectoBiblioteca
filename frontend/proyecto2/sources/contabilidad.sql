use master
go
IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'CONTABILIDAD')
CREATE DATABASE CONTABILIDAD

GO 

USE CONTABILIDAD

GO

if not exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'TIPODECUENTA')
create table TIPODECUENTA(
id int primary key identity(1,1),
codigo int,
nombre varchar(60)
)

go

if not exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'CUENTA')
CREATE table CUENTA (
    codigo INT,
    nombre VARCHAR(255) NOT NULL,
    tipoDeCuenta VARCHAR(50) NOT NULL,
    saldo DECIMAL(18,2) NOT NULL DEFAULT 0
);

go

if not exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'COMPROBANTE')
create table COMPROBANTE(
codigo int primary key identity(1,1),
numero int,
fecha date,
observaciones varchar(60)
)

go
if not exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'DETALLE_COMPROBANTE')
create table DETALLE_COMPROBANTE(
codigo int primary key identity(1,1),
numero int,
cuenta varchar(60),
debe float,
haber float
)

go