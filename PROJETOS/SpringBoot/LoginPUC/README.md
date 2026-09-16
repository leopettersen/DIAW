# Projeto LoginPUC

## Descrição
O LoginPUC é um projeto de aplicação web que implementa um sistema de login seguro utilizando Spring Boot e Spring Security. O objetivo é permitir a autenticação de usuários, diferenciando entre usuários comuns e administradores, e garantindo o acesso apropriado às páginas da aplicação. Além do login, o sistema oferece cadastro de novos usuários, recuperação e redefinição de senha com envio de e-mail, persistindo os usuários cadastrados em um banco de dados H2.

## Estrutura do Projeto

```
LoginPUC
│
├── src
│   └── main
│       ├── java
│       │   └── com.example.LoginPUC
│       │       ├── LoginPucApplication.java
│       │       ├── config
│       │       │   ├── PasswordEncoderConfig.java
│       │       │   ├── SecurityConfig.java
│       │       │   └── UserConfig.java
│       │       ├── controller
│       │       │   ├── LoginPucController.java
│       │       │   └── SendEmailController.java
│       │       ├── dto
│       │       │   └── EmailRequestDTO.java
│       │       ├── exception
│       │       │   ├── GlobalExceptionHandler.java
│       │       │   └── SendEmailException.java
│       │       ├── model
│       │       │   └── Usuario.java
│       │       ├── repository
│       │       │   └── UserRepository.java
│       │       └── service
│       │           ├── SendEmailService.java
│       │           └── UserService.java
│       └── resources
│           ├── application.properties
│           ├── static
│           │   ├── css
│           │   │   ├── login.css
│           │   │   ├── register.css
│           │   │   └── style.css
│           │   └── images
│           │       ├── apc-login-bg.png
│           │       ├── jardim-image.jpg
│           │       ├── logo-puc.png
│           │       ├── logo-puc-colorida.png
│           │       └── 511103917-a3660d92-86ab-4e76-9194-8c08b188cb52.mp4
│           └── templates
│               ├── admin.html
│               ├── error.html
│               ├── home.html
│               ├── login.html
│               ├── recovererror.html
│               ├── recoverpassword.html
│               ├── register.html
│               └── resetpassword.html

```

## Configuração do application.properties

```properties
spring.application.name=LoginPUC
app.user.username=leo
app.user.password=4321
app.admin.username=admin
app.admin.password=1234
```

Os valores acima criam os usuários em memória: `leo` (papel USER) e `admin` (papel ADMIN). Usuários cadastrados pela página de registro são persistidos no banco H2 com papel USER. As credenciais de e-mail (Gmail + App Password) devem ser definidas no arquivo `application-dev.properties`, que é ignorado pelo Git por conter dados sensíveis.

## Dependências
```xml
<!-- Spring Boot Thymeleaf -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Spring Boot Web MVC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Banco de dados H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Envio de e-mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Testes -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf-test</artifactId>
    <scope>test</scope>
</dependency>
```

> **Observação**: este projeto utiliza Spring Boot 4.1.1, em que os starters foram modularizados. Por isso, o starter de web é `spring-boot-starter-webmvc` (e não `spring-boot-starter-web`).

# Thymeleaf

Thymeleaf é um motor de templates para Java que permite a criação de páginas HTML dinâmicas de forma simples e eficiente. Ele é frequentemente utilizado em aplicações Spring, proporcionando uma maneira intuitiva de gerar conteúdo HTML e manipular dados diretamente nas páginas.

## Principais Características

- **Natural Templating**: Os templates Thymeleaf são válidos como documentos HTML, permitindo que sejam visualizados em navegadores sem processamento.
- **Integração com Spring**: Thymeleaf se integra perfeitamente com o Spring Framework, facilitando a injeção de dependências e o acesso a beans do Spring.
- **Expressões de Template**: Utiliza uma sintaxe simples e expressiva para manipular dados, permitindo a criação de lógicas condicionais e loops diretamente nas páginas.

## Exemplo de Uso

Aqui está um exemplo simples de um template Thymeleaf:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Exemplo Thymeleaf</title>
</head>
<body>
    <h1 th:text="${titulo}">Título do Documento</h1>
    <ul>
        <li th:each="item : ${itens}" th:text="${item}"></li>
    </ul>
</body>
</html>
```

Neste exemplo, o título e a lista de itens são preenchidos dinamicamente com dados fornecidos pelo controlador Spring.

Thymeleaf é uma escolha poderosa para desenvolvedores que desejam criar interfaces web dinâmicas e interativas em aplicações Java. Com sua sintaxe intuitiva e forte integração com o Spring, ele se tornou uma ferramenta popular no ecossistema de desenvolvimento Java.

## Interface Gráfica

A interface gráfica permite ao usuário inserir seus dados de login e, após a autenticação, ser redirecionado para a página correspondente, onde terá acesso às funcionalidades e informações de acordo com suas credenciais.

## Configuração de Segurança

### @Configuration
Indica que a classe contém métodos de configuração que geram beans para o contexto da aplicação.

### @EnableWebSecurity
Ativa a segurança da web, permitindo a configuração de regras de segurança para as URLs da aplicação.

### Métodos da classe SecurityConfig

- **public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception** — Configura as regras de segurança das requisições HTTP, permitindo o acesso público às páginas de login, registro e recuperação de senha e aos arquivos CSS e imagens, restringindo o acesso às páginas do administrador somente a usuários com papel ADMIN. Inclui ainda os handlers de sucesso e falha de autenticação (redirecionando para `/home`, `/admin` ou `/error` conforme o papel/resultado).

- **public UserDetailsService inMemoryUserDetailsService()** — Configura o gerenciamento de usuários em memória, criando um usuário comum e um administrador a partir das credenciais definidas no `application.properties`, codificando as senhas com BCrypt.

- **public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception** — Registra o gerenciador de autenticação, alimentando-o tanto com os usuários em memória quanto com os usuários cadastrados no banco (via `UserService`).

### PasswordEncoderConfig

- **public PasswordEncoder passwordEncoder()** — Define o codificador de senhas a ser utilizado na aplicação, utilizando o `BCryptPasswordEncoder`.

## Urls do projeto:
http://localhost:8080/login

http://localhost:8080/login?logout=true

http://localhost:8080/home

http://localhost:8080/admin

http://localhost:8080/error

http://localhost:8080/register

http://localhost:8080/recoverpassword

http://localhost:8080/recovererror

http://localhost:8080/resetpassword
