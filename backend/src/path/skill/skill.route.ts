import { skillController } from "./skill.controller.js";
import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { SkillValidation } from "./skill.validation.js";


const router = Router();

router.get('/', skillController.getAllSkills);
router.post('/', validate(SkillValidation.createSkill), skillController.createSkill);

router.get('/:skillId', validate(SkillValidation.skillById), skillController.getSkillById);
router.put('/:skillId', validate(SkillValidation.updateSkill), skillController.updateSkill);
router.delete('/:skillId', validate(SkillValidation.deleteSkill), skillController.deleteSkill);

export default router;