(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{358:function(n,s,t){"use strict";t.r(s);var e=t(33),a=Object(e.a)({},(function(){var n=this,s=n.$createElement,t=n._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[t("h2",{attrs:{id:"ci-cd"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ci-cd"}},[n._v("#")]),n._v(" CI/CD")]),n._v(" "),t("p",[n._v("CI(持续构建)，CD(持续交付，持续部署)；通过持续构建完成自动化构建，并将构建后作为一个版本以镜像的方式存储在镜像库中。")]),n._v(" "),t("h2",{attrs:{id:"开发流程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#开发流程"}},[n._v("#")]),n._v(" 开发流程")]),n._v(" "),t("ol",[t("li",[t("p",[n._v("产品分析")])]),n._v(" "),t("li",[t("p",[n._v("技术选型")])]),n._v(" "),t("li",[t("p",[n._v("项目，环境搭建")])]),n._v(" "),t("li",[t("p",[n._v("功能开发")])]),n._v(" "),t("li",[t("p",[n._v("校验，测试，上线")]),n._v(" "),t("p",[n._v("校验：以代码风格校验，代码编写错误校验")]),n._v(" "),t("p",[n._v("测试：单元测试(完成某一块代码的断言实现否)，集成测试(多个功能合成测试)，端到端测试(针对用户整体流程性实现测试)")]),n._v(" "),t("p",[n._v("上线：将最终合格代码发送至线上服务器")])])]),n._v(" "),t("p",[n._v("对于校验，测试(单元测试，部分功能测试)过程在提交至代码仓库前进行相关命令触发校验，对于端到端测试更依赖用户场景测试，这部分可以独立在一个贴近线上真实的环境下进行测试")]),n._v(" "),t("h2",{attrs:{id:"ci-持续构建"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ci-持续构建"}},[n._v("#")]),n._v(" CI(持续构建)")]),n._v(" "),t("p",[n._v("CI(持续构建)完成对编写项目代码提交至代码库后自动化或者手动化拉取仓库代码构建产生最终代码(制品)，并将制品提交到镜像保存制品库中，制品可以多个版本存储保存。在后期的部署中，可以拉取各种制品镜像推送至部署进行集群调度上线流程。")]),n._v(" "),t("p",[n._v("实现流程理解:")]),n._v(" "),t("ul",[t("li",[t("p",[n._v("代码开发")])]),n._v(" "),t("li",[t("p",[n._v("本地git提交")])])]),n._v(" "),t("p",[n._v("Jenkins + Nexus + Docker")]),n._v(" "),t("ul",[t("li",[t("p",[n._v("jenkins拉取代码(webHook方式，手动方式)")]),n._v(" "),t("p",[n._v("jenkins基于java开发的发布工具软件；")]),n._v(" "),t("ol",[t("li",[t("p",[n._v("安装jenkins")])]),n._v(" "),t("li",[t("p",[n._v("安装jenkins内部支持node,git; node完成构建命令支持，git完成拉取仓库代码")])]),n._v(" "),t("li",[t("p",[n._v("配置构建任务，配置构建命令，建立ssh项目代码凭证")])])]),n._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[n._v("   // 配置jenkins依赖环境java环境,openJDK\n   yum "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" -y java\n\n   // 导入jenkins镜像源到yum源\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("wget")]),n._v(" -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("rpm")]),n._v(" --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key\n   yum "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" jenkins\n\n   // 通过系统命令service启动jenkins\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("service")]),n._v(" jenkins start\n   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# service jenkins restart restart 重启 Jenkins")]),n._v("\n   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# service jenkins restart stop 停止 Jenkins")]),n._v("\n\n   // 对外开发访问jenkins\n   firewall-cmd --zone"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("public --add-port"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("8080")]),n._v("/tcp --permanent\n   firewall-cmd --zone"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("public --add-port"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("50000")]),n._v("/tcp --permanent\n\n   systemctl reload firewalld\n\n   // 服务启动后，访问 IP:8080\n\n   // 解锁jenkins\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("cat")]),n._v(" /var/lib/jenkins/secrets/initialAdminPassword\n   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# 将其考入解锁界面")]),n._v("\n\n   // 可切换jenkins插件镜像源\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sed")]),n._v(" -i "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v("'s/http:\\/\\/updates.jenkins-ci.org\\/download/https:\\/\\/mirrors.tuna.tsinghua.edu.cn\\/jenkins/g'")]),n._v(" /var/lib/jenkins/updates/default.json "),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("&&")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sed")]),n._v(" -i "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v("'s/http:\\/\\/www.google.com/https:\\/\\/www.baidu.com/g'")]),n._v(" /var/lib/jenkins/updates/default.json\n\n   // 增加构建项目，增加构建步骤\n\n   // 将jenkins用户添入到docker组中，由于jenkins与docker之间通过socket与docker进程通信\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("groupadd")]),n._v(" docker            "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("#新增docker用户组")]),n._v("\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" gpasswd -a jenkins docker  "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("#将当前用户添加至docker用户组")]),n._v("\n   newgrp docker                   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("#更新docker用户组")]),n._v("\n\n\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("service")]),n._v(" jenkins restart\n\n   // 安装node,配置项目构建环境\n\n   // 配置ssh\n   // 生成一对秘钥，将公钥放入仓库ssh管理，将私钥配置在jenkins配置中，并关联上项目资源地址\n   ssh-keygen -t rsa -C "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v('"xxx@gmail.com"')]),n._v("\n\n  // DockerFile编写，完成镜像生成需要的相关配置, 构建产生镜像\n  // docker build -t imagename:version "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v(".")]),n._v("\n  // 提交docker配置保存在仓库中\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("git")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("add")]),n._v(" ./DockerFile\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("git")]),n._v(" commit -m "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v('"chore: add dockerfile"')]),n._v("\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("git")]),n._v(" push\n\n  // 指定jenkins下shell配置\n  "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("#!/bin/sh -l")]),n._v("\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("npm")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" --registry"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("https://registry.npm.taobao.org\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("npm")]),n._v(" run build\n  docker build -t jenkins-test "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v(".")]),n._v("\n")])])])]),n._v(" "),t("li",[t("p",[n._v("安装docker(作为一个容器引擎，通过虚拟化应用环境，达到通过共享物理资源，实现夸平台，去平台兼容问题，快速跑起应用，即快读又灵活搭建应用环境)，镜像则可以理解为应用的服务压缩，当部署到容器中则相关于运行此镜像开启应用")]),n._v(" "),t("p",[n._v("将构建的制品基于docker产生为镜像；部署镜像发起")]),n._v(" "),t("p",[n._v("device-mapper-persistent-data 是 Linux 下的一个存储驱动， Linux 上的高级存储技术。 Lvm 的作用则是创建逻辑磁盘分区")]),n._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[n._v("  // 安装yum工具库，管理存储以及分配存储工具\n  yum "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" -y yum-utils device-mapper-persistent-data lvm2\n\n  // 安装docker镜像原，并安装\n  "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("sudo")]),n._v(" yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo\n  yum "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" docker-ce -y\n\n  // 开启docker\n  systemctl start docker\n  systemctl "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v("enable")]),n._v(" docker\n\n  // 查看docker是否安装\n  docker -v\n\n  // 可根据上面的镜像原更改docker拉取镜像的源地址\n")])])])]),n._v(" "),t("li",[t("p",[n._v("安装镜像库(Nexus)")]),n._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[n._v("   // 下载nexun源\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("wget")]),n._v(" https://dependency-fe.oss-cn-beijing.aliyuncs.com/nexus-3.29.0-02-unix.tar.gz\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("tar")]),n._v(" -zxvf ./nexus-3.29.0-02-unix.tar.gz\n   ./nexus start\n   firewall-cmd --zone"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("public --add-port"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("8081")]),n._v("/tcp --permanent\n   firewall-cmd --zone"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("public --add-port"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("8082")]),n._v("/tcp --permanent\n\n   // 访问 IP:8081\n   // 获取初始登录密码,接着是修改新密码\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("cat")]),n._v(" /opt/nexus/sonatype-work/nexus3/admin.password\n   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# 0ee35fa5-d773-432b-8e76-6c10c940ccd9")]),n._v("\n   // 创建制品库，设置制品库类型\n\n   // 对创建好的制品库提供对外访问配置\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("vi")]),n._v(" /etc/docker/daemon.json\n   "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("{")]),n._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v('"insecure-registries"')]),n._v(" "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v(":")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("[")]),n._v("\n      "),t("span",{pre:!0,attrs:{class:"token string"}},[n._v('"172.16.81.7:8082"')]),n._v(" // 创建好制品库地址\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("]")]),n._v(",\n   "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("}")]),n._v("\n   // 重启docker\n   systemctl restart docker\n   // 测试登录\n   docker login 服务IP:端口\n   // jenkins配置构建命令\n   "),t("span",{pre:!0,attrs:{class:"token comment"}},[n._v("#!/bin/sh -l")]),n._v("\n\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("npm")]),n._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" --registry"),t("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("https://registry.npm.taobao.org\n   "),t("span",{pre:!0,attrs:{class:"token function"}},[n._v("npm")]),n._v(" run build\n   docker build -t "),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("172.16")]),n._v(".81.7:8082/jenkins-test "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v(".")]),n._v("\n   docker push "),t("span",{pre:!0,attrs:{class:"token number"}},[n._v("172.16")]),n._v(".81.7:8082/jenkins-test\n")])])]),t("p",[n._v("nexus类型：")]),n._v(" "),t("p",[n._v("proxy: 此类型制品库原则上只下载，不允许用户推送。可以理解为缓存外网制品的制品库。例如，我们在拉取 nginx 镜像时，如果通过 proxy 类型的制品库，则它会去创建时配置好的外网 docker 镜像源拉取（有点像 cnpm ）到自己的制品库，然后给你。第二次拉取，则不会从外网下载。起到 内网缓存 的作用。")]),n._v(" "),t("p",[n._v("hosted：此类型制品库和 proxy 相反，原则上 只允许用户推送，不允许缓存。这里只存放自己的私有镜像或制品。")]),n._v(" "),t("p",[n._v("group：此类型制品库可以将以上两种类型的制品库组合起来。组合后只访问 group 类型制品库，就都可以访问。")])])]),n._v(" "),t("h2",{attrs:{id:"cd-持续交付，持续部署"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cd-持续交付，持续部署"}},[n._v("#")]),n._v(" CD(持续交付，持续部署)")]),n._v(" "),t("p",[n._v("CD主要以自动化完成交付测试环境，部署生产环境。")]),n._v(" "),t("p",[n._v("常规部署以人工方式将最终部署代码通过ftp模式或者手动拷贝至服务器，通过建立自动化完成部署更利于管理和效率。")]),n._v(" "),t("ul",[t("li",[n._v("scp模式")])]),n._v(" "),t("p",[n._v("在完成构建流程后，最直接的模式可以利用jenkins中shell命令话，通过ssh模式下的scp方式将打包内容直接提交至服务器，登录服务器模式可以以ssh(常规密码登录，秘钥登录主要建立jenkins公钥秘钥存入服务器)")]),n._v(" "),t("ul",[t("li",[n._v("docker容器模式")])]),n._v(" "),t("p",[n._v("配合CI模式，在产生制品后将其打tag标签提交至制品库，由制品库建立对制品的管理；通过配置jenkins远程shell命令，发起对部署服务器进行docker模式下拉取制品启动容器，这种模式主要由两部分完成，一完成部署服务器docker环境配置支持，二由构建服务器下jenkins完成远程shell命令的配置，并配合完成ssh秘钥方式登录远程部署服务,在登录成功后发起docker stop <镜像服务名>, docker rm <镜像服务名>, docker pull <镜像服务>, docker run <镜像服务名>")]),n._v(" "),t("ul",[t("li",[n._v("Ansible模式")])]),n._v(" "),t("p",[n._v("以批量运行服务命令方式")]),n._v(" "),t("ul",[t("li",[n._v("k8s模式")])]),n._v(" "),t("p",[n._v("通过编排容器引擎，可扩展，伸缩建立集群式管理多容器部署方式。主要思想建立以pod为最小调度单位容器组组成的集群服务式多应用服务管理，一个pod即为应用服务容器，由多个pod组成以类型为deployment形成的灵活伸缩化的集群组，即针对同一处理业务的多台应用服务，一个pod由多个docker容器组成，组合完成应用功能，docker容器主要成为了具体的服务性软件。")]),n._v(" "),t("p",[n._v("以至少两台服务为master调度工作节点，node工作节点完成应用执行,通过kubectl命令行命令, kubeadm管节点的创建加入, kubelet。")]),n._v(" "),t("p",[n._v("每一个应用以deployment模式创建，管理多个pod所形成的应用，由于pod的通信ip不唯一性，通过搭建以service模式建立多个pod共享一个网络IP，这样以更好的提供对外访问")])])}),[],!1,null,null,null);s.default=a.exports}}]);