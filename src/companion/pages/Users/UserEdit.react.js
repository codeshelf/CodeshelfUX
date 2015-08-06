import {toUserModalForm} from "./UserForm.js";

const formMetadata = [
    {name: "active",
     label: "Active",
     type: Boolean,
     required: true},
    {name: "roles",
     label: "Roles",
     options:[{name: "Admin", label: "Admin"},
              {name: "Companion", label: "Companion"},
             ],
     type: Array,
     required: false}];
const title = "Edit User";
const returnRoute = "users";

export default toUserModalForm(title, formMetadata, returnRoute);
