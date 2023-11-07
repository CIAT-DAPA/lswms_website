// Define an empty map for storing remote SSH connection parameters
def remote = [:]

pipeline {
    agent any

    environment {
        server_name = credentials('wp_name')
        server_host = credentials('wp_host')
        ssh_key = credentials('wp_devops')
    }

    stages {
        stage('Connection to AWS server') {
            steps {
                script {
                    // Set up remote SSH connection parameterss
                    remote.allowAnyHosts = true
                    remote.identityFile = ssh_key
                    remote.user = ssh_key_USR
                    remote.name = server_name
                    remote.host = server_host
                    
                }
            }
        }
        stage('Verify webapp folder and environment') {
            steps {
                script {
                    
                    sshCommand remote: remote, command: '''
                        # Verify and create the api_SPCAT folder if it does not exist
                        cd /var/www/waterpointsFrontend
                        if [ ! -d webapp_SPCAT ]; then
                            mkdir ./webapp_SPCAT
                            cd ./webapp_SPCAT
                        fi
                    '''
                    
                }
            }
        }
        
       
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Download the latest release f1081419031Nasa@rom GitHub
                        pm2 stop static-page-server-3000                        
                    '''
                }
            }
        }


