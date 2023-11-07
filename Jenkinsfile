// Define an empty map for storing remote SSH connection parameters
def remote = [:]
 
pipeline {
 
    agent any
 
    environment {
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
                    remote.user = ssh_key_USR
                    remote.name = name
                    remote.host = host
                   
                }
            }
        }
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: remote, command: """
                        ls /var/www
                    """
                }
            }
        }
        stage('Init Front End') {
            steps {
                script {
                    sshCommand remote: remote, command: """
                        pm2 delete waterpoints
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
