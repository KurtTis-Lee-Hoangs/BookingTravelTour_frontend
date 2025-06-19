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

const EditTourModal = ({
  isOpen,
  toggle,
  editingHotel,
  setEditingHotel,
  handleEditHotel,
  handlePhotoChange,
}) => {
  const { t } = useTranslation(["admin"]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{t('LBL_HOTEL_TABLE_EDIT_MODAL_TITLE')}</ModalHeader>
      <ModalBody>
        {editingHotel && (
          <Form>
            <FormGroup>
              <Label for="name">{t('LBL_HOTEL_TABLE_NAME')}</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={editingHotel?.name}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, name: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">{t('LBL_HOTEL_TABLE_PHONE')}</Label>
              <Input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={editingHotel?.phoneNumber}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, phoneNumber: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">{t('LBL_HOTEL_TABLE_ADDRESS')}</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={editingHotel?.address}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, address: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="photo">{t('LBL_HOTEL_TABLE_PHOTO')}</Label>
              <Input
                type="file"
                name="photo"
                id="photo"
                // onChange={handlePhotoChange}
                onChange={(e) => handlePhotoChange(e, setEditingHotel)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">{t('LBL_HOTEL_TABLE_DESCRIPTION')}</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={editingHotel?.description}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, description: e.target.value })
                }
              />
            </FormGroup>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditHotel}>
          {t('LBL_BTN_SAVE')}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {t('LBL_BTN_CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTourModal;
