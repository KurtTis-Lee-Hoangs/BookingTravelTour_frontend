// import React from "react";
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
// } from "reactstrap";

// const EditUserModal = ({
//   isOpen,
//   toggle,
//   editingUser,
//   setEditingUser,
//   handleEditUser,
//   handleAvatarChange
// }) => {
//   return (
//     <Modal isOpen={isOpen} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Edit User</ModalHeader>
//       <ModalBody>
//         {editingUser && ( // Chỉ hiển thị form khi editingUser có giá trị
//           <Form>
//             <FormGroup>
//               <Label for="username">Username</Label>
//               <Input
//                 type="text"
//                 name="username"
//                 id="username"
//                 value={editingUser?.username}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, username: e.target.value })
//                 }
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label for="avatar">Avatar Url</Label>
//               <Input
//                 type="file"
//                 name="avatar"
//                 id="avatar"
//                 accept="image/*"
//                 onChange={(e) => handleAvatarChange(e)}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label for="password">Password</Label>
//               <Input
//                 type="text"
//                 name="password"
//                 id="password"
//                 value={editingUser?.password}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, password: e.target.value })
//                 }
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label for="role">Role</Label>
//               <Input
//                 type="select"
//                 name="role"
//                 id="role"
//                 value={editingUser?.role}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, role: e.target.value })
//                 }
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </Input>
//             </FormGroup>
//           </Form>
//         )}
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleEditUser}>
//           Save
//         </Button>{" "}
//         <Button color="secondary" onClick={toggle}>
//           Cancel
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default EditUserModal;

import React from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const EditUserModal = ({
  editingUser,
  setEditingUser,
  handleEditUser,
  handleAvatarChange,
  toggleEditMode,
}) => {
  const { t } = useTranslation(['admin']);

  return (
    <div className="edit-user-form mb-4 mt-4">
      {editingUser && ( // Chỉ hiển thị form khi editingUser có giá trị
        <Form>
          <h3>{t('LBL_EDIT_USER_TITLE')}</h3>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="username">{t('LBL_EDIT_USER_USERNAME')}</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  value={editingUser?.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  style={{
                    maxWidth: "70%",
                    fontSize: "14px",
                    padding: "5px",
                    boxShadow: "none",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="avatar">{t('LBL_EDIT_USER_AVATAR')}</Label>
                <Input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) => handleAvatarChange(e)}
                  style={{
                    maxWidth: "70%",
                    fontSize: "14px",
                    padding: "5px",
                    boxShadow: "none",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password">{t('LBL_EDIT_USER_PASSWORD')}</Label>
                <Input
                  type="text"
                  name="password"
                  id="password"
                  // value={editingUser?.password}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  style={{
                    maxWidth: "70%",
                    fontSize: "14px",
                    padding: "5px",
                    boxShadow: "none",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="role">{t('LBL_EDIT_USER_ROLE')}</Label>
                <Input
                  type="select"
                  name="role"
                  id="role"
                  value={editingUser?.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  style={{
                    maxWidth: "70%",
                    fontSize: "14px",
                    padding: "5px",
                    boxShadow: "none",
                  }}
                >
                  <option value="user">{t('LBL_EDIT_USER_ROLE_USER')}</option>
                  <option value="admin">{t('LBL_EDIT_USER_ROLE_ADMIN')}</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <div className="form-buttons">
            <Button color="primary" onClick={handleEditUser}>
              {t('LBL_BTN_SAVE')}
            </Button>{" "}
            <Button color="secondary" onClick={toggleEditMode}>
              {t('LBL_BTN_CANCEL')}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default EditUserModal;
