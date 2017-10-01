Progress Tracking Application
===================

[![pipeline status](https://gitlab.com/naufalfmm/progress_tracker/badges/master/pipeline.svg)](https://gitlab.com/naufalfmm/progress_tracker/commits/master) [![coverage report](https://gitlab.com/naufalfmm/progress_tracker/badges/master/coverage.svg)](https://gitlab.com/naufalfmm/progress_tracker/commits/master)

**Progress Tracking** application is a web based application to track the progress of software development. Progress Tracking application built by BabyBoss Team IPB. This application built for fulfill the Internship Subject on [Computer Science Department][1], [Bogor Agricultural University][2].

----------

Features
-------------
Progress Tracker application has many features to help tracking the progress of software development. Some features are status update of phase (ex. design, coding, etc.) per day, set on or off day manually, etc.

#### <i class="icon-home"></i> Dashboard
!["Dashboard"](https://s26.postimg.org/qey2kjlzt/Capture.png "Dashboard")
On this page, Progress Tracking application shows all phase on the software development and the status of the phase. The status of the phase divided into 9 status represented by different color

 1. Off Day (#A2A9AF)
 2. Planned (#00A0B0)
 3. On Progress (#99E3EC)
 4. Finished Early (#BCBD7C)
 5. Finished On Time (#93CB9A)
 6. Finished Overdue (#FF4424)
 7. Overdue (#FF2F81)
 8. Postponed (#7B3614)
 9. Warning (#F3E88E)
 
#### <i class="icon-users"></i> User Management
![User Management](https://s20.postimg.org/8xwt31k31/Capture2.png%20%22usermanagement)
This feature is <b>just for admin</b>. You can add, edit, and delete user of the application. You can change password of the user and deactivate the user. Every user divided into 3 role

 1. Project Manager (PM)      
 2. System Analyst (SA)
 3. Programmer (PG)

Installations
-------------
Progress Tracking application requires NodeJS >=8.5.0 and AngularJS >=1.2.1. Progress Tracking run on Chrome browser.

#### 1. Install NodeJS
> **Note:**
> Before you install, please check first by run a command
> ```
> node --version
> ```
> If the version of node >=8.5.0, you can **skip** this step.

1. If you are Windows user, please download [here][3]. Choose the right Windows version (32/64 bit) based on your computer. Please check [here][4] to get the version of Windows.
2. If you're Ubuntu user, run command

    ```
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
3. For another OS, you can check [here][5].

#### 2. Install AngularJS
> **Note:**
> Before you do, please check first by run a command
> ```
> ng --version
> ```
> If the version of @angular/cli >=1.2.1, you can **skip** this step.

1. If the version of @angular/cli <1.2.1, run command below to upgrade @angular/cli

    ```
    npm uninstall -g @angular/cli
    npm cache clean --force
    npm i -g @angular/cli
    ```
    or if you use yarn for package manager, you change the command
    
    ```
    yarn global upgrade @angular/cli
    ```

2. If the command (ng --version) doesn't return anything, you must install AngularJS by run command

    ```
    npm i -g @angular/cli
    ```
    or if you use yarn for package manager, you change the command
    
    ```
    yarn global install @angular/cli
    ```

#### 3. Clone The Project
> **Note:**
> You must install [**git command**][6] first before do the step.

You can store the project file wherever you want. Clone the project by run a command
```
git clone https://gitlab.com/naufalfmm/progress_tracker.git
```
Before you clone the project, you have to be in the directory you want to store the project file.

#### 4. Install The Depedencies
> **Note:**
> You have to be in the directory of the project file stored.

Install the dependecies by run a command
```
npm install
```
If you use yarn, please run command below.
```
yarn
```

#### 5. Build The Interface
1. Go to `/interface-dev` directory by run command below.

    ```
    cd /interface-dev
    ```

2.  Build the interface by using @angular/cli that have been installed before.

    ```
    ng build
    ```

3. Wait the process until done.
4. Go out from `/interface-dev` directory

    ```
    cd ..
    ```

#### 6. Run The App!
The application is ready to serve on 7777. Please type and run command below to start the application
```
node app.js
```
If you want to run the application continously, you can use [pm2][7] or [forever][8]. In this tutorial, we use pm2.

1. Run command below to install pm2.

    ```
    npm i -g pm2
    ```
    or if you use yarn, run command below
    ```
    yarn global install pm2
    ```
2. Run the app

    ```
    pm2 start app.js
    ```
3. If you want to stop the application, run command below

    ```
    pm2 stop app
    pm2 delete app
    ```

----------

  [1]: https://cs.ipb.ac.id/
  [2]: https://ipb.ac.id/
  [3]: https://nodejs.org/en/download/
  [4]: https://support.microsoft.com/en-gb/help/15056/windows-7-32-64-bit-faq
  [5]: https://nodejs.org/en/download/package-manager/
  [6]: https://git-scm.com/downloads
  [7]: http://pm2.keymetrics.io/
  [8]: https://github.com/foreverjs/forever
