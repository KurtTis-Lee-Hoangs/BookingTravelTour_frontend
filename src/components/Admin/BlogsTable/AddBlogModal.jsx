import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useTranslation } from "react-i18next";

const AddBlogModal = ({
  isOpen,
  toggle,
  newBlog,
  handleInputChange,
  handleAddBlog,
  handleImageChange,
  setNewBlog,
}) => {
  const { t } = useTranslation(["admin"]);
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{t('LBL_BLOG_TABLE_ADD_MODAL_TITLE')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="title">{t('LBL_BLOG_TABLE_TITLE')}</Label>
            <Input
              type="text"
              name="title"
              id="title"
            //   value={newPost.title}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="image">{t('LBL_BLOG_TABLE_IMAGE')}</Label>
            <Input
              type="file"
              name="image"
              id="image"
              accept="image/*"
            //   value={newPost.image}
              // onChange={handlePhotoChange}
              onChange={(e) => handleImageChange(e, setNewBlog)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">{t('LBL_BLOG_TABLE_DESCRIPTION')}</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
            //   value={newPost.description}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddBlog}>
          {t('LBL_BTN_SAVE')}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {t('LBL_BTN_CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddBlogModal;
