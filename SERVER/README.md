API Progress Tracker
=================


API for Progress Tracker Application. Developed by using ExpressJS, Sequelize JS as ORM, and MySQL as Database. This repository only document and store the API of the application.



DOKUMENTASI

- /api/signup [POST]
<br />
	RECEIVED BY CLIENT
	{
	  "username"	:
	  "name"		:
	  "role"		:
	  "password"	:
	  "employee_id"	:
	}
	<br />
	REQUIRED BY API
	{
	  "id_user"		:
	  "username"	:
	  "name"		:
	  "role"		:
	  "password"	:
	  "employee_id"	:
	}

- /api/authenticate [POST]
<br />
	RECEIVED BY CLIENT
	{
	  "status"		:
	  "token"		:
	  "name"		:
	  "role"		:
	}
	<br />
	REQUIRED BY API
	{
	  "username"	:
	  "password"	:
	}

- /api/admin/usermanagement [GET]
<br />
	RECEIVED BY CLIENT
	{
	  "id_user"			:
	  "username"		:
	  "name"			:
	  "role"			:
	  "password"		:
	  "employee_id"		:
	  "verified_status"	:
	  "activated_status":
	}
	<br />
	REQUIRED BY API
	{}

- /api/admin/usermanagement/update [POST]
<br />
	RECEIVED BY CLIENT
	{}
	<br />
	REQUIRED BY API
	{
		"id_user"			:
		"role"				:
		"activated_status"	:
		"verified_status"	:
	}

- /api/admin/usermanagement/edit [POST]
<br />
	RECEIVED BY CLIENT
	{}
	<br />
	REQUIRED BY API
	{
		"id_user"			:
		"name"				:
		"role"				:
		"password"			:(OPTIONAL)
		"activated_status"	:
		"verified_status"	:
	}

- /api/admin/usermanagement/delete [POST]
<br />
	RECEIVED BY CLIENT
	{}
	<br />
	REQUIRED BY API
	{
		"id_user":
	}

- /api/project/add [POST]
<br />
	RECEIVED BY CLIENT
	{}
	<br />
	REQUIRED BY API
	{
		project_name 			: 
		project_start_date		: 
		project_end_date		: 
		project_client_name		: 
		project_client_address	: 
		project_client_phone	: 
		project_client_email	: 
		project_manager_id		:
	}

- /api/project [GET]
<br />
	RECEIVED BY CLIENT
	{
		project_id
		project_name 			: 
		project_start_date		: 
		project_end_date		: 
		project_client_name		: 
		project_client_address	: 
		project_client_phone	: 
		project_client_email	: 
		project_manager_id		:
	}
	<br />
	REQUIRED BY API
	{}

- /api/module/add [POST]
<br />
  RECEIVED BY CLIENT
  {}
	<br />
  REQUIRED BY API
  {
    module_name      		: 
    module_code_name   		:
  }

- /api/module [GET]
<br />
  RECEIVED BY CLIENT
  {
  	module_id				:
    module_name      		: 
    module_code_name   		:
    module_start_date		: 
    module_end_date    		:
  }
	<br />
  REQUIRED BY API
  {}

- /api/function/add [POST]
<br />
  RECEIVED BY CLIENT
  {}
	<br />
  REQUIRED BY API
  {
  	To be Filled
  }

- /api/function [GET]
<br />
  RECEIVED BY CLIENT
  {
    To be Filled
  }
	<br />
  REQUIRED BY API
  {}

	# Checklist Routes
	- Add Checklist [POST] <br />
	  /api/checklist/add <br />
		RECEIVED BY CLIENT: {} <br />
		REQUIRED BY API: {checklist_text:, checklist_phase_id:}
	<br />
	- Check Some Checklist [POST] <br />
	  /api/checklist/checked <br />
		RECEIVED BY CLIENT: {} <br />
		REQUIRED BY API: {list_checklist:[{checklist_id:, checked_by_id: },{checklist_id:, checked_by_id: },...]}
		<br />
	- Uncheck Some Checklist [POST] <br />
	  /api/checklist/unchecked <br />
		RECEIVED BY CLIENT: {} <br />
		REQUIRED BY API: {list_checklist:[{checklist_id:},{checklist_id:},...]}
		<br />
	- Get Checklist By Phase ID [POST] <br />
	  /api/checklist/getbyid <br />
		RECEIVED BY CLIENT: {{checklist_id:, checklist_text:, checklist_status:, checklist_phase_id, checked_by_id:},{checklist_id:, checklist_text:, checklist_status:, checklist_phase_id, checked_by_id:},...} <br />
		REQUIRED BY API: {list_checklist:[{checklist_id:},{checklist_id:},...]}
		<br />
	- Edit Checklist [POST] <br />
	  /api/checklist/edit <br />
		RECEIVED BY CLIENT: {} <br />
		REQUIRED BY API: {checklist_id:, checklist_text:}
		<br />
