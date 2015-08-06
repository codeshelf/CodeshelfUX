import {toUserModalForm} from "./UserForm.js";

const formMetadata = [
    {name: "username",
     label: "Email",
     required: true},
    {name: "roles",
     label: "Roles",
     required: false}];
const title = "New User";
const returnRoute = "users";

export default toUserModalForm(title, formMetadata, returnRoute);
