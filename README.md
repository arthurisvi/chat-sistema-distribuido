# Aplicação de Bate-papo
A aplicação trata de uma sala de bate-papo, onde usuários trocam mensagens. Sua arquitetura consiste em um sistema distribuído no modelo cliente-servidor.

## Arquitetura do sistema
![image](https://user-images.githubusercontent.com/83462514/197421859-f4faf2ed-1f0d-48e0-b183-501b462b9015.png)
* O sistema distribuído comporta N clientes e também é escalável ao ponto ter N máquinas replicadas de prontidão caso o servidor principal caia.
* Uso de Middleware como camada intermediária de transferência de dados e comunicação cliente-servidor 

## Cenários que a aplicação comporta
* Conexão de 2 Clientes com 1 servidor (2 x 1):
Dois ou mais clientes distintos conseguem conversar entre si por meio de um servidor.

* Queda de um servidor:
Quando o servidor primário fica indisponível, os dois clientes conseguem se comunicar por meio do servidor que estava de prontidão.

* Mensagem não enviada do cliente:
Quando não tem servidor disponível e um cliente envia uma mensagem, ela fica pendente e será enviada quando um novo servidor estiver online.

## Características implementadas
* Transparência de Replicação – os servidores são replicados
* Transparência de falhas - caso o servidor primário vier a cair, o servidor que está replicado assumirá o seu papel sem que o cliente perceba.
* Transparência de Localização - Por meio de um serviço de descoberta, os servidores irão informar a cada período determinado de tempo que estão disponíveis para serem utilizados (Conceito de Keep-alive);

## Tecnologias utilizadas
* NodeJS
* Dgram (UDP)
* ip

## Como rodar a aplicação
1. Instale as dependências de cada diretório
```
$ cd client
$ npm install
$ cd ..
$ cd server 
$ npm install
$ cd ..
$ cd middleware
$ npm install
```

2. Inicie o cliente e o servidor
```
$ cd client
$ npm run dev
$ cd ..
$ cd server 
$ npm run dev
```
