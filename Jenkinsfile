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
                        cd ./webapp_SPCAT
                        rm -rf build
                        if [ ! -d build ]; then
                            mkdir ./build
                        fi
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
                        cd ./webapp_SPCAT
                        if pm2 show static-page-server-3000 >/dev/null 2>&1; then
                            echo "stopping PM2 process..."
                            pm2 stop static-page-server-3000
                        fi
                        echo "starting PM2 process..."
                        pm2 serve build 3000 --spa
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
