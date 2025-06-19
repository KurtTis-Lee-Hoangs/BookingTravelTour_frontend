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

const EditBookingModal = ({
  isOpen,
  toggle,
  editingBooking,
  setEditingBooking,
  handleEditBooking,
}) => {
  const { t } = useTranslation(["admin"]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{t('LBL_MANAGE_BOOKING_EDIT_MODAL_TITLE')}</ModalHeader>
      <ModalBody>
        {editingBooking && (
          <Form>
            <FormGroup>
              <Label for="fullName">{t('LBL_MANAGE_BOOKING_FULLNAME')}</Label>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                value={editingBooking?.fullName}
                onChange={(e) =>
                    setEditingBooking({ ...editingBooking, fullName: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">{t('LBL_MANAGE_BOOKING_PHONE')}</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={editingBooking?.phone}
                onChange={(e) =>
                    setEditingBooking({ ...editingBooking, phone: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="bookAt">{t('LBL_MANAGE_BOOKING_DEPARTURE_DATE')}</Label>
              <Input
                type="date"
                name="bookAt"
                id="bookAt"
                min={new Date().toISOString().split("T")[0]}
                value={editingBooking?.bookAt}
                onChange={(e) =>
                    setEditingBooking({ ...editingBooking, bookAt: e.target.value })
                }
              />
            </FormGroup>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditBooking}>
          {t('LBL_BTN_SAVE')}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {t('LBL_BTN_CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBookingModal;
