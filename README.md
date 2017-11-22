# OFR (Overdose Fatality Review)
## Installation
Due to the use of Azure Cosmos DB and Active Directory B2C OFR does require an active Azure subscription to be deployed. If the user does not have a pre-existing account one may be created at [Azure Account Creation Page](https://azure.microsoft.com/en-us/free/).
### Cosmos DB Setup
1. Once logged in to the Azure Portal select New to create a new resource.
2. From there you can search the Azure Marketplace for 'Azure Cosmos DB'.
3. Once found you will be prompted to provide some information about the database you wish to create 
	* ID - The name of the database
	* API - This project uses the MongoDB API
	* Resource Group - If a resource group has already been created for this deployment select Use Exisiting and find that from the dropdown list. If one has not been created select Create New and choose a suitable name for the deployment's resource group. 
4. After the resource has been provisioned navigate to its dashboard.
5. Two collections must be added to the database, one named cases and the other named templates.
	* It is required for a partition key to be selected for creating each collection so use Jurisdiction for cases and id for templates
6. Finally the stored procedures for the project must be uploaded to the database. The stored procedures are located in OFR/SProc.
	* To upload the stored procedures locate the script explorer in Cosmos DB.
	* Once there select create stored procedure.
	* The contents of each file should be pasted into the pane containing a sample stored procedure. The ID of the stored procedure should be the name of the file the content came from.

For more information see the [Microsoft Documentation on Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/create-mongodb-dotnet).
### API Setup
1. Open the OFR repo in Visual Studio. 
2. Build the OfrApi project.
3. Publish to your host of choice

\*Will require editing of the web.config after Active Directory B2C has been setup.
### Front-End Setup
1. Install node.js and npm. If they are not already installed they can be found [here](https://nodejs.org/en/).
2. Open Powershell (or terminal if on a non windows system) and navigate to OFR/Web.
3. From there run `npm install`. This will retreive all the packages required by the project in package.json.
4. Once that has completed run `ng build --base-href ./ --output-path [target-for-build]` with [target-for-build] replace with the folder the build should be placed in. 
6. Publish the contents of the output folder to your host of choice.

\* Due to Angular being a single page app that reroutes urls some webservers require configuration files to handle that. Included is a web.config that will work for an IIS server.

\*Will require editing of config.development.json and config.production.json after Active Directory B2C has been setup.

### Active Directory B2C Setup
1. Following the instruction on the [Active Directory B2C Documentation Pages](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-get-started) to create your B2C tenant.
2. Navigate into the B2C Tenant and go to 'Applications'.
3. From there create a new Application for the API and front-end
4. Navigate to the front-ends application and add it's urls for dev and production to the reply url.
5. Modify the properties in OFR/OfrApi/web.config with B2C in the name to contain the values related to your B2C tenant and applications.
6. Do the same in OFR/web/assets/ to the files config.development.json and config.production.json 