import { photoController } from './photo.controller.js';
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { PhotoValidation } from './photo.validation.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/avatar',requireAuth, validate(PhotoValidation.createPhoto), photoController.createAvatar);
router.put('/avatar',requireAuth, validate(PhotoValidation.updatePhoto), photoController.editAvatar);
router.delete('/avatar',requireAuth, validate(PhotoValidation.deletePhoto), photoController.deleteAvatar);

router.post('/background', requireAuth, validate(PhotoValidation.createPhoto), photoController.createBackground);
router.put('/background', requireAuth, validate(PhotoValidation.updatePhoto), photoController.editBackground);
router.delete('/background', requireAuth, validate(PhotoValidation.deletePhoto), photoController.deleteBackground);

router.get('/', photoController.getPhotos);
router.get('/:id', validate(PhotoValidation.getPhotoById), photoController.getPhotoById);

export default router;
