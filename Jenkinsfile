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
                        # Verify and create the wepapp_folder folder if it does not exist
    
                        cd /var/www/waterpointsFrontend
                        if [ ! -d webapp_WP ]; then
                            mkdir ./webapp_WP
                            cd ./webapp_WP
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
                        cd /var/www/waterpointsFrontend
                        cd ./webapp_WP
                        rm -rf build
                        curl -LOk https://github.com/CIAT-DAPA/lswms_website/releases/latest/download/releaseFront.zip
                        unzip releaseFront.zip -d build
                        rm -r  releaseFront.zip
                    '''
                }
            }
        }


        stage('Verify and control PM2 service') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Verify and control PM2 service
                        export REACT_APP_PRODUCTION_API_URL = ${api_wp_url}
                        export REACT_APP_DEBUG = false
                        export REACT_APP_KEY_GRAPHHOPER = ${key_graphhopper}
                        cd /var/www/waterpointsFrontend
                        cd ./webapp_WP
                        if pm2 show waterpointsfrontend >/dev/null 2>&1; then
                            echo "stopping PM2 process..."
                            pm2 stop waterpointsfrontend
                        fi
                        echo "starting PM2 process..."
                        pm2 serve build 5000 --name waterpointsfrontend --spa
                    '''
                }
            }
        }
    }

    post {
        failure {
            script {
                echo 'fail :c'
            }
        }

        success {
            script {
                echo 'everything went very well!!'
            }
        }
    }
}
