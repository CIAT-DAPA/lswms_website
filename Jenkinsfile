// Define an empty map for storing remote SSH connection parameters
def remote = [:]
 
pipeline {
 
    agent any
 
    environment {
        user = credentials('wp_user')
        host = credentials('wp_host')
        name = credentials('wp_name')
        ssh_key = credentials('wp_devops')
    }
 
    stages {
        stage('Ssh to connect Bigelow server') {
            steps {
                script {
                    // Set up remote SSH connection parameters
                    remote.allowAnyHosts = true
                    remote.identityFile = ssh_key
                    remote.user = user
                    remote.name = name
                    remote.host = host
                   
                }
            }
        }
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: remote, command: """
                        ls
                    """
                }
            }
        }
        stage('Init Front End') {
            steps {
                script {
                    sshCommand remote: remote, command: """
                        cd /var/www/waterpointsFrontend/
                        pm2 serve frontwaterpoints 3000 --name waterpoints --spa
                    """
                }
            }
        }
    }
   
    post {
        failure {
            script {
                echo 'fail'
            }
        }
 
        success {
            script {
                echo 'frontend in production!!'
            }
        }
    }
 
}