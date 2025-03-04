# ProyectoBiblioteca- Sistema de Gestión de Biblioteca

## 🚀 Project Structure

## 🔧 Key Features

### Biblioteca Module
- **Loan Management** (<mcsymbol name="PrestamoPage" filename="PrestamoPage.jsx" path="frontend/proyecto2/src/page/biblioteca/ComplexPage/PrestamoPage.jsx" startline="14" type="function"/></mcsymbol>)
  - CRUD operations for loans
  - Automatic loan number generation
  - Detailed loan tracking with books

- **Reports System**
  - Daily Book Delivery Report (<mcsymbol name="ReporteLibrosPorDia" filename="ReporteLibrosPorDia.jsx" path="frontend/proyecto2/src/page/biblioteca/ComplexPage/ReporteLibrosPorDia.jsx" startline="7" type="function"/></mcsymbol>)
  - Author-Book Cross Report (<mcsymbol name="ReporteCruzado" filename="ReporteCruzado.jsx" path="frontend/proyecto2/src/page/biblioteca/ComplexPage/ReporteCruzado.jsx" startline="7" type="function"/></mcsymbol>)

### Technical Stack
- **Frontend**: 
  - React 18 + Vite
  - CSS Modules
  - Fetch API for backend communication

- **Backend**:
  - .NET Web API
  - Swagger UI documentation
  - Entity Framework Core

- **Database**:
  - SQL Server (configured in <mcfile name="init-db.sql" path="init-db.sql"/></mcfile>)

## 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/User/ProyectoSecretoXX.git

# Backend setup
cd .\backend\WebApi3\
dotnet restore
dotnet run

# Frontend setup
cd .\frontend\proyecto2\
npm install
npm start

# Using Docker
docker-compose up --build
# API Documentation
http://localhost:5286/swagger

#Contributors

Key architecture notes:
1. Service Layer pattern used in frontend API calls
2. Containerized development environment
3. Responsive UI components with CSS modules
4. RESTful API design with JSON payloads
5. Error handling in both frontend and backend layers

Would you like me to expand any particular section or add specific technical details?