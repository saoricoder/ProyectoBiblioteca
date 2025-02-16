USE master
GO

IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'BIBLIOTECA')
CREATE DATABASE BIBLIOTECA
GO

USE BIBLIOTECA
GO

-- Creación de la tabla Autores
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Autores')
CREATE TABLE Autores(
    Codigo INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NULL,
    Apellido VARCHAR(100) NULL
)
GO

-- Creación de la tabla Libros
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Libros')
CREATE TABLE Libros(
    Codigo INT PRIMARY KEY IDENTITY(1,1),  -- Se agrega la columna Codigo como clave primaria
    AutorCodigo INT NOT NULL,               -- Relacionamos con la tabla Autores
    ISBN VARCHAR(20) NOT NULL,
    Titulo VARCHAR(255) NULL,
    ValorPrestamo DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (AutorCodigo) REFERENCES Autores(Codigo),  -- Clave foránea a la tabla Autores
    Autor VARCHAR(MAX)
)
GO

-- Creación de la tabla Prestamos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Prestamos')
CREATE TABLE Prestamos(
    Numero INT PRIMARY KEY IDENTITY(1,1),
    FechaPrestamo DATETIME NOT NULL,
    Descripcion VARCHAR(255) NULL
)
GO

-- Creación de la tabla DetallePrestamos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'DetallePrestamos')
CREATE TABLE DetallePrestamos(
    id INT PRIMARY KEY IDENTITY(1,1),
    CodigoLibro INT NOT NULL,  -- Relación con la tabla Libros
    Cantidad INT NOT NULL,
    FechaEntrega DATETIME NOT NULL,
    FOREIGN KEY (CodigoLibro) REFERENCES Libros(Codigo)  -- Relación con la columna Codigo en Libros
)
GO
