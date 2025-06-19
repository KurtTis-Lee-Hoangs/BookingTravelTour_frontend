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

const AddHotelModal = ({
  isOpen,
  toggle,
  newHotel,
  handleChange,
  handleAddHotel,
  handlePhotoChange,
  setNewHotel
}) => {
  const { t } = useTranslation(["admin"]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{t('LBL_HOTEL_TABLE_ADD_MODAL_TITLE')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">{t('LBL_HOTEL_TABLE_NAME')}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="address">{t('LBL_HOTEL_TABLE_ADDRESS')}</Label>
            <Input type="text" name="address" id="address" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="phoneNumber">{t('LBL_HOTEL_TABLE_PHONE')}</Label>
            <Input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="photo">{t('LBL_HOTEL_TABLE_PHOTO')}</Label>
            <Input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              // onChange={handlePhotoChange}
              onChange={(e) => handlePhotoChange(e, setNewHotel)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">{t('LBL_HOTEL_TABLE_DESCRIPTION')}</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddHotel}>
          {t('LBL_BTN_SAVE')}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {t('LBL_BTN_CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddHotelModal;
