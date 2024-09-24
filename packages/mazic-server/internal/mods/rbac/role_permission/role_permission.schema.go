package role_permission

type RolePermission struct {
	Id string `json:"id" db:"id"`

	RoleId       string `json:"role_id" db:"role_id"`
	PermissionId string `json:"permission_id" db:"permission_id"`
	IsAccess     bool   `json:"is_access" db:"is_access"`

	RoleName       string `json:"role_name" db:"role_name"`
	PermissionName string `json:"permission_name" db:"permission_name"`
	ResourceId     string `json:"resource_id" db:"resource_id"`
	ResourceName   string `json:"resource_name" db:"resource_name"`
}

func (m *RolePermission) TableName() string {
	return "sys_role_permission"
}

type RolePermissionRecord struct {
	RoleId       string `json:"role_id"`
	PermissionId string `json:"permission_id"`
}
