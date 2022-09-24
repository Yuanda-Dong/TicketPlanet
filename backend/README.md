---
title: Railway Backend
description: This is the backend for our COMP9900 Project, enabled by Flask and Railway
tags:
  - python
  - flask
  - SQL Alchemy 
  - Railway
---

# COMP9900 Project Backend

Our backend is implemented on [Railway](https://railway.app) using a [Flask](https://flask.palletsprojects.com/en/1.1.x/) app server and a [Postgres](https://www.postgresql.org) DB. 

## ✨ Features

- Python
- Flask
- SQLAlchemy
- Postgres

## 💁‍♀️ How to use
### Environment Set Up
- (Optional) create a Python3 virtual environment in your desired backend location
- Clone repo into the environment
- Sign up to [Railway](https://railway.app) using your github 
- Install the [Railway CLI](https://docs.railway.app/develop/cli) on your OS
- Link the Project - you can find this link on the project page in Railway under 'Set up your project locally'
    - Use `railway link <project-link>` in your command line to link it 
- Install Python requirements `pip install -r requirements.txt`
- Start the server for development `python3 main.py`

### Run Flask Server Locally 
- first make sure to run `export FLASK_APP=main.py` in your terminal
- Make sure you are in the project source directory not the backend folder
- To run the Flask server locally but still access the railway DB you need to use the command: `railway run flask run`

### Deploy to Railway
- Use `railway up` to deploy it
    - !!! Make sure to remove the deployment on railway after you are done to save credits !!! 
        - Click on the COMP9900 deployment in Railway 
        - Under the Deployments sub-heading, click the 3-dots symbol next to the deployed app 
        - Click 'Remove Deployment' 
        
### DB Migrations 
- This is used for when you update the datamodel and want to push that to Postgres 
- Simply run the commands:
    - `railway run flask db migrate`
    - `railway run flask db upgrade`
    
