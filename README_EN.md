# 🏆 Tech's Cave: The hardware cave 

[Leer en español 🇪🇸](README.md)

## 🔥 What is Tech's Cave?  

**Tech's Cave** is a website designed as a modest online store for the sale of products. Its development is mainly oriented to **small entrepreneurs** that seek to digitize their business without high costs.

## 🎯 Why oriented to ventures?  

This e-commerce has a unique peculiarity: it does not use an API Rest, dedicated servers or a traditional database.  

Instead, Tech's Cave replaces all that infrastructure with ** a Google Sheets ** spreadsheet.
Product data is obtained directly thanks to tools such as:  

- 🚀 **Axios** → to make HTTP requests.  
- 📊 **Papa Parser** → to convert CSV values ​​into JSON.  

This approach simplifies the management and makes the platform accessible to small businesses.
## 📌 Why use a spreadsheet as a database?  

In my experience developing web solutions, and especially **virtual stores**, I always found the same problem:  

💸 **The cost of development is very high**. 

- A standard e-commerce requires, at least,
**two servers** (one for the API and one for the database). This makes **migrate or climb a small venture is expensive and not very profitable**.  

- Tech's Cave seeks to eradicate this problem, facilitating migration and digital expansion of small businesses in a much easier and more economical way.
Another key point is that many entrepreneurs are already familiar with **Excel or Google Sheets**, but not with SQL or NOSQL databases. It is true: part of our work as developeres is to create an intuitive UI, which facilitates the management of an e-commerce without even feeling that they are working with a database.   

- However, in many small businesses, products management is already done with spreadsheets, so this system fits practically naturally.  

## ❓ But a simple spreadsheet as a database is not a problem?  

⚠️ Yes, specially if the system's data is built around a .csv file. Therefore, Tech's Cave uses **a data asynchrony system** to improve stability.
In principle, the application is connected to **three different databases**:  

1. **📋 Product sheet (Google Sheets)** → main data source. It contains all products and several utility fields (stock, price, description, image, etc.).  
2. **🗄️ NOSQL database (Mongodb)** → to store purchase orders.  
3.
**🔐 Small database (probably SQLite)** → to manage users (you can change in the future).  

This combination allows to maintain the flexibility of data sources and allows the system to be "modular", so that we can understand where an error or data comes from.