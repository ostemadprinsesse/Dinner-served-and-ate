# Diary 10 marts

## What we did today
- We set up branch protection rule. We choosed to use the number for merging to be 2 if you are mergeing to main, as there are always 2 people attending class. 

This also means we might have to start using developbranch so we can merge into main when there is a new "release"

![alt text](image-3.png)


# Hvordan vi vil håndtere at alle bruge den samme VM
# Guide: 
Vi skal alle sammen på vores egen computer inde i .ssh 
- Lave en mappe der hedder DINNERKEY
- I den skal du lave en fil der hedder id_rsa.pub  
- Og kopiere public key fra jonas herind

Hvordan ssh'er du ind til VM?
Like this: 
ssh -i C:\Users\linea\.ssh\DINNERKEY\id_rsa azureuser@20.100.197.76
