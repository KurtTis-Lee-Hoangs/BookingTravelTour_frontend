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

const AddTourModal = ({
  isOpen,
  toggle,
  newTour,
  handleChange,
  handleAddTour,
  handlePhotoChange,
  setNewTour
}) => {
  const { t } = useTranslation(['admin']);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{t('LBL_TOUR_TABLE_ADD_MODAL_TITLE')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="title">{t('LBL_TOUR_TABLE_TITLE')}</Label>
            <Input
              type="text"
              name="title"
              id="title"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="city">{t('LBL_TOUR_TABLE_CITY')}</Label>
            <Input type="text" name="city" id="city" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="address">{t('LBL_TOUR_TABLE_ADDRESS')}</Label>
            <Input
              type="text"
              name="address"
              id="address"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="day">{t('LBL_TOUR_TABLE_DAY')}</Label>
            <Input
              type="number"
              name="day"
              id="day"
              min="1"
              value={newTour?.day}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="photo">{t('LBL_TOUR_TABLE_PHOTO')}</Label>
            <Input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              // onChange={handlePhotoChange}
              onChange={(e) => handlePhotoChange(e, setNewTour)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="desc">{t('LBL_TOUR_TABLE_DESCRIPTION')}</Label>
            <Input
              type="textarea"
              name="desc"
              id="desc"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">{t('LBL_TOUR_TABLE_PRICE')}</Label>
            <Input
              type="number"
              name="price"
              id="price"
              min="1"
              value={newTour?.price}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="maxGroupSize">{t('LBL_TOUR_TABLE_MAX_GROUP_SIZE')}</Label>
            <Input
              type="number"
              name="maxGroupSize"
              id="maxGroupSize"
              min="1"
              value={newTour?.maxGroupSize}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="featured">{t('LBL_TOUR_TABLE_FEATURED')}</Label>
            <Input
              type="select"
              name="featured"
              id="featured"
              value={newTour?.featured} // Hiển thị giá trị hiện tại
              onChange={handleChange}
            >
              <option value={false}>{t('LBL_TOUR_TABLE_FEATURED_NO')}</option>
              <option value={true}>{t('LBL_TOUR_TABLE_FEATURED_YES')}</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddTour}>
          {t('LBL_BTN_SAVE')}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {t('LBL_BTN_CANCEL')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTourModal;
