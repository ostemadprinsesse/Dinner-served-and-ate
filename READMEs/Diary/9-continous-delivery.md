# Hvad har vi lavet i dag?
- genereret et Personal Access Token (PAT), og koblet det til vores repo. Den bruges de steder man normalt ville have brugt password til github, feks når docker skal logge in i GitHub Container Registry. DEn blev oprettet i opgave 02. 



## Problemer i dag
- Selvom vi alle er admin, kan vi se at det skal godkendes (nok af Føen <3 )at vi vil lave en PAT. Føen var langsom til at svare, så vi kunne ikke komme videre med opgaven i lang tid ;(   

# Opgaver i timen 

01
Kør Claus cookbook fra cd-branchen
Husk at have Docker open
https://github.com/cookbookio/EK_ITA_Agil_Cloud_Ita_2026_Spring/blob/master/09._Continous_delivery/exercises/01._Overview.md


02
Jonas lavede en fine grained token efter guiden. Her valgte han repo DINNER-SERVED-AT-ATE og udfyldte de acces der skulle være 
den personal acces token er sendt på messenger

Den bruges på følgende måde:
Flow 
GitHub Repo
     ↑
     |  (PAT giver adgang)
     ↓
GitHub Container Registry (ghcr.io)
     ↑
     |  docker login med PAT
     ↓
Axure VM eller Workflow



03
vi venter på at fåen godkender acces key (token), så vi kan gå videre 
Vi tænker at access key skal bruges her
         username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
i vores /.github/docker-image.yml så GitHub actions kan bygge Docker images'ne (frontend og backend) og pushe dem til GitHub Container Registry (ghcr.io).

Notes: 
At pushe en Docker image til GitHub betyder:
Den bliver gemt som en container-image i et registry.
Det betyder ikke, at den kører som en hjemmeside.

- Det bruger vi vores Azure VM til med noget ala docker login ghcr.io
docker pull ghcr.io/<dit_org>/frontend:latest
docker pull ghcr.io/<dit_org>/backend:latest

Jonas arbejder på et script man kan kopiere ind der starter ressourcegruppe, VM, installerer den og starter vores side med Docker

Flow:
GitHub → (gemmer image)
        ↓
Axure VM → docker pull
        ↓
Axure VM → docker run
        ↓
Browser → VM'ens IP



Denne note er skrevet i sammarbejde med ChatGPT