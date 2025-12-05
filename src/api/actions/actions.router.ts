import { Router } from "express";

import { 
  changeConfiguration, 
  getConfiguration, 
  reset
} from "./actions.controller";
import { validateBodyPayload } from "./actions.middleware";
import { 
  ChangeConfigurationReqDto, 
  GetConfigurationReqDto, 
  ResetReqDto
} from "./dtos";

const actionsRouter = Router();

actionsRouter.post(
  "/:identity/get-configuration",
  (req, res, next) => validateBodyPayload(req, res, next, GetConfigurationReqDto),
  getConfiguration
);

actionsRouter.post(
  "/:identity/change-configuration",
  (req, res, next) => validateBodyPayload(req, res, next, ChangeConfigurationReqDto),
  changeConfiguration
);

actionsRouter.post(
  "/:identity/reset",
  (req, res, next) => validateBodyPayload(req, res, next, ResetReqDto),
  reset
);

export { actionsRouter };
