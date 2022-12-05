## 组件开发

- 思路理解

  为什么需要进行组件开发，随着业务需求开发的增大，从产品的角度来说需要ui风格的统一，从开发的角度，如何将我们开发中的效率提高，扩展性增强，复用性强，管理良好；从设计模式的规划在一定程度上决定了后期的扩展和管理。

- 组件设计模式

  从设计模式来说，UI组件作为独立的产品，服务于其他业务线，即具有良好通用性，灵活的扩展性，良好的插拔性，高内聚性以及低耦合性。

  **1. 通用性**

  通用性即复用性，如何可以在应对各项业务都可以提供良好的基础通用性。

  **2. 扩展性**

  扩展性可以从两个角度来理解，对组件内可以通过灵活组合多个基础组件来完成一个通用组件的建设，对外即对业务需求提供参量在基础组件模式下定制业务需求。

  **3. 插拔性**

  即组件可以更好的应对开发中的各技术框架间的插拔兼容结合性，简洁，稳定的注入到产品开发中，但又不影响其他业务。

  **4. 高内聚，低耦合**

  作为一个合格的独立应用软件搭建来说，高内聚低耦合是必须具备的，良好的高内聚，与组件有相关的功能都内聚在一起，集体管理；低耦合从多组件间不产生过强性功能依赖，而是可以做到互相组合应用，但不是由于解绑应用建立而操作各组件功能失效；对于开发中功能的职责分离，单一性是更加必要的。

<!-- - 组件开发流程

  **1. 组件分类理解**

  基础组件：可以理解为所有功能组件所依赖的底层功能提供，例如:layout, color，字体等

  功能组件：针对性的功能组件，由个基础组件基础上进行组合完成扩展面对具体功能提供的组件，例如：表单

  业务组件：具有极针对性业务场景而定制的组件，一般这种模式可以由各自业务开发独立开发，当功能具有强大的通用性时，可以考虑抽离为一个独立的提供服务

  **2. 组件的构建管理** -->
