package role_permission

import (
	"context"
	"fmt"
	"mazic/pocketbase/daos"
	"mazic/server/pkg/entry"
	"strings"
)

type RolePermissionService interface {
	Find(ctx context.Context) ([]RolePermissionMatrix, error)
	Update(ctx context.Context, records []RolePermissionRecord) error
}

type rolePermissionService struct {
	Entry entry.Entry
}

func NewRolePermissionService(entry entry.Entry) RolePermissionService {
	return &rolePermissionService{
		Entry: entry,
	}
}

func (service *rolePermissionService) Find(ctx context.Context) ([]RolePermissionMatrix, error) {
	records := []RolePermissionMatrix{}
	rawQuery := `
		SELECT
			COALESCE(rp.id, '') as id,
			res.id AS resource_id,
			res.name AS resource_name,
			r.id AS role_id,
			r.name AS role_name,
			p.id AS permission_id,
			p.name AS permission_name,
			act.id AS action_id,
			act.name AS action_name,
			CASE
				WHEN rp.id IS NOT NULL THEN true
				ELSE false
			END AS is_access
		FROM
			sys_resource res
			LEFT JOIN sys_permission p ON res.id = p.resource_id
			LEFT JOIN sys_action act ON p.action_id = act.id
			CROSS JOIN sys_role r
			LEFT JOIN sys_role_permission rp ON r.id = rp.role_id AND p.id = rp.permission_id
		WHERE p.id IS NOT NULL
		ORDER BY res.name, r.name, act.name
	`
	err := service.Entry.Dao().DB().NewQuery(rawQuery).WithContext(ctx).All(&records)
	if err != nil {
		return nil, err
	}

	return records, nil
}

func (service *rolePermissionService) Update(ctx context.Context, records []RolePermissionRecord) error {
	err := service.Entry.Dao().RunInTransaction(func(txDao *daos.Dao) error {
		var pairs []string
		for _, record := range records {
			pairs = append(pairs, fmt.Sprintf("('%s', '%s')", record.RoleId, record.PermissionId))
		}
		notInClause := fmt.Sprintf("(%s)", strings.Join(pairs, ", "))

		_, err := txDao.DB().
			NewQuery(fmt.Sprintf("DELETE FROM sys_role_permission WHERE (role_id, permission_id) NOT IN %s", notInClause)).
			WithContext(ctx).
			Execute()
		if err != nil {
			return err
		}

		_, err = txDao.DB().
			NewQuery(fmt.Sprintf("INSERT INTO sys_role_permission (role_id, permission_id) VALUES %s ON CONFLICT DO NOTHING", strings.Join(pairs, ", "))).
			WithContext(ctx).
			Execute()
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
