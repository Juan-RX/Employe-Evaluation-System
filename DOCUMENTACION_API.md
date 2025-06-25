# Documentación Formal del Web API - Sistema de Evaluación de Empleados

## 1. Información General

### 1.1 Descripción del Sistema
El Web API desarrollado es un sistema de gestión de evaluaciones de empleados que permite administrar empleados, puestos de trabajo y evaluaciones de rendimiento. El sistema implementa autenticación JWT y proporciona endpoints RESTful para todas las operaciones CRUD.

### 1.2 Tecnologías y Herramientas Utilizadas

#### Framework y Plataforma
- **.NET 8.0**: Framework de desarrollo principal
- **ASP.NET Core Web API**: Framework para construcción de APIs REST
- **C#**: Lenguaje de programación

#### Base de Datos y Acceso a Datos
- **SQL Server**: Sistema de gestión de base de datos
- **Dapper**: Micro-ORM para mapeo objeto-relacional
- **Microsoft.Data.SqlClient**: Proveedor de datos para SQL Server

#### Autenticación y Seguridad
- **JWT (JSON Web Tokens)**: Sistema de autenticación basado en tokens
- **Microsoft.AspNetCore.Authentication.JwtBearer**: Middleware para autenticación JWT
- **Microsoft.IdentityModel.Tokens**: Biblioteca para manejo de tokens JWT

#### Documentación y Testing
- **Swagger/OpenAPI**: Documentación automática de la API
- **Swashbuckle.AspNetCore**: Generador de documentación Swagger
- **xUnit**: Framework de testing unitario

#### Utilidades
- **CsvHelper**: Biblioteca para importación de archivos CSV
- **Microsoft.AspNetCore.OpenApi**: Soporte para OpenAPI

### 1.3 Arquitectura del Sistema

#### Patrón de Arquitectura
- **Arquitectura en Capas**: Separación clara entre controladores, repositorios y modelos
- **Patrón Repository**: Abstracción del acceso a datos
- **Dependency Injection**: Inyección de dependencias para desacoplamiento

#### Estructura del Proyecto
```
ApiBack/
├── Controllers/          # Controladores de la API
├── Models/              # Modelos de datos
├── Repositories/        # Repositorios y interfaces
├── Data/               # Contexto de base de datos
├── Services/           # Servicios de negocio
└── Program.cs          # Configuración de la aplicación
```

## 2. Configuración del Sistema

### 2.1 Configuración de Base de Datos
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DEV-025\\MSSQLSERVER03;Database=systemEvaluation;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 2.2 Configuración JWT
```json
{
  "Jwt": {
    "Key": "SuperSecretKey!2025-Examen$JWT#ClaveNezter2133041925",
    "Issuer": "ExamenApi",
    "Audience": "ExamenApiUsers"
  }
}
```

### 2.3 Configuración de CORS
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
```

## 3. Modelos de Datos

### 3.1 UserLogin
```csharp
public class UserLogin
{
    public int id_user { get; set; }
    public required string username { get; set; }
    public required string userPassword { get; set; }
}
```

### 3.2 Employe (Empleado)
```csharp
public class Employe
{
    public int id_Employee { get; set; }
    public required string name_Employee { get; set; }
    public required string lastName_Employee { get; set; }
    public required string birthDate { get; set; }
    public required string contract_Start_Date { get; set; }
    public int id_Job { get; set; }
}
```

### 3.3 Job (Puesto)
```csharp
public class Job
{
    public int id_Job { get; set; }
    public required string name_Job { get; set; }
}
```

### 3.4 Evaluation (Evaluación)
```csharp
public class Evaluation
{
    public int id_Evaluation { get; set; }
    public int id_employee { get; set; }
    public required string evaluation_Date { get; set; }
    public int productivity { get; set; }
    public int punctuality { get; set; }
    public int work_quality { get; set; }
    public int communication { get; set; }
    public int willingness_to_learn { get; set; }
    public int honesty { get; set; }
    public int initiative { get; set; }
    public int teamwork { get; set; }
    public required string comments { get; set; }
    public string? name_Employee { get; set; }
    public string? lastName_Employee { get; set; }
}
```

## 4. Endpoints de la API

### 4.1 Autenticación

#### POST /api/UserLogin/Login
**Descripción**: Autentica un usuario y devuelve un token JWT

**Autenticación**: No requerida

**Parámetros de Entrada**:
```json
{
  "username": "string",
  "userPassword": "string"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta de Error (401 Unauthorized)**:
```json
"Usuario o contraseña incorrectos"
```

### 4.2 Gestión de Empleados

#### POST /api/Employe/GetAll
**Descripción**: Obtiene todos los empleados

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**: Ninguno

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id_Employee": 1,
    "name_Employee": "Juan",
    "lastName_Employee": "Pérez",
    "birthDate": "1990-01-01",
    "contract_Start_Date": "2020-01-01",
    "id_Job": 1
  }
]
```

#### POST /api/Employe/GetById
**Descripción**: Obtiene un empleado por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id_Employee": 1,
  "name_Employee": "Juan",
  "lastName_Employee": "Pérez",
  "birthDate": "1990-01-01",
  "contract_Start_Date": "2020-01-01",
  "id_Job": 1
}
```

#### POST /api/Employe/Insert
**Descripción**: Crea un nuevo empleado

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "name_Employee": "María",
  "lastName_Employee": "García",
  "birthDate": "1995-05-15",
  "contract_Start_Date": "2021-03-01",
  "id_Job": 2
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Empleado creado exitosamente"
}
```

#### POST /api/Employe/Update
**Descripción**: Actualiza un empleado existente

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "id_Employee": 1,
  "name_Employee": "Juan Carlos",
  "lastName_Employee": "Pérez",
  "birthDate": "1990-01-01",
  "contract_Start_Date": "2020-01-01",
  "id_Job": 1
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Empleado actualizado exitosamente"
}
```

#### POST /api/Employe/Delete
**Descripción**: Elimina un empleado por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Empleado eliminado exitosamente"
}
```

### 4.3 Gestión de Puestos

#### POST /api/Job/GetAll
**Descripción**: Obtiene todos los puestos de trabajo

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**: Ninguno

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id_Job": 1,
    "name_Job": "Desarrollador"
  },
  {
    "id_Job": 2,
    "name_Job": "Analista"
  }
]
```

#### POST /api/Job/GetById
**Descripción**: Obtiene un puesto por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id_Job": 1,
  "name_Job": "Desarrollador"
}
```

#### POST /api/Job/Insert
**Descripción**: Crea un nuevo puesto de trabajo

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "name_Job": "Gerente de Proyecto"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Puesto creado exitosamente"
}
```

#### POST /api/Job/Update
**Descripción**: Actualiza un puesto existente

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "id_Job": 1,
  "name_Job": "Desarrollador Senior"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Puesto actualizado exitosamente"
}
```

#### POST /api/Job/Delete
**Descripción**: Elimina un puesto por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Puesto eliminado exitosamente"
}
```

**Respuesta de Error (400 Bad Request)**:
```json
{
  "message": "No se puede eliminar el puesto porque tiene empleados asociados"
}
```

### 4.4 Gestión de Evaluaciones

#### POST /api/Evaluation/GetAll
**Descripción**: Obtiene todas las evaluaciones

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**: Ninguno

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id_Evaluation": 1,
    "id_employee": 1,
    "evaluation_Date": "2024-01-15",
    "productivity": 8,
    "punctuality": 9,
    "work_quality": 8,
    "communication": 7,
    "willingness_to_learn": 9,
    "honesty": 10,
    "initiative": 8,
    "teamwork": 9,
    "comments": "Excelente desempeño",
    "name_Employee": "Juan",
    "lastName_Employee": "Pérez"
  }
]
```

#### POST /api/Evaluation/GetById
**Descripción**: Obtiene una evaluación por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id_Evaluation": 1,
  "id_employee": 1,
  "evaluation_Date": "2024-01-15",
  "productivity": 8,
  "punctuality": 9,
  "work_quality": 8,
  "communication": 7,
  "willingness_to_learn": 9,
  "honesty": 10,
  "initiative": 8,
  "teamwork": 9,
  "comments": "Excelente desempeño",
  "name_Employee": "Juan",
  "lastName_Employee": "Pérez"
}
```

#### POST /api/Evaluation/GetByEmployee
**Descripción**: Obtiene todas las evaluaciones de un empleado específico

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id_Evaluation": 1,
    "id_employee": 1,
    "evaluation_Date": "2024-01-15",
    "productivity": 8,
    "punctuality": 9,
    "work_quality": 8,
    "communication": 7,
    "willingness_to_learn": 9,
    "honesty": 10,
    "initiative": 8,
    "teamwork": 9,
    "comments": "Excelente desempeño",
    "name_Employee": "Juan",
    "lastName_Employee": "Pérez"
  }
]
```

#### POST /api/Evaluation/Insert
**Descripción**: Crea una nueva evaluación

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "id_employee": 1,
  "evaluation_Date": "2024-01-15",
  "productivity": 8,
  "punctuality": 9,
  "work_quality": 8,
  "communication": 7,
  "willingness_to_learn": 9,
  "honesty": 10,
  "initiative": 8,
  "teamwork": 9,
  "comments": "Excelente desempeño"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Evaluación creada exitosamente"
}
```

#### POST /api/Evaluation/Update
**Descripción**: Actualiza una evaluación existente

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
{
  "id_Evaluation": 1,
  "id_employee": 1,
  "evaluation_Date": "2024-01-15",
  "productivity": 9,
  "punctuality": 9,
  "work_quality": 8,
  "communication": 8,
  "willingness_to_learn": 9,
  "honesty": 10,
  "initiative": 8,
  "teamwork": 9,
  "comments": "Excelente desempeño, mejoró en comunicación"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Evaluación actualizada exitosamente"
}
```

#### POST /api/Evaluation/Delete
**Descripción**: Elimina una evaluación por su ID

**Autenticación**: JWT Bearer Token requerido

**Parámetros de Entrada**:
```json
1
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": true,
  "message": "Evaluación eliminada exitosamente"
}
```

### 4.5 Importación de Datos

#### POST /api/EvaluationImport/ImportCsv
**Descripción**: Importa evaluaciones desde un archivo CSV

**Autenticación**: No requerida

**Tipo de Contenido**: multipart/form-data

**Parámetros de Entrada**:
- `file`: Archivo CSV con las evaluaciones

**Formato del CSV**:
```csv
id_employee,evaluation_Date,productivity,punctuality,work_quality,communication,willingness_to_learn,honesty,initiative,teamwork,comments
1,2024-01-15,8,9,8,7,9,10,8,9,"Excelente desempeño"
2,2024-01-16,7,8,9,8,8,9,7,8,"Buen trabajo"
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "success": 10,
  "fail": 2,
  "errors": [
    "Error en línea 3: Empleado no encontrado",
    "Error en línea 5: Fecha inválida"
  ]
}
```

## 5. Autenticación y Autorización

### 5.1 Sistema JWT
El sistema utiliza JSON Web Tokens (JWT) para la autenticación de usuarios.

#### Configuración JWT
- **Algoritmo**: HMAC SHA256
- **Duración del Token**: 1 hora
- **Claims Incluidos**:
  - `sub`: Nombre de usuario
  - `jti`: Identificador único del token

#### Uso de Tokens
1. **Login**: El usuario se autentica con username y password
2. **Token**: Se genera un JWT token válido por 1 hora
3. **Autorización**: Incluir el token en el header `Authorization: Bearer {token}`

### 5.2 Endpoints Protegidos
Todos los endpoints excepto `/api/UserLogin/Login` y `/api/EvaluationImport/ImportCsv` requieren autenticación JWT.

## 6. Manejo de Errores

### 6.1 Códigos de Estado HTTP
- **200 OK**: Operación exitosa
- **400 Bad Request**: Error en los datos de entrada
- **401 Unauthorized**: No autenticado o token inválido
- **500 Internal Server Error**: Error interno del servidor

### 6.2 Formato de Respuestas de Error
```json
{
  "message": "Descripción del error"
}
```

### 6.3 Validaciones
- **Datos Requeridos**: Validación de campos obligatorios
- **Integridad Referencial**: Validación de relaciones entre entidades
- **Formato de Datos**: Validación de formatos de fecha y tipos de datos

## 7. Testing

### 7.1 Framework de Testing
- **xUnit**: Framework principal de testing
- **Moq**: Framework para mocking de dependencias

### 7.2 Tipos de Tests
- **Unit Tests**: Pruebas unitarias de controladores y repositorios
- **Integration Tests**: Pruebas de integración con base de datos real

### 7.3 Cobertura de Testing
- Tests para todos los controladores principales
- Tests de autenticación y autorización
- Tests de manejo de errores

## 8. Documentación Swagger

### 8.1 Acceso a la Documentación
La documentación automática está disponible en:
- **URL**: `/swagger`
- **JSON**: `/swagger/v1/swagger.json`

### 8.2 Características de Swagger
- Documentación automática de todos los endpoints
- Interfaz interactiva para probar endpoints
- Configuración de autenticación JWT
- Ejemplos de request y response

## 9. Estándares Aplicados

### 9.1 Estándares REST
- **URLs Semánticas**: Uso de nombres descriptivos para recursos
- **Métodos HTTP**: Uso apropiado de POST para operaciones CRUD
- **Códigos de Estado**: Uso correcto de códigos HTTP
- **Formato JSON**: Respuestas en formato JSON estándar

### 9.2 Estándares de Seguridad
- **JWT**: Implementación estándar de JSON Web Tokens
- **HTTPS**: Configuración para conexiones seguras
- **CORS**: Configuración de políticas de origen cruzado
- **Validación de Entrada**: Validación de datos de entrada

### 9.3 Estándares de Código
- **Clean Code**: Código limpio y legible
- **SOLID Principles**: Aplicación de principios SOLID
- **Dependency Injection**: Inyección de dependencias
- **Async/Await**: Uso de programación asíncrona

## 10. Despliegue y Configuración

### 10.1 Requisitos del Sistema
- **.NET 8.0 Runtime**
- **SQL Server 2019 o superior**
- **Windows Server 2019 o superior** (para el entorno actual)

### 10.2 Variables de Entorno
```bash
# Base de datos
ConnectionStrings__DefaultConnection="Server=server;Database=database;Trusted_Connection=True;"

# JWT
Jwt__Key="your-secret-key"
Jwt__Issuer="your-issuer"
Jwt__Audience="your-audience"
```

### 10.3 Configuración de Producción
- Configurar HTTPS
- Configurar logging apropiado
- Configurar monitoreo y métricas
- Configurar backup de base de datos

## 11. Mantenimiento y Soporte

### 11.1 Logging
El sistema utiliza el sistema de logging integrado de .NET Core con configuración en `appsettings.json`.

### 11.2 Monitoreo
- Monitoreo de endpoints de salud
- Métricas de rendimiento
- Logs de errores y excepciones

### 11.3 Backup y Recuperación
- Backup regular de la base de datos
- Procedimientos de recuperación documentados
- Plan de contingencia para fallos

---

**Versión del Documento**: 1.0  
**Fecha de Creación**: Enero 2025  
**Última Actualización**: Enero 2025  
**Autor**: Sistema de Evaluación de Empleados 