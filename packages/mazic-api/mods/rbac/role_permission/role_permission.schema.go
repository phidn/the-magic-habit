package role_permission

type RolePermissionSchema struct {
	Id             string `json:"id"`
	RoleId         string `json:"role_id"`
	RoleName       string `json:"role_name"`
	RoleKey        string `json:"role_key"`
	PermissionId   string `json:"permission_id"`
	PermissionName string `json:"permission_name"`
	ResourceId     string `json:"resource_id"`
	ResourceName   string `json:"resource_name"`
	IsAccess       bool   `json:"is_access"`
}

type RolePermissionUpsertSchema struct {
	RoleId       string `json:"role_id"`
	PermissionId string `json:"permission_id"`
}

func (a *RolePermissionSchema) TableName() string {
	return "sys_role_permission"
}
func (a *RolePermissionUpsertSchema) TableName() string {
	return "sys_role_permission"
}
