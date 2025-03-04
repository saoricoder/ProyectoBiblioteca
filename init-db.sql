USE master;
GO

-- Create databases if they don't exist
IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'CONTABILIDAD')
CREATE DATABASE CONTABILIDAD;
GO

IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'BIBLIOTECA')
CREATE DATABASE BIBLIOTECA;
GO

IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'DBWEBAPI')
CREATE DATABASE DBWEBAPI;
GO

-- Create login
CREATE LOGIN saoricoder WITH PASSWORD = '23889';
GO

-- Configure CONTABILIDAD database
USE CONTABILIDAD;
GO
CREATE USER saoricoder FOR LOGIN saoricoder;
GO
ALTER ROLE db_owner ADD MEMBER saoricoder;
GO

-- Configure BIBLIOTECA database
USE BIBLIOTECA;
GO
CREATE USER saoricoder FOR LOGIN saoricoder;
GO
ALTER ROLE db_owner ADD MEMBER saoricoder;
GO

-- Configure DBWEBAPI database
USE DBWEBAPI;
GO
CREATE USER saoricoder FOR LOGIN saoricoder;
GO
ALTER ROLE db_owner ADD MEMBER saoricoder;
GO