# ![Juice Shop Logo](https://raw.githubusercontent.com/juice-shop/juice-shop/master/frontend/src/assets/public/images/JuiceShop_Logo_100px.png) OWASP Juice Shop

This project was developed for the Network Security course unit, as part of our Master in Informatics and Computing Engineering.
The goal of the project is to study the most common vulnerabilities found in websites and learn how to exploit them. With this knowledge, we worked on securing the OWASP Juice Shop. The result is in the [website](./website) folder.
Our version of the Juice Shop can be run using, from the inside of the [website](./website) folder:
- Docker: `docker build -t secure-juice-shop . && docker run -d -p 3000:3000 secure-juice-shop`
- Nodejs: `npm install && npm start`

Furthermore, we also used the knowledge gained with this project to craft 2 additional attacks, that are present in the [Extra Attacks](./extra_attacks) folder, with the respective instructions to use them. The theory behind these attacks is explained in the report.

Project developed by:

| Name            | Number    |
| --------------- | --------- |
| Alexandre Nunes | 202005358 |
| André Filipe Sousa     | 202005277 |
| Diogo Babo   | 202004950 |
| Gonçalo Pinto   | 202004907 |
