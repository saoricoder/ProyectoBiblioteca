DECLARE @table_name NVARCHAR(256)
DECLARE @sql NVARCHAR(MAX)

-- Cursor para recorrer todas las tablas de la base de datos actual
DECLARE table_cursor CURSOR FOR 
SELECT name 
FROM sys.tables
WHERE type = 'U' -- 'U' es para tablas de usuario (no vistas ni tablas del sistema)

-- Abriendo el cursor
OPEN table_cursor

-- Obtenemos la primera tabla
FETCH NEXT FROM table_cursor INTO @table_name

-- Iterando a través de todas las tablas
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Crear la sentencia SQL dinámica para eliminar la tabla
    SET @sql = 'DROP TABLE [dbo].[' + @table_name + ']'
    
    -- Ejecutar la sentencia SQL para eliminar la tabla
    EXEC sp_executesql @sql

    -- Obtener la siguiente tabla
    FETCH NEXT FROM table_cursor INTO @table_name
END

-- Cerramos y liberamos el cursor
CLOSE table_cursor
DEALLOCATE table_cursor
