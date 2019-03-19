This is a sample application developed on meteor which demonstrates role based access.

There are 4 roles on the platform :

  - Admin
  - Client
  - Manager
  - Employee
  
Accont creation :
  
  - Admin can create accounts for Clients and Managers.
  - Managers can create accounts for Employees.
  
The basic functionality is :
  
  - Clients can add tasks.
  - Managers can see tasks from all clients and assign them to specific employees created by them.
  - Employees can view their tasks and mark them completed.
