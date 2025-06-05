# Sistema de Intercambio de Monedas

Este proyecto implementa una API para un sistema de intercambio de monedas, permitiendo a los usuarios gestionar saldos en diferentes divisas, realizar transferencias y consultar tasas de cambio en tiempo real.

---

## 🚀 Requisitos Funcionales

El sistema cumple con los siguientes requisitos funcionales:

* **Gestión de Usuarios y Cuentas:** Soporta múltiples usuarios, cada uno con cuentas en al menos dos monedas: Soles (S/.) y Dólares (USD).
* **Visualización de Estado de Cuenta:** Ofrece un endpoint para consultar el estado de cuenta de un usuario específico, mostrando los saldos por moneda.
* **Consulta de Tasa de Cambio:** Permite consultar la tasa de cambio entre dos monedas, obteniendo la información de una API externa en tiempo real.
* **Transferencia de Valores:** Habilita la transferencia de fondos:
    * Entre diferentes monedas para un mismo usuario (cambio de moneda).
    * Entre usuarios en la misma moneda.
    * Entre usuarios en diferentes monedas (realizando la conversión con la tasa online).
* **Historial de Operaciones:** Permite visualizar el historial de todas las operaciones realizadas por un usuario.

---

## ✨ Requisitos No Funcionales

Se han implementado los siguientes requisitos no funcionales para asegurar la robustez y evaluabilidad del sistema:

* **Inicialización de Usuarios:** La aplicación se inicializa con los siguientes usuarios y saldos predefinidos:
    * **Usuario X:** S/. 100, USD 200
    * **Usuario Y:** S/. 50, USD 100
* **Acceso por Endpoints:** Todas las operaciones y consultas se realizan a través de endpoints RESTful.
* **Lenguaje de Implementación:** El lenguaje de programación utilizado es **[Python / Java / Node.js / *su elección aquí*]**.
* **Integración con Múltiples APIs de Cambio:** Se han integrado al menos dos APIs externas para la consulta de tasas de cambio (ej. `ExchangeRate-API`, `Open Exchange Rates`).
* **Formato de Datos:** Todos los intercambios de datos (solicitudes y respuestas) utilizan el formato **JSON**.
* **Uso de Interfaces:** Se ha implementado una interfaz para abstraer la lógica de las APIs de cambio de monedas, permitiendo alternar fácilmente entre ellas.
* **Patrones de Diseño:** Se han aplicado al menos dos patrones de diseño:
    * **Singleton:** Para la gestión del acceso a las APIs de cambio de monedas.
    * **Adapter:** Para normalizar los resultados obtenidos de las diferentes APIs de cambio, asegurando un formato consistente.
    * **Observer:** Para actualizar el historial de transacciones de un usuario automáticamente tras cada operación.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** **[Python / Java / Node.js / *su elección aquí*]**
* **Framework Web:** **[Flask / Spring Boot / Express.js / *su elección aquí*]**
* **APIs de Cambio de Moneda:**
    * [Nombre de la API 1]
    * [Nombre de la API 2]
* **Manejo de Dependencias:** **[pip / Maven / npm / *su elección aquí*]**

---

## 🚀 Puesta en Marcha

Sigue estos pasos para levantar la aplicación:

1.  **Clonar el Repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <nombre_del_repositorio>
    ```

2.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` (o similar) y configura las claves de API necesarias para las APIs de cambio de moneda:
    ```
    API_KEY_EXCHANGE_RATE_API=tu_clave_api_1
    API_KEY_OPEN_EXCHANGE_RATES=tu_clave_api_2
    ```

3.  **Instalar Dependencias:**
    ```bash
    # Para Python
    pip install -r requirements.txt

    # Para Java (Maven)
    mvn install

    # Para Node.js
    npm install
    ```

4.  **Ejecutar la Aplicación:**
    ```bash
    # Para Python (Flask)
    flask run

    # Para Java (Spring Boot)
    java -jar target/your-app.jar

    # Para Node.js (Express)
    node app.js
    ```

---

## 📖 Endpoints de la API y Ejemplos de Uso

A continuación, se presentan los endpoints principales de la API con ejemplos de solicitudes y respuestas, ilustrados con capturas de pantalla de la aplicación en acción.

### **`GET /accounts/{userId}` - Consulta de Estado de Cuenta**

Este endpoint permite obtener el balance actual de un usuario en todas sus monedas.

* **Parámetros de Ruta:** `userId` (ID del usuario, ej. `X` o `Y`)
* **Ejemplo de Solicitud:** `GET /accounts/X`
* **Respuesta Exitosa (200 OK):**
    ```json
    {
        "userId": "X",
        "balances": {
            "PEN": 100.00,
            "USD": 200.00
        }
    }
    ```
* **Visualización en la Aplicación:**
    ![Estado de Cuenta del Usuario X](.images/01.png)

### **`GET /exchange-rate` - Consulta de Tasa de Cambio**

Obtiene la tasa de conversión actual entre dos monedas, obtenida de una de las APIs externas configuradas.

* **Parámetros de Consulta:**
    * `from`: Código de la moneda de origen (ej. `USD`, `PEN`)
    * `to`: Código de la moneda de destino (ej. `USD`, `PEN`)
* **Ejemplo de Solicitud:** `GET /exchange-rate?from=USD&to=PEN`
* **Respuesta Exitosa (200 OK):**
    ```json
    {
        "from": "USD",
        "to": "PEN",
        "rate": 3.75,
        "source_api": "ExchangeRate-API"
    }
    ```
* **Visualización en la Aplicación:**
    ![Consulta de Tasa de Cambio USD a PEN](.images/02.png)

### **`POST /transfer` - Transferencia de Valores**

Permite mover fondos entre usuarios o realizar un cambio de moneda para el mismo usuario.

* **Cuerpo de la Solicitud (JSON):**
    ```json
    {
        "senderId": "X",
        "receiverId": "Y",
        "amount": 10.00,
        "currency": "USD",
        "targetCurrency": "PEN"  // Opcional: si la moneda de destino es diferente
    }
    ```
    * Si `senderId` y `receiverId` son el mismo, se interpreta como un cambio de moneda para el mismo usuario.
    * Si `targetCurrency` no se especifica, la transferencia se realiza en la misma `currency`.

* **Respuesta Exitosa (200 OK):**
    ```json
    {
        "message": "Transferencia realizada con éxito.",
        "transactionId": "abc-123",
        "details": {
            "senderId": "X",
            "receiverId": "Y",
            "amount": 10.00,
            "currencySent": "USD",
            "amountReceived": 37.50,
            "currencyReceived": "PEN",
            "exchangeRateUsed": 3.75
        }
    }
    ```
* **Visualización en la Aplicación:**
    ![Ejemplo de Transferencia entre Usuarios con Conversión](.images/03.png)

### **`GET /history/{userId}` - Historial de Operaciones**

Proporciona un registro detallado de todas las transacciones de un usuario específico.

* **Parámetros de Ruta:** `userId` (ID del usuario, ej. `X` o `Y`)
* **Ejemplo de Solicitud:** `GET /history/X`
* **Respuesta Exitosa (200 OK):**
    ```json
    [
        {
            "transactionId": "abc-123",
            "type": "transfer",
            "timestamp": "2024-06-04T10:00:00Z",
            "details": {
                "senderId": "X",
                "receiverId": "Y",
                "amount": 10.00,
                "currencySent": "USD",
                "amountReceived": 37.50,
                "currencyReceived": "PEN"
            }
        },
        {
            "transactionId": "def-456",
            "type": "exchange",
            "timestamp": "2024-06-04T10:30:00Z",
            "details": {
                "userId": "X",
                "amountFrom": 50.00,
                "currencyFrom": "PEN",
                "amountTo": 13.33,
                "currencyTo": "USD"
            }
        }
    ]
    ```
* **Visualización en la Aplicación:**
   ![Uso de la aplicacion](./images/01.png)
![Uso de la aplicacion](./images/02.png)
![Uso de la aplicacion](./images/03.png)
![Uso de la aplicacion](./images/04.png)
![Uso de la aplicacion](./images/05.png)
![Uso de la aplicacion](./images/06.png)

---

## 🌟 Características Opcionales (Si Implementadas)

* **Soporte de Más Monedas:** Se ha extendido el soporte para otras monedas además de Soles y Dólares.
* **Autenticación de Usuario:** Implementación de un sistema básico de usuario/contraseña para acceder a los endpoints.
* **Interfaz de Usuario:** Una interfaz de usuario basada en [Consola / Web] para interactuar con la API.
* **Formatos de Exportación:** Posibilidad de exportar historiales o estados de cuenta en formatos como CSV o XML.
* **Serialización de Datos:** El estado de la aplicación (usuarios, saldos, historial) se serializa para persistir los datos entre reinicios.

---

## 🤝 Contribuciones

[Si el proyecto es open source y acepta contribuciones, puedes añadir una sección aquí.]

---

## 📄 Licencia

Este proyecto está bajo la Licencia **[Nombre de la Licencia, ej. MIT License]**.