import ListManagement from "components/common/list/ListManagement";
import {properties, keyColumn} from "data/types/User";

const columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
export function UsersList(props) {
  const {users, currentUser} = props;
  const rowActionComponent = ListManagement.toEditButton((row) => {
    return {
      to: "/admin/users/" + row.get(keyColumn),
      disabled: (row.get("username") == currentUser.username)};
  });

  return (
    <ListManagement
        addButtonRoute="/admin/users/new"
        columnMetadata={columnMetadata}
        results={users}
        keyColumn={keyColumn}
        rowActionComponent={rowActionComponent}
      />);
}
