# User Identity Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Users. This offers a solution using a microservice architecture.

## Pre-requirements
  Check the network created previously:

    docker network inspect EHRNetwork

  You must see the network details
 
## Install process
Execute the following steps:
Go to path "ehr/entities", so-called PATHL:
      
    cd <PATHL>  
there, you can see this readme document.     

Create the new image from ehrimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <ehrimage Container Id> entities

Run ubuntu: 
      
    sudo docker run -dit --name entities --network EHRNetwork  -p 5501:5501 -v <PATHL>:/entities  ehrimage

Go into container **entities** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it entities /bin/bash

  Then, go to the ubuntu instance path:
      
      cd /entities/entitiesApp
  
  Then, Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute web server:
      
      ./startApp

  After this, you must see something like this:
    
    > didentity@0.0.0 start
    > node ./bin/www

  You can execute ctrl+C to exit

  You can exit of this instance:
    
    exit