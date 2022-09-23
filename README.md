This Blockchain voting system is my Final Year Project during my study year. Through various resources, I learn to create a voting system that utilizes smart contract to help in conducting the election process. The front-end part is developed using react framework while MySQL database is used to store user's data for authentication process. The system will be running on user's local host machine.

Before starting:

1) Required software:
- Ganache GUI
- Git Bash console
- Metamask
- XAMPP control panel

2) Open Ganache to simulate blockchain environment.

3) Import account from Ganache to metamask, first listed account in Ganache is administrator account and the rest is for voter 

4) Configure network on metamask, go to add network ->
- Network name: Election
- New RPC URL: http://localhost:7545
- Chain ID: 1337

5) Open XAMPP control panel and start Apache and MySQL service

To start system:

1) Open Git bash console and run command 'truffle migrate' to compile and migrate smart contract to localhost environment

2) Go to backend folder and open ReadMe.md to configure before starting the system

3) Go to client folder and open ReadMe.md to configure and start the system

4) scripts folder contains file to evaluate smart contract in remix console.

5) test folder contains file to test smart contract before deployment.

6) contracts folder contains the smart contract

7) migrations folder contains migration file for smart contract

8) client folder contains files for front-end part

9) backend folder contains files for back-end part which is MySQL database for authentication purpose
