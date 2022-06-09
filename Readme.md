Add a .env file at root and add the following 
```
EMAIL = 'xyz@gmail.com'
PASSWORD = 'somePass'
```

Seperate varNames with a comma in text field/postman. Subject is not Unique and cannot contain variables (they will have no effect)

In the CSV folder always keep the email last and the values of the variables (corresponding to the email) first.

Example of post request structure (in postman):

```
text : Hello ${Name}          =============> Keep fieldNames same (or edit code to reflect changes). 
varNames : Name               =============> Case Sensitive variables.
subject : Automated mail      =============> Not unique
send_to : 1.csv               =============> File name can be anything. Attaching example file in root. (./1.csv). Look below to see example.
```

```
aditya, adityagudimetla@gmail.com
Hasgeek-aditya, aditya@hasgeek.in
```
