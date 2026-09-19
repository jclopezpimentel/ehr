# Blockchain instance for EHR
## General description
  This will install the blockchain instance, which will store the transactions of EHR. We have used Ganache application (part of the Truffle Suite). We have not modified anything of Ganache.

## Pre-requirements
  Check the network created previously:

    docker network inspect EHRNetwork

  You must see the network details
 
## Install process
Go to path "ehr/ganache", so-called PATHL, there you can see this readme. Execute the following steps
      
      cd PATHL  
  
Create the new image from ehrimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <ehrimage Container Id> ganache

Run ubuntu: 
      
    sudo docker run -dit --name ganache --network EHRNetwork -p 8546:8546 -v <PATHL>:/ehr/ganache ehrimage

Go into container **ganache** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it ganache /bin/bash

  Now, you must stay within the ganache's instance, then go to the path as follows:
  
      cd /ehr/ganache

  You must intro to the ubuntu instance and install ganache:
      
    // Use the following in Windows OS or Linux
    npm install ganache --global

    // Use the following in MAC OS intel cpu
    npm install -g ganache-cli 

  Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute the following command:
      
      ./startApp

  You must obtain the following result at the end of the console:
      
      RPC Listening on 172.18.1.2:8546

  You can execute ctrl+C to exit

  You can exit of this instance:
    
    exit