## CI/CD

CI(持续构建)，CD(持续交付，持续部署)；通过持续构建完成自动化构建，并将构建后作为一个版本以镜像的方式存储在镜像库中。

## 开发流程

1. 产品分析

2. 技术选型

3. 项目，环境搭建

4. 功能开发

5. 校验，测试，上线

   校验：以代码风格校验，代码编写错误校验

   测试：单元测试(完成某一块代码的断言实现否)，集成测试(多个功能合成测试)，端到端测试(针对用户整体流程性实现测试)

   上线：将最终合格代码发送至线上服务器

  对于校验，测试(单元测试，部分功能测试)过程在提交至代码仓库前进行相关命令触发校验，对于端到端测试更依赖用户场景测试，这部分可以独立在一个贴近线上真实的环境下进行测试


## CI(持续构建)

CI(持续构建)完成对编写项目代码提交至代码库后自动化或者手动化拉取仓库代码构建产生最终代码(制品)，并将制品提交到镜像保存制品库中，制品可以多个版本存储保存。在后期的部署中，可以拉取各种制品镜像推送至部署进行集群调度上线流程。


实现流程理解:

- 代码开发

- 本地git提交

Jenkins + Nexus + Docker

- jenkins拉取代码(webHook方式，手动方式)

  jenkins基于java开发的发布工具软件；

  1. 安装jenkins

  2. 安装jenkins内部支持node,git; node完成构建命令支持，git完成拉取仓库代码

  3. 配置构建任务，配置构建命令，建立ssh项目代码凭证

  ```shell
     // 配置jenkins依赖环境java环境,openJDK
     yum install -y java

     // 导入jenkins镜像源到yum源
     sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
     sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
     yum install jenkins

     // 通过系统命令service启动jenkins
     service jenkins start
     # service jenkins restart restart 重启 Jenkins
     # service jenkins restart stop 停止 Jenkins

     // 对外开发访问jenkins
     firewall-cmd --zone=public --add-port=8080/tcp --permanent
     firewall-cmd --zone=public --add-port=50000/tcp --permanent

     systemctl reload firewalld

     // 服务启动后，访问 IP:8080

     // 解锁jenkins
     cat /var/lib/jenkins/secrets/initialAdminPassword
     # 将其考入解锁界面

     // 可切换jenkins插件镜像源
     sed -i 's/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' /var/lib/jenkins/updates/default.json && sed -i 's/http:\/\/www.google.com/https:\/\/www.baidu.com/g' /var/lib/jenkins/updates/default.json

     // 增加构建项目，增加构建步骤

     // 将jenkins用户添入到docker组中，由于jenkins与docker之间通过socket与docker进程通信
     sudo groupadd docker            #新增docker用户组
     sudo gpasswd -a jenkins docker  #将当前用户添加至docker用户组
     newgrp docker                   #更新docker用户组


     sudo service jenkins restart

     // 安装node,配置项目构建环境

     // 配置ssh
     // 生成一对秘钥，将公钥放入仓库ssh管理，将私钥配置在jenkins配置中，并关联上项目资源地址
     ssh-keygen -t rsa -C "xxx@gmail.com"

    // DockerFile编写，完成镜像生成需要的相关配置, 构建产生镜像
    // docker build -t imagename:version .
    // 提交docker配置保存在仓库中
    git add ./DockerFile
    git commit -m "chore: add dockerfile"
    git push

    // 指定jenkins下shell配置
    #!/bin/sh -l
    npm install --registry=https://registry.npm.taobao.org
    npm run build
    docker build -t jenkins-test .
  ```

- 安装docker(作为一个容器引擎，通过虚拟化应用环境，达到通过共享物理资源，实现夸平台，去平台兼容问题，快速跑起应用，即快读又灵活搭建应用环境)，镜像则可以理解为应用的服务压缩，当部署到容器中则相关于运行此镜像开启应用

  将构建的制品基于docker产生为镜像；部署镜像发起

  device-mapper-persistent-data 是 Linux 下的一个存储驱动， Linux 上的高级存储技术。 Lvm 的作用则是创建逻辑磁盘分区

  ```shell
    // 安装yum工具库，管理存储以及分配存储工具
    yum install -y yum-utils device-mapper-persistent-data lvm2

    // 安装docker镜像原，并安装
    sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    yum install docker-ce -y

    // 开启docker
    systemctl start docker
    systemctl enable docker

    // 查看docker是否安装
    docker -v

    // 可根据上面的镜像原更改docker拉取镜像的源地址
  ```

- 安装镜像库(Nexus)

  ```shell
     // 下载nexun源
     wget https://dependency-fe.oss-cn-beijing.aliyuncs.com/nexus-3.29.0-02-unix.tar.gz
     tar -zxvf ./nexus-3.29.0-02-unix.tar.gz
     ./nexus start
     firewall-cmd --zone=public --add-port=8081/tcp --permanent
     firewall-cmd --zone=public --add-port=8082/tcp --permanent

     // 访问 IP:8081
     // 获取初始登录密码,接着是修改新密码
     cat /opt/nexus/sonatype-work/nexus3/admin.password
     # 0ee35fa5-d773-432b-8e76-6c10c940ccd9
     // 创建制品库，设置制品库类型

     // 对创建好的制品库提供对外访问配置
     vi /etc/docker/daemon.json
     {
      "insecure-registries" : [
        "172.16.81.7:8082" // 创建好制品库地址
      ],
     }
     // 重启docker
     systemctl restart docker
     // 测试登录
     docker login 服务IP:端口
     // jenkins配置构建命令
     #!/bin/sh -l

     npm install --registry=https://registry.npm.taobao.org
     npm run build
     docker build -t 172.16.81.7:8082/jenkins-test .
     docker push 172.16.81.7:8082/jenkins-test
  ```

  nexus类型：

  proxy: 此类型制品库原则上只下载，不允许用户推送。可以理解为缓存外网制品的制品库。例如，我们在拉取 nginx 镜像时，如果通过 proxy 类型的制品库，则它会去创建时配置好的外网 docker 镜像源拉取（有点像 cnpm ）到自己的制品库，然后给你。第二次拉取，则不会从外网下载。起到 内网缓存 的作用。

  hosted：此类型制品库和 proxy 相反，原则上 只允许用户推送，不允许缓存。这里只存放自己的私有镜像或制品。

  group：此类型制品库可以将以上两种类型的制品库组合起来。组合后只访问 group 类型制品库，就都可以访问。


## CD(持续交付，持续部署)

  CD主要以自动化完成交付测试环境，部署生产环境。

  常规部署以人工方式将最终部署代码通过ftp模式或者手动拷贝至服务器，通过建立自动化完成部署更利于管理和效率。

  - scp模式

  在完成构建流程后，最直接的模式可以利用jenkins中shell命令话，通过ssh模式下的scp方式将打包内容直接提交至服务器，登录服务器模式可以以ssh(常规密码登录，秘钥登录主要建立jenkins公钥秘钥存入服务器)

  - docker容器模式

  配合CI模式，在产生制品后将其打tag标签提交至制品库，由制品库建立对制品的管理；通过配置jenkins远程shell命令，发起对部署服务器进行docker模式下拉取制品启动容器，这种模式主要由两部分完成，一完成部署服务器docker环境配置支持，二由构建服务器下jenkins完成远程shell命令的配置，并配合完成ssh秘钥方式登录远程部署服务,在登录成功后发起docker stop <镜像服务名>, docker rm <镜像服务名>, docker pull <镜像服务>, docker run <镜像服务名>

  - Ansible模式

  以批量运行服务命令方式

  - k8s模式

  通过编排容器引擎，可扩展，伸缩建立集群式管理多容器部署方式。主要思想建立以pod为最小调度单位容器组组成的集群服务式多应用服务管理，一个pod即为应用服务容器，由多个pod组成以类型为deployment形成的灵活伸缩化的集群组，即针对同一处理业务的多台应用服务，一个pod由多个docker容器组成，组合完成应用功能，docker容器主要成为了具体的服务性软件。

  以至少两台服务为master调度工作节点，node工作节点完成应用执行,通过kubectl命令行命令, kubeadm管节点的创建加入, kubelet。

  每一个应用以deployment模式创建，管理多个pod所形成的应用，由于pod的通信ip不唯一性，通过搭建以service模式建立多个pod共享一个网络IP，这样以更好的提供对外访问
