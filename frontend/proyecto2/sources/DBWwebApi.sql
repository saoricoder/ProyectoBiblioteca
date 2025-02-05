use master
go
IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'DBWEBAPI')
CREATE DATABASE DDBWEBAPI

GO 

USE DBWEBAPI

GO

if not exists (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'USUARIOS')
create table USUARIOS(
IdUsuario int primary key identity(1,1),
usuario varchar(60),
password varchar(60),
)

go