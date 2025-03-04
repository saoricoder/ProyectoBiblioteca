# ProyectoBiblioteca - Sistema Integral de Gestión

## 🚀 Visión General
Sistema completo de gestión con módulos de Biblioteca y Contabilidad, desarrollado con arquitectura moderna y tecnologías actualizadas.

## 🛠️ Tecnologías Principales
### Frontend
- React 18 + Vite
- React Router v6
- CSS Modules
- Fetch API
- JWT Authentication

### Backend
- .NET Web API 7
- Entity Framework Core
- SQL Server
- Swagger UI
- JWT Authentication

### Infraestructura
- Docker Compose
- SQL Server Container
- Nginx Reverse Proxy

## 📂 Estructura del Proyecto
```plaintext
ProyectoBiblioteca/
├── backend/
│   ├── WebApi3/
│   │   ├── Controllers/
│   │   │   ├── BibliotecaController.cs
│   │   │   └── ContabilidadController.cs
│   │   ├── Data/
│   │   │   ├── Contabilidad_data/
│   │   │   │   ├── Cuentas_data.cs
│   │   │   │   ├── Comprobante_data.cs
│   │   │   │   └── AppDbContext_contabilidad.cs
│   │   ├── Models/
│   │   │   ├── Biblioteca_models/
│   │   │   └── Contabilidad_models/
├── frontend/
│   └── proyecto2/
│       ├── src/
│       │   ├── moduls/
│       │   │   ├── Menu_header.jsx
│       │   │   ├── chatHub.jsx
│       │   │   └── Auth/
│       │   │       ├── LoginForm.jsx
│       │   │       └── RegisterForm.jsx
│       │   ├── services/
│       │   │   ├── biblioteca.services/
│       │   │   │   ├── prestamo.service.js
│       │   │   │   └── detallePrestamo.service.js
│       │   │   └── user.services/
│       │   │       └── Login.services.js
│       │   ├── page/
│       │   │   ├── biblioteca/
│       │   │   │   ├── ComplexPage/
│       │   │   │   │   ├── PrestamoPage.jsx
│       │   │   │   │   ├── ReporteCruzado.jsx
│       │   │   │   │   └── ReporteLibrosPorDia.jsx
│       │   │   │   └── SimplePage/
│       │   │   │       ├── AutorPage.jsx
│       │   │   │       └── LibroPage.jsx
│       │   │   ├── contabilidad/
│       │   │   └── auth/
│       ├── sources/
│       │   ├── biblioteca.sql
│       │   └── contabilidad.sql
├── docker-compose.yml
└── init-db.sql
```
## 🔧 Módulos Principales
### Biblioteca
- Gestión de Préstamos ( `PrestamoPage` )
  
  - CRUD completo de préstamos
  - Generación automática de números de préstamo
  - Detalle de préstamos con libros asociados
- Reportes
  
  - Reporte Cruzado Libros-Autores ( `ReporteCruzado` )
  - Reporte de Libros por Día ( `ReporteLibrosPorDia` )

  ## 🚀 Instalación
### Requisitos Previos
- Docker Desktop
- Node.js 18+
- .NET SDK 7

##Configuración Inicial
# Clonar repositorio
git clone https://github.com/saoricoder/ProyectoBiblioteca.git
cd ProyectoSecretoXX

# Iniciar contenedores
docker-compose up --build

# Configurar bases de datos
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'YourStrong!Passw0rd' -i /init-db.sql

# Ejcucion
# Frontend
cd frontend/proyecto2
npm install
npm start

# Backend
cd backend/WebApi3
dotnet run

## 📚 Documentación API
Accede a la documentación interactiva en:
http://localhost:5286/swagger

## 🛡️ Autenticación
El sistema utiliza JWT para la autenticación segura. Los endpoints protegidos requieren un token válido en el header Authorization.

## 🐛 Reporte de Issues
Para reportar problemas o sugerencias, por favor abre un issue en el repositorio con la siguiente información:

- Descripción detallada del problema
- Pasos para reproducir
- Versión del sistema
```plaintext
This improved README.md provides:
1. Comprehensive project overview
2. Detailed technology stack
3. Complete project structure
4. Main modules description
5. Installation and setup instructions
6. API documentation reference
7. Authentication details
8. Issue reporting guidelines

Would you like me to add or modify any specific section?