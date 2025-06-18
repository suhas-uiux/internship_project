# Introduction to DBMS

A **Database Management System (DBMS)** is software that enables users to define, create, maintain, and control access to databases. It provides an interface between the data, the user, and the application programs.

## Key Concepts

* **Database**: An organized collection of related data.
* **DBMS**: Software that interacts with the user, applications, and the database to capture and analyze data.
* **Data**: Raw facts and figures.
* **Information**: Processed data that is meaningful.

## Advantages of DBMS

* Reduces data redundancy
* Ensures data consistency
* Enhances data security
* Supports data backup and recovery
* Allows multi-user access

## Components of DBMS

1. **Hardware**: Physical devices like servers and storage.
2. **Software**: DBMS software, operating system, and application programs.
3. **Data**: The actual data stored in the database.
4. **Users**: Administrators, developers, end-users.
5. **Procedures**: Instructions and rules to use the DBMS.

## Database Users

* **Database Administrators (DBA)**: Manage and maintain the DBMS.
* **Application Programmers**: Develop programs that interact with the database.
* **End Users**: Interact with the database through applications.

## Popular DBMS Examples

* MySQL
* PostgreSQL
* Oracle Database
* Microsoft SQL Server
* MongoDB (NoSQL)

## Three-Tier Architecture

The **Three-Tier Architecture** of a DBMS divides the system into three layers, each with a specific function:

### 1. Presentation Tier (Client Tier)

* The topmost layer
* Interface between user and system
* Handles input and output
* Examples: Web browser, GUI application

### 2. Application Tier (Middle Tier)

* Also called the logic tier
* Processes business logic
* Handles communication between the presentation and data tiers
* Examples: Web server, application server

### 3. Data Tier (Database Tier)

* Bottom layer
* Manages storage and retrieval of data
* Contains the actual database

### Diagram:

```
+---------------------+
|   Presentation Tier |
| (UI - Frontend)     |
+---------------------+
          ↓
+---------------------+
|   Application Tier  |
| (Server-side logic) |
+---------------------+
          ↓
+---------------------+
|       Data Tier     |
|   (Database Layer)  |
+---------------------+
```

### Advantages

* Improved security
* Better scalability
* Easier maintenance
* Separation of concerns

## References

* [GeeksforGeeks - DBMS Introduction](https://www.geeksforgeeks.org/introduction-of-dbms/)
* [TutorialsPoint - DBMS Basics](https://www.tutorialspoint.com/dbms/index.htm)
* [YouTube - DBMS by Gate Smashers](https://www.youtube.com/watch?v=OpaiGYxkSuU)

---
