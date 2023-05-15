# codbex-industries
Industries Management Application

### Model

![model](images/industries-model.png)

### Application

#### Launchpad

![launchpad](images/industries-launchpad.png)

#### Management

![management](images/industries-management.png)

### Infrastructure

#### Build

	docker build -t codbex-industries:1.0.0 .

#### Run

	docker run --name codbex-industries -d -p 8080:8080 codbex-industries:1.0.0

#### Clean

	docker rm codbex-industries