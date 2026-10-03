# Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **entities** and set the following command:
    
    sudo docker start entities

  Go into container **entities** by executing the following:
    
    sudo docker exec -it entities /bin/bash

  Go to the following path:
    
    cd /entities/entitiesApp

  Then, execute the following command:
    
    ./startApp
