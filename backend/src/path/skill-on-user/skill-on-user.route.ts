
import { Router } from "express";
import { skillOnUser } from "./skill-on-user.controller.js";
import { requireAuth as auth } from "../../middleware/auth.middleware.js";
import { SkillOnUserValidation } from "./skill-on-user.validation.js";
import { validate } from '../../middleware/validate.js';

const router = Router();

router.get('/', skillOnUser.getAll);
router.post('/', auth, validate(SkillOnUserValidation.createSkillOnUser), skillOnUser.create);

router.get('/:skillOnUserId', validate(SkillOnUserValidation.getSkillOnUserById), skillOnUser.getOne)
router.put('/:skillOnUserId', auth, validate(SkillOnUserValidation.updateSkillOnUser), skillOnUser.update);
router.delete('/:skillOnUserId', auth, validate(SkillOnUserValidation.deleteSkillOnUser), skillOnUser.delete);

router.get('/matching/:otherUserId', auth, validate(SkillOnUserValidation.getMatchingSkills), skillOnUser.getMatching);
router.get('/user/:userId', validate(SkillOnUserValidation.getSkillsOnUserByUserId), skillOnUser.getAllByUser);

export default router;
