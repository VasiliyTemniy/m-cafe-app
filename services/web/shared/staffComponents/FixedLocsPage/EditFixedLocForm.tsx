import { Formik, Form } from 'formik';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { fixedLocValidationSchema } from './validationSchemas';
import { ButtonGroup, Button, Scrollable, FormikTextAreaField } from 'shared/components';


export type EditFixedLocFormValues = {
  mainStr: string,
  secStr?: string,
  altStr?: string
};

interface EditFixedLocFormProps {
  onSubmit: (values: EditFixedLocFormValues) => void,
  onCancel: () => void,
  onDelete: () => void,
  initialValues: EditFixedLocFormValues
}

export const EditFixedLocForm = ({
  onSubmit,
  onCancel,
  onDelete,
  initialValues
}: EditFixedLocFormProps) => {

  const { t } = useTranslation();

  const tNode = 'fixedLocsPage';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={fixedLocValidationSchema(t)}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className='form'>
            <Scrollable classNameAddon="form-inputs">
              <FormikTextAreaField
                placeholder={t(`${tNode}.main`)}
                label={t(`${tNode}.main`)}
                type='text'
                name='mainStr'
              />
              <FormikTextAreaField
                placeholder={t(`${tNode}.sec`)}
                label={t(`${tNode}.sec`)}
                type='text'
                name='secStr'
              />
              <FormikTextAreaField
                placeholder={t(`${tNode}.alt`)}
                label={t(`${tNode}.alt`)}
                type='text'
                name='altStr'
              />
            </Scrollable>
            <div className="form-buttons">
              <Button
                label={t('main.buttonLabel.delete')}
                variant='delete'
                id='delete-button'
                onClick={onDelete}
              />
              <ButtonGroup>
                <Button
                  label={t('main.buttonLabel.submit')}
                  type='submit'
                  variant='primary'
                  id='submit-button'
                  disabled={!dirty || !isValid}
                />
                <Button
                  label={t('main.buttonLabel.cancel')}
                  variant='secondary'
                  id='cancel-button'
                  onClick={onCancel}
                />
              </ButtonGroup>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};